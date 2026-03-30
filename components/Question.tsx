'use client';

import { Question as QuestionType, ScoreBreakdown } from '@/lib/types/game';
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
  totalQuestions?: number;
  currentScore: number;
  scoreBreakdown: ScoreBreakdown | null;
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
  scoreBreakdown,
  onAnswer,
  onTimeout,
  startTimer = true,
}: QuestionProps) {
  const [timeRemaining, setTimeRemaining] = useState(TIMER_DURATION);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [displayScore, setDisplayScore] = useState(currentScore);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [previousIconUrl, setPreviousIconUrl] = useState<string | null>(null);
  const [previousFallbackUrl, setPreviousFallbackUrl] = useState<string | null>(null);
  const [previousQuestionText, setPreviousQuestionText] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const answeredRef = useRef(false);
  const questionIdRef = useRef(question.id);
  const timerStartedRef = useRef(false);
  const previousQuestionIdRef = useRef<string | null>(null);
  const previousIconUrlRef = useRef<string | null>(null);
  const previousFallbackUrlRef = useRef<string | null>(null);
  const previousQuestionTextRef = useRef<string | null>(null);

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

  // Reset timer when question changes
  useEffect(() => {
    // Store previous icon and text from ref before question changes
    if (previousQuestionIdRef.current !== null && previousQuestionIdRef.current !== question.id) {
      // Question is changing, store the previous icon and text
      if (previousIconUrlRef.current) {
        setPreviousIconUrl(previousIconUrlRef.current);
        setPreviousFallbackUrl(previousFallbackUrlRef.current);
      }
      if (previousQuestionTextRef.current) {
        setPreviousQuestionText(previousQuestionTextRef.current);
      }
      
      setIsTransitioning(true);
      setImageLoaded(false); // Reset image loaded state for new question
      
      // Reset transition state after animation completes
      setTimeout(() => {
        setIsTransitioning(false);
        setPreviousQuestionText(null);
      }, 400); // Match animation duration
    }
    
    // Immediately reset all state when question changes
    setTimeRemaining(TIMER_DURATION);
    setAnswered(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
    answeredRef.current = false;
    previousQuestionIdRef.current = questionIdRef.current;
    questionIdRef.current = question.id;
    timerStartedRef.current = false;
  }, [question.id]);

  // Update display score without resetting other state
  useEffect(() => {
    if (!scoreBreakdown) {
      setDisplayScore(currentScore);
    }
  }, [currentScore, scoreBreakdown]);

  // Animate score counting when points are earned
  useEffect(() => {
    if (scoreBreakdown && scoreBreakdown.total > 0) {
      setShowBreakdown(true);
      const startScore = currentScore - scoreBreakdown.total;
      setDisplayScore(startScore);
      
      const duration = 1000; // 1 second
      const steps = 30;
      const increment = scoreBreakdown.total / steps;
      const stepDuration = duration / steps;
      
      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        if (currentStep <= steps) {
          setDisplayScore((prev) => Math.min(startScore + (currentStep * increment), currentScore));
        } else {
          setDisplayScore(currentScore);
          clearInterval(interval);
        }
      }, stepDuration);

      // Hide breakdown after animation completes + 2 seconds
      const hideTimer = setTimeout(() => {
        setShowBreakdown(false);
      }, duration + 2000);

      return () => {
        clearInterval(interval);
        clearTimeout(hideTimer);
      };
    } else {
      setShowBreakdown(false);
    }
  }, [scoreBreakdown, currentScore]);

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


  const { primary: questionIconUrl, fallback: questionIconFallbackUrl } = getQuestionIconUrl();

  // Update refs with current icon and text for next transition
  useEffect(() => {
    previousIconUrlRef.current = questionIconUrl;
    previousFallbackUrlRef.current = questionIconFallbackUrl;
    previousQuestionTextRef.current = question.question;
  }, [questionIconUrl, questionIconFallbackUrl, question.question]);

  // Preload new image to prevent jump
  useEffect(() => {
    if (questionIconUrl) {
      const img = new Image();
      img.onload = () => {
        setImageLoaded(true);
      };
      img.onerror = () => {
        // If primary fails, try fallback
        if (questionIconFallbackUrl) {
          const fallbackImg = new Image();
          fallbackImg.onload = () => {
            setImageLoaded(true);
          };
          fallbackImg.src = questionIconFallbackUrl;
        } else {
          setImageLoaded(true); // Allow transition even if image fails
        }
      };
      img.src = questionIconUrl;
    } else {
      setImageLoaded(true); // No image to load
    }
  }, [questionIconUrl, questionIconFallbackUrl]);

  // Clear previous icon after animation completes
  useEffect(() => {
    if (previousIconUrl && questionIconUrl && previousIconUrl !== questionIconUrl) {
      // Icon changed, clear previous after animation
      const timer = setTimeout(() => {
        setPreviousIconUrl(null);
        setPreviousFallbackUrl(null);
      }, 400); // Match animation duration
      return () => clearTimeout(timer);
    } else if (!questionIconUrl && previousIconUrl) {
      // Icon removed, clear previous after animation
      const timer = setTimeout(() => {
        setPreviousIconUrl(null);
        setPreviousFallbackUrl(null);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [questionIconUrl, previousIconUrl]);

  // Parse question text to render icons inline
  const renderQuestionWithIcon = () => {
    const questionText = question.question;
    const iconPlaceholder = '{icon}';
    
    if (!questionText.includes(iconPlaceholder)) {
      // No icon placeholder, render normally
      const iconKey = questionIconUrl || previousIconUrl;
      const hasIconChange = previousIconUrl !== questionIconUrl;
      // Show previous icon if it exists and (icons are different or new image not loaded yet)
      const showPrevious = previousIconUrl && (hasIconChange && (!imageLoaded || questionIconUrl));
      // Show current icon only when loaded
      const showCurrent = !!questionIconUrl && imageLoaded;
      const shouldAnimate = hasIconChange && showCurrent && previousIconUrl;
      
      const hasQuestionChange = previousQuestionText !== null && previousQuestionText !== questionText;
      const showPreviousText = hasQuestionChange && previousQuestionText;
      const showCurrentText = !!questionText;
      
      const hasContentChange = hasQuestionChange || hasIconChange;
      const showPreviousContent = (showPreviousText || showPrevious) && hasContentChange;
      const showCurrentContent = (showCurrentText || showCurrent);
      // Always animate new content when question changes (even if no previous content)
      const shouldAnimateNew = isTransitioning || hasContentChange;
      
      return (
        <div className="relative flex flex-col items-center gap-4 min-h-32 w-full">
          {/* Previous question content (text + image) sliding out together */}
          {showPreviousContent && (
            <div 
              key={`prev-content-${previousQuestionText || previousIconUrl}`}
              className="absolute flex flex-col items-center gap-4 w-full animate-slide-out-down"
            >
              {showPreviousText && (
                <h3 className="text-base font-medium text-white text-center">
                  {previousQuestionText}
                </h3>
              )}
              {showPrevious && (
                <div className="flex items-center justify-center">
                  <AssetImage
                    src={previousIconUrl}
                    alt="Question"
                    className="h-20 w-20 object-contain"
                    fallbackSrc={previousFallbackUrl}
                  />
                </div>
              )}
            </div>
          )}
          {/* Current question content (text + image) sliding in together */}
          {showCurrentContent && (
            <div 
              key={`current-content-${questionText || questionIconUrl}`}
              className={`flex flex-col items-center gap-4 w-full ${shouldAnimateNew ? 'animate-slide-in-from-up' : ''}`}
            >
              {showCurrentText && (
                <h3 className="text-base font-medium text-white text-center">
                  {questionText}
                </h3>
              )}
              {showCurrent && imageLoaded && (
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
          )}
        </div>
      );
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

    const hasQuestionChange = previousQuestionText !== null && previousQuestionText !== questionText;
    const hasIconChange = previousIconUrl !== questionIconUrl;
    const hasContentChange = hasQuestionChange || hasIconChange;
    
    // Show previous content if it exists and content is changing
    const showPreviousIcon = previousIconUrl && (hasIconChange && (!imageLoaded || questionIconUrl));
    const showPreviousText = hasQuestionChange && previousQuestionText;
    const showPreviousContent = (showPreviousText || showPreviousIcon) && hasContentChange;
    
    // Show current content
    const showCurrentIcon = !!questionIconUrl && imageLoaded;
    const showCurrentText = !!questionText;
    const showCurrentContent = showCurrentText || showCurrentIcon;
    // Always animate new content when question changes (even if no previous content)
    const shouldAnimateNew = isTransitioning || hasContentChange;
    
    // Build the full question text for comparison
    const buildQuestionText = (text: string) => {
      const parts = text.split(iconPlaceholder);
      const before = parts[0];
      const after = parts[1] || '';
      const afterWords = after.trim().split(/\s+/);
      const first = afterWords[0] || '';
      const rest = afterWords.slice(1).join(' ');
      return { before, first, rest };
    };
    
    const currentTextParts = buildQuestionText(questionText);
    const previousTextParts = previousQuestionText ? buildQuestionText(previousQuestionText) : null;
    
    return (
      <div className="relative flex flex-col items-center gap-4 min-h-32 w-full">
        {/* Previous question content (text + image) sliding out together */}
        {showPreviousContent && (
          <div 
            key={`prev-content-${previousQuestionText || previousIconUrl}`}
            className="absolute flex flex-col items-center gap-4 w-full animate-slide-out-down"
          >
            {showPreviousText && previousTextParts && (
              <h3 className="text-base font-medium text-white block items-center justify-center flex-wrap gap-1 text-center">
                {previousTextParts.before && <span>{previousTextParts.before}</span>}
                <img 
                  src={iconSrc} 
                  alt="" 
                  className="inline-block h-5 w-5 mx-1 align-middle"
                />
                {previousTextParts.first && <span style={textColorStyle}>{previousTextParts.first}</span>}
                {previousTextParts.rest && <span> {renderTextWithBoldLevel(previousTextParts.rest)}</span>}
              </h3>
            )}
            {showPreviousIcon && (
              <div className="flex items-center justify-center">
                <AssetImage
                  src={previousIconUrl}
                  alt="Question"
                  className="h-20 w-20 object-contain"
                  fallbackSrc={previousFallbackUrl}
                />
              </div>
            )}
          </div>
        )}
        {/* Current question content (text + image) sliding in together */}
        {showCurrentContent && (
          <div className={`flex flex-col items-center gap-4 w-full ${shouldAnimateNew ? 'animate-slide-in-from-up' : ''}`}>
            {showCurrentText && (
              <h3 className="text-base font-medium text-white block items-center justify-center flex-wrap gap-1 text-center">
                {currentTextParts.before && <span>{currentTextParts.before}</span>}
                <img 
                  key={`${question.id}-${iconSrc}`}
                  src={iconSrc} 
                  alt="" 
                  className="inline-block h-5 w-5 mx-1 align-middle"
                />
                {currentTextParts.first && <span style={textColorStyle}>{currentTextParts.first}</span>}
                {currentTextParts.rest && <span> {renderTextWithBoldLevel(currentTextParts.rest)}</span>}
              </h3>
            )}
            {showCurrentIcon && (
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
        )}
      </div>
    );
  };

  // Format score breakdown text
  const formatScoreBreakdown = (breakdown: ScoreBreakdown | null): string => {
    if (!breakdown) return '';
    
    const parts: string[] = [];
    parts.push(`+${breakdown.base}`);
    if (breakdown.speed > 0) parts.push(`+${breakdown.speed} speed`);
    if (breakdown.streak > 0) parts.push(`+${breakdown.streak} streak`);
    if (breakdown.perfect > 0) parts.push(`+${breakdown.perfect} perfect`);
    
    return parts.join(' ');
  };

  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center px-4 py-8"
    >
      {/* Sleek Score Bar at Top */}
      <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        <div
          className="flex items-center justify-between px-6 py-2.5 backdrop-blur-xl"
          style={{ backgroundColor: 'rgba(10, 14, 26, 0.85)', borderBottom: '1px solid #4f4f4f3b' }}
        >
          {/* Question Number - Left */}
          <div className="text-xs uppercase tracking-widest font-medium" style={{ color: '#94a3b8' }}>
            Q{questionNumber}{totalQuestions ? ` / ${totalQuestions}` : ''}
          </div>

          {/* Score - Center */}
          <div className="flex items-center gap-2.5">
            <span className="text-lg font-semibold tracking-wide tabular-nums" style={{ color: '#f8fafc' }}>
              {Math.round(displayScore).toLocaleString()}
            </span>
            {scoreBreakdown && scoreBreakdown.total > 0 && showBreakdown && (
              <span className="text-xs font-medium animate-fade-in" style={{ color: '#7fb069' }}>
                {formatScoreBreakdown(scoreBreakdown)}
              </span>
            )}
          </div>

          {/* Streak - Right */}
          <div className="text-xs uppercase tracking-widest font-medium" style={{ color: '#94a3b8' }}>
            {scoreBreakdown && scoreBreakdown.streakMultiplier > 1
              ? `${scoreBreakdown.streakMultiplier.toFixed(1)}x`
              : ''}
          </div>
        </div>
      </div>

      {/* Card Container */}
      <div className="question-card w-full max-w-md overflow-hidden transition-all duration-300 ease-in-out">
        {/* Timer Bar - Top of card */}
        <div className="w-full h-1" style={{ backgroundColor: 'rgba(127, 176, 105, 0.06)' }}>
          <div
            key={`timer-${question.id}`}
            className="h-full timer-bar"
            style={{
              width: answered ? undefined : '100%',
              animationDuration: `${TIMER_DURATION}s`,
              animationPlayState: answered ? 'paused' : (startTimer && timerStartedRef.current ? 'running' : 'paused'),
              background: 'linear-gradient(90deg, #ef4444, #f59e0b, #7fb069)',
            }}
          />
        </div>

        {/* Window Content */}
        <div className="p-6 space-y-5 transition-all duration-300 ease-in-out">
          {/* Question Text - Centered */}
          <div className="text-center transition-all duration-300 ease-in-out">
            {renderQuestionWithIcon()}
          </div>

          {/* Lore Box */}
          <div
            key={`lore-container-${question.id}`}
            className={`transition-all duration-300 ease-in-out overflow-hidden ${
              question.lore
                ? 'max-h-96 opacity-100'
                : 'max-h-0 opacity-0'
            }`}
          >
            {question.lore && (
              <div
                className="px-4 py-3 rounded-lg transition-opacity duration-300"
                style={{ backgroundColor: 'rgba(127, 176, 105, 0.04)', border: '1px solid rgba(127, 176, 105, 0.1)' }}
              >
                <p className="text-center text-sm italic" style={{ color: '#94a3b8' }}>{question.lore}</p>
              </div>
            )}
          </div>

          {/* Answer Options - 2x2 Grid */}
          <div key={question.id} className="grid grid-cols-2 gap-3">
              {(['A', 'B', 'C', 'D'] as const).map((option) => {
                const isCurrentQuestion = questionIdRef.current === question.id;
                const isSelected = isCurrentQuestion && selectedAnswer === option;
                const isCorrectAnswer = option === question.correctAnswer;
                const showCorrect = isCurrentQuestion && answered && isCorrect === true && isCorrectAnswer;
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
                    className={`answer-btn group relative flex flex-col items-center justify-center py-5 px-3 min-h-[5rem] ${
                      answered && !showCorrect && !showCorrectAnswer ? 'pointer-events-none cursor-not-allowed opacity-50' : showCorrect ? '' : 'cursor-pointer'
                    } ${
                      showCorrect
                        ? 'answer-btn-correct animate-correct-pulse'
                        : showCorrectAnswer
                        ? 'answer-btn-correct-reveal'
                        : showWrong
                        ? 'answer-btn-wrong'
                        : isSelected
                        ? 'answer-btn-selected'
                        : 'answer-btn-default'
                    }`}
                  >
                    {/* Letter Label - Top-left corner */}
                    <span
                      className={`absolute left-2 top-2 flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold uppercase ${
                        showCorrect ? 'text-white' : showWrong ? 'text-white' : ''
                      }`}
                      style={
                        showCorrect
                          ? { backgroundColor: '#7fb069' }
                          : showWrong
                          ? { backgroundColor: '#ef4444' }
                          : { backgroundColor: 'rgba(255,255,255,0.05)', color: '#64748b' }
                      }
                    >
                      {option}
                    </span>

                    {/* Checkmark or X overlay */}
                    {showCorrect && (
                      <div className="absolute inset-0 flex items-center justify-center z-10">
                        <div className="text-4xl font-bold animate-bounce drop-shadow-lg" style={{ color: '#7fb069', textShadow: '0 0 12px rgba(127, 176, 105, 0.8)' }}>
                          ✓
                        </div>
                      </div>
                    )}
                    {showWrong && (
                      <div className="absolute inset-0 flex items-center justify-center z-10">
                        <div className="text-4xl font-bold animate-bounce drop-shadow-lg" style={{ color: '#ef4444', textShadow: '0 0 12px rgba(239, 68, 68, 0.6)' }}>
                          ✗
                        </div>
                      </div>
                    )}

                    {/* Answer Image - Centered, square */}
                    <div
                      key={`option-image-container-${question.id}-${option}`}
                      className={`transition-all duration-300 ease-in-out overflow-hidden ${
                        question.optionImages?.[option]
                          ? 'h-16 w-16 mb-2 opacity-100'
                          : 'h-0 w-0 mb-0 opacity-0'
                      }`}
                    >
                      {question.optionImages?.[option] && (
                        <div
                          className={`h-16 w-16 flex items-center justify-center rounded overflow-hidden transition-all duration-300 ease-in-out`}
                          style={
                            showCorrect
                              ? { border: '1px solid rgba(127, 176, 105, 0.5)', boxShadow: '0 0 10px rgba(127, 176, 105, 0.3)' }
                              : showCorrectAnswer
                              ? { border: '1px solid rgba(127, 176, 105, 0.3)' }
                              : showWrong
                              ? { border: '1px solid rgba(239, 68, 68, 0.3)' }
                              : { border: '1px solid #4f4f4f3b', backgroundColor: 'rgb(25 25 25)' }
                          }
                        >
                          <img
                            src={question.optionImages[option]}
                            alt={`Option ${option}`}
                            className={`h-full w-full object-contain transition-opacity duration-300 ${showWrong ? 'opacity-40' : ''}`}
                          />
                        </div>
                      )}
                    </div>

                    {/* Answer Text */}
                    <div
                      className="text-center text-sm font-medium"
                      style={
                        showCorrect
                          ? { color: '#a8d98a' }
                          : showCorrectAnswer
                          ? { color: '#7fb069' }
                          : showWrong
                          ? { color: '#fca5a5' }
                          : { color: '#cbd5e1' }
                      }
                    >
                      {question.options[option]}
                    </div>
                  </button>
                );
              })}
            </div>
        </div>
      </div>
    </div>
  );
}

