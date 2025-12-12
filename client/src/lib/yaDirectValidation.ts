export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  stats: {
    titleLength: number;
    textLength: number;
    longestWord: number;
    hasKeywords: boolean;
    hasCTA: boolean;
    hasUSP: boolean;
  };
}

const PROFANITY_WORDS = [
  "блядь", "сука", "хуй", "пизд", "ебат", "мудак", "дерьмо", "жопа",
  "говно", "залупа", "член", "пидор", "шлюха", "тварь",
];

const FORBIDDEN_CLAIMS = [
  "лучший", "самый", "номер один", "№1", "#1", "единственный",
  "абсолютный", "безусловный", "гарантированный результат",
  "100% гарантия", "мгновенный результат",
];

const CTA_PHRASES = [
  "купи", "закажи", "позвони", "оставь заявку", "узнай", "получи",
  "скачай", "попробуй", "запишись", "оформи", "выбери", "забронируй",
  "подпишись", "зарегистрируйся", "успей", "торопись", "не упусти",
  "переходи", "жми", "кликай", "звони", "пиши",
];

export function validateYaDirectAd(
  title: string,
  text: string,
  keywords: string,
  usp: string = "",
  format: "standard" | "extended" = "standard"
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const titleLimits = format === "extended" 
    ? { min: 33, max: 75 } 
    : { min: 0, max: 56 };
  
  const textLimits = format === "extended"
    ? { min: 75, max: 100 }
    : { min: 0, max: 81 };

  const titleLength = title.length;
  if (titleLength > titleLimits.max) {
    errors.push(`Заголовок: ${titleLength} симв. (макс. ${titleLimits.max})`);
  }

  const textLength = text.length;
  if (textLength > textLimits.max) {
    errors.push(`Описание: ${textLength} симв. (макс. ${textLimits.max})`);
  }

  const allWords = `${title} ${text}`.split(/\s+/);
  const longestWord = Math.max(...allWords.map(w => w.replace(/[.,!?;:]/g, "").length));
  if (longestWord > 23) {
    errors.push(`Слово длиннее 23 символов (${longestWord} симв.)`);
  }

  const lowerTitle = title.toLowerCase();
  const lowerText = text.toLowerCase();
  const fullText = `${lowerTitle} ${lowerText}`;

  for (const word of PROFANITY_WORDS) {
    if (fullText.includes(word)) {
      errors.push("Обнаружена ненормативная лексика");
      break;
    }
  }

  for (const claim of FORBIDDEN_CLAIMS) {
    if (fullText.includes(claim.toLowerCase())) {
      warnings.push(`Потенциально запрещённое утверждение: "${claim}"`);
      break;
    }
  }

  const keywordList = keywords.toLowerCase().split(/[,;]+/).map(k => k.trim()).filter(Boolean);
  const hasKeywords = keywordList.some(kw => fullText.includes(kw));
  if (!hasKeywords && keywordList.length > 0) {
    warnings.push("Ключевые слова не найдены в тексте");
  }

  const hasCTA = CTA_PHRASES.some(cta => fullText.includes(cta));
  if (!hasCTA) {
    warnings.push("Отсутствует призыв к действию (CTA)");
  }

  let hasUSP = true;
  if (usp && usp.trim().length > 0) {
    const uspWords = usp.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    hasUSP = uspWords.some(word => fullText.includes(word));
    if (!hasUSP) {
      warnings.push("УТП не отражено в тексте объявления");
    }
  }

  const isValid = errors.length === 0;

  return {
    isValid,
    errors,
    warnings,
    stats: {
      titleLength,
      textLength,
      longestWord,
      hasKeywords,
      hasCTA,
      hasUSP,
    },
  };
}

export function getCharacterCountColor(current: number, max: number): string {
  const ratio = current / max;
  if (ratio > 1) return "text-red-600 dark:text-red-400";
  if (ratio > 0.9) return "text-amber-600 dark:text-amber-400";
  return "text-muted-foreground";
}
