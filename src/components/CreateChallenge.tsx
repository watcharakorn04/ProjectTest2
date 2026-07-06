import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Plus, 
  Trash2, 
  Layers, 
  AlertCircle, 
  Sparkles, 
  Check, 
  ArrowLeft,
  ChevronRight,
  Eye,
  Settings as GearIcon,
  HelpCircle,
  PlusCircle
} from 'lucide-react';
import { Challenge, Question, Difficulty, QuestionType } from '../types';

export const CreateChallenge: React.FC = () => {
  const { createChallenge, changeView, settings } = useApp();

  // Challenge metadata states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Routing');
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
  const [estimatedTime, setEstimatedTime] = useState(10);
  const [xpReward, setXpReward] = useState(100);
  const [requiredKnowledge, setRequiredKnowledge] = useState('');

  // Questions builder states
  const [questions, setQuestions] = useState<any[]>([]);

  // Individual active question edit state (temporary holding area)
  const [qType, setQType] = useState<QuestionType>('command');
  const [qQuestion, setQQuestion] = useState('');
  const [qExplanation, setQExplanation] = useState('');
  const [qPromptPrefix, setQPromptPrefix] = useState('Router(config)#');
  
  // For Command Mode (Mode A)
  const [qCommandAnswer, setQCommandAnswer] = useState(''); // Comma separated or line-by-line
  
  // For Fill-in-the-blank Mode (Mode B)
  const [qBlankAnswer, setQBlankAnswer] = useState('');

  // Validation error
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!qQuestion.trim()) {
      setError('Question prompt description cannot be empty.');
      return;
    }

    if (!qExplanation.trim()) {
      setError('Please provide a short configuration explanation/hint.');
      return;
    }

    if (qType === 'command') {
      if (!qCommandAnswer.trim()) {
        setError('At least one correct configuration command is required.');
        return;
      }
      // Split by newline and remove empty lines
      const commandsArray = qCommandAnswer
        .split('\n')
        .map(c => c.trim())
        .filter(c => c.length > 0);

      if (commandsArray.length === 0) {
        setError('Please type valid commands (one command per line).');
        return;
      }

      const newQ = {
        type: 'command',
        question: qQuestion,
        explanation: qExplanation,
        promptPrefix: qPromptPrefix,
        correctAnswer: commandsArray
      };

      setQuestions(prev => [...prev, newQ]);
    } else {
      if (!qBlankAnswer.trim()) {
        setError('The blank answer string is required.');
        return;
      }

      const newQ = {
        type: 'fill_blank',
        question: qQuestion,
        explanation: qExplanation,
        promptPrefix: qPromptPrefix,
        answer: qBlankAnswer.trim()
      };

      setQuestions(prev => [...prev, newQ]);
    }

    // Reset single question state
    setQQuestion('');
    setQExplanation('');
    setQCommandAnswer('');
    setQBlankAnswer('');
    setError(null);
  };

  const handleRemoveQuestion = (idx: number) => {
    setQuestions(prev => prev.filter((_, i) => i !== idx));
  };

  const handlePublishChallenge = () => {
    setError(null);

    // Metadata validations:
    if (!title.trim()) {
      setError('Challenge title cannot be empty.');
      return;
    }

    if (!description.trim()) {
      setError('Challenge description cannot be empty.');
      return;
    }

    if (questions.length === 0) {
      setError('At least one challenge question must be built before publishing.');
      return;
    }

    const knowledgeArray = requiredKnowledge
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    // Map questions with distinct ids
    const mappedQuestions: Question[] = questions.map((q, idx) => {
      if (q.type === 'command') {
        return {
          ...q,
          id: `custom-${idx + 1}-${Date.now()}`
        } as Question;
      } else {
        return {
          ...q,
          id: `custom-${idx + 1}-${Date.now()}`
        } as Question;
      }
    });

    const challengeData = {
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
      difficulty,
      xpReward: Number(xpReward),
      estimatedTime: Number(estimatedTime),
      requiredKnowledge: knowledgeArray.length > 0 ? knowledgeArray : undefined,
      questions: mappedQuestions
    };

    createChallenge(challengeData);
    setIsSuccess(true);
    setTimeout(() => {
      changeView('dashboard');
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-12 font-sans" id="create-challenge-root">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <PlusCircle className="text-blue-500" size={24} />
            Develop Config Lab
          </h2>
          <p className="text-sm text-slate-400">Design custom command validation labs, choose configurations, and share them with the Arena.</p>
        </div>
        <button
          onClick={() => changeView('dashboard')}
          className="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold rounded-lg hover:text-white transition-colors cursor-pointer"
        >
          Cancel
        </button>
      </div>

      {isSuccess && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-center font-bold text-sm">
          🎉 Lab Published Successfully! Loading Arena Dashboard...
        </div>
      )}

      {/* Global Validation Display */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 font-medium leading-relaxed flex items-start gap-2">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column: Challenge Metadata Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-5">
            <h3 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2">
              <GearIcon size={16} className="text-blue-400" /> Lab Configuration
            </h3>

            {/* Title */}
            <div className="space-y-1.5">
              <label htmlFor="create-title" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Lab Title
              </label>
              <input 
                type="text"
                id="create-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. VLAN Routing Setup"
                className="block w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label htmlFor="create-desc" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Description
              </label>
              <textarea 
                id="create-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly describe the objective of this command practice challenge..."
                className="block w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[90px] text-xs"
              />
            </div>

            {/* Difficulty */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Difficulty Level
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['Easy', 'Medium', 'Hard', 'Expert'] as Difficulty[]).map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => {
                      setDifficulty(diff);
                      // Auto scale rewards
                      if (diff === 'Easy') { setXpReward(50); setEstimatedTime(5); }
                      if (diff === 'Medium') { setXpReward(100); setEstimatedTime(8); }
                      if (diff === 'Hard') { setXpReward(200); setEstimatedTime(12); }
                      if (diff === 'Expert') { setXpReward(400); setEstimatedTime(15); }
                    }}
                    className={`
                      py-2 rounded-md text-xs font-bold transition-all cursor-pointer
                      ${difficulty === diff 
                        ? 'bg-blue-600 text-white shadow-lg' 
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }
                    `}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags / Category */}
            <div className="space-y-1.5">
              <label htmlFor="create-category" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Category tag
              </label>
              <select
                id="create-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="block w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-xs font-semibold"
              >
                <option value="Routing">Routing Protocols</option>
                <option value="Switching">Switching Technologies</option>
                <option value="Security">Access Lists & Firewalls</option>
                <option value="IP Services">NAT & DHCP Services</option>
                <option value="WAN">BGP & Wide Area Services</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Est. Time */}
              <div className="space-y-1.5">
                <label htmlFor="create-time" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Est. Minutes
                </label>
                <input 
                  type="number"
                  id="create-time"
                  value={estimatedTime}
                  onChange={(e) => setEstimatedTime(Number(e.target.value))}
                  min={1}
                  max={60}
                  className="block w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none"
                />
              </div>

              {/* XP Reward */}
              <div className="space-y-1.5">
                <label htmlFor="create-xp" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  XP Reward
                </label>
                <input 
                  type="number"
                  id="create-xp"
                  value={xpReward}
                  onChange={(e) => setXpReward(Number(e.target.value))}
                  min={10}
                  max={500}
                  className="block w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none"
                />
              </div>
            </div>

            {/* Required Knowledge bullet points */}
            <div className="space-y-1.5">
              <label htmlFor="create-knowledge" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Pre-requisites (One per line)
              </label>
              <textarea 
                id="create-knowledge"
                value={requiredKnowledge}
                onChange={(e) => setRequiredKnowledge(e.target.value)}
                placeholder="e.g. Cisco interface subnet ranges&#10;Understanding 'no shutdown'"
                className="block w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-700 focus:outline-none min-h-[80px]"
              />
            </div>
          </div>
        </div>

        {/* Middle/Right columns: Question Builder */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section: Question Builder Editor Form */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
            <h3 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2">
              <Layers size={16} className="text-cyan-400" /> Question Builder
            </h3>

            <form onSubmit={handleAddQuestion} className="space-y-4">
              {/* Question Mode Type */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setQType('command')}
                  className={`
                    flex-1 py-2.5 rounded-lg text-xs font-bold transition-all border cursor-pointer
                    ${qType === 'command' 
                      ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' 
                      : 'bg-slate-950 text-slate-500 border-slate-800 hover:text-white'
                    }
                  `}
                >
                  Mode A: Multi-line CLI command configuration sequence
                </button>
                <button
                  type="button"
                  onClick={() => setQType('fill_blank')}
                  className={`
                    flex-1 py-2.5 rounded-lg text-xs font-bold transition-all border cursor-pointer
                    ${qType === 'fill_blank' 
                      ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' 
                      : 'bg-slate-950 text-slate-500 border-slate-800 hover:text-white'
                    }
                  `}
                >
                  Mode B: Inline Fill-in-the-blank command segment
                </button>
              </div>

              {/* Question Description text */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Question prompt / instruction
                </label>
                <input 
                  type="text"
                  value={qQuestion}
                  onChange={(e) => setQQuestion(e.target.value)}
                  placeholder={qType === 'command' 
                    ? "e.g. Enter interface FastEthernet0/1 and assign IP address 10.1.1.5 with standard Class C subnet mask" 
                    : "e.g. Complete the OSPF dynamic router process activation command"
                  }
                  className="block w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* IOS Prompt prefix */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Prompt Prefix
                  </label>
                  <input 
                    type="text"
                    value={qPromptPrefix}
                    onChange={(e) => setQPromptPrefix(e.target.value)}
                    placeholder="Router(config)#"
                    className="block w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Detailed Explanation & Help Tips
                  </label>
                  <input 
                    type="text"
                    value={qExplanation}
                    onChange={(e) => setQExplanation(e.target.value)}
                    placeholder="Explain the correct commands structure and keywords context..."
                    className="block w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-700"
                  />
                </div>
              </div>

              {/* Mode Specific answers inputs */}
              {qType === 'command' ? (
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Expected CLI Commands sequence (One command line per row)
                  </label>
                  <textarea 
                    value={qCommandAnswer}
                    onChange={(e) => setQCommandAnswer(e.target.value)}
                    placeholder={`e.g.\ninterface FastEthernet0/1\nip address 10.1.1.5 255.255.255.0\nno shutdown`}
                    rows={4}
                    className="block w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono placeholder-slate-700 focus:outline-none"
                  />
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Exact Blank Answer String segment
                  </label>
                  <input 
                    type="text"
                    value={qBlankAnswer}
                    onChange={(e) => setQBlankAnswer(e.target.value)}
                    placeholder="e.g. ospf 1"
                    className="block w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono placeholder-slate-700 focus:outline-none"
                  />
                </div>
              )}

              {/* Action row to push individual questions */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-white font-semibold text-xs flex items-center gap-1 cursor-pointer transition-all hover:translate-x-0.5"
                >
                  <Plus size={14} />
                  <span>Add Question to List</span>
                </button>
              </div>

            </form>
          </div>

          {/* Section: List of Added Questions & Publish controls */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h3 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Eye size={14} className="text-indigo-400" /> Added Questions ({questions.length})
              </h3>
              {questions.length > 0 && (
                <span className="text-[10px] text-slate-500 font-semibold uppercase">Review items below before publishing</span>
              )}
            </div>

            {questions.length === 0 ? (
              <div className="p-8 text-center rounded-xl border border-dashed border-slate-800 text-xs text-slate-500">
                No questions added to this challenge yet. Create one above to begin composing.
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[220px] overflow-y-auto">
                {questions.map((q, idx) => (
                  <div key={idx} className="p-3 bg-slate-950 border border-slate-850 rounded-xl flex items-start justify-between gap-3 text-xs text-slate-300">
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-slate-850 text-slate-400 px-2 py-0.5 rounded font-bold uppercase">
                          Q{idx + 1}: {q.type === 'command' ? 'Command Line Sequence' : 'Fill Blank'}
                        </span>
                        <span className="text-[10px] text-slate-500 truncate">Prompt: {q.promptPrefix}</span>
                      </div>
                      <h4 className="font-bold text-white truncate">{q.question}</h4>
                      <p className="text-[10px] text-slate-500 line-clamp-1">Explanation: {q.explanation}</p>
                    </div>

                    <button
                      onClick={() => handleRemoveQuestion(idx)}
                      className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors cursor-pointer shrink-0"
                      title="Remove question"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Bottom Actions Row to Publish */}
            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={handlePublishChallenge}
                disabled={questions.length === 0 || !title.trim() || !description.trim()}
                className={`
                  px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-blue-600/10
                  ${(questions.length === 0 || !title.trim() || !description.trim()) ? 'opacity-40 cursor-not-allowed hover:bg-blue-600' : 'hover:-translate-y-0.5'}
                `}
                id="publish-challenge-btn"
              >
                <Check size={14} />
                <span>Publish Challenge</span>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
