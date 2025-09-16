// src/components/EmptyState.tsx
interface EmptyStateProps {
  message: string;
  actionText: string;
  onActionClick: () => void;
}
export default function EmptyState({ message, actionText, onActionClick }: EmptyStateProps) {
  return (
    <div className="text-center p-8 border-2 border-dashed rounded-lg">
      <p className="mb-4 text-gray-500">{message}</p>
      <button onClick={onActionClick} className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-hover">
        {actionText}
      </button>
    </div>
  );
}