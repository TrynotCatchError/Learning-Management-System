import { LucideIcon } from "lucide-react";
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from "../../lib/utils"; // assuming this is a utility function to join class names

// Background variants using `cva`
const backgroundVariants = cva(
  "rounded-full flex items-center justify-center",
  {
    variants: {
      variant: { // Corrected the typo from `varriants` to `variant`
        default: 'bg-sky-100',
        success: 'bg-emerald-100',
      },
      iconVariant: {
        default: "text-sky-700",
        success: "text-emerald-700"
      },
      size: {
        default: "p-2",
        sm: "p-1"
      }
    },
    defaultVariants: {
      variant: "default", // Corrected the typo from `defualt` to `default`
      size: 'default'
    }
  }
);

// Icon variants using `cva`
const iconVariants = cva(
  "",
  {
    variants: {
      variant: { // Corrected the typo from `varriants` to `variant`
        default: 'bg-sky-700',
        success: "bg-emerald-700",
      },
      size: {
        default: "h-8 w-8",
        sm: "h-4 w-4"
      }
    },
    defaultVariants: {
      variant: "success", // Corrected the typo from `defualt` to `default`
      size: 'default'
    }
  }
);

// Type definitions
type BackgroundVariantsProps = VariantProps<typeof backgroundVariants>;
type IconVariantsProps = VariantProps<typeof iconVariants>;

interface IconBadgeProps extends BackgroundVariantsProps, IconVariantsProps {
  icon: LucideIcon;
}

// Component for the IconBadge
export const IconBadge = ({
  icon: Icon,
  variant, // Added correct destructuring of `variant` instead of `variants`
  size,
}: IconBadgeProps) => {
  return (
    <div className={cn(backgroundVariants({ variant, size }))}> {/* Corrected `varriants` to `variant` */}
      <Icon className={cn(iconVariants({ variant, size }))} /> {/* Corrected `varriants` to `variant` */}
    </div>
  );
};
