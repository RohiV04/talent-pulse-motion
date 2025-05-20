
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  buttonText: string;
  onClick: () => void;
  className?: string;
}

const QuickActionCard = ({
  title,
  description,
  icon,
  buttonText,
  onClick,
  className,
}: QuickActionCardProps) => {
  return (
    <Card className={cn("hover-scale transition-all duration-200", className)}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-primary/10 text-primary">{icon}</div>
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={onClick} className="w-full">
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickActionCard;
