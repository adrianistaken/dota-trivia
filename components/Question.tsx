'use client';

import { Question as QuestionType } from '@/lib/types/game';
import { useEffect, useState, useRef } from 'react';
import { 
  getAbilityIconUrl, 
  getItemIconUrl, 
  getHeroIconUrl,
  getAbilityIconFallbackUrl,
  getItemIconFallbackUrl,
  getHeroIconFallbackUrl,
} from '@/lib/utils/asset-resolver';
import AssetImage from './AssetImage';

interface QuestionProps {
  question: QuestionType;
  questionNumber: number;
  totalQuestions: number;
  currentScore: number;
  pointsEarned: number;
  onAnswer: (answer: 'A' | 'B' | 'C' | 'D', timeRemaining: number) => void;
  onTimeout: () => void;
  startTimer?: boolean;
}

const TIMER_DURATION = 10; // seconds

export default function Question({
  question,
  questionNumber,
  totalQuestions,
  currentScore,
  pointsEarned,
  onAnswer,
  onTimeout,
  startTimer = true,
}: QuestionProps) {
  const [timeRemaining, setTimeRemaining] = useState(TIMER_DURATION);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [displayScore, setDisplayScore] = useState(currentScore);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const answeredRef = useRef(false);
  const questionIdRef = useRef(question.id);
  const timerStartedRef = useRef(false);

  // Reset timer when question changes
  useEffect(() => {
    // Immediately reset all state when question changes
    setTimeRemaining(TIMER_DURATION);
    setAnswered(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
    answeredRef.current = false;
    questionIdRef.current = question.id;
    timerStartedRef.current = false;
  }, [question.id]);

  // Update display score without resetting other state
  useEffect(() => {
    if (pointsEarned === 0) {
      setDisplayScore(currentScore);
    }
  }, [currentScore, pointsEarned]);

  // Animate score counting when points are earned
  useEffect(() => {
    if (pointsEarned > 0) {
      const duration = 1000; // 1 second
      const steps = 30;
      const increment = pointsEarned / steps;
      const stepDuration = duration / steps;
      
      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        if (currentStep <= steps) {
          setDisplayScore((prev) => Math.min(prev + increment, currentScore + pointsEarned));
        } else {
          setDisplayScore(currentScore + pointsEarned);
          clearInterval(interval);
        }
      }, stepDuration);

      return () => clearInterval(interval);
    }
  }, [pointsEarned, currentScore]);

  useEffect(() => {
    // Only start timer if startTimer is true and timer hasn't been started yet
    if (!startTimer || answeredRef.current || timerStartedRef.current) return;

    timerStartedRef.current = true;

    const interval = setInterval(() => {
      if (answeredRef.current) {
        clearInterval(interval);
        return;
      }

      setTimeRemaining((prev) => {
        if (prev <= 1) {
          answeredRef.current = true;
          setAnswered(true);
          setIsCorrect(false);
          clearInterval(interval);
          setTimeout(() => onTimeout(), 100);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onTimeout, question.id, startTimer]);

  const handleAnswer = (answer: 'A' | 'B' | 'C' | 'D') => {
    if (answeredRef.current) return;
    
    // Immediately stop timer and disable buttons
    answeredRef.current = true;
    setAnswered(true);
    setSelectedAnswer(answer);
    const correct = answer === question.correctAnswer;
    setIsCorrect(correct);
    
    // Call the parent handler
    onAnswer(answer, timeRemaining);
  };

  const formatTime = (seconds: number): string => {
    return `0:${seconds.toString().padStart(2, '0')}`;
  };

  // Determine which icon to show based on metadata priority: ability > item > hero
  const getQuestionIconUrl = (): { primary: string | null; fallback: string | null } => {
    if (question.abilityId) {
      return {
        primary: getAbilityIconUrl(question.abilityId),
        fallback: getAbilityIconFallbackUrl(question.abilityId),
      };
    }
    if (question.itemId) {
      return {
        primary: getItemIconUrl(question.itemId),
        fallback: getItemIconFallbackUrl(question.itemId),
      };
    }
    if (question.heroId) {
      return {
        primary: getHeroIconUrl(question.heroId),
        fallback: getHeroIconFallbackUrl(question.heroId),
      };
    }
    return { primary: null, fallback: null };
  };

  const { primary: questionIconUrl, fallback: questionIconFallbackUrl } = getQuestionIconUrl();

  // Parse question text to render icons inline
  const renderQuestionWithIcon = () => {
    const questionText = question.question;
    const iconPlaceholder = '{icon}';
    
    if (!questionText.includes(iconPlaceholder)) {
      // No icon placeholder, render normally
      if (questionIconUrl) {
        return (
          <div className="flex flex-col items-center gap-4">
            <h3 className="text-base font-medium text-white">{questionText}</h3>
            <div className="flex items-center justify-center">
              <AssetImage
                src={questionIconUrl}
                alt="Question"
                className="h-20 w-20 object-contain"
                fallbackSrc={questionIconFallbackUrl}
              />
            </div>
          </div>
        );
      }
      return <h3 className="text-base font-medium text-white">{questionText}</h3>;
    }

    // Split by icon placeholder
    const parts = questionText.split(iconPlaceholder);
    const beforeIcon = parts[0];
    const afterIcon = parts[1] || '';

    // Split afterIcon to get only the first word for coloring
    const afterIconWords = afterIcon.trim().split(/\s+/);
    const firstWord = afterIconWords[0] || '';
    const restOfText = afterIconWords.slice(1).join(' ');

    // Determine icon and color based on category
    let iconSrc: string;
    let textColorStyle: React.CSSProperties;
    
    if (question.category === 'ability') {
      iconSrc = '/images/icons/mana.png';
      textColorStyle = {
        background: 'linear-gradient(to right, #60a5fa, #93c5fd)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        fontWeight: 'bold',
      };
    } else if (question.category === 'item') {
      iconSrc = '/images/icons/gold.png';
      textColorStyle = { color: '#fbbf24', fontWeight: 'bold' }; // gold-400
    } else if (question.category === 'cooldown') {
      iconSrc = '/images/icons/cooldown.png';
      textColorStyle = { color: '#6b7280', fontWeight: 'bold' }; // gray-500
    } else {
      // Fallback
      iconSrc = '/images/icons/mana.png';
      textColorStyle = { color: '#ffffff', fontWeight: 'bold' };
    }

    // Parse restOfText to find and bold level numbers (e.g., "at level 1")
    const renderTextWithBoldLevel = (text: string) => {
      // Match "at level X" pattern where X is a number
      const levelPattern = /(at )(level )(\d+)/gi;
      const parts: (string | React.ReactElement)[] = [];
      let lastIndex = 0;
      let match;

      while ((match = levelPattern.exec(text)) !== null) {
        // Add text before the match
        if (match.index > lastIndex) {
          parts.push(text.substring(lastIndex, match.index));
        }
        // Add "at " as normal text
        parts.push(match[1]);
        // Add "level" and the number as bold
        parts.push(
          <strong key={`level-${match.index}`}>
            {match[2]}{match[3]}
          </strong>
        );
        lastIndex = match.index + match[0].length;
      }

      // Add remaining text
      if (lastIndex < text.length) {
        parts.push(text.substring(lastIndex));
      }

      return parts.length > 0 ? parts : text;
    };

    return (
      <div className="flex flex-col items-center gap-4">
        <h3 className="text-base font-medium text-white block items-center justify-center flex-wrap gap-1">
          {beforeIcon && <span>{beforeIcon}</span>}
          <img 
            src={iconSrc} 
            alt="" 
            className="inline-block h-5 w-5 mx-1 align-middle"
          />
          {firstWord && <span style={textColorStyle}>{firstWord}</span>}
          {restOfText && <span> {renderTextWithBoldLevel(restOfText)}</span>}
        </h3>
        {questionIconUrl && (
          <div className="flex items-center justify-center">
            <AssetImage
              src={questionIconUrl}
              alt="Question"
              className="h-20 w-20 object-contain"
              fallbackSrc={questionIconFallbackUrl}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div 
      className="relative flex min-h-screen flex-col items-center justify-center px-4 py-8"
    >
      {/* Slim Pop-up Window Container */}
      <div className="w-full max-w-md rounded-lg border border-amber-900/60 shadow-2xl backdrop-blur-sm" style={{ backgroundColor: 'rgb(59 46 22)' }}>
        {/* Window Content */}
        <div className="p-5 space-y-5">
          {/* Question Text - Centered */}
          <div className="text-center">
            {renderQuestionWithIcon()}
          </div>

          {/* Lore Box - Dark brown rectangular box, no rounded corners */}
          {question.lore && (
            <div className="px-4 py-3 border border-amber-900/40" style={{ backgroundColor: 'rgb(45 34 18)' }}>
              <p className="text-center text-sm italic text-white">{question.lore}</p>
            </div>
          )}

          {/* Answer Options - 2x2 Grid, compact */}
          <div key={question.id} className="grid grid-cols-2 gap-2">
              {(['A', 'B', 'C', 'D'] as const).map((option) => {
                // Only show visual feedback if we're still on the same question
                const isCurrentQuestion = questionIdRef.current === question.id;
                const isSelected = isCurrentQuestion && selectedAnswer === option;
                const isCorrectAnswer = option === question.correctAnswer;
                // Only show celebration animation if user got it correct and on current question
                const showCorrect = isCurrentQuestion && answered && isCorrect === true && isCorrectAnswer;
                // Show correct answer (without celebration) on timeout and on current question
                const showCorrectAnswer = isCurrentQuestion && answered && isCorrect === false && isCorrectAnswer;
                const showWrong = isCurrentQuestion && answered && isSelected && !isCorrectAnswer;
                
                return (
                  <button
                    key={`${question.id}-${option}`}
                    onClick={(e) => {
                      e.preventDefault();
                      if (!answered) {
                        handleAnswer(option);
                      }
                    }}
                    disabled={answered}
                    style={{
                      ...(showCorrect ? { animation: 'correct-pulse 1s ease-in-out infinite' } : {}),
                      ...(!showCorrect && !showCorrectAnswer && !showWrong && !isSelected ? { backgroundColor: 'rgb(45 34 18)' } : {}),
                    }}
                    className={`group relative flex flex-col items-center justify-center rounded border p-2.5 ${
                      answered && !showCorrect && !showCorrectAnswer ? 'pointer-events-none cursor-not-allowed opacity-60 transition-opacity' : showCorrect ? '' : 'transition-all cursor-pointer'
                    } ${
                      showCorrect
                        ? 'border-green-500 bg-green-900/60 shadow-lg shadow-green-500/50 animate-correct-pulse'
                        : showCorrectAnswer
                        ? 'border-green-600/50 bg-green-900/30'
                        : showWrong
                        ? 'border-red-500 bg-red-900/40 shadow-lg shadow-red-500/30'
                        : isSelected
                        ? 'border-amber-700 bg-amber-950/70'
                        : 'border-amber-900/50 hover:border-amber-800/70 hover:shadow-lg'
                    }`}
                  >
                    {/* Letter Label - Top-left corner, subtle */}
                    <span className={`absolute left-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded text-xs font-semibold text-white/70 ${
                      showCorrect ? 'bg-green-600' : showWrong ? 'bg-red-600' : ''
                    }`}
                    style={!showCorrect && !showWrong ? { backgroundColor: 'rgb(68 52 24)' } : undefined}
                    >
                      {option}
                    </span>
                    
                    {/* Checkmark or X overlay */}
                    {showCorrect && (
                      <div className="absolute inset-0 flex items-center justify-center z-10">
                        <div className="text-4xl text-green-400 font-bold animate-bounce drop-shadow-lg" style={{ textShadow: '0 0 10px rgba(34, 197, 94, 0.8)' }}>
                          ✓
                        </div>
                      </div>
                    )}
                    {showWrong && (
                      <div className="absolute inset-0 flex items-center justify-center z-10">
                        <div className="text-4xl text-red-400 font-bold animate-bounce drop-shadow-lg">✗</div>
                      </div>
                    )}
                    
                    {/* Answer Image - Centered, square */}
                    {question.optionImages?.[option] && (
                      <div className={`h-16 w-16 flex items-center justify-center border rounded mb-2 ${
                        showCorrect ? 'border-green-500/80 animate-correct-glow' : showCorrectAnswer ? 'border-green-600/50' : showWrong ? 'border-red-500/50' : 'border-amber-900/50'
                      }`}
                      style={!showCorrect && !showCorrectAnswer && !showWrong ? { backgroundColor: 'rgb(45 34 18)' } : undefined}
                      >
                        <img
                          src={question.optionImages[option]}
                          alt={`Option ${option}`}
                          className={`h-full w-full object-contain ${showWrong ? 'opacity-50' : ''}`}
                        />
                      </div>
                    )}
                    
                    {/* Answer Text - Below image */}
                    <div className={`text-center text-sm font-medium ${
                      showCorrect ? 'text-green-200' : showCorrectAnswer ? 'text-green-300' : showWrong ? 'text-red-300' : 'text-white'
                    }`}>
                      {question.options[option]}
                    </div>
                  </button>
                );
              })}
            </div>

          {/* Timer - Centered below answers */}
          <div className="flex flex-col items-center gap-1 pt-1">
            <div className="text-3xl font-bold text-amber-100">
              {formatTime(timeRemaining)}
            </div>
            <div className="text-xs text-amber-200/70 uppercase tracking-wide">TIME REMAINING</div>
          </div>
        </div>
      </div>
    </div>
  );
}

