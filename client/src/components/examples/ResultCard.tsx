import ResultCard from '../ResultCard';

export default function ResultCardExample() {
  return (
    <div className="space-y-4 max-w-xl">
      <ResultCard
        variantNumber={1}
        title="Скидка 30% на все курсы!"
        text="Освойте новую профессию за 3 месяца. Гарантия трудоустройства. Обучение от практикующих экспертов."
      />
      <ResultCard
        variantNumber={2}
        text="Привет! Рады видеть тебя снова. Специально для тебя подготовили подборку новинок этого сезона."
        imageIdea="Яркий коллаж из новых товаров с весенними цветами"
      />
    </div>
  );
}
