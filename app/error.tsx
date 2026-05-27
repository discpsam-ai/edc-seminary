"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;

  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#071528] px-6">
      <div className="max-w-2xl text-center">
        <p className="text-sm uppercase tracking-[0.25em] text-[#c9a84c]">
          Institutional System Error
        </p>

        <h1 className="mt-6 font-edc-serif text-5xl font-semibold text-white">
          Something Went Wrong
        </h1>

        <p className="mt-6 leading-8 text-white/70">
          The system encountered an
          unexpected issue while processing
          this request.
        </p>

        <button
          onClick={() => reset()}
          className="btn-gold mt-10"
        >
          Reload Page
        </button>
      </div>
    </div>
  );
}