"use client";

export default function ProgressDots({
  total,
  atual,
}: {
  total: number;
  atual: number;
}) {
  function irPara(i: number) {
    document
      .getElementById(`estrofe-${i}`)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <div className="fixed right-4 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-2.5 sm:flex">
      {Array.from({ length: total }, (_, i) => (
        <button
          key={i}
          onClick={() => irPara(i)}
          aria-label={`Ir para a estrofe ${i + 1}`}
          className="group flex h-3 w-3 items-center justify-center"
        >
          <span
            className={
              "block rounded-full border transition-all duration-300 " +
              (i === atual
                ? "h-2 w-2 border-[#c8a030] bg-[#c8a030]"
                : "h-1.5 w-1.5 border-[rgba(200,160,48,0.4)] bg-transparent group-hover:border-[#c8a030]")
            }
          />
        </button>
      ))}
    </div>
  );
}
