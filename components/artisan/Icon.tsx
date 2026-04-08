export function Icon({
  name,
  className = "",
  "aria-label": ariaLabel,
}: {
  name: string;
  className?: string;
  "aria-label"?: string;
}) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      aria-hidden={ariaLabel ? undefined : true}
      aria-label={ariaLabel}
    >
      {name}
    </span>
  );
}
