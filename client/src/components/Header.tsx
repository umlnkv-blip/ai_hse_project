import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";

interface HeaderProps {
  showAppButton?: boolean;
}

export default function Header({ showAppButton = true }: HeaderProps) {
  const [location] = useLocation();
  const isApp = location.startsWith("/app");

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between gap-4 px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center justify-center w-9 h-9 rounded-md bg-primary text-primary-foreground">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-xl font-semibold" data-testid="text-logo">NeuroMarketer</span>
        </Link>
        
        <div className="flex items-center gap-3">
          {showAppButton && !isApp && (
            <Link href="/app">
              <Button data-testid="button-start-app">
                Начать работу
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          )}
          
          {isApp && (
            <Link href="/">
              <Button variant="ghost" data-testid="button-back-to-home">
                На главную
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
