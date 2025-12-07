import OpenAI from "openai";

const yandexClient = new OpenAI({
  apiKey: process.env.YANDEX_CLOUD_API_KEY || "",
  baseURL: "https://llm.api.cloud.yandex.net/foundationModels/v1",
});

export async function generateTextYandex(prompt: string): Promise<string> {
  const folderId = process.env.YANDEX_CLOUD_FOLDER || "";
  
  if (!process.env.YANDEX_CLOUD_API_KEY || !folderId) {
    throw new Error("YandexGPT API credentials not configured. Please set YANDEX_CLOUD_API_KEY and YANDEX_CLOUD_FOLDER.");
  }

  try {
    const response = await yandexClient.chat.completions.create({
      model: `gpt://${folderId}/yandexgpt-lite`,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const text = response.choices[0]?.message?.content || "";
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

  return `Ты русскоязычный копирайтер по контекстной рекламе. На основе следующих данных создай ${data.count} реалистичных объявлений для Яндекс.Директ.

Продукт/услуга: ${data.product}
Целевая аудитория: ${data.audience}
Ключевые слова: ${data.keywords}
${data.usp ? `УТП: ${data.usp}` : ""}
Тональность: ${toneMap[data.tone] || "нейтральной"}

Требования:
- Заголовок до 56 символов
- Текст объявления до 81 символа
- Используй ключевые слова естественно
- Учитывай особенности аудитории

Формат ответа для каждого варианта:
ВАРИАНТ N:
Заголовок: [заголовок]
Текст: [текст объявления]

Создай ровно ${data.count} вариантов.`;
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

    if (mainText) {
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
    if (trimmed) {
      results.push({ text: trimmed });
    }
  }

  return results;
}
