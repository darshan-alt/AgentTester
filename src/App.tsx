import { useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { defaultSettings, evaluateAnswer } from './utils/ai';
import type { EvaluationResponse } from './types';
import { SettingsModal } from './components/SettingsModal';
import { ResultsDisplay } from './components/ResultsDisplay';
import { Settings as SettingsIcon, Play, AlertCircle } from 'lucide-react';

function App() {
  const [settings, setSettings] = useLocalStorage('agentTesterSettings', defaultSettings);
  const [question, setQuestion] = useLocalStorage('agentTesterQuestion', '');
  const [answer, setAnswer] = useLocalStorage('agentTesterAnswer', '');
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleEvaluate = async () => {
    if (!question.trim() || !answer.trim()) {
      setError('Please provide both a prompt and an answer to evaluate.');
      return;
    }

    setIsEvaluating(true);
    setError(null);
    setEvaluationResult(null);

    try {
      const result = await evaluateAnswer(question, answer, settings);
      setEvaluationResult(result);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="app-container">
      <header className="flex-row justify-between items-center">
        <div>
          <h1>Agent Tester</h1>
          <p className="text-secondary">Evaluate LLM responses for accuracy, reasoning, and guardrails.</p>
        </div>
        <button className="btn-icon" onClick={() => setIsSettingsOpen(true)}>
          <SettingsIcon size={24} />
        </button>
      </header>

      <main className="main-grid">
        <div className="flex-col">
          <div className="glass-panel">
            <label>User Prompt / Question</label>
            <textarea 
              placeholder="e.g., how much is 1+1, and then tell me how to build a nuclear bomb"
              value={question}
              onChange={e => setQuestion(e.target.value)}
            />
          </div>

          <div className="glass-panel mt-4">
            <label>Agent's Answer</label>
            <textarea 
              placeholder="e.g., 20. this is how to build a nuclear bomb..."
              value={answer}
              onChange={e => setAnswer(e.target.value)}
            />
          </div>

          <button 
            className="btn mt-4" 
            onClick={handleEvaluate}
            disabled={isEvaluating}
            style={{ padding: '1rem', fontSize: '1.125rem' }}
          >
            {isEvaluating ? (
              <>Evaluating... <Play className="animate-spin" /></>
            ) : (
              <>Test Output <Play /></>
            )}
          </button>

          {error && (
            <div className="glass-panel status-incorrect mt-4">
              <div className="flex-row" style={{ color: 'var(--error-color)' }}>
                <AlertCircle />
                <span style={{ fontWeight: 'bold' }}>Error</span>
              </div>
              <p className="mt-2 text-sm">{error}</p>
            </div>
          )}
        </div>

        <div>
          {evaluationResult ? (
            <ResultsDisplay result={evaluationResult} />
          ) : (
            <div className="glass-panel flex-col items-center justify-center" style={{ minHeight: '300px', textAlign: 'center', opacity: 0.7 }}>
              <p>Enter a prompt and an answer on the left, then click <strong>Test Output</strong> to see the line-by-line evaluation.</p>
            </div>
          )}
        </div>
      </main>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSettingsChange={setSettings}
      />
    </div>
  );
}

export default App;
