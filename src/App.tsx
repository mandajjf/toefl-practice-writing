/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, RefreshCcw, ArrowRight, Info, BookOpen } from 'lucide-react';

interface Question {
  id: number;
  context: string;
  fragments: string[];
  distractor: string;
  answer: string;
  explanation: string;
}

const QUESTIONS: Question[] = [
  {
    "id": 1,
    "context": "The campus health center will be closed for maintenance tomorrow.",
    "fragments": ["the center", "reopen", "is", "expected", "to", "reopening"],
    "distractor": "reopening",
    "answer": "the center is expected to reopen",
    "explanation": "動詞短語 'be expected to' 後面應接原形動詞 'reopen'。'reopening' 是干擾項。"
  },
  {
    "id": 2,
    "context": "I'm looking for the latest edition of the macroeconomics textbook.",
    "fragments": ["you", "the", "library website", "checked", "have", "checking"],
    "distractor": "checking",
    "answer": "have you checked the library website",
    "explanation": "現在完成式疑問句結構為 'Have + 主詞 + 過去分詞'。'checking' 不符合此結構。"
  },
  {
    "id": 3,
    "context": "My research paper is due on Friday, but I still have two chapters to write.",
    "fragments": ["finishing", "difficulty", "I am", "having", "the assignment", "to finish"],
    "distractor": "to finish",
    "answer": "I am having difficulty finishing the assignment",
    "explanation": "習慣用法為 'have difficulty (in) doing something'。因此應使用動名詞 'finishing'。"
  },
  {
    "id": 4,
    "context": "Professor Smith requires all students to submit their lab reports online.",
    "fragments": ["is", "submitted", "the report", "electronically", "to be", "submitting"],
    "distractor": "submitting",
    "answer": "the report is to be submitted electronically",
    "explanation": "此處需用被動語態 'to be + 過去分詞'，表示報告『將被』提交。"
  },
  {
    "id": 5,
    "context": "The student council meeting has been moved to a larger auditorium.",
    "fragments": ["space", "for", "more", "provide", "This", "will", "attendees", "provides"],
    "distractor": "provides",
    "answer": "This will provide more space for attendees",
    "explanation": "助動詞 'will' 後面必須接原形動詞 'provide'。'provides' 是單數動詞陷阱。"
  }
];

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedFragments, setSelectedFragments] = useState<string[]>([]);
  const [availableFragments, setAvailableFragments] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [showExplanation, setShowExplanation] = useState(false);

  const currentQuestion = QUESTIONS[currentIndex];

  // Shuffle fragments on question change
  useEffect(() => {
    const shuffled = [...currentQuestion.fragments].sort(() => Math.random() - 0.5);
    setAvailableFragments(shuffled);
    setSelectedFragments([]);
    setStatus('idle');
    setShowExplanation(false);
  }, [currentIndex]);

  const handleFragmentClick = (fragment: string, index: number) => {
    if (status !== 'idle') return;
    
    // Move from available to selected
    setSelectedFragments([...selectedFragments, fragment]);
    const newAvailable = [...availableFragments];
    newAvailable.splice(index, 1);
    setAvailableFragments(newAvailable);
  };

  const handleRemoveFragment = (index: number) => {
    if (status !== 'idle') return;

    const fragment = selectedFragments[index];
    const newSelected = [...selectedFragments];
    newSelected.splice(index, 1);
    setSelectedFragments(newSelected);
    setAvailableFragments([...availableFragments, fragment]);
  };

  const handleSubmit = () => {
    const userAnswer = selectedFragments.join(' ').toLowerCase().trim();
    const correctAnswer = currentQuestion.answer.toLowerCase().trim();

    if (userAnswer === correctAnswer) {
      setStatus('correct');
    } else {
      setStatus('incorrect');
      setShowExplanation(true);
    }
  };

  const handleNext = () => {
    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Reset to start or show completion
      setCurrentIndex(0);
    }
  };

  const handleReset = () => {
    const shuffled = [...currentQuestion.fragments].sort(() => Math.random() - 0.5);
    setAvailableFragments(shuffled);
    setSelectedFragments([]);
    setStatus('idle');
    setShowExplanation(false);
  };

  const progress = ((currentIndex + 1) / QUESTIONS.length) * 100;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-blue-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-bold text-lg tracking-tight text-slate-800">TOEFL Build a Sentence</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm font-medium text-slate-500">
              Question <span className="text-blue-600">{currentIndex + 1}</span> of {QUESTIONS.length}
            </div>
          </div>
        </div>
        {/* Progress Bar */}
        <div className="w-full h-1 bg-slate-100">
          <motion.div 
            className="h-full bg-blue-600"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Context Section */}
            <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <Info className="w-5 h-5 text-blue-500" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Context</h2>
                  <p className="text-xl leading-relaxed text-slate-700 font-medium italic">
                    "{currentQuestion.context}"
                  </p>
                </div>
              </div>
            </section>

            {/* Answer Box */}
            <section className="space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Your Answer</h2>
              <div 
                className={`min-h-[120px] p-6 rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-wrap gap-3 items-center content-center justify-center bg-white
                  ${status === 'correct' ? 'border-green-500 bg-green-50' : 
                    status === 'incorrect' ? 'border-red-500 bg-red-50' : 
                    'border-slate-200 hover:border-blue-300'}
                `}
              >
                {selectedFragments.length === 0 && (
                  <span className="text-slate-400 italic">Click fragments below to build the sentence...</span>
                )}
                <AnimatePresence>
                  {selectedFragments.map((frag, idx) => (
                    <motion.button
                      key={`${frag}-${idx}`}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      onClick={() => handleRemoveFragment(idx)}
                      disabled={status !== 'idle'}
                      className={`px-4 py-2 rounded-xl font-medium shadow-sm transition-all
                        ${status === 'correct' ? 'bg-green-600 text-white cursor-default' : 
                          status === 'incorrect' ? 'bg-red-600 text-white cursor-default' : 
                          'bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 hover:scale-105 active:scale-95'}
                      `}
                    >
                      {frag}
                    </motion.button>
                  ))}
                </AnimatePresence>
              </div>
            </section>

            {/* Fragments Pool */}
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Available Fragments</h2>
                <button 
                  onClick={handleReset}
                  className="text-slate-400 hover:text-blue-600 transition-colors flex items-center gap-1.5 text-sm font-medium"
                >
                  <RefreshCcw className="w-4 h-4" />
                  Shuffle
                </button>
              </div>
              <div className="flex flex-wrap gap-3 p-6 bg-slate-50 rounded-2xl border border-slate-200 min-h-[100px] items-center justify-center">
                {availableFragments.map((frag, idx) => (
                  <motion.button
                    key={`${frag}-${idx}`}
                    layout
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleFragmentClick(frag, idx)}
                    disabled={status !== 'idle'}
                    className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl font-medium text-slate-700 shadow-sm hover:border-blue-400 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {frag}
                  </motion.button>
                ))}
                {availableFragments.length === 0 && selectedFragments.length > 0 && status === 'idle' && (
                  <p className="text-slate-400 text-sm italic">All fragments used. Ready to submit?</p>
                )}
              </div>
            </section>

            {/* Explanation & Feedback */}
            <AnimatePresence>
              {status !== 'idle' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className={`p-6 rounded-2xl border ${status === 'correct' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <div className="flex items-center gap-3 mb-4">
                      {status === 'correct' ? (
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-600" />
                      )}
                      <h3 className={`text-lg font-bold ${status === 'correct' ? 'text-green-800' : 'text-red-800'}`}>
                        {status === 'correct' ? 'Excellent! Correct Answer' : 'Not quite right'}
                      </h3>
                    </div>
                    
                    {status === 'incorrect' && (
                      <div className="space-y-4">
                        <div className="bg-white/50 p-4 rounded-xl border border-red-100">
                          <p className="text-sm font-bold text-red-900 uppercase tracking-wider mb-1">Correct Answer:</p>
                          <p className="text-lg text-slate-800 font-medium">{currentQuestion.answer}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Explanation:</p>
                          <p className="text-slate-700 leading-relaxed">{currentQuestion.explanation}</p>
                        </div>
                      </div>
                    )}
                    
                    {status === 'correct' && (
                      <p className="text-green-700">You've mastered this sentence structure!</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions */}
            <div className="flex justify-center pt-4">
              {status === 'idle' ? (
                <button
                  onClick={handleSubmit}
                  disabled={selectedFragments.length === 0}
                  className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:bg-slate-300 disabled:shadow-none transition-all active:scale-95 flex items-center gap-2"
                >
                  Submit Answer
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-10 py-4 bg-slate-800 text-white rounded-2xl font-bold text-lg shadow-lg shadow-slate-200 hover:bg-slate-900 transition-all active:scale-95 flex items-center gap-2 group"
                >
                  {currentIndex < QUESTIONS.length - 1 ? 'Next Question' : 'Restart Practice'}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="max-w-4xl mx-auto px-6 py-12 border-t border-slate-200 text-center">
        <p className="text-slate-400 text-sm">
          TOEFL Practice System • Professional Edition
        </p>
      </footer>
    </div>
  );
}
