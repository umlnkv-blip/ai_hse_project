import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sparkles, ArrowRight, LogOut, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface HeaderProps {
  showAppButton?: boolean;
}

export default function Header({ showAppButton = true }: HeaderProps) {
  const [location] = useLocation();
  const isApp = location.startsWith("/app");
  const { user, isAuthenticated, isLoading } = useAuth();

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const getInitials = (firstName?: string | null, lastName?: string | null, email?: string | null) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (firstName) {
      return firstName.slice(0, 2).toUpperCase();
    }
    if (email) {
      return email.slice(0, 2).toUpperCase();
    }
    return "U";
  };

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
          {showAppButton && !isApp && !isAuthenticated && (
            <a href="/api/login">
              <Button data-testid="button-login">
                Войти
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
          )}
          
          {isApp && !isAuthenticated && !isLoading && (
            <a href="/api/login">
              <Button data-testid="button-login">
                Войти
              </Button>
            </a>
          )}

          {isAuthenticated && user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative gap-2 px-2" data-testid="button-user-menu">
                  <Avatar className="w-8 h-8">
                    <AvatarImage 
                      src={user.profileImageUrl || undefined} 
                      alt={user.firstName || user.email || "User"} 
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                      {getInitials(user.firstName, user.lastName, user.email)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline-block text-sm font-medium" data-testid="text-user-name">
                    {user.firstName || user.email?.split('@')[0] || "Пользователь"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem className="gap-2" data-testid="menu-item-profile">
                  <User className="w-4 h-4" />
                  <span>{user.email || "Мой профиль"}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="gap-2 text-destructive" data-testid="menu-item-logout">
                  <LogOut className="w-4 h-4" />
                  <span>Выйти</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
