import EmptyState from '../EmptyState';

export default function EmptyStateExample() {
  return (
    <div className="space-y-8">
      <EmptyState type="results" />
      <EmptyState type="history" />
    </div>
  );
}
