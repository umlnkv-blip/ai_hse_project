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
  usp: string = ""
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const titleLength = title.length;
  if (titleLength > 56) {
    errors.push(`Заголовок слишком длинный: ${titleLength} символов (максимум 56)`);
  }

  const textLength = text.length;
  if (textLength > 81) {
    errors.push(`Текст слишком длинный: ${textLength} символов (максимум 81)`);
  }

  const allWords = `${title} ${text}`.split(/\s+/);
  const longestWord = Math.max(...allWords.map(w => w.replace(/[.,!?;:]/g, "").length));
  if (longestWord > 23) {
    errors.push(`Слово длиннее 23 символов`);
  }

  const lowerTitle = title.toLowerCase();
  const lowerText = text.toLowerCase();
  const fullText = `${lowerTitle} ${lowerText}`;

  for (const word of PROFANITY_WORDS) {
    if (fullText.includes(word)) {
      errors.push("Ненормативная лексика");
      break;
    }
  }

  for (const claim of FORBIDDEN_CLAIMS) {
    if (fullText.includes(claim.toLowerCase())) {
      warnings.push(`Запрещённое утверждение: "${claim}"`);
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
    warnings.push("Отсутствует призыв к действию");
  }

  let hasUSP = true;
  if (usp && usp.trim().length > 0) {
    const uspWords = usp.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    hasUSP = uspWords.some(word => fullText.includes(word));
    if (!hasUSP) {
      warnings.push("УТП не отражено в тексте");
    }
  }

  const isValid = errors.length === 0 && warnings.length === 0;

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

export function buildRefinementPrompt(
  title: string,
  text: string,
  issues: string[],
  originalData: {
    product: string;
    keywords: string;
    usp?: string;
  }
): string {
  const keywordList = originalData.keywords.split(/[,;]+/).map(k => k.trim()).filter(Boolean);
  const firstKeyword = keywordList[0] || "";
  
  return `ЗАДАЧА: Исправь объявление Яндекс.Директ, устранив ВСЕ указанные проблемы.

ТЕКУЩЕЕ ОБЪЯВЛЕНИЕ:
Заголовок: ${title}
Текст: ${text}

ПРОБЛЕМЫ (ОБЯЗАТЕЛЬНО ИСПРАВИТЬ):
${issues.map((issue, i) => `${i + 1}. ${issue}`).join("\n")}

ЖЁСТКИЕ ТРЕБОВАНИЯ:
1. Заголовок СТРОГО до 56 символов (считай символы!)
2. Текст СТРОГО до 81 символа (считай символы!)
3. ОБЯЗАТЕЛЬНО включи хотя бы одно ключевое слово: ${firstKeyword}
4. ОБЯЗАТЕЛЬНО добавь призыв к действию: закажи, узнай, получи, запишись
${originalData.usp ? `5. ОБЯЗАТЕЛЬНО упомяни УТП: ${originalData.usp}` : ""}

ФОРМАТ ОТВЕТА (ТОЛЬКО ЭТО, БЕЗ ПОЯСНЕНИЙ):
Заголовок: [твой исправленный заголовок]
Текст: [твой исправленный текст]`;
}

export function parseRefinedAd(response: string): { title: string; text: string } | null {
  const titleMatch = response.match(/Заголовок:\s*(.+?)(?:\n|Текст:)/i);
  const textMatch = response.match(/Текст:\s*(.+)/i);
  
  if (titleMatch && textMatch) {
    return {
      title: titleMatch[1].trim(),
      text: textMatch[1].trim().split("\n")[0].trim(),
    };
  }
  return null;
}
