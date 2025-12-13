function getWordStem(word: string): string {
  const suffixes = [
    "ами", "ями", "ах", "ях", "ом", "ем", "ой", "ей", "ов", "ев", "ий", "ый", "ая", "яя", "ое", "ее",
    "ию", "ью", "ию", "ие", "ье", "ия", "ья", "ую", "юю", "ого", "его", "ому", "ему",
    "ать", "ять", "еть", "ить", "уть", "ти", "чь",
    "ал", "ял", "ел", "ил", "ул", "ала", "яла", "ела", "ила",
    "ок", "ек", "ик", "ка", "ки", "ку", "ке",
    "ы", "и", "а", "я", "у", "ю", "е", "о"
  ];
  
  let stem = word.toLowerCase();
  for (const suffix of suffixes) {
    if (stem.endsWith(suffix) && stem.length - suffix.length >= 3) {
      return stem.slice(0, -suffix.length);
    }
  }
  return stem;
}

function keywordMatches(keyword: string, text: string): boolean {
  const lowerKw = keyword.toLowerCase();
  const lowerText = text.toLowerCase();
  
  // Direct match
  if (lowerText.includes(lowerKw)) return true;
  
  // Stem of keyword in text
  const kwStem = getWordStem(lowerKw);
  if (kwStem.length >= 3 && lowerText.includes(kwStem)) return true;
  
  // Check if any word in text starts with keyword stem (курс -> курсы, курсов, etc)
  const textWords = lowerText.split(/\s+/);
  for (const word of textWords) {
    const cleanWord = word.replace(/[.,!?;:()""«»]/g, "");
    if (cleanWord.startsWith(kwStem) || kwStem.startsWith(cleanWord.slice(0, 3))) {
      return true;
    }
  }
  
  return false;
}

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

  const keywordList = keywords.toLowerCase().split(/[,;\s]+/).map(k => k.trim()).filter(Boolean);
  const hasKeywords = keywordList.some(kw => keywordMatches(kw, fullText));
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
  const keywordList = originalData.keywords.split(/[,;\s]+/).map(k => k.trim()).filter(Boolean);
  const keywordsStr = keywordList.slice(0, 3).join(", ");
  
  const currentTitleLen = title.length;
  const currentTextLen = text.length;
  
  return `ИСПРАВЬ объявление Яндекс.Директ!

ТЕКУЩЕЕ:
Заголовок: ${title}
Текст: ${text}

ПРОБЛЕМЫ:
${issues.map(issue => `- ${issue}`).join("\n")}

ОБЯЗАТЕЛЬНО:
1. Заголовок до 56 символов
2. Текст до 81 символа
3. ВКЛЮЧИ ОДНО ИЗ СЛОВ: ${keywordsStr}
4. Добавь призыв: закажи/узнай/звони/запишись
${originalData.usp ? `5. Упомяни: ${originalData.usp}` : ""}

ОТВЕТ:
Заголовок: [текст с ключевым словом]
Текст: [текст до 81 символа]`;
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

function truncateToLimit(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  
  const sentences = text.split(/(?<=[.!?])\s+/);
  let result = "";
  
  for (const sentence of sentences) {
    if ((result + (result ? " " : "") + sentence).length <= maxLength) {
      result += (result ? " " : "") + sentence;
    } else {
      break;
    }
  }
  
  if (!result) {
    const words = text.split(/\s+/);
    for (const word of words) {
      if ((result + (result ? " " : "") + word).length <= maxLength) {
        result += (result ? " " : "") + word;
      } else {
        break;
      }
    }
  }
  
  if (!result || result.length < 10) {
    result = text.slice(0, maxLength - 3) + "...";
  }
  
  return result;
}

export function truncateAdText(title: string, text: string): { title: string; text: string } {
  return {
    title: truncateToLimit(title, 56),
    text: truncateToLimit(text, 81),
  };
}
