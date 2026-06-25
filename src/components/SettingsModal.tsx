import React, { useState, useEffect } from 'react';
import type { Settings, Provider } from '../types';
import { modelsByProvider } from '../utils/ai';
import { X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  onSettingsChange: (newSettings: Settings) => void;
}

export const SettingsModal: React.FC<Props> = ({ isOpen, onClose, settings, onSettingsChange }) => {
  const [localSettings, setLocalSettings] = useState<Settings>(settings);

  useEffect(() => {
    if (isOpen) {
      setLocalSettings(settings);
    }
  }, [isOpen, settings]);

  if (!isOpen) return null;

  const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provider = e.target.value as Provider;
    setLocalSettings({
      ...localSettings,
      provider,
      model: modelsByProvider[provider][0]
    });
  };

  const handleApiKeyChange = (provider: Provider, value: string) => {
    setLocalSettings({
      ...localSettings,
      apiKeys: {
        ...localSettings.apiKeys,
        [provider]: value
      }
    });
  };

  const handleSave = () => {
    onSettingsChange(localSettings);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel modal-content">
        <div className="flex-row justify-between items-center mb-4">
          <h2>Settings</h2>
          <button className="btn-icon" onClick={onClose}><X size={24} /></button>
        </div>

        <div className="flex-col">
          <div>
            <label>Evaluator Provider</label>
            <select value={localSettings.provider} onChange={handleProviderChange}>
              <option value="openai">OpenAI</option>
              <option value="anthropic">Anthropic</option>
              <option value="gemini">Google (Gemini)</option>
            </select>
          </div>

          <div>
            <label>Model</label>
            <select 
              value={localSettings.model} 
              onChange={e => setLocalSettings({ ...localSettings, model: e.target.value })}
            >
              {modelsByProvider[localSettings.provider].map((m: string) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div>
            <h3>API Keys</h3>
            <p className="text-sm text-secondary mb-4">
              Keys are stored locally in your browser and never sent anywhere except directly to the provider.
            </p>
            
            <div className="flex-col">
              <div>
                <label>OpenAI API Key</label>
                <input 
                  type="password" 
                  value={localSettings.apiKeys.openai} 
                  onChange={e => handleApiKeyChange('openai', e.target.value)}
                  placeholder="sk-..."
                />
              </div>
              <div>
                <label>Anthropic API Key</label>
                <input 
                  type="password" 
                  value={localSettings.apiKeys.anthropic} 
                  onChange={e => handleApiKeyChange('anthropic', e.target.value)}
                  placeholder="sk-ant-..."
                />
              </div>
              <div>
                <label>Gemini API Key</label>
                <input 
                  type="password" 
                  value={localSettings.apiKeys.gemini} 
                  onChange={e => handleApiKeyChange('gemini', e.target.value)}
                  placeholder="AIza..."
                />
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label>System Prompt Template</label>
            <p className="text-sm text-secondary mb-2">Edit this to change how the evaluator agent behaves.</p>
            <textarea 
              value={localSettings.systemPrompt}
              onChange={e => setLocalSettings({ ...localSettings, systemPrompt: e.target.value })}
              style={{ minHeight: '300px' }}
            />
          </div>

          <div className="flex-row justify-end mt-6" style={{ gap: '1rem' }}>
            <button className="btn" style={{ background: 'var(--surface-color)', color: 'var(--text-color)' }} onClick={onClose}>Cancel</button>
            <button className="btn" onClick={handleSave}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
};
