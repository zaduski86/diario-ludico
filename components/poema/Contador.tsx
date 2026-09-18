export default function Contador({
  total,
  atual,
}: {
  total: number;
  atual: number;
}) {
  return (
    <div className="fixed bottom-10 left-1/2 z-10 flex -translate-x-1/2 gap-2">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={
            "h-1.5 w-1.5 rounded-full border transition-all duration-400 " +
            (i === atual
              ? "border-[#c8a030] bg-[#c8a030]"
              : i < atual
                ? "border-[rgba(200,160,48,0.3)] bg-[rgba(200,160,48,0.3)]"
                : "border-[rgba(200,160,48,0.4)] bg-transparent")
          }
        />
      ))}
    </div>
  );
}
