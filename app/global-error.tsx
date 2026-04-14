'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center text-center px-6">
          <div>
            <h2 className="text-2xl font-light mb-4">Something went wrong</h2>
            <p className="text-sm text-gray-500 mb-6">{error.message}</p>
            <button
              onClick={reset}
              className="px-6 py-3 rounded-full bg-black text-white text-sm hover:opacity-80 transition-opacity"
            >
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
