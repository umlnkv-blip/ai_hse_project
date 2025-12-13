interface YandexGPTResponse {
  result: {
    alternatives: Array<{
      message: {
        role: string;
        text: string;
      };
      status: string;
    }>;
    usage: {
      inputTextTokens: string;
      completionTokens: string;
      totalTokens: string;
    };
    modelVersion: string;
  };
}

export async function generateTextYandex(prompt: string): Promise<string> {
  const apiKey = process.env.YANDEX_CLOUD_API_KEY || "";
  const folderId = process.env.YANDEX_CLOUD_FOLDER || "";
  
  if (!apiKey || !folderId) {
    throw new Error("YandexGPT API credentials not configured. Please set YANDEX_CLOUD_API_KEY and YANDEX_CLOUD_FOLDER.");
  }

  try {
    const response = await fetch("https://llm.api.cloud.yandex.net/foundationModels/v1/completion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Api-Key ${apiKey}`,
        "x-folder-id": folderId,
      },
      body: JSON.stringify({
        modelUri: `gpt://${folderId}/yandexgpt-lite/latest`,
        completionOptions: {
          stream: false,
          temperature: 0.7,
          maxTokens: 2000,
        },
        messages: [
          {
            role: "user",
            text: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("YandexGPT API error response:", errorText);
      throw new Error(`YandexGPT API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json() as YandexGPTResponse;
    const text = data.result?.alternatives?.[0]?.message?.text || "";
    return text;
  } catch (error: any) {
    console.error("YandexGPT API error:", error);
    throw new Error(`Ошибка генерации: ${error.message || "Неизвестная ошибка"}`);
  }
}

export function buildYaDirectPrompt(data: {
  product: string;
  audience: string;
  keywords: string;
  usp?: string;
  tone: string;
  count: number;
}): string {
  const toneMap: Record<string, string> = {
    neutral: "нейтральной",
    friendly: "дружеской",
    expert: "экспертной",
    emotional: "эмоциональной",
  };

  const keywordList = data.keywords.split(/[,;\s]+/).map(k => k.trim()).filter(Boolean);
  const firstKeyword = keywordList[0] || data.product;

  return `Создай ${data.count} рекламных объявлений для Яндекс.Директ.

ДАННЫЕ:
- Продукт: ${data.product}
- Аудитория: ${data.audience}
- Ключевые слова: ${data.keywords}
${data.usp ? `- УТП: ${data.usp}` : ""}
- Тональность: ${toneMap[data.tone] || "нейтральной"}

КРИТИЧЕСКИ ВАЖНО - ЛИМИТЫ СИМВОЛОВ:
- Заголовок: СТРОГО до 56 символов (включая пробелы и знаки)
- Текст: СТРОГО до 81 символа (включая пробелы и знаки)

ПРИМЕР ПРАВИЛЬНОЙ ДЛИНЫ:
Заголовок: "Курсы Python с нуля до Junior" (30 симв.) - OK
Текст: "Научим кодить за 3 месяца. Практика. Помощь с трудоустройством." (65 симв.) - OK

ПЛОХО (слишком длинно):
Текст: "Закажи курсы! Практика на реальных проектах. Гарантия трудоустройства или возврат денег. 24/7 поддержка." (104 симв.) - НЕ ПРОЙДЕТ!

ТРЕБОВАНИЯ:
1. Включи "${firstKeyword}" в заголовок или текст
2. Добавь призыв: закажи, узнай, звони, запишись
3. Пиши КОРОТКО - лучше 2-3 фразы чем одно длинное предложение
${data.usp ? `4. Упомяни: ${data.usp}` : ""}

ФОРМАТ:
ВАРИАНТ 1:
Заголовок: [до 56 символов]
Текст: [до 81 символа]

Пиши максимально кратко!`;
}

export function buildEmailSocialPrompt(data: {
  channel: string;
  goal: string;
  customerProfile: string;
  productDescription: string;
  tone: string;
}): string {
  const channelMap: Record<string, string> = {
    email: "email-рассылки",
    instagram_post: "поста в Instagram",
    instagram_stories: "сторис Instagram",
    vk: "поста ВКонтакте",
    telegram: "поста в Telegram",
  };

  const goalMap: Record<string, string> = {
    welcome: "приветствия нового клиента",
    promo: "промо-акции",
    reactivation: "реактивации клиента",
    digest: "дайджеста",
    educational: "образовательного контента",
  };

  const toneMap: Record<string, string> = {
    friendly: "дружеской",
    expert: "экспертной",
    inspiring: "вдохновляющей",
    provocative: "провокационной",
  };

  return `Ты копирайтер, который пишет тексты для email и соцсетей. Создай 2-3 варианта текста для ${channelMap[data.channel] || data.channel}.

Цель: ${goalMap[data.goal] || data.goal}
Портрет клиента: ${data.customerProfile}
Описание продукта/оффера: ${data.productDescription}
Тональность: ${toneMap[data.tone] || data.tone}

Требования:
- Учитывай специфику канала
- Текст должен вовлекать и побуждать к действию
- В конце каждого варианта добавь строку "Идея для картинки: [описание визуала]"

Формат ответа:
ВАРИАНТ N:
[текст сообщения]
Идея для картинки: [описание]

Создай 2-3 варианта.`;
}

export function buildLoyaltyPrompt(data: {
  scenario: string;
  customerName: string;
  purchaseHistory?: string;
  offer: string;
  campaignGoal?: string;
}): string {
  const scenarioMap: Record<string, string> = {
    birthday: "поздравления с днем рождения",
    personal_offer: "персонального предложения",
    reactivation: "реактивации клиента",
  };

  return `Ты маркетолог по CRM и программам лояльности. Создай 1-2 варианта персональных сообщений для сценария: ${scenarioMap[data.scenario] || data.scenario}.

Имя клиента: ${data.customerName}
${data.purchaseHistory ? `История покупок/интересы: ${data.purchaseHistory}` : ""}
Предложение: ${data.offer}
${data.campaignGoal ? `Цель кампании: ${data.campaignGoal}` : ""}

Требования:
- Используй плейсхолдер {{Имя}} для обращения к клиенту
- Текст должен быть персональным и теплым
- Применяй принципы AIDA (внимание, интерес, желание, действие)
- Сообщение должно подходить для email или мессенджеров

Формат ответа:
ВАРИАНТ N:
[полный текст сообщения с плейсхолдером {{Имя}}]

Создай 1-2 варианта.`;
}

export function parseYaDirectResponse(text: string): Array<{ title: string; text: string }> {
  const results: Array<{ title: string; text: string }> = [];
  const variants = text.split(/ВАРИАНТ\s*\d+:/i).filter(Boolean);

  for (const variant of variants) {
    const titleMatch = variant.match(/Заголовок:\s*(.+?)(?:\n|Текст:)/i);
    const textMatch = variant.match(/Текст:\s*(.+?)(?:\n\n|ВАРИАНТ|$)/i);

    if (titleMatch && textMatch) {
      results.push({
        title: titleMatch[1].trim(),
        text: textMatch[1].trim(),
      });
    }
  }

  return results;
}

export function parseEmailSocialResponse(text: string): Array<{ text: string; imageIdea: string }> {
  const results: Array<{ text: string; imageIdea: string }> = [];
  const variants = text.split(/ВАРИАНТ\s*\d+:/i).filter(Boolean);

  for (const variant of variants) {
    const imageMatch = variant.match(/Идея для картинки:\s*(.+?)$/im);
    const mainText = variant.replace(/Идея для картинки:\s*.+$/im, "").trim();

    // Skip empty variants or intro text (must have substantial content)
    if (mainText && mainText.length > 20) {
      results.push({
        text: mainText,
        imageIdea: imageMatch ? imageMatch[1].trim() : "",
      });
    }
  }

  return results;
}

export function parseLoyaltyResponse(text: string): Array<{ text: string }> {
  const results: Array<{ text: string }> = [];
  const variants = text.split(/ВАРИАНТ\s*\d+:/i).filter(Boolean);

  for (const variant of variants) {
    const trimmed = variant.trim();
    // Skip empty variants or intro text (must have substantial content)
    if (trimmed && trimmed.length > 20) {
      results.push({ text: trimmed });
    }
  }

  return results;
}
