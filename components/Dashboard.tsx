
import React, { useState } from 'react';
import { ScanRecord, StockStatus } from '../types';
import { getStockStatus, getStatusBg } from '../utils';
import { BarChart3, Clock, Filter, AlertTriangle, CheckCircle, PackageSearch } from 'lucide-react';

interface DashboardProps {
  history: ScanRecord[];
  onScanClick: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ history, onScanClick }) => {
  const [filter, setFilter] = useState<'ALL' | 'LOW' | 'TODAY'>('ALL');

  // Stats
  const today = new Date().toDateString();
  const todayScans = history.filter(s => new Date(s.timestamp).toDateString() === today);
  const lowStockScans = history.filter(s => getStockStatus(s.stockAtScan) === StockStatus.LOW);
  const criticalCount = history.filter(s => s.stockAtScan < 10).length;

  const filteredHistory = history.filter(s => {
    if (filter === 'LOW') return getStockStatus(s.stockAtScan) === StockStatus.LOW;
    if (filter === 'TODAY') return new Date(s.timestamp).toDateString() === today;
    return true;
  }).slice(0, 20);

  return (
    <div className="p-4 space-y-6 pb-24 overflow-y-auto h-full">
      {/* App Branding */}
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-blue-600 p-2 rounded-lg">
          <PackageSearch className="text-white" size={24} />
        </div>
        <div>
          <h1 className="text-xl font-black text-white tracking-tighter">WHS PRO</h1>
          <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">Scanner Terminal v2.0</p>
        </div>
      </div>

      {/* Stats Widget */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex flex-col">
          <span className="text-slate-500 text-[10px] font-bold uppercase tracking-tight">Today</span>
          <span className="text-2xl font-black text-white">{todayScans.length}</span>
          <CheckCircle size={14} className="mt-1 text-blue-500" />
        </div>
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex flex-col">
          <span className="text-slate-500 text-[10px] font-bold uppercase tracking-tight">Low</span>
          <span className="text-2xl font-black text-yellow-500">{lowStockScans.length}</span>
          <AlertTriangle size={14} className="mt-1 text-yellow-500" />
        </div>
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex flex-col">
          <span className="text-slate-500 text-[10px] font-bold uppercase tracking-tight">Crit</span>
          <span className="text-2xl font-black text-red-500">{criticalCount}</span>
          <AlertTriangle size={14} className="mt-1 text-red-500" />
        </div>
      </div>

      {/* Big Scan Button */}
      <button 
        onClick={onScanClick}
        className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 h-24 rounded-2xl flex items-center justify-center gap-4 text-2xl font-black text-white shadow-xl shadow-blue-900/20 transition-transform active:scale-[0.98]"
      >
        <PackageSearch size={32} />
        SCAN ITEM
      </button>

      {/* History Header */}
      <div className="flex items-center justify-between pt-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Clock size={20} className="text-slate-500" />
          Recent Scans
        </h2>
        <div className="flex gap-1">
          {(['ALL', 'LOW', 'TODAY'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-md text-[10px] font-bold transition-colors ${
                filter === f 
                  ? 'bg-slate-200 text-slate-950' 
                  : 'bg-slate-900 text-slate-500 border border-slate-800'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* History List */}
      <div className="space-y-2">
        {filteredHistory.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/50 rounded-xl border border-dashed border-slate-800">
            <PackageSearch size={48} className="mx-auto text-slate-800 mb-4" />
            <p className="text-slate-500 font-bold">No items found</p>
          </div>
        ) : (
          filteredHistory.map(record => (
            <div 
              key={record.id}
              className="bg-slate-900 border border-slate-800 p-3 rounded-lg flex items-center gap-4"
            >
              <div className={`w-3 h-3 rounded-full shrink-0 ${getStatusBg(getStockStatus(record.stockAtScan))}`} />
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold truncate uppercase tracking-tight">{record.productName}</p>
                <p className="text-slate-500 text-xs font-mono">{record.sku}</p>
              </div>
              <div className="text-right">
                <p className="text-slate-200 font-black">{record.stockAtScan}</p>
                <p className="text-[10px] text-slate-500">{new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
