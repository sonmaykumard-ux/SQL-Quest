import React from 'react';

interface MascotProps {
  mood?: 'happy' | 'thinking' | 'cheering' | 'winking';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSpeechBubble?: boolean;
  speechText?: string;
  hasVisor?: boolean;
  hasCrown?: boolean;
}

export const Mascot: React.FC<MascotProps> = ({
  mood = 'happy',
  size = 'md',
  showSpeechBubble = false,
  speechText,
  hasVisor = false,
  hasCrown = false,
}) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-36 h-36',
  }[size];

  return (
    <div className="relative inline-flex items-center gap-3">
      {/* Dragon Character SVG */}
      <div className={`relative ${sizeClasses} flex-shrink-0 animate-bounce-subtle`}>
        <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md" fill="none">
          {/* Wings */}
          <path
            d={mood === 'cheering' ? 'M18 45 C5 25 15 5 35 25 Z' : 'M20 50 C10 35 15 20 30 35 Z'}
            fill="#059669"
            className="transition-all duration-300"
          />
          <path
            d={mood === 'cheering' ? 'M102 45 C115 25 105 5 85 25 Z' : 'M100 50 C110 35 105 20 90 35 Z'}
            fill="#059669"
            className="transition-all duration-300"
          />

          {/* Dragon Body */}
          <ellipse cx="60" cy="72" rx="36" ry="34" fill="#10B981" />
          {/* Dragon Belly */}
          <ellipse cx="60" cy="76" rx="24" ry="22" fill="#FDE047" />
          <path d="M48 68 Q60 72 72 68" stroke="#CA8A04" strokeWidth="2" strokeLinecap="round" />
          <path d="M46 76 Q60 80 74 76" stroke="#CA8A04" strokeWidth="2" strokeLinecap="round" />
          <path d="M50 84 Q60 88 70 84" stroke="#CA8A04" strokeWidth="2" strokeLinecap="round" />

          {/* Head */}
          <circle cx="60" cy="42" r="28" fill="#10B981" />

          {/* Cute Horns */}
          <path d="M42 22 C38 12 30 14 34 26 Z" fill="#F59E0B" />
          <path d="M78 22 C82 12 90 14 86 26 Z" fill="#F59E0B" />

          {/* Eyes */}
          {mood === 'winking' ? (
            <>
              {/* Left Eye Open */}
              <circle cx="50" cy="40" r="6" fill="#064E3B" />
              <circle cx="48" cy="38" r="2.5" fill="#FFFFFF" />
              {/* Right Eye Winking */}
              <path d="M66 40 Q72 36 76 40" stroke="#064E3B" strokeWidth="3" strokeLinecap="round" />
            </>
          ) : mood === 'thinking' ? (
            <>
              {/* Curious Looking Up */}
              <circle cx="50" cy="38" r="5" fill="#064E3B" />
              <circle cx="49" cy="36" r="2" fill="#FFFFFF" />
              <circle cx="70" cy="38" r="5" fill="#064E3B" />
              <circle cx="69" cy="36" r="2" fill="#FFFFFF" />
              {/* Tilted Eyebrows */}
              <path d="M44 31 L54 33" stroke="#047857" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M66 33 L76 31" stroke="#047857" strokeWidth="2.5" strokeLinecap="round" />
            </>
          ) : (
            <>
              {/* Big Joyful Eyes */}
              <circle cx="49" cy="40" r="6" fill="#064E3B" />
              <circle cx="47" cy="38" r="2.5" fill="#FFFFFF" />
              <circle cx="71" cy="40" r="6" fill="#064E3B" />
              <circle cx="69" cy="38" r="2.5" fill="#FFFFFF" />
            </>
          )}

          {/* Rosy Cheeks */}
          <circle cx="40" cy="46" r="4" fill="#F87171" opacity="0.6" />
          <circle cx="80" cy="46" r="4" fill="#F87171" opacity="0.6" />

          {/* Mouth */}
          {mood === 'happy' || mood === 'cheering' ? (
            <path d="M52 48 Q60 56 68 48" stroke="#064E3B" strokeWidth="3" strokeLinecap="round" fill="#DC2626" />
          ) : mood === 'thinking' ? (
            <path d="M56 50 Q62 52 66 49" stroke="#064E3B" strokeWidth="2.5" strokeLinecap="round" />
          ) : (
            <path d="M54 48 Q60 54 66 48" stroke="#064E3B" strokeWidth="2.5" strokeLinecap="round" />
          )}

          {/* Paws */}
          {mood === 'cheering' ? (
            <>
              <circle cx="40" cy="58" r="6" fill="#059669" />
              <circle cx="80" cy="58" r="6" fill="#059669" />
            </>
          ) : mood === 'thinking' ? (
            <>
              <circle cx="45" cy="80" r="6" fill="#059669" />
              <circle cx="68" cy="54" r="6" fill="#059669" />
            </>
          ) : (
            <>
              <circle cx="44" cy="80" r="6" fill="#059669" />
              <circle cx="76" cy="80" r="6" fill="#059669" />
            </>
          )}

          {/* Feet */}
          <ellipse cx="44" cy="102" rx="10" ry="6" fill="#059669" />
          <ellipse cx="76" cy="102" rx="10" ry="6" fill="#059669" />

          {/* Accessories: Cyber Visor */}
          {hasVisor && (
            <path
              d="M38 36 Q60 40 82 36 L84 43 Q60 48 36 43 Z"
              fill="#06B6D4"
              opacity="0.85"
              stroke="#22D3EE"
              strokeWidth="1.5"
            />
          )}

          {/* Accessories: Monarch Crown */}
          {hasCrown && (
            <path
              d="M44 22 L48 10 L60 17 L72 10 L76 22 Z"
              fill="#FBBF24"
              stroke="#B45309"
              strokeWidth="2"
            />
          )}
        </svg>
      </div>

      {/* Speech Bubble */}
      {showSpeechBubble && speechText && (
        <div className="relative bg-slate-800 text-slate-100 text-xs md:text-sm font-medium px-3.5 py-2 rounded-2xl border border-emerald-500/30 shadow-lg max-w-[220px] md:max-w-xs">
          <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-y-4 border-y-transparent border-r-8 border-r-slate-800" />
          {speechText}
        </div>
      )}
    </div>
  );
};
