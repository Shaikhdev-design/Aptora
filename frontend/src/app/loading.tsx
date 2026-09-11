export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#faf9f6]">
      <div className="text-center">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-[#e8e6df] border-t-[#5b4b8a]" />
        <p className="text-sm text-[#73736d]">Loading Aptora...</p>
      </div>
    </div>
  );
}
