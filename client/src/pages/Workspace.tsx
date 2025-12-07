import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Megaphone, Mail, Heart, Clock, Loader2 } from "lucide-react";
import YaDirectForm, { YaDirectFormData } from "@/components/YaDirectForm";
import EmailSocialForm, { EmailSocialFormData } from "@/components/EmailSocialForm";
import LoyaltyForm, { LoyaltyFormData } from "@/components/LoyaltyForm";
import HistoryTable from "@/components/HistoryTable";
import ResultCard from "@/components/ResultCard";
import EmptyState from "@/components/EmptyState";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Generation } from "@shared/schema";

interface GeneratedResult {
  title?: string;
  text: string;
  imageIdea?: string;
}

interface GenerateResponse {
  results: GeneratedResult[];
  raw?: string;
}

interface HistoryResponse {
  generations: Generation[];
}

export default function Workspace() {
  const [activeTab, setActiveTab] = useState("yadirect");
  const [yaDirectResults, setYaDirectResults] = useState<GeneratedResult[]>([]);
  const [emailResults, setEmailResults] = useState<GeneratedResult[]>([]);
  const [loyaltyResults, setLoyaltyResults] = useState<GeneratedResult[]>([]);
  const { toast } = useToast();

  const { data: historyData, isLoading: isHistoryLoading } = useQuery<HistoryResponse>({
    queryKey: ["/api/history"],
  });

  const yaDirectMutation = useMutation({
    mutationFn: async (data: YaDirectFormData) => {
      const res = await apiRequest("POST", "/api/generate/yadirect", data);
      return res.json() as Promise<GenerateResponse>;
    },
    onSuccess: (data) => {
      setYaDirectResults(data.results);
      queryClient.invalidateQueries({ queryKey: ["/api/history"] });
      toast({
        title: "Готово",
        description: `Создано ${data.results.length} вариантов объявлений`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Ошибка генерации",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const emailMutation = useMutation({
    mutationFn: async (data: EmailSocialFormData) => {
      const res = await apiRequest("POST", "/api/generate/email-social", data);
      return res.json() as Promise<GenerateResponse>;
    },
    onSuccess: (data) => {
      setEmailResults(data.results);
      queryClient.invalidateQueries({ queryKey: ["/api/history"] });
      toast({
        title: "Готово",
        description: `Создано ${data.results.length} вариантов`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Ошибка генерации",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const loyaltyMutation = useMutation({
    mutationFn: async (data: LoyaltyFormData) => {
      const res = await apiRequest("POST", "/api/generate/loyalty", data);
      return res.json() as Promise<GenerateResponse>;
    },
    onSuccess: (data) => {
      setLoyaltyResults(data.results);
      queryClient.invalidateQueries({ queryKey: ["/api/history"] });
      toast({
        title: "Готово",
        description: `Создано ${data.results.length} вариантов сообщений`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Ошибка генерации",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("PATCH", `/api/history/${id}/favorite`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/history"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleYaDirectSubmit = (data: YaDirectFormData) => {
    yaDirectMutation.mutate(data);
  };

  const handleEmailSubmit = (data: EmailSocialFormData) => {
    emailMutation.mutate(data);
  };

  const handleLoyaltySubmit = (data: LoyaltyFormData) => {
    loyaltyMutation.mutate(data);
  };

  const handleToggleFavorite = (id: string) => {
    toggleFavoriteMutation.mutate(id);
  };

  const renderResults = (results: GeneratedResult[], isLoading: boolean) => {
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

  const historyItems = (historyData?.generations || []).map((gen) => ({
    id: gen.id.toString(),
    module: gen.module as "yadirect" | "email_social" | "loyalty",
    inputJson: gen.inputJson,
    outputText: gen.outputText,
    isFavorite: gen.isFavorite,
    createdAt: new Date(gen.createdAt),
  }));

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
                <YaDirectForm onSubmit={handleYaDirectSubmit} isLoading={yaDirectMutation.isPending} />
              </div>
              <div className="lg:col-span-3">
                <ScrollArea className="h-[calc(100vh-200px)]">
                  {renderResults(yaDirectResults, yaDirectMutation.isPending)}
                </ScrollArea>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="email" className="mt-0">
            <div className="grid lg:grid-cols-5 gap-6">
              <div className="lg:col-span-2">
                <EmailSocialForm onSubmit={handleEmailSubmit} isLoading={emailMutation.isPending} />
              </div>
              <div className="lg:col-span-3">
                <ScrollArea className="h-[calc(100vh-200px)]">
                  {renderResults(emailResults, emailMutation.isPending)}
                </ScrollArea>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="loyalty" className="mt-0">
            <div className="grid lg:grid-cols-5 gap-6">
              <div className="lg:col-span-2">
                <LoyaltyForm onSubmit={handleLoyaltySubmit} isLoading={loyaltyMutation.isPending} />
              </div>
              <div className="lg:col-span-3">
                <ScrollArea className="h-[calc(100vh-200px)]">
                  {renderResults(loyaltyResults, loyaltyMutation.isPending)}
                </ScrollArea>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-0">
            {isHistoryLoading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Загрузка истории...</p>
              </div>
            ) : historyItems.length === 0 ? (
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
