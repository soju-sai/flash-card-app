'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  Shuffle, 
  CheckCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { type Card as CardType } from '@/lib/validations/card';
import { type Deck } from '@/lib/validations/deck';

interface StudyInterfaceProps {
  deck: Deck;
  cards: CardType[];
}

export default function StudyInterface({ deck, cards }: StudyInterfaceProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studiedCards, setStudiedCards] = useState<Set<number>>(new Set());
  const [shuffledCards, setShuffledCards] = useState<CardType[]>(cards);
  const [isShuffled, setIsShuffled] = useState(false);
  const { t } = useI18n();

  // Shuffle function
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Current card and progress calculations
  const currentCard = shuffledCards[currentIndex];
  const progress = Math.round(((currentIndex + 1) / shuffledCards.length) * 100);
  const studiedCount = studiedCards.size;
  const isCompleted = studiedCount === shuffledCards.length;

  // Navigation handlers
  const handleNext = useCallback(() => {
    if (currentIndex < shuffledCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
      // Mark current card as studied
      setStudiedCards(prev => new Set(prev).add(currentCard.id));
    }
  }, [currentIndex, shuffledCards.length, currentCard.id]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  }, [currentIndex]);

  const handleReset = useCallback(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setStudiedCards(new Set());
  }, []);

  const handleShuffle = useCallback(() => {
    const newShuffled = shuffleArray(cards);
    setShuffledCards(newShuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsShuffled(true);
  }, [cards]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case ' ':
        case 'Enter':
          event.preventDefault();
          setIsFlipped(!isFlipped);
          break;
        case 'ArrowRight':
          event.preventDefault();
          handleNext();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          handlePrevious();
          break;
        case 'r':
          event.preventDefault();
          handleReset();
          break;
        case 's':
          event.preventDefault();
          handleShuffle();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isFlipped, currentIndex, handleNext, handlePrevious, handleReset, handleShuffle]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleMarkStudied = () => {
    setStudiedCards(prev => new Set(prev).add(currentCard.id));
    handleNext();
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md mx-auto text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('studyUI.completeTitle')}</h1>
          <p className="text-gray-600 mb-6">
            {t('studyUI.completeDesc')
              .replace('{{count}}', String(shuffledCards.length))
              .replace('{{title}}', deck.title)}
          </p>
          <div className="flex flex-col gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={handleReset} className="w-full" aria-label={t('studyUI.studyAgain')}>
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {t('studyUI.studyAgain')}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Link href={`/deck/${deck.id}`}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" className="w-full" aria-label={t('studyUI.backToDeck')}>
                      <ArrowLeft className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {t('studyUI.backToDeck')}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={`/deck/${deck.id}`}>
                    <Button variant="outline" size="sm" aria-label={t('studyUI.back')}>
                      <ArrowLeft className="w-4 h-4" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  {t('studyUI.back')}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{deck.title}</h1>
              <p className="text-sm text-gray-600">{t('studyUI.studyMode')}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={handleShuffle} aria-label={isShuffled ? t('studyUI.shuffled') : t('studyUI.shuffle')}>
                    <Shuffle className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isShuffled ? t('studyUI.shuffled') : t('studyUI.shuffle')}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={handleReset} aria-label={t('studyUI.reset')}>
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {t('studyUI.reset')}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              {t('studyUI.progressCardOf')
                .replace('{{n}}', String(currentIndex + 1))
                .replace('{{total}}', String(shuffledCards.length))}
            </span>
            <span className="text-sm text-gray-600">
              {t('studyUI.progressStudied').replace('{{count}}', String(studiedCount))} • {t('studyUI.progressComplete').replace('{{percent}}', String(progress))}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Flashcard */}
        <div className="flex justify-center mb-8">
          <div className="relative w-full max-w-2xl">
            <div 
              className={`relative w-full h-80 cursor-pointer transition-transform duration-500 transform-style-preserve-3d ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
              onClick={handleFlip}
              style={{ 
                transformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
              }}
            >
              {/* Front Side */}
              <Card className={`absolute inset-0 w-full h-full backface-hidden border-2 ${
                studiedCards.has(currentCard.id) ? 'border-green-300 bg-green-50' : 'border-blue-300 bg-blue-50'
              }`}>
                <CardContent className="flex items-center justify-center h-full p-8">
                  <div className="text-center space-y-4">
                    <Badge variant="secondary" className="mb-4">{t('studyUI.front')}</Badge>
                    <p className="text-xl font-medium text-gray-900 leading-relaxed">
                      {currentCard.frontSide}
                    </p>
                    <p className="text-sm text-gray-500 mt-6">{t('studyUI.clickToReveal')}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Back Side */}
              <Card className={`absolute inset-0 w-full h-full backface-hidden border-2 ${
                studiedCards.has(currentCard.id) ? 'border-green-300 bg-green-50' : 'border-green-300 bg-green-50'
              }`}
              style={{ transform: 'rotateY(180deg)' }}>
                <CardContent className="flex items-center justify-center h-full p-8">
                  <div className="text-center space-y-4">
                    <Badge variant="secondary" className="mb-4">{t('studyUI.backLabel')}</Badge>
                    <p className="text-xl font-medium text-gray-900 leading-relaxed">
                      {currentCard.backSide}
                    </p>
                    <p className="text-sm text-gray-500 mt-6">{t('studyUI.clickToFlipBack')}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Studied indicator */}
            {studiedCards.has(currentCard.id) && (
              <div className="absolute top-4 right-4 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                {t('studyUI.studiedBadge')}
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center items-center gap-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                  size="lg"
                  aria-label={t('studyUI.previous')}
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t('studyUI.previous')}</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    onClick={handleFlip}
                    size="lg"
                    aria-label={isFlipped ? t('studyUI.showFront') : t('studyUI.showAnswer')}
                  >
                    {isFlipped ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{isFlipped ? t('studyUI.showFront') : t('studyUI.showAnswer')}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {isFlipped && !studiedCards.has(currentCard.id) && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      onClick={handleMarkStudied}
                      size="lg"
                      className="bg-green-600 hover:bg-green-700"
                      aria-label={t('studyUI.gotIt')}
                    >
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{t('studyUI.gotIt')}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  onClick={handleNext}
                  disabled={currentIndex === shuffledCards.length - 1}
                  size="lg"
                  aria-label={t('studyUI.next')}
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t('studyUI.next')}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Keyboard shortcuts hint */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">{t('studyUI.keyboardShortcuts')}</p>
        </div>
      </div>

      <style jsx>{`
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
      `}</style>
    </div>
  );
}
