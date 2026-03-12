export function ThankYouSlide() {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-8 px-12 overflow-hidden">
      {/* Livefront-style slanted purple wash — bottom portion (same as Next Steps) */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          clipPath: "polygon(0 33%, 100% 15%, 100% 100%, 0 100%)",
          background:
            "linear-gradient(195deg, rgba(122, 31, 162, 0.07) 0%, rgba(122, 31, 162, 0.10) 100%)",
        }}
      />

      <div className="relative text-center">
        <h1 className="font-serif text-5xl tracking-tight text-lf-navy">
          Thank you
        </h1>
        <div className="mt-5 h-px w-24 mx-auto bg-lf-blue/25" />
        <p className="mt-6 text-lg text-lf-secondary max-w-md mx-auto">
          Let&rsquo;s schedule time to walk through the prototype and
          discuss next steps.
        </p>
      </div>
      <div className="relative mt-4 text-center">
        <p className="text-sm font-semibold text-lf-blue">
          Ready to talk?
        </p>
        <p className="mt-1 text-xs text-lf-secondary">
          Let&rsquo;s set up a call
        </p>
      </div>
    </div>
  );
}
