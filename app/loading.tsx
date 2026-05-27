export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#071528] px-6">
      <div className="text-center">
        <div className="mx-auto h-20 w-20 animate-spin rounded-full border-4 border-[#c9a84c]/20 border-t-[#c9a84c]" />

        <h1 className="mt-10 font-edc-serif text-4xl font-semibold text-white">
          Ecclesia Discipleship &
          Commissioning
        </h1>

        <p className="mt-4 text-sm uppercase tracking-[0.25em] text-[#c9a84c]">
          Loading Institutional Portal
        </p>
      </div>
    </div>
  );
}