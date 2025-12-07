import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Sparkles } from "lucide-react";

interface YaDirectFormProps {
  onSubmit: (data: YaDirectFormData) => void;
  isLoading?: boolean;
}

export interface YaDirectFormData {
  product: string;
  audience: string;
  keywords: string;
  usp: string;
  tone: string;
  count: number;
}

const exampleData: YaDirectFormData = {
  product: "Онлайн-курсы по программированию для начинающих. Python, JavaScript, веб-разработка. Обучение с нуля до Junior за 6 месяцев.",
  audience: "Молодые специалисты 25-35 лет, желающие сменить профессию. Офисные работники, уставшие от рутины. Студенты последних курсов.",
  keywords: "курсы программирования, обучение python, стать программистом, IT курсы онлайн, веб-разработка с нуля",
  usp: "Гарантия трудоустройства или возврат денег. Практика на реальных проектах. Поддержка менторов 24/7.",
  tone: "expert",
  count: 5,
};

export default function YaDirectForm({ onSubmit, isLoading = false }: YaDirectFormProps) {
  const [formData, setFormData] = useState<YaDirectFormData>({
    product: "",
    audience: "",
    keywords: "",
    usp: "",
    tone: "neutral",
    count: 5,
  });

  const handleChange = (field: keyof YaDirectFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleExample = () => {
    setFormData(exampleData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isValid = formData.product && formData.audience && formData.keywords;

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
          <h3 className="text-lg font-semibold">Параметры объявления</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleExample}
            data-testid="button-use-example-yadirect"
          >
            Использовать пример
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="product">Продукт или услуга *</Label>
          <Textarea
            id="product"
            value={formData.product}
            onChange={(e) => handleChange("product", e.target.value)}
            placeholder="Опишите ваш продукт или услугу..."
            className="min-h-24"
            data-testid="input-product"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="audience">Целевая аудитория *</Label>
          <Textarea
            id="audience"
            value={formData.audience}
            onChange={(e) => handleChange("audience", e.target.value)}
            placeholder="Опишите вашу целевую аудиторию..."
            className="min-h-24"
            data-testid="input-audience"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="keywords">Ключевые слова *</Label>
          <Textarea
            id="keywords"
            value={formData.keywords}
            onChange={(e) => handleChange("keywords", e.target.value)}
            placeholder="Введите ключевые слова через запятую..."
            className="min-h-20"
            data-testid="input-keywords"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="usp">Уникальное торговое предложение (УТП)</Label>
          <Textarea
            id="usp"
            value={formData.usp}
            onChange={(e) => handleChange("usp", e.target.value)}
            placeholder="Чем ваше предложение отличается от конкурентов..."
            className="min-h-20"
            data-testid="input-usp"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tone">Тональность</Label>
            <Select
              value={formData.tone}
              onValueChange={(value) => handleChange("tone", value)}
            >
              <SelectTrigger data-testid="select-tone">
                <SelectValue placeholder="Выберите тональность" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="neutral">Нейтральный</SelectItem>
                <SelectItem value="friendly">Дружеский</SelectItem>
                <SelectItem value="expert">Экспертный</SelectItem>
                <SelectItem value="emotional">Эмоциональный</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="count">Количество вариантов</Label>
            <Input
              id="count"
              type="number"
              min={1}
              max={10}
              value={formData.count}
              onChange={(e) => handleChange("count", parseInt(e.target.value) || 1)}
              data-testid="input-count"
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={!isValid || isLoading}
          data-testid="button-generate-yadirect"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Генерируем объявления...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Сгенерировать объявления
            </>
          )}
        </Button>
      </form>
    </Card>
  );
}
