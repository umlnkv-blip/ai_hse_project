import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Sparkles } from "lucide-react";

interface EmailSocialFormProps {
  onSubmit: (data: EmailSocialFormData) => void;
  isLoading?: boolean;
}

export interface EmailSocialFormData {
  channel: string;
  goal: string;
  customerProfile: string;
  productDescription: string;
  tone: string;
}

const exampleData: EmailSocialFormData = {
  channel: "email",
  goal: "promo",
  customerProfile: "Женщины 25-45 лет, интересующиеся уходом за кожей. Средний+ доход. Следят за трендами в бьюти-индустрии. Ценят натуральные ингредиенты.",
  productDescription: "Новая линейка органической косметики. Сыворотка с витамином C, увлажняющий крем с гиалуроновой кислотой. Скидка 25% на первый заказ.",
  tone: "inspiring",
};

export default function EmailSocialForm({ onSubmit, isLoading = false }: EmailSocialFormProps) {
  const [formData, setFormData] = useState<EmailSocialFormData>({
    channel: "",
    goal: "",
    customerProfile: "",
    productDescription: "",
    tone: "friendly",
  });

  const handleChange = (field: keyof EmailSocialFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleExample = () => {
    setFormData(exampleData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isValid = formData.channel && formData.goal && formData.customerProfile && formData.productDescription;

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
          <h3 className="text-lg font-semibold">Параметры публикации</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleExample}
            data-testid="button-use-example-email"
          >
            Использовать пример
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="channel">Канал *</Label>
          <Select
            value={formData.channel}
            onValueChange={(value) => handleChange("channel", value)}
          >
            <SelectTrigger data-testid="select-channel">
              <SelectValue placeholder="Выберите канал" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="instagram_post">Пост в Instagram (принадлежит Meta, деятельность организации запрещена на территории РФ)</SelectItem>
              <SelectItem value="instagram_stories">Сторис Instagram (принадлежит Meta, деятельность организации запрещена на территории РФ)</SelectItem>
              <SelectItem value="vk">ВКонтакте</SelectItem>
              <SelectItem value="telegram">Telegram</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="goal">Цель *</Label>
          <Select
            value={formData.goal}
            onValueChange={(value) => handleChange("goal", value)}
          >
            <SelectTrigger data-testid="select-goal">
              <SelectValue placeholder="Выберите цель" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="welcome">Приветствие</SelectItem>
              <SelectItem value="promo">Промо-акция</SelectItem>
              <SelectItem value="reactivation">Реактивация</SelectItem>
              <SelectItem value="digest">Дайджест</SelectItem>
              <SelectItem value="educational">Образовательный пост</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="customerProfile">Портрет клиента *</Label>
          <Textarea
            id="customerProfile"
            value={formData.customerProfile}
            onChange={(e) => handleChange("customerProfile", e.target.value)}
            placeholder="Демография, интересы, боли..."
            className="min-h-24"
            data-testid="input-customer-profile"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="productDescription">Описание продукта или оффера *</Label>
          <Textarea
            id="productDescription"
            value={formData.productDescription}
            onChange={(e) => handleChange("productDescription", e.target.value)}
            placeholder="Что вы предлагаете клиенту..."
            className="min-h-24"
            data-testid="input-product-description"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tone">Тональность</Label>
          <Select
            value={formData.tone}
            onValueChange={(value) => handleChange("tone", value)}
          >
            <SelectTrigger data-testid="select-tone-email">
              <SelectValue placeholder="Выберите тональность" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="friendly">Дружеская</SelectItem>
              <SelectItem value="expert">Экспертная</SelectItem>
              <SelectItem value="inspiring">Вдохновляющая</SelectItem>
              <SelectItem value="provocative">Провокационная</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={!isValid || isLoading}
          data-testid="button-generate-email"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Генерируем тексты...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Сгенерировать тексты
            </>
          )}
        </Button>
      </form>
    </Card>
  );
}
