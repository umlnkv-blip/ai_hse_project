import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

interface CopyButtonProps {
  text: string;
  className?: string;
}

export default function CopyButton({ text, className = "" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.log("Failed to copy text");
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCopy}
      className={className}
      data-testid="button-copy"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 mr-1 text-chart-2" />
          <span className="text-chart-2">Скопировано!</span>
        </>
      ) : (
        <>
          <Copy className="w-4 h-4 mr-1" />
          Копировать
        </>
      )}
    </Button>
  );
}
