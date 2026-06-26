// Feature: geosite-developers, Property 16: Large file loading produces chunks of at most 10 MB
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import {
  computeChunkRanges,
  CHUNK_SIZE_BYTES,
  LARGE_FILE_THRESHOLD_BYTES,
} from '../lib/chunked-loader';

const MB = 1024 * 1024;

describe('Property 16: Large file loading produces chunks of at most 10 MB', () => {
  it('every chunk range is at most CHUNK_SIZE_BYTES (10 MB)', () => {
    fc.assert(
      fc.property(
        // File sizes > 50 MB
        fc.integer({ min: LARGE_FILE_THRESHOLD_BYTES + 1, max: 500 * MB }),
        (fileSize) => {
          const ranges = computeChunkRanges(fileSize);
          // Every chunk must be ≤ CHUNK_SIZE_BYTES
          return ranges.every(([start, end]) => end - start + 1 <= CHUNK_SIZE_BYTES);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('chunks cover the entire file without gaps or overlaps', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 500 * MB }),
        (fileSize) => {
          const ranges = computeChunkRanges(fileSize);
          if (ranges.length === 0) return fileSize === 0;

          // First chunk starts at 0
          if (ranges[0][0] !== 0) return false;
          // Last chunk ends at fileSize - 1
          if (ranges[ranges.length - 1][1] !== fileSize - 1) return false;
          // Consecutive chunks are contiguous
          for (let i = 1; i < ranges.length; i++) {
            if (ranges[i][0] !== ranges[i - 1][1] + 1) return false;
          }
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('files at or below CHUNK_SIZE_BYTES produce exactly one chunk range', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: CHUNK_SIZE_BYTES }),
        (fileSize) => {
          const ranges = computeChunkRanges(fileSize);
          return ranges.length === 1 && ranges[0][0] === 0 && ranges[0][1] === fileSize - 1;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('number of chunks equals ceil(fileSize / CHUNK_SIZE_BYTES)', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 500 * MB }),
        (fileSize) => {
          const ranges = computeChunkRanges(fileSize);
          const expected = Math.ceil(fileSize / CHUNK_SIZE_BYTES);
          return ranges.length === expected;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('CHUNK_SIZE_BYTES is exactly 10 MB', () => {
    expect(CHUNK_SIZE_BYTES).toBe(10 * MB);
  });

  it('LARGE_FILE_THRESHOLD_BYTES is exactly 50 MB', () => {
    expect(LARGE_FILE_THRESHOLD_BYTES).toBe(50 * MB);
  });

  it('a 55 MB file produces 6 chunks', () => {
    const ranges = computeChunkRanges(55 * MB);
    expect(ranges.length).toBe(6);
    ranges.forEach(([start, end]) => {
      expect(end - start + 1).toBeLessThanOrEqual(CHUNK_SIZE_BYTES);
    });
  });
});
