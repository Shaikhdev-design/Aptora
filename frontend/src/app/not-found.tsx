export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#faf9f6] px-6">
      <div className="text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#5b4b8a]">
          Aptora
        </p>

        <h1 className="text-4xl font-semibold tracking-tight text-[#20201d]">
          Page not found
        </h1>

        <p className="mt-3 text-[#73736d]">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>

        <a
          href="/"
          className="mt-6 inline-flex rounded-full bg-[#5b4b8a] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#483a70]"
        >
          Back to Aptora
        </a>
      </div>
    </main>
  );
}
