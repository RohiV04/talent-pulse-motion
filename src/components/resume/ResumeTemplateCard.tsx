
import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResumeTemplateCardProps {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  tags: string[];
  selected?: boolean;
  onSelect: (id: string) => void;
}

const ResumeTemplateCard = ({
  id,
  name,
  description,
  thumbnail,
  tags,
  selected = false,
  onSelect,
}: ResumeTemplateCardProps) => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <Card
      className={cn(
        "overflow-hidden transition-all duration-300 hover:shadow-md",
        selected && "ring-2 ring-primary",
        "hover-scale"
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="relative">
        <img 
          src={thumbnail} 
          alt={name} 
          className="w-full h-[200px] object-cover"
        />
        {selected && (
          <div className="absolute top-2 right-2 bg-primary rounded-full p-1">
            <Check className="h-4 w-4 text-white" />
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-medium text-lg">{name}</h3>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
        <div className="flex flex-wrap gap-1 mt-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-secondary px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={() => onSelect(id)} 
          variant={selected ? "default" : "outline"}
          className="w-full"
        >
          {selected ? "Selected" : "Use Template"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ResumeTemplateCard;
