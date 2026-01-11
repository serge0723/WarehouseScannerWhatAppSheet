
import React, { useEffect, useRef, useState } from 'react';
import { Camera, X, AlertCircle, Keyboard } from 'lucide-react';

interface ScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onClose: () => void;
}

declare const Html5QrcodeScanner: any;

const Scanner: React.FC<ScannerProps> = ({ onScanSuccess, onClose }) => {
  const scannerRef = useRef<any>(null);
  const [manualInput, setManualInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize scanner
    const config = { 
      fps: 10, 
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0
    };
    
    scannerRef.current = new Html5QrcodeScanner("reader", config, false);
    
    scannerRef.current.render(
      (decodedText: string) => {
        scannerRef.current.clear().then(() => {
          onScanSuccess(decodedText);
        });
      },
      (error: any) => {
        // Suppress quiet mode errors to console
        // console.warn(error);
      }
    );

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch((err: any) => console.error("Failed to clear scanner", err));
      }
    };
  }, [onScanSuccess]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInput.trim()) {
      onScanSuccess(manualInput.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Camera size={24} className="text-blue-500" />
          SCANNER
        </h2>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-slate-800 rounded-full transition-colors"
        >
          <X size={28} />
        </button>
      </div>

      {/* Camera View Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div id="reader" className="w-full max-w-md bg-slate-900 rounded-lg overflow-hidden border-2 border-slate-700 shadow-2xl"></div>
        
        {/* Manual Input Backup */}
        <div className="mt-8 w-full max-w-md">
          <form onSubmit={handleManualSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Keyboard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
              <input
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                placeholder="Type Barcode Manually"
                className="w-full bg-slate-900 border-2 border-slate-700 rounded-lg py-4 pl-10 pr-4 text-lg focus:border-blue-500 outline-none uppercase"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 active:bg-blue-700 px-6 py-4 rounded-lg font-bold text-lg transition-colors shadow-lg"
            >
              GO
            </button>
          </form>
        </div>
      </div>

      {/* Safety Instructions */}
      <div className="p-6 bg-slate-900/50 border-t border-slate-800 text-center">
        <p className="text-slate-400 text-sm flex items-center justify-center gap-2">
          <AlertCircle size={14} />
          Hold camera steady. Center barcode in the frame.
        </p>
      </div>
    </div>
  );
};

export default Scanner;
