/**
 * Signature Meskel bloom — draws itself in on load, ringed by topographic
 * contours: flower + map + the city named "new flower." Reused across pages
 * as an ambient brand motif. Pass `color` to tint it for light/dark grounds.
 */
export default function Bloom({ className, color = '#F4B400' }: { className?: string; color?: string }) {
  const petals = Array.from({ length: 12 });
  return (
    <svg viewBox="0 0 240 240" fill="none" className={className} aria-hidden="true">
      {/* Contour rings (elevation around the bloom) */}
      {[108, 88, 68].map((r, i) => (
        <circle
          key={`ring-${i}`}
          cx="120"
          cy="120"
          r={r}
          stroke={color}
          strokeOpacity={0.16 - i * 0.03}
          strokeWidth="1"
          pathLength={1}
          className="bloom-path"
          style={{ animationDelay: `${0.15 + i * 0.12}s` }}
        />
      ))}
      {/* Outer petals */}
      {petals.map((_, i) => (
        <path
          key={`petal-${i}`}
          d="M120,120 C104,86 104,54 120,30 C136,54 136,86 120,120 Z"
          transform={`rotate(${i * 30} 120 120)`}
          stroke={color}
          strokeOpacity="0.9"
          strokeWidth="1.4"
          pathLength={1}
          className="bloom-path"
          style={{ animationDelay: `${0.5 + i * 0.06}s` }}
        />
      ))}
      {/* Inner petals, offset and shorter */}
      {petals.map((_, i) => (
        <path
          key={`inner-${i}`}
          d="M120,120 C112,98 112,84 120,72 C128,84 128,98 120,120 Z"
          transform={`rotate(${i * 30 + 15} 120 120)`}
          stroke={color}
          strokeOpacity="0.5"
          strokeWidth="1.2"
          pathLength={1}
          className="bloom-path"
          style={{ animationDelay: `${0.9 + i * 0.04}s` }}
        />
      ))}
      {/* Center */}
      <circle
        cx="120"
        cy="120"
        r="12"
        stroke={color}
        strokeWidth="1.6"
        fill={color}
        fillOpacity="0.14"
        pathLength={1}
        className="bloom-path"
        style={{ animationDelay: '1.35s' }}
      />
    </svg>
  );
}
