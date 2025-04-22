import { cn } from "@/lib/utils";

interface TickProps {
  /**
   * Additional CSS classes to apply to the tick icon
   */
  className?: string;
}

export function Tick({ className }: TickProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-4 w-4", className)}
      data-testid="tick-icon"
    >
      <path
        d="M3.33301 8.6665L5.68396 10.5473C6.2355 10.9885 7.03544 10.9231 7.50794 10.3981L12.6663 4.6665"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
