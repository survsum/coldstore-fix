import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center px-6">
      <div>
        <p
          className="text-8xl font-light text-[var(--text-primary)] mb-4"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          404
        </p>
        <h2 className="text-2xl font-light text-[var(--text-secondary)] mb-6">
          Page Not Found
        </h2>
        <Link
          href="/"
          className="inline-flex px-8 py-3 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
