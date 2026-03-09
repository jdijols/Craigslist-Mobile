export function TitleSlide() {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-8 px-12 overflow-hidden">
      {/* Livefront-style slanted purple wash — top portion */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          clipPath: "polygon(0 0, 100% 0, 100% 70%, 0 88%)",
          background:
            "linear-gradient(145deg, rgba(122, 31, 162, 0.10) 0%, rgba(122, 31, 162, 0.07) 100%)",
        }}
      />

      <img
        src="/assets/cl-icon.png"
        alt="Craigslist"
        className="relative h-20 w-20 mix-blend-multiply"
      />
      <div className="relative text-center">
        <h1 className="font-serif text-5xl tracking-tight text-lf-navy">
          Reimagining the <span className="text-cl-purple-secondary">craigslist</span> app
        </h1>
        <div className="mt-5 h-px w-24 mx-auto bg-lf-blue/25" />
        <p className="mt-5 text-lg text-lf-secondary">
          Same Brand, Modern Design
        </p>
      </div>
      <div className="relative mt-8 text-center">
        <p className="text-sm font-semibold text-lf-blue">
          Presented by{" "}
          <a
            href="https://livefront.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold hover:underline underline-offset-2"
          >
            Livefront
          </a>
        </p>
        <p className="mt-1 text-xs text-lf-secondary">
          <a
            href="https://www.linkedin.com/in/jasondijols"
            target="_blank"
            rel="noopener noreferrer"
            className="text-lf-secondary hover:text-lf-blue"
          >
            Jason Dijols
          </a>{" "}
          March 2026
        </p>
      </div>
    </div>
  );
}
