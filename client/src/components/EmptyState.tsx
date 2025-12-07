import { FileText, Clock } from "lucide-react";

interface EmptyStateProps {
  type: "results" | "history";
}

export default function EmptyState({ type }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center" data-testid={`empty-state-${type}`}>
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        {type === "results" ? (
          <FileText className="w-8 h-8 text-muted-foreground" />
        ) : (
          <Clock className="w-8 h-8 text-muted-foreground" />
        )}
      </div>
      <h3 className="text-lg font-medium mb-2">
        {type === "results" ? "Здесь появятся результаты" : "История пуста"}
      </h3>
      <p className="text-muted-foreground max-w-sm">
        {type === "results" 
          ? "Заполните форму слева и нажмите кнопку генерации, чтобы получить варианты текстов."
          : "Сгенерированные тексты будут сохраняться здесь для быстрого доступа."
        }
      </p>
    </div>
  );
}
