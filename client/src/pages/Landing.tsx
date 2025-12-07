import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import { ArrowRight, Megaphone, Mail, Heart, Zap, Target, TrendingUp } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-chart-3/5" />
        <div className="max-w-4xl mx-auto px-6 relative">
          <div className="text-center space-y-6">
            <h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
              data-testid="text-hero-title"
            >
              ИИ-ассистент для маркетологов и малого бизнеса
            </h1>
            <p 
              className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
              data-testid="text-hero-subtitle"
            >
              Генерируйте эффективные рекламные тексты за секунды. 
              Объявления для Яндекс.Директ, email-рассылки, посты для соцсетей 
              и персональные сообщения для программ лояльности.
            </p>
            <div className="pt-4">
              <Link href="/app">
                <Button size="lg" className="px-8 py-6 text-lg" data-testid="button-cta-hero">
                  Перейти к сервису
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-semibold text-center mb-12" data-testid="text-features-title">
            Три модуля для всех задач
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-chart-1/10 flex items-center justify-center mx-auto">
                <Megaphone className="w-8 h-8 text-chart-1" />
              </div>
              <h3 className="text-xl font-semibold" data-testid="text-feature-yadirect">
                Яндекс.Директ
              </h3>
              <p className="text-muted-foreground">
                Создавайте цепляющие заголовки и тексты объявлений 
                для контекстной рекламы с учетом ключевых слов и аудитории.
              </p>
            </Card>

            <Card className="p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-chart-2/10 flex items-center justify-center mx-auto">
                <Mail className="w-8 h-8 text-chart-2" />
              </div>
              <h3 className="text-xl font-semibold" data-testid="text-feature-email">
                Email и соцсети
              </h3>
              <p className="text-muted-foreground">
                Готовьте тексты для email-рассылок, постов в Instagram, 
                ВКонтакте и Telegram с идеями для визуального контента.
              </p>
            </Card>

            <Card className="p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-chart-3/10 flex items-center justify-center mx-auto">
                <Heart className="w-8 h-8 text-chart-3" />
              </div>
              <h3 className="text-xl font-semibold" data-testid="text-feature-loyalty">
                Лояльность
              </h3>
              <p className="text-muted-foreground">
                Пишите персональные сообщения: поздравления с днем рождения, 
                специальные предложения и реактивационные письма.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-semibold text-center mb-12" data-testid="text-how-it-works">
            Как это работает
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto text-xl font-bold">
                1
              </div>
              <div className="flex items-center justify-center gap-2">
                <Target className="w-5 h-5 text-muted-foreground" />
                <h3 className="font-semibold">Заполните форму</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                Укажите информацию о продукте, целевой аудитории и желаемой тональности текста.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto text-xl font-bold">
                2
              </div>
              <div className="flex items-center justify-center gap-2">
                <Zap className="w-5 h-5 text-muted-foreground" />
                <h3 className="font-semibold">ИИ генерирует</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                Нейросеть создает несколько вариантов текстов на основе ваших данных.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto text-xl font-bold">
                3
              </div>
              <div className="flex items-center justify-center gap-2">
                <TrendingUp className="w-5 h-5 text-muted-foreground" />
                <h3 className="font-semibold">Используйте</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                Скопируйте понравившийся вариант и используйте в своих рекламных кампаниях.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-semibold mb-4">
            Готовы начать?
          </h2>
          <p className="text-muted-foreground mb-6">
            Попробуйте сгенерировать первый текст прямо сейчас
          </p>
          <Link href="/app">
            <Button size="lg" data-testid="button-cta-bottom">
              Начать работу
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="py-8 border-t">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              NeuroMarketer — ИИ-ассистент для маркетологов
            </p>
            <p className="text-sm text-muted-foreground">
              Powered by YandexGPT
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
