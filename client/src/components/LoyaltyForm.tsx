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

interface LoyaltyFormProps {
  onSubmit: (data: LoyaltyFormData) => void;
  isLoading?: boolean;
}

export interface LoyaltyFormData {
  scenario: string;
  customerName: string;
  purchaseHistory: string;
  offer: string;
  campaignGoal: string;
}

const exampleData: LoyaltyFormData = {
  scenario: "birthday",
  customerName: "Анна",
  purchaseHistory: "Покупала зимнюю коллекцию одежды, интересуется аксессуарами. Последняя покупка — 2 месяца назад. Средний чек 5000 руб.",
  offer: "Скидка 20% на любую покупку + бесплатная доставка",
  campaignGoal: "Поздравить клиента с днем рождения и стимулировать покупку в честь праздника",
};

export default function LoyaltyForm({ onSubmit, isLoading = false }: LoyaltyFormProps) {
  const [formData, setFormData] = useState<LoyaltyFormData>({
    scenario: "",
    customerName: "",
    purchaseHistory: "",
    offer: "",
    campaignGoal: "",
  });

  const handleChange = (field: keyof LoyaltyFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleExample = () => {
    setFormData(exampleData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isValid = formData.scenario && formData.customerName && formData.offer;

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
          <h3 className="text-lg font-semibold">Параметры сообщения</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleExample}
            data-testid="button-use-example-loyalty"
          >
            Использовать пример
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="scenario">Тип сценария *</Label>
          <Select
            value={formData.scenario}
            onValueChange={(value) => handleChange("scenario", value)}
          >
            <SelectTrigger data-testid="select-scenario">
              <SelectValue placeholder="Выберите сценарий" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="birthday">Поздравление с ДР</SelectItem>
              <SelectItem value="personal_offer">Персональное предложение</SelectItem>
              <SelectItem value="reactivation">Реактивация</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="customerName">Имя клиента *</Label>
          <Input
            id="customerName"
            value={formData.customerName}
            onChange={(e) => handleChange("customerName", e.target.value)}
            placeholder="Введите имя клиента..."
            data-testid="input-customer-name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="purchaseHistory">Что клиент покупал / интересы</Label>
          <Textarea
            id="purchaseHistory"
            value={formData.purchaseHistory}
            onChange={(e) => handleChange("purchaseHistory", e.target.value)}
            placeholder="История покупок, предпочтения клиента..."
            className="min-h-24"
            data-testid="input-purchase-history"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="offer">Скидка / предложение *</Label>
          <Input
            id="offer"
            value={formData.offer}
            onChange={(e) => handleChange("offer", e.target.value)}
            placeholder="Например: Скидка 15% на следующую покупку"
            data-testid="input-offer"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="campaignGoal">Цель кампании</Label>
          <Textarea
            id="campaignGoal"
            value={formData.campaignGoal}
            onChange={(e) => handleChange("campaignGoal", e.target.value)}
            placeholder="Чего вы хотите достичь этим сообщением..."
            className="min-h-20"
            data-testid="input-campaign-goal"
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={!isValid || isLoading}
          data-testid="button-generate-loyalty"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Генерируем сообщения...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Сгенерировать сообщения
            </>
          )}
        </Button>
      </form>
    </Card>
  );
}
