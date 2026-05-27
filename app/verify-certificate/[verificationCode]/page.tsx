import { redirect } from "next/navigation";

export default function VerifyCertificateHomePage() {
  return (
    <main className="min-h-screen bg-[#fdfaf4] p-8">
      <section className="mx-auto max-w-3xl border border-[#c9a84c]/20 bg-white/90 p-10">
        <div className="text-center">
          <p className="section-label">
            Certificate Authentication
          </p>

          <h1 className="mt-4 font-edc-serif text-5xl font-semibold text-[#0b1f3a]">
            Verify EDC Certificate
          </h1>

          <p className="mx-auto mt-5 max-w-2xl leading-8 text-[#1c2b3a]/70">
            Use the verification code on an official EDC certificate
            to validate authenticity and ownership.
          </p>
        </div>

        <form className="mt-10 grid gap-5">
          <input
            name="verificationCode"
            required
            placeholder="Enter Verification Code"
            className="border border-[#c9a84c]/30 bg-[#fdfaf4]/90 p-5 text-center uppercase tracking-[0.2em] outline-none"
          />

          <button
            formAction={async (formData) => {
              "use server";

              const code = String(
                formData.get("verificationCode") || ""
              ).trim();

              redirect(`/verify-certificate/${code}`);
            }}
            className="btn-gold"
          >
            Verify Certificate
          </button>
        </form>
      </section>
    </main>
  );
}