import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle2, XCircle, Lightbulb } from "lucide-react";
import CopyButton from "./CopyButton";
import { validateYaDirectAd, getCharacterCountColor, type ValidationResult } from "@/lib/yaDirectValidation";

interface YaDirectResultCardProps {
  variantNumber: number;
  title: string;
  text: string;
  keywords: string;
  usp?: string;
}

function ValidationBadge({ validation }: { validation: ValidationResult }) {
  if (validation.isValid && validation.warnings.length === 0) {
    return (
      <Badge variant="outline" className="gap-1 border-green-500/50 text-green-600 dark:text-green-400">
        <CheckCircle2 className="w-3 h-3" />
        Соответствует
      </Badge>
    );
  }
  if (!validation.isValid) {
    return (
      <Badge variant="outline" className="gap-1 border-red-500/50 text-red-600 dark:text-red-400">
        <XCircle className="w-3 h-3" />
        Ошибки
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="gap-1 border-amber-500/50 text-amber-600 dark:text-amber-400">
      <AlertTriangle className="w-3 h-3" />
      Предупреждения
    </Badge>
  );
}

export default function YaDirectResultCard({ 
  variantNumber, 
  title, 
  text, 
  keywords,
  usp = ""
}: YaDirectResultCardProps) {
  const fullText = `Заголовок: ${title}\nТекст: ${text}`;
  const validation = validateYaDirectAd(title, text, keywords, usp);

  return (
    <Card className="p-6 space-y-4" data-testid={`card-yadirect-result-${variantNumber}`}>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary" className="text-xs">
            Вариант {variantNumber}
          </Badge>
          <ValidationBadge validation={validation} />
        </div>
        <CopyButton text={fullText} />
      </div>
      
      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-sm font-medium text-muted-foreground">Заголовок</span>
            <span className={`text-xs ${getCharacterCountColor(validation.stats.titleLength, 56)}`}>
              {validation.stats.titleLength}/56 симв.
            </span>
          </div>
          <h4 className="font-semibold text-lg" data-testid={`text-yadirect-title-${variantNumber}`}>
            {title}
          </h4>
        </div>
        
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-sm font-medium text-muted-foreground">Текст объявления</span>
            <span className={`text-xs ${getCharacterCountColor(validation.stats.textLength, 81)}`}>
              {validation.stats.textLength}/81 симв.
            </span>
          </div>
          <div className="bg-muted rounded-md p-4">
            <p className="whitespace-pre-wrap leading-7" data-testid={`text-yadirect-content-${variantNumber}`}>
              {text}
            </p>
          </div>
        </div>
      </div>

      {(validation.errors.length > 0 || validation.warnings.length > 0) && (
        <div className="border-t pt-4 space-y-2">
          {validation.errors.map((error, idx) => (
            <div key={`error-${idx}`} className="flex items-start gap-2 text-sm text-red-600 dark:text-red-400">
              <XCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          ))}
          {validation.warnings.map((warning, idx) => (
            <div key={`warning-${idx}`} className="flex items-start gap-2 text-sm text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{warning}</span>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4 text-xs text-muted-foreground border-t pt-3 flex-wrap">
        <span className="flex items-center gap-1">
          {validation.stats.hasKeywords ? (
            <CheckCircle2 className="w-3 h-3 text-green-500" />
          ) : (
            <XCircle className="w-3 h-3 text-muted-foreground" />
          )}
          Ключевые слова
        </span>
        <span className="flex items-center gap-1">
          {validation.stats.hasCTA ? (
            <CheckCircle2 className="w-3 h-3 text-green-500" />
          ) : (
            <XCircle className="w-3 h-3 text-muted-foreground" />
          )}
          Призыв к действию
        </span>
        {usp && (
          <span className="flex items-center gap-1">
            {validation.stats.hasUSP ? (
              <CheckCircle2 className="w-3 h-3 text-green-500" />
            ) : (
              <XCircle className="w-3 h-3 text-muted-foreground" />
            )}
            УТП
          </span>
        )}
        <span className="flex items-center gap-1">
          <Lightbulb className="w-3 h-3" />
          Макс. слово: {validation.stats.longestWord} симв.
        </span>
      </div>
    </Card>
  );
}
