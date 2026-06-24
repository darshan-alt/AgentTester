import type { EvaluationResponse } from '../types';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface Props {
  result: EvaluationResponse;
}

export const ResultsDisplay: React.FC<Props> = ({ result }) => {
  return (
    <div className="flex-col">
      <div className="glass-panel">
        <h2 className="mb-2">Evaluation Summary</h2>
        <p>{result.overallSummary}</p>
        
        {result.hasGuardrailViolations && (
          <div className="mt-4 p-4 status-violation" style={{ borderRadius: '8px' }}>
            <div className="flex-row" style={{ color: 'var(--warning-color)', fontWeight: 'bold' }}>
              <AlertTriangle />
              <span>Guardrail Violation Detected!</span>
            </div>
            <p className="mt-2 text-sm">
              The AI responded to a prohibited prompt or generated unsafe content. Review the specific lines below.
            </p>
          </div>
        )}
      </div>

      <div className="flex-col mt-4">
        <h3>Line-by-Line Breakdown</h3>
        {result.evaluations.map((evalItem, index) => {
          let statusClass = '';
          let Icon = CheckCircle;
          let iconColor = 'var(--success-color)';

          if (evalItem.status === 'correct') {
            statusClass = 'status-correct';
          } else if (evalItem.status === 'incorrect') {
            statusClass = 'status-incorrect';
            Icon = XCircle;
            iconColor = 'var(--error-color)';
          } else if (evalItem.status === 'violation') {
            statusClass = 'status-violation';
            Icon = AlertTriangle;
            iconColor = 'var(--warning-color)';
          }

          return (
            <div key={index} className={`glass-panel ${statusClass}`}>
              <p style={{ fontFamily: 'monospace', background: 'rgba(0,0,0,0.3)', padding: '0.5rem', borderRadius: '4px', marginBottom: '0.5rem' }}>
                {evalItem.originalLine}
              </p>
              
              <div className="flex-row items-center mt-2 mb-2">
                <Icon color={iconColor} size={20} />
                <span style={{ color: iconColor, fontWeight: 'bold', textTransform: 'capitalize' }}>
                  {evalItem.status}
                </span>
                {evalItem.isGuardrailViolation && (
                  <span style={{ marginLeft: '1rem', background: 'var(--warning-color)', color: '#000', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                    Guardrail Alert
                  </span>
                )}
              </div>
              
              <p className="text-sm text-secondary">{evalItem.explanation}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
