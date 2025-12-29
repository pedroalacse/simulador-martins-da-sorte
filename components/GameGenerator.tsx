
import React, { useState, useMemo } from 'react';
import { LotteryConfig, Game, LotteryType } from '../types';
import { Sparkles, Save, RotateCcw, LayoutGrid, Wand2 } from 'lucide-react';

interface GameGeneratorProps {
  config: LotteryConfig;
  type: LotteryType;
  onSave: (games: Game[]) => void;
}

const GameGenerator: React.FC<GameGeneratorProps> = ({ config, onSave, type }) => {
  const [numDezenas, setNumDezenas] = useState(config.minNumbers);
  const [activeSubTab, setActiveSubTab] = useState<'random' | 'completer'>('random');
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [generatedResult, setGeneratedResult] = useState<number[]>([]);

  const toggleNumber = (n: number) => {
    if (selectedNumbers.includes(n)) {
      setSelectedNumbers(prev => prev.filter(x => x !== n));
    } else {
      if (selectedNumbers.length < numDezenas) {
        setSelectedNumbers(prev => [...prev, n].sort((a, b) => a - b));
      }
    }
  };

  const applySanityFilter = (current: number[], pool: number[]): number => {
    // Tenta equilibrar par e ímpar
    const evens = current.filter(n => n % 2 === 0).length;
    const odds = current.length - evens;
    const targetEven = Math.floor(numDezenas / 2);
    
    let filteredPool = pool;
    if (evens > targetEven) {
        filteredPool = pool.filter(n => n % 2 !== 0);
    } else if (odds > (numDezenas - targetEven)) {
        filteredPool = pool.filter(n => n % 2 === 0);
    }

    if (filteredPool.length === 0) filteredPool = pool;
    return filteredPool[Math.floor(Math.random() * filteredPool.length)];
  };

  const generateOrComplete = () => {
    let finalNumbers: number[] = [...selectedNumbers];
    const available = Array.from({ length: config.rangeMax }, (_, i) => i + 1)
      .filter(n => !finalNumbers.includes(n));

    while (finalNumbers.length < numDezenas) {
      const pick = applySanityFilter(finalNumbers, available);
      finalNumbers.push(pick);
      const idx = available.indexOf(pick);
      available.splice(idx, 1);
    }

    setGeneratedResult(finalNumbers.sort((a, b) => a - b));
  };

  const handleSave = () => {
    if (generatedResult.length === 0) return;
    const price = config.prices.find(p => p.numbers === numDezenas)?.price || 0;
    onSave([{
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      lotteryType: type,
      numbers: generatedResult,
      numDezenas,
      timestamp: Date.now(),
      cost: price
    }]);
    setGeneratedResult([]);
    setSelectedNumbers([]);
    alert("Jogo salvo no histórico!");
  };

  const currentPrice = config.prices.find(p => p.numbers === numDezenas)?.price || 0;

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Selector Header */}
      <div className="bg-slate-50 border-b border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm w-full md:w-auto">
          <button 
            onClick={() => { setActiveSubTab('random'); setGeneratedResult([]); setSelectedNumbers([]); }}
            className={`flex-1 md:flex-none flex items-center gap-2 px-6 py-2 rounded-lg font-bold text-sm transition-all ${activeSubTab === 'random' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <Sparkles size={16} /> Aleatório
          </button>
          <button 
            onClick={() => { setActiveSubTab('completer'); setGeneratedResult([]); setSelectedNumbers([]); }}
            className={`flex-1 md:flex-none flex items-center gap-2 px-6 py-2 rounded-lg font-bold text-sm transition-all ${activeSubTab === 'completer' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <LayoutGrid size={16} /> Completador
          </button>
        </div>

        <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm w-full md:w-auto">
          <label className="text-xs font-black text-slate-400 uppercase">Qtd. Dezenas:</label>
          <select 
            value={numDezenas} 
            onChange={(e) => { setNumDezenas(Number(e.target.value)); setGeneratedResult([]); setSelectedNumbers([]); }}
            className="bg-transparent border-none font-black text-emerald-700 outline-none cursor-pointer text-lg"
          >
            {config.prices.map(p => (
              <option key={p.numbers} value={p.numbers}>{p.numbers} Dezenas</option>
            ))}
          </select>
        </div>
      </div>

      <div className="p-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Input/Grid Area */}
        <div className="lg:col-span-7 space-y-6">
          {activeSubTab === 'completer' ? (
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <h3 className="font-black text-slate-800 flex items-center gap-2">
                  <LayoutGrid className="text-emerald-600" size={20} /> Escolha suas dezenas fixas
                </h3>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                  {selectedNumbers.length} / {numDezenas} selecionadas
                </span>
              </div>
              <div className="grid grid-cols-6 sm:grid-cols-10 gap-2">
                {Array.from({ length: config.rangeMax }, (_, i) => i + 1).map(n => {
                  const isSelected = selectedNumbers.includes(n);
                  const formatted = n < 10 ? `0${n}` : n;
                  return (
                    <button
                      key={n}
                      onClick={() => toggleNumber(n)}
                      disabled={!isSelected && selectedNumbers.length >= numDezenas}
                      className={`aspect-square rounded-lg flex items-center justify-center font-black text-sm transition-all border-2 ${
                        isSelected 
                          ? 'bg-emerald-600 border-emerald-700 text-white scale-110 shadow-lg z-10' 
                          : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-emerald-300 hover:text-emerald-600 disabled:opacity-30 disabled:cursor-not-allowed'
                      }`}
                    >
                      {formatted}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-10 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl text-center">
              <Sparkles size={48} className="text-emerald-300 mb-4 animate-pulse" />
              <h4 className="font-black text-slate-700">Geração 100% Aleatória</h4>
              <p className="text-sm text-slate-400 mt-2">Clique no botão abaixo para que o sistema escolha todas as {numDezenas} dezenas para você.</p>
            </div>
          )}
        </div>

        {/* Right: Preview Area */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-slate-900 rounded-3xl p-6 shadow-xl relative overflow-hidden min-h-[320px] flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-6">
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Resultado da Simulação</span>
                <span className="text-white/40 text-[10px] font-mono">{new Date().toLocaleDateString('pt-BR')}</span>
              </div>

              {generatedResult.length > 0 ? (
                <div className="flex flex-wrap gap-2 justify-center py-4">
                  {generatedResult.map((n, i) => {
                    const isFixed = selectedNumbers.includes(n);
                    return (
                      <div 
                        key={i} 
                        className={`w-10 h-10 flex items-center justify-center rounded-full font-black text-sm shadow-lg border-2 animate-in zoom-in duration-300 ${isFixed ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-white border-slate-200 text-slate-800'}`}
                        style={{ animationDelay: `${i * 50}ms` }}
                      >
                        {n < 10 ? `0${n}` : n}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-slate-600">
                  <Wand2 size={40} className="opacity-20 mb-3" />
                  <p className="text-xs font-bold uppercase tracking-widest opacity-50">Aguardando geração...</p>
                </div>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-white/10 flex justify-between items-end">
              <div>
                <span className="text-[10px] text-white/40 uppercase font-black block mb-1">Custo Estimado</span>
                <span className="text-2xl font-black text-emerald-400">R$ {currentPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-white/40 uppercase font-black block mb-1">Formato</span>
                <span className="text-xs text-white font-bold">{numDezenas} Dezenas</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={generateOrComplete}
              className="flex items-center justify-center gap-2 bg-emerald-600 text-white py-4 px-6 rounded-2xl font-black hover:bg-emerald-500 transition-all shadow-lg active:scale-95"
            >
              <RotateCcw size={20} /> {generatedResult.length > 0 ? 'RECALCULAR' : activeSubTab === 'completer' ? 'COMPLETAR' : 'GERAR'}
            </button>
            <button 
              onClick={handleSave}
              disabled={generatedResult.length === 0}
              className={`flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-black transition-all shadow-lg active:scale-95 ${
                generatedResult.length > 0 ? 'bg-slate-800 text-white hover:bg-slate-900' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Save size={20} /> SALVAR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameGenerator;
