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
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Study Complete!</h1>
          <p className="text-gray-600 mb-6">
            You&apos;ve studied all {shuffledCards.length} cards in &quot;{deck.title}&quot;.
          </p>
          <div className="flex flex-col gap-3">
            <Button onClick={handleReset} className="w-full">
              <RotateCcw className="w-4 h-4 mr-2" />
              Study Again
            </Button>
            <Link href={`/deck/${deck.id}`}>
              <Button variant="outline" className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Deck
              </Button>
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
            <Link href={`/deck/${deck.id}`}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{deck.title}</h1>
              <p className="text-sm text-gray-600">Study Mode</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleShuffle}>
              <Shuffle className="w-4 h-4 mr-2" />
              {isShuffled ? 'Shuffled' : 'Shuffle'}
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Card {currentIndex + 1} of {shuffledCards.length}
            </span>
            <span className="text-sm text-gray-600">
              {studiedCount} studied • {progress}% complete
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
                    <Badge variant="secondary" className="mb-4">Front</Badge>
                    <p className="text-xl font-medium text-gray-900 leading-relaxed">
                      {currentCard.frontSide}
                    </p>
                    <p className="text-sm text-gray-500 mt-6">
                      Click to reveal answer
                    </p>
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
                    <Badge variant="secondary" className="mb-4">Back</Badge>
                    <p className="text-xl font-medium text-gray-900 leading-relaxed">
                      {currentCard.backSide}
                    </p>
                    <p className="text-sm text-gray-500 mt-6">
                      Click to flip back
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Studied indicator */}
            {studiedCards.has(currentCard.id) && (
              <div className="absolute top-4 right-4 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                ✓ Studied
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center items-center gap-4">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            size="lg"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Previous
          </Button>

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleFlip}
              size="lg"
            >
              {isFlipped ? 'Show Front' : 'Show Answer'}
            </Button>
            
            {isFlipped && !studiedCards.has(currentCard.id) && (
              <Button 
                onClick={handleMarkStudied}
                size="lg"
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Got it!
              </Button>
            )}
          </div>

          <Button 
            variant="outline" 
            onClick={handleNext}
            disabled={currentIndex === shuffledCards.length - 1}
            size="lg"
          >
            Next
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

        {/* Keyboard shortcuts hint */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Keyboard shortcuts: <strong>Space/Enter</strong> flip • <strong>←→</strong> navigate • <strong>R</strong> reset • <strong>S</strong> shuffle
          </p>
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
