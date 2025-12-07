import { useState } from 'react';
import HistoryTable, { HistoryItem } from '../HistoryTable';

const mockHistoryItems: HistoryItem[] = [
  {
    id: "1",
    module: "yadirect",
    inputJson: JSON.stringify({
      product: "Онлайн-курсы программирования",
      audience: "Молодые специалисты 25-35 лет",
      keywords: "курсы python, обучение",
    }),
    outputText: "Заголовок: Стань программистом за 6 месяцев!\n\nОсвойте Python с нуля. Гарантия трудоустройства. Практика на реальных проектах.",
    isFavorite: true,
    createdAt: new Date(Date.now() - 3600000),
  },
  {
    id: "2",
    module: "email_social",
    inputJson: JSON.stringify({
      channel: "email",
      goal: "promo",
      customerProfile: "Женщины 25-45 лет",
    }),
    outputText: "Привет! Специально для тебя подготовили скидку 25% на новую коллекцию. Успей до конца недели!",
    isFavorite: false,
    createdAt: new Date(Date.now() - 7200000),
  },
  {
    id: "3",
    module: "loyalty",
    inputJson: JSON.stringify({
      scenario: "birthday",
      customerName: "Анна",
      offer: "Скидка 20%",
    }),
    outputText: "Дорогая {{Имя}}, поздравляем с Днем рождения! В честь вашего праздника дарим скидку 20% на любую покупку.",
    isFavorite: true,
    createdAt: new Date(Date.now() - 86400000),
  },
];

export default function HistoryTableExample() {
  const [items, setItems] = useState(mockHistoryItems);

  const handleToggleFavorite = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    ));
  };

  return (
    <HistoryTable 
      items={items}
      onToggleFavorite={handleToggleFavorite}
    />
  );
}
