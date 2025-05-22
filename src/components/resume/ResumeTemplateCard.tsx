
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
        "overflow-hidden transition-all duration-300 transform hover:-translate-y-1",
        selected ? "ring-2 ring-primary shadow-lg" : "hover:shadow-md",
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="relative">
        <div className="w-full h-[200px] overflow-hidden bg-muted">
          <img 
            src={thumbnail} 
            alt={name} 
            className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-105"
          />
          {selected && (
            <div className="absolute top-3 right-3 bg-primary rounded-full p-1.5 shadow-md">
              <Check className="h-4 w-4 text-primary-foreground" />
            </div>
          )}
          <div className={cn(
            "absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 transition-opacity duration-300",
            isHovering && "opacity-100"
          )}></div>
        </div>
      </div>
      <CardContent className="p-5">
        <h3 className="font-semibold text-lg">{name}</h3>
        <p className="text-sm text-muted-foreground mt-1.5">{description}</p>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-secondary/50 px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </CardContent>
      <CardFooter className="px-5 pb-5 pt-0">
        <Button 
          onClick={() => onSelect(id)} 
          variant={selected ? "default" : "outline"}
          className="w-full transition-all duration-300"
        >
          {selected ? "Selected" : "Use Template"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ResumeTemplateCard;
