import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeft, 
  Clock, 
  HelpCircle, 
  CheckCircle, 
  XCircle, 
  Play, 
  Sparkles,
  RefreshCw,
  AlertTriangle,
  Send,
  HelpCircle as HintIcon,
  BookOpen
} from 'lucide-react';
import { Question, CommandQuestion, FillBlankQuestion } from '../types';

export const PlayChallenge: React.FC = () => {
  const { challenges, selectedChallengeId, finishChallenge, changeView, soundEffect, settings } = useApp();

  const challenge = challenges.find(c => c.id === selectedChallengeId);

  // States
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [seconds, setSeconds] = useState(0);
  
  // Answers states
  const [commandInputValue, setCommandInputValue] = useState(''); // Mode A
  const [blankInputValue, setBlankInputValue] = useState('');     // Mode B
  
  // Evaluation states
  const [hasChecked, setHasChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [mistakesCount, setMistakesCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  
  // Help hint states
  const [showHint, setShowHint] = useState(false);
  
  // Modals
  const [showExitModal, setShowExitModal] = useState(false);

  // References
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  if (!challenge) return null;

  const currentQuestion: Question = challenge.questions[currentQuestionIndex];

  // Timer Setup
  useEffect(() => {
    // Reset timer and question on load
    setSeconds(0);
    setCurrentQuestionIndex(0);
    setCommandInputValue('');
    setBlankInputValue('');
    setHasChecked(false);
    setIsCorrect(false);
    setMistakesCount(0);
    setCorrectCount(0);
    setShowHint(false);

    timerRef.current = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [selectedChallengeId]);

  // Clean timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Format timer
  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // String Normalization Helper for Answer Checking
  const normalizeCommand = (cmd: string) => {
    return cmd
      .toLowerCase()
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim();
  };

  const checkAnswer = () => {
    if (hasChecked && isCorrect) return;

    soundEffect('click');

    let answerIsRight = false;

    if (currentQuestion.type === 'command') {
      const cq = currentQuestion as CommandQuestion;
      // Split user inputs by newlines, filter empty lines
      const userLines = commandInputValue
        .split('\n')
        .map(l => normalizeCommand(l))
        .filter(l => l.length > 0);

      const correctLines = cq.correctAnswer.map(l => normalizeCommand(l));

      // Must have the exact same length and same commands in order
      if (userLines.length === correctLines.length) {
        answerIsRight = userLines.every((line, idx) => line === correctLines[idx]);
      } else {
        answerIsRight = false;
      }
    } else {
      const fq = currentQuestion as FillBlankQuestion;
      answerIsRight = normalizeCommand(blankInputValue) === normalizeCommand(fq.answer);
    }

    setHasChecked(true);
    setIsCorrect(answerIsRight);

    if (answerIsRight) {
      soundEffect('success');
      setCorrectCount(prev => prev + 1);
    } else {
      soundEffect('error');
      setMistakesCount(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    soundEffect('click');
    setHasChecked(false);
    setIsCorrect(false);
    setShowHint(false);
    setCommandInputValue('');
    setBlankInputValue('');

    if (currentQuestionIndex + 1 < challenge.questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Finished all questions! Complete the lab
      if (timerRef.current) clearInterval(timerRef.current);
      
      // Calculate accuracy
      const totalQuestions = challenge.questions.length;
      const finalAccuracy = Math.round((correctCount / (correctCount + mistakesCount || 1)) * 100);
      
      // Calculate score based on difficulty and speed multiplier
      let difficultyMultiplier = 1;
      if (challenge.difficulty === 'Medium') difficultyMultiplier = 1.5;
      if (challenge.difficulty === 'Hard') difficultyMultiplier = 2.2;
      if (challenge.difficulty === 'Expert') difficultyMultiplier = 3.5;

      const baseScore = challenge.questions.length * 100;
      const speedBonus = Math.max(10, 300 - seconds); // bonus points for finishing quickly
      const finalScore = Math.round((baseScore + speedBonus) * (finalAccuracy / 100) * difficultyMultiplier);

      finishChallenge(finalScore, finalAccuracy, seconds, correctCount, mistakesCount);
    }
  };

  const handleSkipQuestion = () => {
    soundEffect('click');
    setHasChecked(false);
    setIsCorrect(false);
    setShowHint(false);
    setCommandInputValue('');
    setBlankInputValue('');
    setMistakesCount(prev => prev + 1);

    if (currentQuestionIndex + 1 < challenge.questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Complete lab
      if (timerRef.current) clearInterval(timerRef.current);
      const totalQuestions = challenge.questions.length;
      const finalAccuracy = Math.round((correctCount / (correctCount + mistakesCount + 1 || 1)) * 100);
      const finalScore = Math.round(correctCount * 50);
      finishChallenge(finalScore, finalAccuracy, seconds, correctCount, mistakesCount + 1);
    }
  };

  const handleExitChallenge = () => {
    soundEffect('click');
    setShowExitModal(true);
  };

  const confirmExit = () => {
    soundEffect('click');
    if (timerRef.current) clearInterval(timerRef.current);
    changeView('browse');
  };

  // Helper to split commands with highlighted keyword tokens
  const renderHighlightedCommand = (line: string) => {
    const keywords = [
      'interface', 'ip', 'address', 'no', 'shutdown', 'router', 'ospf', 
      'bgp', 'neighbor', 'remote-as', 'vlan', 'name', 'switchport', 
      'access', 'mode', 'exit', 'configure', 'terminal', 'banner', 'motd'
    ];
    
    const parts = line.split(/(\s+)/);
    return parts.map((part, idx) => {
      const trimmed = part.trim().toLowerCase();
      if (keywords.includes(trimmed)) {
        return <span key={idx} className="text-cyan-400 font-bold">{part}</span>;
      }
      // Check if it's an IP Address or subnet mask
      const isIp = /^[0-9./]{3,18}$/.test(trimmed);
      if (isIp) {
        return <span key={idx} className="text-amber-400">{part}</span>;
      }
      // Numbers
      if (!isNaN(Number(trimmed)) && trimmed !== '') {
        return <span key={idx} className="text-purple-400">{part}</span>;
      }
      return <span key={idx}>{part}</span>;
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 relative font-sans" id="play-challenge-root">
      
      {/* Top action bar */}
      <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <button
          onClick={handleExitChallenge}
          className="flex items-center gap-2 text-slate-400 hover:text-red-400 text-sm font-semibold transition-colors cursor-pointer"
          id="play-exit-btn"
        >
          <ArrowLeft size={16} />
          <span>Exit Lab</span>
        </button>

        {/* Challenge details */}
        <div className="hidden md:block text-center">
          <h3 className="font-bold text-white text-sm truncate max-w-xs">{challenge.title}</h3>
          <p className="text-[10px] text-slate-400">Section {currentQuestionIndex + 1} of {challenge.questions.length}</p>
        </div>

        {/* Timer ticking display */}
        <div className="flex items-center gap-2 bg-slate-950 px-3.5 py-1.5 rounded-lg border border-slate-800 shrink-0 text-slate-300 font-mono text-sm font-bold">
          <Clock size={15} className="text-blue-400 animate-pulse-slow" />
          <span>{formatTime(seconds)}</span>
        </div>
      </div>

      {/* Progress status indicators bar */}
      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden flex">
        {challenge.questions.map((_, idx) => (
          <div 
            key={idx}
            className={`
              h-full flex-1 border-r border-slate-950 last:border-0 transition-all duration-300
              ${idx === currentQuestionIndex ? 'bg-blue-500' : ''}
              ${idx < currentQuestionIndex ? 'bg-emerald-500' : ''}
              ${idx > currentQuestionIndex ? 'bg-slate-700' : ''}
            `}
          />
        ))}
      </div>

      {/* Primary challenge simulation panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col">
        
        {/* Header Question Description */}
        <div className="p-6 border-b border-slate-800/80 bg-slate-900/50 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] bg-slate-800 text-slate-400 border border-slate-700/80 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
              {currentQuestion.type === 'command' ? 'Dual-command CLI Configuration' : 'CLI Fill-in-the-blank'}
            </span>
            <span className="text-xs text-slate-400 font-medium">Question {currentQuestionIndex + 1} of {challenge.questions.length}</span>
          </div>
          <h3 className="text-base font-bold text-white leading-relaxed">{currentQuestion.question}</h3>
        </div>

        {/* Input Interactive Arena */}
        <div className="p-6 flex-1 min-h-[260px] flex flex-col bg-slate-950">
          
          {currentQuestion.type === 'command' ? (
            /* MODE A: CLI Terminal command typing style */
            <div className="flex-1 flex flex-col font-mono text-xs text-slate-300 space-y-2 select-none">
              <div className="text-[10px] text-slate-500 uppercase font-bold flex items-center justify-between pb-1 border-b border-slate-900">
                <span>IOS Interactive Terminal Simulator v4.1</span>
                <span>Type exact configuration command lines</span>
              </div>

              {/* Terminal Editor Wrapper */}
              <div className="flex-1 min-h-[160px] bg-[#070b13] border border-slate-800/80 rounded-lg p-4 flex gap-4 overflow-y-auto">
                
                {/* Line Numbers column */}
                <div className="text-slate-600 text-right select-none space-y-1">
                  {commandInputValue.split('\n').map((_, idx) => (
                    <div key={idx} className="h-5">{idx + 1}</div>
                  ))}
                  {/* Cursor placeholder line */}
                  <div className="h-5 text-blue-500/50">+</div>
                </div>

                {/* Input Textarea overlaying terminal lines */}
                <div className="flex-1 relative">
                  {/* Backdrop highlights for active keywords */}
                  <div className="absolute inset-0 pointer-events-none whitespace-pre space-y-1 leading-5 text-transparent overflow-hidden">
                    {commandInputValue.split('\n').map((line, idx) => (
                      <div key={idx} className="h-5 select-none">
                        <span className="text-slate-600 mr-2">{currentQuestion.promptPrefix || 'Router(config)#'}</span>
                        {renderHighlightedCommand(line)}
                      </div>
                    ))}
                  </div>

                  {/* Real transparent Textarea accepting input */}
                  <textarea
                    value={commandInputValue}
                    onChange={(e) => {
                      if (!hasChecked) {
                        setCommandInputValue(e.target.value);
                      }
                    }}
                    disabled={hasChecked && isCorrect}
                    placeholder={`e.g.\ninterface GigabitEthernet0/0\nip address 10.1.1.1 255.255.255.0\nno shutdown`}
                    className="absolute inset-0 bg-transparent text-white focus:outline-none resize-none leading-5 font-mono text-xs w-full h-full pl-[135px] caret-blue-500 placeholder-slate-700 select-text"
                    spellCheck="false"
                    id="cli-textarea"
                  />
                </div>
              </div>

              <div className="text-[10px] text-slate-500 leading-normal">
                💡 <span className="font-bold">IOS Tip:</span> Spacing must be correct. Make sure to press enter between commands. Command parameters must match exactly.
              </div>
            </div>
          ) : (
            /* MODE B: Fill-in-the-blank style */
            <div className="flex-1 flex flex-col justify-center items-center space-y-6 py-6 font-mono">
              <div className="text-xs text-slate-400 text-center max-w-md font-sans">
                Fill the missing CLI section highlighted by the underscores to complete the configuration command.
              </div>

              {/* Console command box */}
              <div className="w-full max-w-lg bg-slate-900 border border-slate-800 p-6 rounded-xl flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-[10px] text-slate-500 font-bold uppercase">
                  <span>IOS CLI Blank Editor</span>
                  <span>Fill input below</span>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-sm text-white">
                  <span>{currentQuestion.promptPrefix?.replace('______', '') || 'Router(config)# '}</span>
                  <input
                    type="text"
                    value={blankInputValue}
                    onChange={(e) => {
                      if (!hasChecked) {
                        setBlankInputValue(e.target.value);
                      }
                    }}
                    disabled={hasChecked && isCorrect}
                    placeholder="Enter missing commands here"
                    className="px-3 py-1.5 bg-slate-950 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg text-white font-mono text-sm placeholder-slate-700 flex-1 min-w-[200px]"
                    id="blank-input"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') checkAnswer();
                    }}
                  />
                </div>
              </div>
            </div>
          )}

        </div>

        {/* FEEDBACK STATUS OVERLAY (Correct / Incorrect) */}
        {hasChecked && (
          <div className={`p-6 border-t leading-relaxed transition-all
            ${isCorrect 
              ? 'bg-green-500/10 border-green-500/20 text-green-300' 
              : 'bg-red-500/10 border-red-500/20 text-red-300'
            }
          `} id="play-feedback-banner">
            <div className="flex items-start gap-3">
              {isCorrect ? (
                <CheckCircle className="text-green-500 shrink-0 mt-0.5 animate-bounce" size={20} />
              ) : (
                <XCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
              )}
              <div className="space-y-1.5 flex-1">
                <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                  {isCorrect ? 'Command Accepted (Success!)' : 'Command Syntax Refused (Mistake!)'}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">{currentQuestion.explanation}</p>
                
                {/* Incorrect state help helper */}
                {!isCorrect && (
                  <div className="pt-2 flex items-center gap-3">
                    <button
                      onClick={() => setShowHint(!showHint)}
                      className="text-[11px] font-semibold text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 cursor-pointer font-sans"
                    >
                      <HintIcon size={12} />
                      <span>{showHint ? 'Hide correct answer help' : 'Need help? Reveal solution'}</span>
                    </button>
                  </div>
                )}

                {showHint && (
                  <div className="mt-2 p-3 bg-slate-950 border border-red-500/20 rounded-lg text-slate-200 text-xs font-mono select-text">
                    <span className="font-sans font-bold text-slate-500 block text-[10px] uppercase mb-1">Expected CLI Command(s):</span>
                    {currentQuestion.type === 'command' ? (
                      (currentQuestion as CommandQuestion).correctAnswer.map((line, index) => (
                        <div key={index} className="text-green-400 font-bold">{line}</div>
                      ))
                    ) : (
                      <div className="text-green-400 font-bold">{(currentQuestion as FillBlankQuestion).answer}</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer controls */}
        <div className="p-6 bg-slate-900 border-t border-slate-800/80 flex items-center justify-between gap-4">
          
          <div className="flex gap-2">
            {/* Show Hint if available */}
            {currentQuestion.explanation && !hasChecked && (
              <button
                onClick={() => setShowHint(!showHint)}
                className="px-3 py-2 bg-slate-950 border border-slate-800 text-slate-400 rounded-lg text-xs font-semibold hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                id="hint-toggle-btn"
              >
                <HelpCircle size={14} />
                <span>{showHint ? 'Hide Help' : 'Show Hint'}</span>
              </button>
            )}

            {showHint && !hasChecked && (
              <div className="hidden sm:block text-[11px] text-slate-400 max-w-xs truncate py-2 font-medium">
                Hint: Check routing process or commands sequence.
              </div>
            )}
          </div>

          <div className="flex gap-3">
            {/* Skip Option */}
            {!isCorrect && (
              <button
                onClick={handleSkipQuestion}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                id="skip-question-btn"
              >
                Skip Question
              </button>
            )}

            {/* Check/Next button */}
            {!hasChecked ? (
              <button
                onClick={checkAnswer}
                disabled={currentQuestion.type === 'command' ? !commandInputValue.trim() : !blankInputValue.trim()}
                className={`
                  px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 font-bold text-xs text-white transition-all flex items-center gap-1.5
                  ${(currentQuestion.type === 'command' ? !commandInputValue.trim() : !blankInputValue.trim()) ? 'opacity-40 cursor-not-allowed hover:bg-blue-600' : 'hover:-translate-y-0.5'}
                `}
                id="check-answer-btn"
              >
                <Send size={13} />
                <span>Check Command</span>
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 font-bold text-xs text-white transition-all flex items-center gap-1.5 hover:-translate-y-0.5"
                id="next-question-btn"
              >
                <span>{currentQuestionIndex + 1 < challenge.questions.length ? 'Next Question' : 'Complete Challenge'}</span>
                <Play size={10} fill="currentColor" />
              </button>
            )}
          </div>

        </div>

      </div>

      {/* WARNING POPUP: Exit Confirmation Modal */}
      {showExitModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" id="exit-modal">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <AlertTriangle size={24} />
              </div>
              <h3 className="font-bold text-white text-lg">Abandon Lab?</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to exit the current configuration training? Your active score and timer stats for this lab will be lost.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={confirmExit}
                className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-xs font-bold text-white transition-colors"
                id="confirm-exit-btn"
              >
                Exit and Discard
              </button>
              <button
                onClick={() => {
                  soundEffect('click');
                  setShowExitModal(false);
                }}
                className="flex-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
              >
                Keep Solving
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
