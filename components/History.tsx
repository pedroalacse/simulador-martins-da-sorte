
import React from 'react';
import { Game } from '../types';
import { LOTTERY_CONFIGS } from '../constants';
import { Trash2, Calendar, Hash, Tag, Clock, Wand2, Calculator, CloudMoon } from 'lucide-react';

interface HistoryProps {
  history: Game[];
  onClear: () => void;
}

const History: React.FC<HistoryProps> = ({ history, onClear }) => {
  const getSourceIcon = (source?: string) => {
    switch (source) {
      case 'Sonho': return <CloudMoon size={12} className="text-purple-500" />;
      case 'Orçamento': return <Calculator size={12} className="text-emerald-600" />;
      default: return <Wand2 size={12} className="text-emerald-600" />;
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Histórico Recente</h2>
          <p className="text-sm text-slate-400 font-medium">Suas últimas 100 simulações registradas.</p>
        </div>
        {history.length > 0 && (
          <button 
            onClick={onClear}
            className="flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 px-5 py-2.5 rounded-xl font-black transition-all text-xs border border-red-200 shadow-sm"
          >
            <Trash2 size={16} /> LIMPAR TUDO
          </button>
        )}
      </div>

      <div className="p-2 md:p-8">
        {history.length > 0 ? (
          <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
            {history.map((game) => {
              const cfg = LOTTERY_CONFIGS[game.lotteryType];
              const d = new Date(game.timestamp);
              
              const datePart = d.toLocaleDateString('pt-BR');
              const timePart = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
              
              return (
                <div key={game.id} className="group relative flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-6 bg-white hover:bg-slate-50 border border-slate-100 hover:border-emerald-200 rounded-2xl transition-all shadow-sm hover:shadow-md">
                  <div className="flex items-center gap-5">
                    <div className={`${cfg.color} w-2 h-16 rounded-full shadow-lg`}></div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-3 h-3 rounded-full ${cfg.color} shadow-sm animate-pulse`}></div>
                        <span className="font-black text-slate-800 tracking-tight text-lg">{cfg.name}</span>
                        <span className="text-[10px] bg-slate-900 text-white px-2 py-0.5 rounded-lg font-black uppercase">{game.numDezenas} DZ</span>
                        {game.source && (
                          <span className={`text-[9px] px-2 py-0.5 rounded-lg font-black uppercase flex items-center gap-1 shadow-sm border ${game.source === 'Sonho' ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                            {getSourceIcon(game.source)} {game.source}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold uppercase tracking-wider">
                        <div className="flex items-center gap-1.5 bg-slate-100 text-slate-600 px-2 py-1 rounded-md border border-slate-200/50">
                          <Calendar size={14} className="text-emerald-600" />
                          <span>{datePart}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-slate-100 text-slate-600 px-2 py-1 rounded-md border border-slate-200/50">
                          <Clock size={14} className="text-emerald-600" />
                          <span>às {timePart}</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-400 opacity-70 ml-1">
                          <Hash size={12} />
                          <span>{game.id}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 lg:justify-center max-w-2xl">
                    {game.numbers.map((n, i) => (
                      <span key={i} className="w-9 h-9 flex items-center justify-center bg-white border-2 border-slate-100 text-slate-700 font-black rounded-xl text-xs shadow-sm hover:border-emerald-500 hover:text-emerald-700 transition-colors">
                        {n < 10 ? `0${n}` : n}
                      </span>
                    ))}
                  </div>

                  <div className="lg:w-40 text-right bg-emerald-50 p-3 rounded-2xl border border-emerald-100">
                    <span className="text-[9px] text-emerald-600 block uppercase font-black tracking-widest leading-none mb-1">Investimento</span>
                    <span className="text-lg font-black text-emerald-800">R$ {game.cost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 text-center">
            <div className="bg-slate-100 p-6 rounded-full mb-4 shadow-inner">
              <Tag size={40} className="text-slate-300" />
            </div>
            <h4 className="font-black text-slate-700 uppercase tracking-widest">Nada por aqui</h4>
            <p className="text-sm text-slate-400 mt-2 max-w-xs">Gere e salve simulações para vê-las listadas no seu histórico educacional.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
