'use client';

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main style={{padding: 24, maxWidth: 860, margin: '0 auto'}}>
      <h1 style={{fontSize: 20, fontWeight: 600}}>Something went wrong</h1>
      <pre style={{whiteSpace: 'pre-wrap', background: '#f6f6f6', padding: 12, borderRadius: 8, marginTop: 12}}>
        {error?.message || 'Unknown error'}
        {error?.digest ? `\n\ndigest: ${error.digest}` : ''}
      </pre>
      <button
        onClick={() => reset()}
        style={{marginTop: 12, padding: '8px 14px', border: '1px solid #000', borderRadius: 8}}
      >
        Try again
      </button>
    </main>
  );
}
