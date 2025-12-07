import { useState } from "react";
import Header from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Megaphone, Mail, Heart, Clock, Loader2 } from "lucide-react";
import YaDirectForm, { YaDirectFormData } from "@/components/YaDirectForm";
import EmailSocialForm, { EmailSocialFormData } from "@/components/EmailSocialForm";
import LoyaltyForm, { LoyaltyFormData } from "@/components/LoyaltyForm";
import HistoryTable, { HistoryItem } from "@/components/HistoryTable";
import ResultCard from "@/components/ResultCard";
import EmptyState from "@/components/EmptyState";

interface GeneratedResult {
  title?: string;
  text: string;
  imageIdea?: string;
}

export default function Workspace() {
  const [activeTab, setActiveTab] = useState("yadirect");
  const [isLoading, setIsLoading] = useState(false);
  const [yaDirectResults, setYaDirectResults] = useState<GeneratedResult[]>([]);
  const [emailResults, setEmailResults] = useState<GeneratedResult[]>([]);
  const [loyaltyResults, setLoyaltyResults] = useState<GeneratedResult[]>([]);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);

  const handleYaDirectSubmit = async (data: YaDirectFormData) => {
    setIsLoading(true);
    console.log("YaDirect submit:", data);
    
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const mockResults: GeneratedResult[] = [
      {
        title: "Стань программистом за 6 месяцев!",
        text: "Освойте Python с нуля до Junior. Гарантия трудоустройства. Практика на реальных проектах. Поддержка менторов 24/7.",
      },
      {
        title: "IT-профессия с нуля",
        text: "Курсы программирования для начинающих. Обучение от практикующих экспертов. Диплом государственного образца.",
      },
      {
        title: "Смени профессию на IT",
        text: "Научим программировать с нуля. 6 месяцев — и вы Junior-разработчик. Помощь в трудоустройстве.",
      },
    ];
    
    setYaDirectResults(mockResults);
    
    const newHistoryItem: HistoryItem = {
      id: Date.now().toString(),
      module: "yadirect",
      inputJson: JSON.stringify(data),
      outputText: mockResults.map((r) => `${r.title}\n${r.text}`).join("\n\n"),
      isFavorite: false,
      createdAt: new Date(),
    };
    setHistoryItems((prev) => [newHistoryItem, ...prev]);
    
    setIsLoading(false);
  };

  const handleEmailSubmit = async (data: EmailSocialFormData) => {
    setIsLoading(true);
    console.log("Email/Social submit:", data);
    
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const mockResults: GeneratedResult[] = [
      {
        text: "Привет! Мы соскучились по тебе и подготовили кое-что особенное. Только для тебя — скидка 25% на всю новую коллекцию органической косметики. Сыворотка с витамином C уже ждет тебя!",
        imageIdea: "Флэтлей с баночками косметики на светлом мраморном фоне, лепестки роз, капли воды",
      },
      {
        text: "Твоя кожа заслуживает лучшего! Новая линейка органической косметики — это забота о себе без компромиссов. Натуральные ингредиенты, видимый результат. Попробуй со скидкой 25%!",
        imageIdea: "До/после эффект на коже, естественный свет, минималистичный дизайн",
      },
    ];
    
    setEmailResults(mockResults);
    
    const newHistoryItem: HistoryItem = {
      id: Date.now().toString(),
      module: "email_social",
      inputJson: JSON.stringify(data),
      outputText: mockResults.map((r) => `${r.text}\n\nИдея для картинки: ${r.imageIdea}`).join("\n\n---\n\n"),
      isFavorite: false,
      createdAt: new Date(),
    };
    setHistoryItems((prev) => [newHistoryItem, ...prev]);
    
    setIsLoading(false);
  };

  const handleLoyaltySubmit = async (data: LoyaltyFormData) => {
    setIsLoading(true);
    console.log("Loyalty submit:", data);
    
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const mockResults: GeneratedResult[] = [
      {
        text: `Дорогая {{Имя}}, поздравляем вас с Днем рождения!\n\nВ этот особенный день мы хотим подарить вам скидку 20% на любую покупку + бесплатную доставку. Это наш маленький подарок за то, что вы с нами!\n\nЖелаем счастья, здоровья и исполнения всех желаний. Ваш промокод: BIRTHDAY20\n\nС теплом,\nВаш любимый магазин`,
      },
      {
        text: `{{Имя}}, с Днем рождения!\n\nСегодня ваш день, и мы приготовили для вас сюрприз: скидка 20% + доставка в подарок!\n\nВы давно присматривались к аксессуарам из новой коллекции? Самое время порадовать себя! Промокод BIRTHDAY20 уже активирован.\n\nОтличного праздника!`,
      },
    ];
    
    setLoyaltyResults(mockResults);
    
    const newHistoryItem: HistoryItem = {
      id: Date.now().toString(),
      module: "loyalty",
      inputJson: JSON.stringify(data),
      outputText: mockResults.map((r) => r.text).join("\n\n---\n\n"),
      isFavorite: false,
      createdAt: new Date(),
    };
    setHistoryItems((prev) => [newHistoryItem, ...prev]);
    
    setIsLoading(false);
  };

  const handleToggleFavorite = (id: string) => {
    setHistoryItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  const renderResults = (results: GeneratedResult[], type: string) => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Генерируем варианты...</p>
        </div>
      );
    }

    if (results.length === 0) {
      return <EmptyState type="results" />;
    }

    return (
      <div className="space-y-4">
        {results.map((result, index) => (
          <ResultCard
            key={index}
            variantNumber={index + 1}
            title={result.title}
            text={result.text}
            imageIdea={result.imageIdea}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header showAppButton={false} />

      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="mb-6 sticky top-16 z-40 bg-background/95 backdrop-blur">
            <TabsTrigger value="yadirect" className="gap-2" data-testid="tab-yadirect">
              <Megaphone className="w-4 h-4" />
              Яндекс.Директ
            </TabsTrigger>
            <TabsTrigger value="email" className="gap-2" data-testid="tab-email">
              <Mail className="w-4 h-4" />
              Email и соцсети
            </TabsTrigger>
            <TabsTrigger value="loyalty" className="gap-2" data-testid="tab-loyalty">
              <Heart className="w-4 h-4" />
              Лояльность
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2" data-testid="tab-history">
              <Clock className="w-4 h-4" />
              История
            </TabsTrigger>
          </TabsList>

          <TabsContent value="yadirect" className="mt-0">
            <div className="grid lg:grid-cols-5 gap-6">
              <div className="lg:col-span-2">
                <YaDirectForm onSubmit={handleYaDirectSubmit} isLoading={isLoading} />
              </div>
              <div className="lg:col-span-3">
                <ScrollArea className="h-[calc(100vh-200px)]">
                  {renderResults(yaDirectResults, "yadirect")}
                </ScrollArea>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="email" className="mt-0">
            <div className="grid lg:grid-cols-5 gap-6">
              <div className="lg:col-span-2">
                <EmailSocialForm onSubmit={handleEmailSubmit} isLoading={isLoading} />
              </div>
              <div className="lg:col-span-3">
                <ScrollArea className="h-[calc(100vh-200px)]">
                  {renderResults(emailResults, "email")}
                </ScrollArea>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="loyalty" className="mt-0">
            <div className="grid lg:grid-cols-5 gap-6">
              <div className="lg:col-span-2">
                <LoyaltyForm onSubmit={handleLoyaltySubmit} isLoading={isLoading} />
              </div>
              <div className="lg:col-span-3">
                <ScrollArea className="h-[calc(100vh-200px)]">
                  {renderResults(loyaltyResults, "loyalty")}
                </ScrollArea>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-0">
            {historyItems.length === 0 ? (
              <EmptyState type="history" />
            ) : (
              <HistoryTable
                items={historyItems}
                onToggleFavorite={handleToggleFavorite}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
