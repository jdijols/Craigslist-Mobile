import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const exitVariants = {
  visible: { opacity: 1 },
  exit: {
    opacity: 0,
    transition: { duration: 0.35, ease: "easeInOut" },
  },
};

export function StandaloneCover() {
  const [visible, setVisible] = useState(true);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center overflow-y-auto"
          variants={exitVariants}
          initial="visible"
          animate="visible"
          exit="exit"
        >
          <div
            className="absolute inset-0 backdrop-blur-2xl"
            style={{ backgroundColor: "rgba(249,250,251,0.88)" }}
          />

          <div className="relative z-10 flex w-full max-w-sm flex-col items-center px-8 py-16 text-center">
            <img
              src="/assets/cl-icon.png"
              alt=""
              className="mb-8 h-11 w-11 rounded-full"
            />

            <h1 className="font-serif text-[1.75rem] leading-snug tracking-tight text-lf-navy sm:text-[2rem]">
              Reimagining the
              <br />
              <span className="text-cl-purple-secondary">craigslist</span> app
            </h1>

            <div className="mt-6 h-px w-10 bg-lf-navy/10" />

            <p className="mt-6 text-sm leading-relaxed text-lf-secondary">
              Thank you for taking the time to review this work. It's a
              ground-up redesign of the craigslist mobile experience that
              preserves the brand while modernizing how people browse, search,
              and connect.
            </p>

            <p className="mt-5 text-sm leading-relaxed text-lf-secondary">
              At this screen size you can interact with the prototype directly.
              For the full presentation, including research, strategy, and
              rationale, open this on a display wider than 1280px.
            </p>

            <button
              onClick={() => setVisible(false)}
              className="mt-10 rounded-full border border-lf-navy/15 px-7 py-2.5 text-sm font-medium text-lf-navy transition-colors hover:bg-lf-navy/[0.04] active:bg-lf-navy/[0.07]"
            >
              Continue to Prototype
            </button>

            <p className="mt-16 text-[11px] text-lf-secondary/60">
              Feedback and critiques are welcome
            </p>
            <p className="mt-2 text-[11px] text-lf-secondary/50">
              <a
                href="https://www.linkedin.com/in/jasondijols"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lf-secondary/70 hover:text-lf-navy transition-colors"
              >
                Jason Dijols
              </a>
              {" · "}
              Prepared for{" "}
              <a
                href="https://livefront.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lf-secondary/70 hover:text-lf-navy transition-colors"
              >
                Livefront
              </a>
              {" · "}
              March 2026
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
