import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CopyButton from "./CopyButton";

interface ResultCardProps {
  variantNumber: number;
  title?: string;
  text: string;
  imageIdea?: string;
}

export default function ResultCard({ variantNumber, title, text, imageIdea }: ResultCardProps) {
  const fullText = imageIdea ? `${text}\n\nИдея для картинки: ${imageIdea}` : text;

  return (
    <Card className="p-6 space-y-4" data-testid={`card-result-${variantNumber}`}>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <Badge variant="secondary" className="text-xs">
          Вариант {variantNumber}
        </Badge>
        <CopyButton text={fullText} />
      </div>
      
      {title && (
        <h4 className="font-semibold text-lg" data-testid={`text-result-title-${variantNumber}`}>
          {title}
        </h4>
      )}
      
      <div className="bg-muted rounded-md p-4">
        <p className="whitespace-pre-wrap leading-7" data-testid={`text-result-content-${variantNumber}`}>
          {text}
        </p>
      </div>
      
      {imageIdea && (
        <div className="border-t pt-4">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Идея для картинки:</span> {imageIdea}
          </p>
        </div>
      )}
    </Card>
  );
}
