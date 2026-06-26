// Geosite DEVELOPERS — Chunked loader for large model files (> 50 MB)

export const CHUNK_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
export const LARGE_FILE_THRESHOLD_BYTES = 50 * 1024 * 1024; // 50 MB

export interface ChunkLoadProgress {
  loaded: number; // bytes loaded so far
  total: number;  // total file size in bytes
  progress: number; // 0.0 – 1.0
  chunkIndex: number;
  totalChunks: number;
}

export type ProgressCallback = (progress: ChunkLoadProgress) => void;

/**
 * Fetches a file using HTTP Range requests, splitting it into chunks of at most CHUNK_SIZE_BYTES.
 * Reports progress via the onProgress callback.
 *
 * Falls back to a single-request load if Range requests are not supported.
 */
export async function loadFileChunked(
  url: string,
  onProgress?: ProgressCallback
): Promise<ArrayBuffer> {
  // First, get the file size via a HEAD request
  let totalSize: number;
  try {
    const headRes = await fetch(url, { method: 'HEAD' });
    const contentLength = headRes.headers.get('content-length');
    if (!contentLength) {
      // Fall back to single request if content-length is unavailable
      console.warn(`[chunked-loader] No content-length for ${url}, falling back to single request`);
      return loadFileSingle(url, onProgress);
    }
    totalSize = parseInt(contentLength, 10);
  } catch {
    console.warn(`[chunked-loader] HEAD request failed for ${url}, falling back to single request`);
    return loadFileSingle(url, onProgress);
  }

  // If file is below threshold, load normally
  if (totalSize <= LARGE_FILE_THRESHOLD_BYTES) {
    return loadFileSingle(url, onProgress);
  }

  // Split into chunks
  const totalChunks = Math.ceil(totalSize / CHUNK_SIZE_BYTES);
  const chunks: ArrayBuffer[] = [];
  let loaded = 0;

  for (let i = 0; i < totalChunks; i++) {
    const start = i * CHUNK_SIZE_BYTES;
    const end = Math.min(start + CHUNK_SIZE_BYTES - 1, totalSize - 1);

    const res = await fetch(url, {
      headers: { Range: `bytes=${start}-${end}` },
    });

    // Accept 200 (full file) or 206 (partial content/range request)
    if (!(res.status === 200 || res.status === 206)) {
      throw new Error(`[chunked-loader] Chunk ${i} failed with status ${res.status}`);
    }

    const chunk = await res.arrayBuffer();
    chunks.push(chunk);
    loaded += chunk.byteLength;

    onProgress?.({
      loaded,
      total: totalSize,
      progress: loaded / totalSize,
      chunkIndex: i,
      totalChunks,
    });
  }

  // Concatenate all chunks
  return concatenateArrayBuffers(chunks);
}

async function loadFileSingle(url: string, onProgress?: ProgressCallback): Promise<ArrayBuffer> {
  const res = await fetch(url);
  if (res.status !== 200) {
    throw new Error(`[chunked-loader] Failed to load ${url}: ${res.status}`);
  }
  const buffer = await res.arrayBuffer();
  onProgress?.({
    loaded: buffer.byteLength,
    total: buffer.byteLength,
    progress: 1,
    chunkIndex: 0,
    totalChunks: 1,
  });
  return buffer;
}

function concatenateArrayBuffers(buffers: ArrayBuffer[]): ArrayBuffer {
  const totalLength = buffers.reduce((sum, b) => sum + b.byteLength, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const buf of buffers) {
    result.set(new Uint8Array(buf), offset);
    offset += buf.byteLength;
  }
  return result.buffer;
}

/**
 * Computes the chunk ranges for a given file size.
 * Returns an array of [start, end] byte ranges.
 */
export function computeChunkRanges(fileSize: number): Array<[number, number]> {
  if (fileSize <= 0) return [];
  const ranges: Array<[number, number]> = [];
  let start = 0;
  while (start < fileSize) {
    const end = Math.min(start + CHUNK_SIZE_BYTES - 1, fileSize - 1);
    ranges.push([start, end]);
    start = end + 1;
  }
  return ranges;
}
