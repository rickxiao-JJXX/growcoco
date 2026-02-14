import { BookOpen, Calculator, Languages, FlaskConical, Dumbbell } from 'lucide-react';
import type { Subject } from '@/types';
import { SUBJECTS } from '@/lib/constants';

interface SubjectIconProps {
  subject: Subject;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
}

const iconMap = {
  BookOpen,
  Calculator,
  Languages,
  FlaskConical,
  Dumbbell
};

export default function SubjectIcon({
  subject,
  size = 'md',
  showLabel = false,
  isSelected = false,
  onClick
}: SubjectIconProps) {
  const subjectConfig = SUBJECTS.find(s => s.id === subject);
  if (!subjectConfig) return null;

  const Icon = iconMap[subjectConfig.icon as keyof typeof iconMap];

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  const containerSizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div
      onClick={onClick}
      className={`
        flex flex-col items-center gap-1 cursor-pointer transition-all duration-200
        ${onClick ? 'hover:scale-105' : ''}
      `}
    >
      <div
        className={`
          ${containerSizes[size]} rounded-xl flex items-center justify-center transition-all duration-200
          ${isSelected
            ? 'ring-2 ring-offset-2 ring-offset-slate-900'
            : ''
          }
        `}
        style={{
          backgroundColor: subjectConfig.bgColor,
          borderColor: isSelected ? subjectConfig.color : 'transparent',
          borderWidth: '2px',
          borderStyle: 'solid',
          boxShadow: isSelected ? `0 0 15px ${subjectConfig.color}40` : 'none'
        }}
      >
        <Icon
          className={sizeClasses[size]}
          style={{ color: subjectConfig.color }}
        />
      </div>
      {showLabel && (
        <span
          className={`text-xs font-medium ${isSelected ? 'text-white' : 'text-slate-400'}`}
        >
          {subjectConfig.name}
        </span>
      )}
    </div>
  );
}
