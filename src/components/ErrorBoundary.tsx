'use client';
import React, { ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary — catches rendering errors in child components.
 * Prevents blank pages when 3D canvas crashes.
 *
 * Usage:
 * <ErrorBoundary fallback={<ErrorFallback />}>
 *   <Viewer />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ErrorBoundary] Caught error:', error);
    console.error('[ErrorBoundary] Error info:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex items-center justify-center w-full h-screen bg-red-50 p-8">
            <div className="max-w-md text-center">
              <h1 className="text-2xl font-bold text-red-900 mb-4">Something went wrong</h1>
              <p className="text-red-700 mb-4">{this.state.error?.message}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-900 text-white rounded hover:bg-red-800 transition"
              >
                Reload page
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
