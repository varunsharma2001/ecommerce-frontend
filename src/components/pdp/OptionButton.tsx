interface OptionButtonProps {
  value: string;
  isSelected: boolean;
  isAvailable: boolean;
  onClick: () => void;
}

export default function OptionButton({
  value,
  isSelected,
  isAvailable,
  onClick,
}: OptionButtonProps) {
  const stateClass = isSelected
    ? 'border-gray-900 bg-gray-900 text-white'
    : isAvailable
      ? 'border-gray-200 text-gray-700 hover:border-gray-400'
      : 'cursor-not-allowed border-gray-100 text-gray-300 line-through';

  return (
    <button
      onClick={onClick}
      disabled={!isAvailable}
      className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${stateClass}`}
    >
      {value}
    </button>
  );
}
