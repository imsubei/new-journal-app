import { cn } from "@/lib/utils";

interface EmotionBadgeProps {
  emotion: string;
  className?: string;
}

export function EmotionBadge({ emotion, className }: EmotionBadgeProps) {
  // 根据情绪类型选择颜色
  const getEmotionColor = () => {
    switch (emotion) {
      case '积极':
        return 'bg-green-100 text-green-800 border-green-200';
      case '愉快':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case '中立':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case '焦虑':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case '消极':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium border",
      getEmotionColor(),
      className
    )}>
      {emotion}
    </span>
  );
}
