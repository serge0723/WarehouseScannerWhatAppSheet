
import React, { useState } from 'react';
import { AppSettings } from '../types.ts';
import { testWebhookConnection, WEBHOOK_URL } from '../utils.ts';
import { User, Phone, Save, Info, CheckCircle2, CloudSync, Loader2, AlertCircle, Link2, ExternalLink } from 'lucide-react';

interface SettingsProps {
  settings: AppSettings;
  onSave: (settings: AppSettings) => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onSave }) => {
  const [formData, setFormData] = useState<AppSettings>({ ...settings });
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'SUCCESS' | 'ERROR' | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    const success = await testWebhookConnection(formData);
    setTesting(false);
    setTestResult(success ? 'SUCCESS' : 'ERROR');
    setTimeout(() => setTestResult(null), 3000);
  };

  return (
    <div className="p-4 space-y-6 pb-24 overflow-y-auto h-full bg-slate-950">
      <div className="pt-4">
        <h1 className="text-3xl font-black text-white tracking-tighter uppercase mb-2">Configure</h1>
        <p className="text-slate-500 text-sm">System setup and alert targets.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <User size={14} />
              Worker Name
            </label>
            <input
              type="text"
              required
              value={formData.workerName}
              onChange={(e) => setFormData({ ...formData, workerName: e.target.value })}
              placeholder="e.g. John Miller"
              className="w-full bg-slate-950 border-2 border-slate-800 rounded-xl py-4 px-4 text-white text-lg focus:border-blue-500 outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Phone size={14} />
              Manager WhatsApp
            </label>
            <input
              type="tel"
              required
              value={formData.managerPhone}
              onChange={(e) => setFormData({ ...formData, managerPhone: e.target.value })}
              placeholder="e.g. 15551234567"
              className="w-full bg-slate-950 border-2 border-slate-800 rounded-xl py-4 px-4 text-white text-lg focus:border-blue-500 outline-none"
            />
            <p className="text-[10px] text-slate-500 font-medium px-1">
              * Include country code, no "+" or spaces.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <button
            type="submit"
            disabled={saved}
            className={`w-full h-16 rounded-xl flex items-center justify-center gap-3 text-lg font-black transition-all ${
              saved 
                ? 'bg-green-600 text-white' 
                : 'bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white shadow-xl shadow-blue-900/20'
            }`}
          >
            {saved ? (
              <>
                <CheckCircle2 size={24} />
                SAVED SUCCESS
              </>
            ) : (
              <>
                <Save size={24} />
                SAVE CONFIGURATION
              </>
            )}
          </button>

          {/* Webhook Connection Test Section */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                <Link2 size={12} />
                Target Endpoint
              </div>
              <a 
                href={WEBHOOK_URL} 
                target="_blank" 
                rel="noreferrer"
                className="text-blue-500 hover:text-blue-400 flex items-center gap-1 text-[10px] font-bold uppercase"
              >
                Open in Browser
                <ExternalLink size={10} />
              </a>
            </div>
            <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg break-all">
              <code className="text-[10px] text-blue-400 font-mono leading-relaxed block">
                {WEBHOOK_URL}
              </code>
            </div>
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testing}
              className={`w-full h-12 rounded-lg border-2 flex items-center justify-center gap-3 font-bold transition-all ${
                testResult === 'SUCCESS' 
                  ? 'border-green-500 text-green-500 bg-green-500/10'
                  : testResult === 'ERROR'
                  ? 'border-red-500 text-red-500 bg-red-500/10'
                  : 'border-slate-800 text-slate-400 hover:bg-slate-900'
              }`}
            >
              {testing ? (
                <Loader2 size={18} className="animate-spin" />
              ) : testResult === 'SUCCESS' ? (
                <CheckCircle2 size={18} />
              ) : testResult === 'ERROR' ? (
                <AlertCircle size={18} />
              ) : (
                <CloudSync size={18} />
              )}
              {testing ? 'SENDING...' : testResult === 'SUCCESS' ? 'SUCCESS' : testResult === 'ERROR' ? 'FAILED' : 'TEST WEBHOOK'}
            </button>
            <p className="text-[9px] text-slate-600 text-center italic">
              Note: Direct browser access (GET) might show an error. Use this button for POST testing.
            </p>
          </div>
        </div>
      </form>

      {/* Help Card */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex gap-4">
        <Info className="text-slate-500 shrink-0" size={24} />
        <div>
          <h4 className="text-sm font-bold text-slate-300 mb-1">Sheet Integration</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Data is sent to your Google Sheet via a POST request. Ensure your script is 
            deployed as a Web App with access set to "Anyone".
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
