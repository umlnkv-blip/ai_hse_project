import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Star, Search, X } from "lucide-react";
import CopyButton from "./CopyButton";

export interface HistoryItem {
  id: string;
  module: "yadirect" | "email_social" | "loyalty";
  inputJson: string;
  outputText: string;
  isFavorite: boolean;
  createdAt: Date;
}

interface HistoryTableProps {
  items: HistoryItem[];
  onToggleFavorite: (id: string) => void;
}

const moduleLabels: Record<string, string> = {
  yadirect: "Яндекс.Директ",
  email_social: "Email и соцсети",
  loyalty: "Лояльность",
};

const moduleColors: Record<string, string> = {
  yadirect: "bg-chart-1/10 text-chart-1",
  email_social: "bg-chart-2/10 text-chart-2",
  loyalty: "bg-chart-3/10 text-chart-3",
};

export default function HistoryTable({ items, onToggleFavorite }: HistoryTableProps) {
  const [moduleFilter, setModuleFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

  const filteredItems = items.filter((item) => {
    if (moduleFilter !== "all" && item.module !== moduleFilter) return false;
    if (favoritesOnly && !item.isFavorite) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        item.inputJson.toLowerCase().includes(query) ||
        item.outputText.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const parseInputSummary = (inputJson: string) => {
    try {
      const data = JSON.parse(inputJson);
      return truncateText(
        Object.values(data).filter(Boolean).join(", "),
        80
      );
    } catch {
      return truncateText(inputJson, 80);
    }
  };

  return (
    <>
      <Card className="p-6">
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex-1 min-w-[200px] max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Поиск по ключевым словам..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              data-testid="input-search-history"
            />
          </div>

          <Select value={moduleFilter} onValueChange={setModuleFilter}>
            <SelectTrigger className="w-48" data-testid="select-module-filter">
              <SelectValue placeholder="Все модули" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все модули</SelectItem>
              <SelectItem value="yadirect">Яндекс.Директ</SelectItem>
              <SelectItem value="email_social">Email и соцсети</SelectItem>
              <SelectItem value="loyalty">Лояльность</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <Switch
              id="favorites"
              checked={favoritesOnly}
              onCheckedChange={setFavoritesOnly}
              data-testid="switch-favorites-only"
            />
            <Label htmlFor="favorites" className="text-sm">
              Только избранное
            </Label>
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {items.length === 0 ? "История пуста" : "Ничего не найдено"}
          </div>
        ) : (
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-10"></TableHead>
                  <TableHead className="w-40">Дата и время</TableHead>
                  <TableHead className="w-36">Модуль</TableHead>
                  <TableHead>Входные данные</TableHead>
                  <TableHead>Результат</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow
                    key={item.id}
                    className="cursor-pointer"
                    onClick={() => setSelectedItem(item)}
                    data-testid={`row-history-${item.id}`}
                  >
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(item.id);
                        }}
                        data-testid={`button-favorite-${item.id}`}
                      >
                        <Star
                          className={`w-4 h-4 ${
                            item.isFavorite
                              ? "fill-chart-4 text-chart-4"
                              : "text-muted-foreground"
                          }`}
                        />
                      </Button>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(item.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={moduleColors[item.module]}
                      >
                        {moduleLabels[item.module]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {parseInputSummary(item.inputJson)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {truncateText(item.outputText, 100)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <DialogTitle>Детали генерации</DialogTitle>
              {selectedItem && (
                <Badge
                  variant="secondary"
                  className={moduleColors[selectedItem.module]}
                >
                  {moduleLabels[selectedItem.module]}
                </Badge>
              )}
            </div>
          </DialogHeader>

          {selectedItem && (
            <div className="space-y-6 mt-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">
                  Дата создания
                </h4>
                <p>{formatDate(selectedItem.createdAt)}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">
                  Входные данные
                </h4>
                <pre className="bg-muted rounded-md p-4 text-sm overflow-x-auto whitespace-pre-wrap">
                  {JSON.stringify(JSON.parse(selectedItem.inputJson), null, 2)}
                </pre>
              </div>

              <div>
                <div className="flex items-center justify-between gap-4 flex-wrap mb-2">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Результат
                  </h4>
                  <CopyButton text={selectedItem.outputText} />
                </div>
                <div className="bg-muted rounded-md p-4">
                  <p className="whitespace-pre-wrap leading-7">
                    {selectedItem.outputText}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
