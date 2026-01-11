
import React, { useState } from 'react';
import { Product, AppSettings, StockStatus } from '../types';
import { getStockStatus, getStatusColor, getStatusBg, generateWhatsAppLink } from '../utils';
import { MapPin, Barcode, Calendar, MessageSquare, ArrowLeft, RefreshCcw, Plus, Minus, CheckCircle2 } from 'lucide-react';

interface ProductDetailProps {
  product: Product;
  settings: AppSettings;
  onBack: () => void;
  onRescan: () => void;
  onSync: (product: Product) => Promise<void>;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product: initialProduct, settings, onBack, onRescan }) => {
  const [product, setProduct] = useState<Product>({ ...initialProduct });

  const adjustStock = (amount: number) => {
    setProduct(prev => ({
      ...prev,
      stock: Math.max(0, prev.stock + amount)
    }));
  };

  const status = getStockStatus(product.stock);
  const showAlert = status === StockStatus.LOW || status === StockStatus.MONITOR;
  
  return (
    <div className="flex flex-col h-full bg-slate-950 p-4 pb-24 overflow-y-auto">
      {/* Top Actions */}
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white py-2"
        >
          <ArrowLeft size={20} />
          <span>Dashboard</span>
        </button>
        <button 
          onClick={onRescan}
          className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors border border-slate-700"
        >
          <RefreshCcw size={18} />
          <span>Rescan</span>
        </button>
      </div>

      {/* Main Info Card */}
      <div className="bg-slate-900 border-2 border-slate-800 rounded-xl p-6 shadow-xl relative overflow-hidden">
        <div className={`absolute top-0 right-0 left-0 h-2 ${getStatusBg(status)}`} />
        
        {/* Sync Indicator (Shows scan sync was successful) */}
        <div className="flex justify-end mb-2">
          <div className="flex items-center gap-2 px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest border text-green-400 border-green-900/50 bg-green-900/20">
            <CheckCircle2 size={10} />
            SCAN SYNCED
          </div>
        </div>

        <div className="mt-2 space-y-4">
          <h1 className="text-3xl font-black text-white leading-tight uppercase">
            {product.name}
          </h1>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">SKU / BARCODE</span>
              <p className="text-lg font-mono text-blue-400 flex items-center gap-2">
                <Barcode size={18} />
                {product.sku}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">LOCATION</span>
              <p className="text-lg font-bold text-slate-200 flex items-center gap-2">
                <MapPin size={18} />
                {product.location}
              </p>
            </div>
          </div>

          <hr className="border-slate-800" />

          {/* Stock Display & Adjustment */}
          <div className="py-2 space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">STOCK COUNT</span>
                <div className="flex items-center gap-3 mt-1">
                  <span className={`text-6xl font-black ${getStatusColor(status)}`}>
                    {product.stock}
                  </span>
                  <span className="text-slate-500 text-xl font-bold">UNITS</span>
                </div>
              </div>
              <div className={`px-4 py-2 rounded-lg font-black text-xs uppercase tracking-tighter border-2 ${getStatusColor(status).replace('text', 'border')} ${getStatusColor(status)}`}>
                {status}
              </div>
            </div>

            {/* Adjustment Controls */}
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => adjustStock(-1)}
                className="bg-slate-800 hover:bg-slate-700 active:bg-slate-600 h-16 rounded-xl flex items-center justify-center gap-2 font-black text-white border border-slate-700 transition-all shadow-lg active:scale-95"
              >
                <Minus size={24} />
                DECREASE
              </button>
              <button 
                onClick={() => adjustStock(1)}
                className="bg-slate-800 hover:bg-slate-700 active:bg-slate-600 h-16 rounded-xl flex items-center justify-center gap-2 font-black text-white border border-slate-700 transition-all shadow-lg active:scale-95"
              >
                <Plus size={24} />
                INCREASE
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-500 text-sm italic">
            <Calendar size={14} />
            <span>Scan Timestamp: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      {/* Helper text */}
      <p className="mt-4 text-center text-slate-500 text-[10px] font-bold uppercase tracking-widest">
        Data posted to sheet on initial scan
      </p>

      {/* Alert Manager Section */}
      {showAlert && (
        <div className="mt-8 space-y-4">
          <div className="p-4 bg-red-950/30 border-2 border-red-900/50 rounded-xl">
            <h3 className="text-red-400 font-bold flex items-center gap-2 mb-2">
              <MessageSquare size={18} />
              LOW STOCK WARNING
            </h3>
            <p className="text-red-200 text-sm leading-relaxed">
              Count is at or below threshold ({product.threshold} units). 
              A WhatsApp report should be sent to the manager.
            </p>
          </div>
          
          <a 
            href={generateWhatsAppLink(product, settings)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-4 bg-green-600 hover:bg-green-500 active:bg-green-700 py-4 rounded-xl text-lg font-black text-white transition-transform active:scale-95 shadow-xl shadow-green-900/20"
          >
            <MessageSquare size={24} />
            REPORT VIA WHATSAPP
          </a>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
