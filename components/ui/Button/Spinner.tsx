import { cn } from "../../../lib/utils";

interface SpinnerProps {
  /**
   * Additional CSS classes to apply to the spinner
   */
  className?: string;
}

const Spinner = ({ className }: SpinnerProps) => {
  return (
    <svg
      width="25"
      height="24"
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("absolute h-6 w-6 animate-spin", className)}
    >
      <circle
        cx="12.5"
        cy="12"
        r="10.75"
        strokeOpacity="0.16"
        strokeWidth="2.5"
        className="stroke-gray-400"
      />
      <path
        d="M17.7793 2.63334C18.1177 2.03289 17.9073 1.2652 17.275 0.990931C15.811 0.355965 14.2311 0.0176611 12.6271 0.000672984C11.0231 -0.0163151 9.43634 0.28845 7.95926 0.892267C7.32126 1.15308 7.09463 1.91614 7.42026 2.52362C7.74589 3.1311 8.50044 3.35103 9.14533 3.10774C10.2458 2.69258 11.4173 2.484 12.6007 2.49653C13.784 2.50907 14.9508 2.74241 16.0423 3.18079C16.6818 3.43768 17.4409 3.23378 17.7793 2.63334Z"
        className="fill-gray-900"
      />
    </svg>
  );
};

export default Spinner;