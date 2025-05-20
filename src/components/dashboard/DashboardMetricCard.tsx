
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva(
  "transition-all duration-300 hover:shadow-md overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-card",
        primary: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        success: "bg-green-100 dark:bg-green-900 border-green-200 dark:border-green-800",
        warning: "bg-yellow-100 dark:bg-yellow-900 border-yellow-200 dark:border-yellow-800",
        danger: "bg-red-100 dark:bg-red-900 border-red-200 dark:border-red-800",
        info: "bg-blue-100 dark:bg-blue-900 border-blue-200 dark:border-blue-800",
        purple: "bg-resume-soft-purple text-resume-dark-purple",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface DashboardMetricCardProps extends VariantProps<typeof cardVariants> {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  className?: string;
}

const DashboardMetricCard = ({
  title,
  value,
  description,
  icon,
  variant,
  trend,
  trendValue,
  className,
}: DashboardMetricCardProps) => {
  return (
    <Card className={cn(cardVariants({ variant }), "animate-scale-in", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="w-4 h-4">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center mt-1">
          {trend && (
            <div className="mr-1">
              {trend === "up" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4 text-green-500"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : trend === "down" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4 text-red-500"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4 text-gray-500"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
          )}
          {trendValue && (
            <p
              className={cn("text-xs", {
                "text-green-600 dark:text-green-500": trend === "up",
                "text-red-600 dark:text-red-500": trend === "down",
                "text-gray-600 dark:text-gray-400": trend === "neutral" || !trend,
              })}
            >
              {trendValue}
            </p>
          )}
          {description && (
            <CardDescription className="text-xs ml-auto">
              {description}
            </CardDescription>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardMetricCard;
