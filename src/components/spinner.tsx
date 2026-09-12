import type { SVGProps } from "react";

type SpinnerProps = Omit<SVGProps<SVGSVGElement>, "color"> & {
  size?: number | string;
  color?: string;
  strokeWidth?: number;
};

export function Spinner({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  className,
  ...props
}: SpinnerProps) {
  const classes = ["spinner", className].filter(Boolean).join(" ");

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      color={color}
      className={classes}
      role="status"
      aria-label="불러오는 중"
      {...props}
    >
      <circle
        className="spinner__arc"
        cx="12"
        cy="12"
        r="9"
        pathLength="1"
        stroke="currentColor"
        strokeWidth={strokeWidth}
      />
    </svg>
  );
}

export default Spinner;
