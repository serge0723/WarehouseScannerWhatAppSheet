
import React, { useState, useEffect, useCallback } from 'react';
import { AppView, Product, ScanRecord, AppSettings } from './types.ts';
import { SAMPLE_INVENTORY, STORAGE_KEYS } from './constants.ts';
import Dashboard from './components/Dashboard.tsx';
import Scanner from './components/Scanner.tsx';
import Settings from './components/Settings.tsx';
import ProductDetail from './components/ProductDetail.tsx';
import { syncToGoogleSheet } from './utils.ts';
import { LayoutGrid, Camera, Settings as SettingsIcon, CloudCheck } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('DASHBOARD');
  const [history, setHistory] = useState<ScanRecord[]>([]);
  const [settings, setSettings] = useState<AppSettings>({
    managerPhone: '',
    workerName: ''
  });
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [syncing, setSyncing] = useState(false);

  // Initialization
  useEffect(() => {
    const storedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    const storedHistory = localStorage.getItem(STORAGE_KEYS.HISTORY);

    if (storedSettings) setSettings(JSON.parse(storedSettings));
    if (storedHistory) setHistory(JSON.parse(storedHistory));
  }, []);

  const saveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(newSettings));
  };

  const handleScanSuccess = async (code: string) => {
    const product = SAMPLE_INVENTORY.find(p => p.barcode === code || p.sku === code);
    
    if (product) {
      // 1. Update active state
      setActiveProduct(product);
      
      // 2. Add to local history
      const newRecord: ScanRecord = {
        id: crypto.randomUUID(),
        productId: product.id,
        productName: product.name,
        sku: product.sku,
        timestamp: new Date().toISOString(),
        stockAtScan: product.stock
      };
      const updatedHistory = [newRecord, ...history].slice(0, 50);
      setHistory(updatedHistory);
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updatedHistory));

      // 3. TRIGGER IMMEDIATE SYNC (Scenario: Camera Scan / Manual Entry)
      setSyncing(true);
      const success = await syncToGoogleSheet(product, settings, 'MANUAL_UPDATE');
      
      // Navigate to detail
      setCurrentView('PRODUCT_DETAIL');
      
      // Manage notification visibility
      if (success) {
        setTimeout(() => setSyncing(false), 3000);
      } else {
        setSyncing(false);
      }
    } else {
      alert(`Product not found: ${code}`);
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'DASHBOARD':
        return <Dashboard history={history} onScanClick={() => setCurrentView('SCANNER')} />;
      case 'SCANNER':
        return <Scanner onScanSuccess={handleScanSuccess} onClose={() => setCurrentView('DASHBOARD')} />;
      case 'SETTINGS':
        return <Settings settings={settings} onSave={saveSettings} />;
      case 'PRODUCT_DETAIL':
        return activeProduct ? (
          <ProductDetail 
            product={activeProduct} 
            settings={settings}
            onBack={() => setCurrentView('DASHBOARD')}
            onRescan={() => setCurrentView('SCANNER')}
            onSync={() => Promise.resolve()} 
          />
        ) : <Dashboard history={history} onScanClick={() => setCurrentView('SCANNER')} />;
      default:
        return <Dashboard history={history} onScanClick={() => setCurrentView('SCANNER')} />;
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-slate-950 font-sans select-none overflow-hidden relative">
      {/* Global Sync Notification */}
      {syncing && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[60] bg-blue-600 text-white px-6 py-3 rounded-full text-xs font-black shadow-2xl flex items-center gap-2 animate-bounce border-2 border-blue-400">
          <CloudCheck size={18} />
          DATA SYNCED TO SHEET
        </div>
      )}

      {/* View Container */}
      <main className="flex-1 overflow-hidden">
        {renderView()}
      </main>

      {/* Navigation Bar (Sticky at bottom) */}
      {currentView !== 'SCANNER' && (
        <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-slate-900 border-t border-slate-800 flex items-center justify-around h-20 px-4 z-40">
          <button 
            onClick={() => setCurrentView('DASHBOARD')}
            className={`flex flex-col items-center gap-1 transition-colors ${currentView === 'DASHBOARD' ? 'text-blue-500' : 'text-slate-500'}`}
          >
            <LayoutGrid size={24} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Dash</span>
          </button>
          
          <button 
            onClick={() => setCurrentView('SCANNER')}
            className="flex flex-col items-center justify-center -translate-y-8 bg-blue-600 w-20 h-20 rounded-full border-8 border-slate-950 shadow-2xl active:scale-95 transition-all"
          >
            <Camera size={32} className="text-white" />
          </button>
          
          <button 
            onClick={() => setCurrentView('SETTINGS')}
            className={`flex flex-col items-center gap-1 transition-colors ${currentView === 'SETTINGS' ? 'text-blue-500' : 'text-slate-500'}`}
          >
            <SettingsIcon size={24} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Config</span>
          </button>
        </nav>
      )}
    </div>
  );
};

export default App;
