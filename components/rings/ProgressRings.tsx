type RingData = {
  label: string;
  color: string;
  progress: number; // 0-1
};

interface ProgressRingsProps {
  left: RingData;
  right: RingData;
  size?: number;
}

const RADIUS = 42;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function Ring({
  progress,
  color,
  offset,
}: {
  progress: number;
  color: string;
  offset: number;
}) {
  const clamped = Math.min(Math.max(progress, 0), 1);
  const dashoffset = CIRCUMFERENCE * (1 - clamped);

  return (
    <circle
      cx="50"
      cy="50"
      r={RADIUS}
      fill="none"
      stroke={color}
      strokeWidth="9"
      strokeLinecap="round"
      strokeDasharray={CIRCUMFERENCE}
      strokeDashoffset={dashoffset}
      transform={`rotate(-90 50 50) translate(${offset} 0)`}
      className="transition-[stroke-dashoffset] duration-700 ease-out"
    />
  );
}

/**
 * The MacroMates brand mark: two overlapping rings, one per household member,
 * each filling toward 100% as protein is logged for the day. Used both as the
 * dashboard leaderboard widget and (simplified) as the app icon.
 */
export function ProgressRings({ left, right, size = 220 }: ProgressRingsProps) {
  const bothComplete = left.progress >= 1 && right.progress >= 1;

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="relative"
        style={{ width: size, height: size * 0.7 }}
      >
        <svg
          viewBox="0 0 150 100"
          className={bothComplete ? "animate-pulse" : undefined}
        >
          <circle
            cx="50"
            cy="50"
            r={RADIUS}
            fill="none"
            stroke="var(--surface-raised)"
            strokeWidth="9"
          />
          <circle
            cx="100"
            cy="50"
            r={RADIUS}
            fill="none"
            stroke="var(--surface-raised)"
            strokeWidth="9"
          />
          <g>
            <Ring progress={left.progress} color={left.color} offset={0} />
          </g>
          <g>
            <Ring progress={right.progress} color={right.color} offset={50} />
          </g>
        </svg>
      </div>
      <div className="flex gap-10 text-sm">
        <span className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: left.color }}
          />
          {left.label}
        </span>
        <span className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: right.color }}
          />
          {right.label}
        </span>
      </div>
    </div>
  );
}
