type BadgeVariant = "default" | "positive" | "negative" | "neutral";

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-[#f0faf6] text-[#00835b] border border-[#c3e8da]",
  positive: "bg-emerald-50 text-emerald-600 border border-emerald-200",
  negative: "bg-rose-50 text-rose-500 border border-rose-200",
  neutral: "bg-gray-100 text-gray-500 border border-gray-200",
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
}

export function Badge({ children, variant = "default" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantClasses[variant]}`}
    >
      {children}
    </span>
  );
}
