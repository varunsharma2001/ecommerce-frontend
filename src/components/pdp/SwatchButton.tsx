import Image from 'next/image';
import type { ProductImage } from '@/types/product.types';

interface SwatchButtonProps {
  value: string;
  displayName: string;
  image: ProductImage | null;
  isSelected: boolean;
  isAvailable: boolean;
  onClick: () => void;
}

export default function SwatchButton({
  value,
  displayName,
  image,
  isSelected,
  isAvailable,
  onClick,
}: SwatchButtonProps) {
  const borderClass = isSelected
    ? 'border-gray-900 shadow-md'
    : 'border-transparent';
  const cursorClass = isAvailable
    ? 'cursor-pointer hover:border-gray-400'
    : 'cursor-not-allowed opacity-40';

  return (
    <button
      onClick={onClick}
      disabled={!isAvailable}
      title={value}
      aria-label={`${displayName}: ${value}`}
      className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border-2 transition ${borderClass} ${cursorClass}`}
    >
      {image ? (
        <Image
          src={image.url}
          alt={value}
          fill
          sizes="56px"
          className={`object-cover ${!isAvailable ? 'grayscale' : ''}`}
        />
      ) : (
        <span className="flex h-full w-full items-center justify-center bg-gray-100 text-[10px] font-medium text-gray-500">
          {value.slice(0, 3)}
        </span>
      )}

      {!isAvailable && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="h-px w-full rotate-45 bg-gray-400" />
        </span>
      )}
    </button>
  );
}
