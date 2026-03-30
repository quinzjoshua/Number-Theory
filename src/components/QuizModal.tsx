import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, AlertCircle, RefreshCcw, ArrowRight, Trophy } from 'lucide-react';
import { cn } from '../lib/utils';

interface Question {
  id: number;
  type: 'mcq' | 'tf' | 'identification';
  question: string;
  options?: string[];
  answer: string;
}

const ALL_QUESTIONS: Question[] = [
  {
    id: 1,
    type: 'mcq',
    question: 'What is the only even prime number?',
    options: ['0', '2', '4', '6'],
    answer: '2'
  },
  {
    id: 2,
    type: 'tf',
    question: 'Every integer greater than 1 is either a prime or a unique product of primes.',
    answer: 'True'
  },
  {
    id: 3,
    type: 'identification',
    question: 'What is the term for a number that is equal to the sum of its proper divisors?',
    answer: 'Perfect Number'
  },
  {
    id: 4,
    type: 'mcq',
    question: 'In modular arithmetic, what is 17 mod 5?',
    options: ['1', '2', '3', '7'],
    answer: '2'
  },
  {
    id: 5,
    type: 'tf',
    question: 'The number 1 is considered a prime number.',
    answer: 'False'
  },
  {
    id: 6,
    type: 'identification',
    question: 'Which algorithm is used to find the Greatest Common Divisor (GCD) of two numbers?',
    answer: 'Euclidean Algorithm'
  },
  {
    id: 7,
    type: 'mcq',
    question: 'What are primes of the form 2ⁿ - 1 called?',
    options: ['Fibonacci Primes', 'Mersenne Primes', 'Twin Primes', 'Perfect Primes'],
    answer: 'Mersenne Primes'
  },
  {
    id: 8,
    type: 'tf',
    question: 'Twin primes are pairs of primes that differ by exactly two.',
    answer: 'True'
  },
  {
    id: 9,
    type: 'identification',
    question: 'What is the sequence where each number is the sum of the two preceding ones?',
    answer: 'Fibonacci Sequence'
  },
  {
    id: 10,
    type: 'mcq',
    question: 'Which of these is a perfect number?',
    options: ['4', '6', '8', '10'],
    answer: '6'
  },
  {
    id: 11,
    type: 'tf',
    question: 'Modular arithmetic is often called "clock arithmetic".',
    answer: 'True'
  },
  {
    id: 12,
    type: 'identification',
    question: 'What is the term for a natural number greater than 1 that has no positive divisors other than 1 and itself?',
    answer: 'Prime Number'
  },
  {
    id: 13,
    type: 'mcq',
    question: 'What is the GCD of 48 and 18?',
    options: ['2', '3', '6', '9'],
    answer: '6'
  },
  {
    id: 14,
    type: 'tf',
    question: 'The Sieve of Eratosthenes is an algorithm for finding all prime numbers up to a limit.',
    answer: 'True'
  },
  {
    id: 15,
    type: 'identification',
    question: 'What is the result of 2^10 mod 7?',
    answer: '2'
  }
];

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuizModal({ isOpen, onClose }: QuizModalProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Randomize and pick 10 questions
      const shuffled = [...ALL_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 10);
      setQuestions(shuffled);
      setCurrentIndex(0);
      setScore(0);
      setIsFinished(false);
      setUserAnswer('');
      setFeedback(null);
    }
  }, [isOpen]);

  const currentQuestion = questions[currentIndex];

  const handleSubmit = () => {
    if (!userAnswer || feedback || !currentQuestion) return;

    const isCorrect = userAnswer.toLowerCase().trim() === currentQuestion.answer.toLowerCase().trim();
    if (isCorrect) {
      setScore(s => s + 1);
      setFeedback('correct');
      // Play sparkle sound
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3');
      audio.volume = 0.5;
      audio.play().catch(e => console.log('Audio play failed:', e));
    } else {
      setFeedback('incorrect');
    }

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(i => i + 1);
        setUserAnswer('');
        setFeedback(null);
      } else {
        setIsFinished(true);
      }
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-zinc-900/60 backdrop-blur-md z-[80]"
          />
          
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[90] p-6 md:p-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-2xl bg-white/70 backdrop-blur-3xl rounded-[40px] border border-white/40 shadow-2xl pointer-events-auto overflow-hidden flex flex-col"
            >
              <div className="p-8 border-b border-black/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-zinc-900 rounded-2xl flex items-center justify-center text-white">
                    <Trophy className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black tracking-widest text-zinc-900 uppercase">Assessment Drill</h2>
                    {!isFinished && questions.length > 0 && (
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Question {currentIndex + 1} of 10</p>
                    )}
                  </div>
                </div>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-zinc-100 transition-colors">
                  <X className="w-6 h-6 text-zinc-400" />
                </button>
              </div>

              <div className="flex-1 p-8 md:p-12 overflow-y-auto">
                <AnimatePresence mode="wait">
                  {questions.length > 0 && !isFinished && currentQuestion ? (
                    <motion.div
                      key={currentIndex}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-8"
                    >
                      <div className="space-y-4">
                        <div className="inline-block px-3 py-1 rounded-full bg-zinc-100 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                          {currentQuestion.type === 'mcq' ? 'Multiple Choice' : currentQuestion.type === 'tf' ? 'True or False' : 'Identification'}
                        </div>
                        <h3 className="text-2xl font-bold text-zinc-900 leading-tight">
                          {currentQuestion.question}
                        </h3>
                      </div>

                      <div className="space-y-3">
                        {currentQuestion.type === 'mcq' && currentQuestion.options?.map((opt) => (
                          <button
                            key={opt}
                            disabled={!!feedback}
                            onClick={() => setUserAnswer(opt)}
                            className={cn(
                              "w-full p-5 rounded-2xl text-left font-bold transition-all border",
                              userAnswer === opt 
                                ? "bg-zinc-900 text-white border-zinc-900 shadow-lg" 
                                : "bg-white border-zinc-100 text-zinc-600 hover:border-zinc-300",
                              feedback === 'correct' && opt === currentQuestion.answer && "bg-emerald-500 border-emerald-500 text-white",
                              feedback === 'incorrect' && userAnswer === opt && "bg-rose-500 border-rose-500 text-white"
                            )}
                          >
                            {opt}
                          </button>
                        ))}

                        {currentQuestion.type === 'tf' && (
                          <div className="grid grid-cols-2 gap-4">
                            {['True', 'False'].map((opt) => (
                              <button
                                key={opt}
                                disabled={!!feedback}
                                onClick={() => setUserAnswer(opt)}
                                className={cn(
                                  "p-8 rounded-2xl font-bold transition-all border text-xl",
                                  userAnswer === opt 
                                    ? "bg-zinc-900 text-white border-zinc-900 shadow-lg" 
                                    : "bg-white border-zinc-100 text-zinc-600 hover:border-zinc-300",
                                  feedback === 'correct' && opt === currentQuestion.answer && "bg-emerald-500 border-emerald-500 text-white",
                                  feedback === 'incorrect' && userAnswer === opt && "bg-rose-500 border-rose-500 text-white"
                                )}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        )}

                        {currentQuestion.type === 'identification' && (
                          <div className="space-y-4">
                            <input
                              type="text"
                              disabled={!!feedback}
                              value={userAnswer}
                              onChange={(e) => setUserAnswer(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                              placeholder="Type your answer here..."
                              className={cn(
                                "w-full p-5 rounded-2xl bg-white border border-zinc-200 focus:border-zinc-900 outline-none transition-all text-lg font-bold",
                                feedback === 'correct' && "border-emerald-500 text-emerald-600 bg-emerald-50",
                                feedback === 'incorrect' && "border-rose-500 text-rose-600 bg-rose-50"
                              )}
                            />
                            {feedback === 'incorrect' && (
                              <p className="text-sm font-bold text-rose-500 px-2">
                                Correct answer: {currentQuestion.answer}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="pt-4">
                        <button
                          onClick={handleSubmit}
                          disabled={!userAnswer || !!feedback}
                          className={cn(
                            "w-full py-5 rounded-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2",
                            !userAnswer || !!feedback
                              ? "bg-zinc-100 text-zinc-400 cursor-not-allowed"
                              : "bg-zinc-900 text-white hover:bg-zinc-800 shadow-xl shadow-zinc-200"
                          )}
                        >
                          {feedback === 'correct' ? (
                            <><CheckCircle2 className="w-5 h-5" /> Correct!</>
                          ) : feedback === 'incorrect' ? (
                            <><AlertCircle className="w-5 h-5" /> Incorrect</>
                          ) : (
                            <>Submit Answer <ArrowRight className="w-5 h-5" /></>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  ) : isFinished ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center space-y-8 py-12"
                    >
                      <div className="relative inline-block">
                        <div className="w-32 h-32 bg-emerald-500 rounded-full flex items-center justify-center text-white mx-auto shadow-2xl shadow-emerald-200">
                          <Trophy className="w-16 h-16" />
                        </div>
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.3 }}
                          className="absolute -top-2 -right-2 bg-zinc-900 text-white w-12 h-12 rounded-full flex items-center justify-center font-black border-4 border-white"
                        >
                          {score}/10
                        </motion.div>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-4xl font-black text-zinc-900 tracking-tight">Quiz Completed!</h3>
                        <p className="text-zinc-500 font-medium">
                          {score >= 8 ? "Excellent! You've mastered the basics." : score >= 5 ? "Good job! Keep practicing to improve." : "Keep studying and try again!"}
                        </p>
                      </div>

                      <div className="flex flex-col gap-3">
                        <button
                          onClick={() => {
                            const shuffled = [...ALL_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 10);
                            setQuestions(shuffled);
                            setCurrentIndex(0);
                            setScore(0);
                            setIsFinished(false);
                            setUserAnswer('');
                            setFeedback(null);
                          }}
                          className="w-full bg-zinc-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200 flex items-center justify-center gap-2"
                        >
                          <RefreshCcw className="w-5 h-5" /> Retake Quiz
                        </button>
                        <button
                          onClick={onClose}
                          className="w-full bg-white border border-zinc-200 text-zinc-600 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-zinc-50 transition-all"
                        >
                          Close Modal
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="flex items-center justify-center h-full py-20">
                      <RefreshCcw className="w-10 h-10 animate-spin text-zinc-300" />
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
