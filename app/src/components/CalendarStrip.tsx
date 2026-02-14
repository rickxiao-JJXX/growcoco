import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { format, addDays, startOfWeek, isSameDay, addWeeks, subWeeks } from 'date-fns';

interface CalendarStripProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

export default function CalendarStrip({ selectedDate, onDateChange }: CalendarStripProps) {
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(selectedDate, { weekStartsOn: 1 }));

  const handlePrevWeek = () => {
    setCurrentWeek(prev => subWeeks(prev, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeek(prev => addWeeks(prev, 1));
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentWeek(startOfWeek(today, { weekStartsOn: 1 }));
    onDateChange(today);
  };

  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(currentWeek, i));
  const weekNumber = Math.ceil(format(currentWeek, 'w') as unknown as number);

  return (
    <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/50">
      {/* 月份导航 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePrevWeek}
            className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-slate-400" />
          </motion.button>
          <span className="text-white font-medium">
            {format(currentWeek, 'yyyy年M月')}
          </span>
          <span className="px-2 py-0.5 bg-blue-600/30 text-blue-400 text-xs rounded-full">
            第{weekNumber}周
          </span>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleNextWeek}
            className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </motion.button>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleToday}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/50 hover:bg-slate-700 text-slate-300 text-sm rounded-lg transition-colors"
        >
          <Calendar className="w-4 h-4" />
          今天
        </motion.button>
      </div>

      {/* 日期选择 */}
      <div className="grid grid-cols-7 gap-2">
        {weekDates.map((date, index) => {
          const isSelected = isSameDay(date, selectedDate);
          const isToday = isSameDay(date, new Date());

          return (
            <motion.button
              key={date.toISOString()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDateChange(date)}
              className={`
                flex flex-col items-center justify-center py-3 rounded-xl transition-all duration-200
                ${isSelected
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : isToday
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                    : 'bg-slate-700/30 text-slate-400 hover:bg-slate-700/50'
                }
              `}
            >
              <span className="text-xs mb-1 opacity-80">{weekDays[index]}</span>
              <span className={`text-lg font-semibold ${isSelected ? 'text-white' : ''}`}>
                {format(date, 'd')}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
