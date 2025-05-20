
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ResumeProgressCardProps {
  title: string;
  progress: number;
  maxScore?: number;
  className?: string;
}

const ResumeProgressCard = ({
  title,
  progress,
  maxScore = 100,
  className,
}: ResumeProgressCardProps) => {
  const percentage = (progress / maxScore) * 100;
  const formattedPercentage = Math.round(percentage);

  // Determine the color of the progress bar based on the percentage
  const getProgressColor = () => {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <Card className={`animate-scale-in ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <CardDescription>
          {progress} of {maxScore} points
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">{formattedPercentage}%</span>
          <div className="text-xs text-muted-foreground">
            {formattedPercentage >= 80
              ? "Excellent"
              : formattedPercentage >= 60
              ? "Good"
              : "Needs improvement"}
          </div>
        </div>
        <Progress value={percentage} className={`h-2 ${getProgressColor()}`} />
      </CardContent>
    </Card>
  );
};

export default ResumeProgressCard;
