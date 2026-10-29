import type { Room } from '../data/types';

/** Schematic floor plan drawn from room plan coordinates. Not to scale. */
export function FloorPlan({
  rooms,
  counts,
  flagged = {},
  selected,
  onSelect,
  className = '',
}: {
  rooms: Room[];
  counts: Record<string, number>;
  flagged?: Record<string, number>;
  selected?: string | null;
  onSelect?: (id: string) => void;
  className?: string;
}) {
  const U = 20;
  const maxX = Math.max(...rooms.map((r) => r.plan.x + r.plan.w), 1);
  const maxY = Math.max(...rooms.map((r) => r.plan.y + r.plan.h), 1);
  return (
    <svg
      viewBox={`-4 -4 ${maxX * U + 8} ${maxY * U + 8}`}
      className={className}
      role="img"
      aria-label="Schematic floor plan of surveyed rooms"
    >
      <defs>
        <pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="#cfc9bd" strokeWidth="1" />
        </pattern>
      </defs>
      <rect x={-2} y={-2} width={maxX * U + 4} height={maxY * U + 4} fill="url(#hatch)" opacity=".6" />
      {rooms.map((r) => {
        const isSel = selected === r.id;
        const x = r.plan.x * U;
        const y = r.plan.y * U;
        const w = r.plan.w * U;
        const h = r.plan.h * U;
        return (
          <g
            key={r.id}
            onClick={onSelect ? () => onSelect(r.id) : undefined}
            className={onSelect ? 'cursor-pointer' : undefined}
            role={onSelect ? 'button' : undefined}
            tabIndex={onSelect ? 0 : undefined}
            aria-label={onSelect ? `${r.code} ${r.name}, ${counts[r.id] ?? 0} items` : undefined}
            onKeyDown={onSelect ? (e) => (e.key === 'Enter' || e.key === ' ') && onSelect(r.id) : undefined}
          >
            <rect x={x} y={y} width={w} height={h} fill={isSel ? '#eef1fb' : '#fbfaf7'} stroke={isSel ? '#2747b8' : '#1d1d1b'} strokeWidth={isSel ? 2 : 1.25} />
            <text x={x + 6} y={y + 13} fontSize="8.5" fontFamily="JetBrains Mono, monospace" fill="#6b675f">{r.code}</text>
            {h >= 60 && w >= 80 && (
              <text x={x + 6} y={y + 25} fontSize="9" fontFamily="Inter, sans-serif" fill="#3d3c38">
                {r.name.length > w / 5.2 ? r.name.slice(0, Math.floor(w / 5.2) - 1) + '…' : r.name}
              </text>
            )}
            <text x={x + w - 6} y={y + h - 7} fontSize="13" fontFamily="Inter, sans-serif" fontWeight="600" textAnchor="end" fill={isSel ? '#2747b8' : '#1d1d1b'}>
              {counts[r.id] ?? 0}
            </text>
            {(flagged[r.id] ?? 0) > 0 && <rect x={x + w - 10} y={y + 5} width={5} height={5} fill="#9a6a12" />}
          </g>
        );
      })}
    </svg>
  );
}
