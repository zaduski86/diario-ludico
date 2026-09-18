export default function InkFilter() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden>
      <filter id="tinta-turbulencia">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.01 0.04"
          numOctaves={2}
          seed={7}
          result="noise"
        />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale={6} />
      </filter>
    </svg>
  );
}
