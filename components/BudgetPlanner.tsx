
import React, { useState, useMemo } from 'react';
import { LotteryConfig, Game, LotteryType } from '../types';
// Fix: Added missing 'Info' import from lucide-react to resolve "Cannot find name 'Info'" error
import { Calculator, PlayCircle, Coins, ChevronRight, Info } from 'lucide-react';

interface BudgetPlannerProps {
  config: LotteryConfig;
  type: LotteryType;
  onSave: (games: Game[]) => void;
}

const BudgetPlanner: React.FC<BudgetPlannerProps> = ({ config, onSave, type }) => {
  const [budget, setBudget] = useState<number>(0);

  const simulations = useMemo(() => {
    if (budget <= 0) return [];
    
    return config.prices
      .map(p => {
        const quantity = Math.floor(budget / p.price);
        const totalCost = quantity * p.price;
        return {
          numbers: p.numbers,
          pricePerGame: p.price,
          quantity,
          totalCost,
          leftover: budget - totalCost
        };
      })
      .filter(sim => sim.quantity > 0)
      .sort((a, b) => b.quantity - a.quantity); // Mostra primeiro onde cabe mais jogos
  }, [budget, config]);

  const handleGenerateAndSave = (sim: typeof simulations[0]) => {
    const newGames: Game[] = [];
    const availableTotal = Array.from({ length: config.rangeMax }, (_, i) => i + 1);

    for (let i = 0; i < sim.quantity; i++) {
      let nums: number[] = [];
      const pool = [...availableTotal];
      
      while (nums.length < sim.numbers) {
        const idx = Math.floor(Math.random() * pool.length);
        nums.push(pool[idx]);
        pool.splice(idx, 1);
      }
      
      newGames.push({
        id: Math.random().toString(36).substr(2, 9).toUpperCase(),
        lotteryType: type,
        numbers: nums.sort((a, b) => a - b),
        numDezenas: sim.numbers,
        timestamp: Date.now(),
        cost: sim.pricePerGame
      });
    }
    onSave(newGames);
    alert(`Sucesso! ${newGames.length} jogos de ${sim.numbers} dezenas foram adicionados ao seu histórico.`);
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-10">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Otimizador de Investimento</h2>
          <p className="text-sm text-slate-400">Quanto você deseja investir hoje? Calculamos a melhor distribuição.</p>
        </div>
        <div className="bg-emerald-50 p-6 rounded-3xl flex items-center gap-6 border border-emerald-100 w-full md:w-80 shadow-inner">
          <div className="bg-emerald-600 p-3 rounded-2xl text-white shadow-lg shadow-emerald-600/20">
            <Coins size={24} />
          </div>
          <div className="flex-grow">
            <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block mb-1">Meu Orçamento</label>
            <div className="flex items-center">
              <span className="text-xl font-black text-emerald-900 mr-1">R$</span>
              <input 
                type="number" 
                placeholder="0,00"
                value={budget || ''}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full bg-transparent text-2xl font-black text-emerald-900 outline-none placeholder:text-emerald-200"
              />
            </div>
          </div>
        </div>
      </div>

      {budget > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
          {simulations.length > 0 ? simulations.map((sim, idx) => (
            <div key={idx} className="group flex flex-col justify-between bg-slate-50 hover:bg-white border border-slate-100 hover:border-emerald-300 rounded-3xl p-6 transition-all hover:shadow-2xl hover:-translate-y-1">
              <div>
                <div className="flex justify-between items-start mb-6">
                   <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-lg font-black text-emerald-600">
                     {sim.numbers}
                   </div>
                   <div className="text-right">
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Máximo de</span>
                     <span className="text-xl font-black text-slate-800">{sim.quantity} Jogos</span>
                   </div>
                </div>
                
                <div className="space-y-3 mb-8 bg-white/50 p-4 rounded-2xl border border-slate-100 shadow-inner">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-bold">Unidade:</span>
                    <span className="font-black text-slate-700">R$ {sim.pricePerGame.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-bold">Custo Total:</span>
                    <span className="font-black text-slate-700">R$ {sim.totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-xs pt-2 border-t border-slate-100">
                    <span className="text-emerald-600 font-black uppercase tracking-tighter">Sobrou Troco:</span>
                    <span className="font-black text-emerald-700">R$ {sim.leftover.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => handleGenerateAndSave(sim)}
                className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-4 rounded-2xl font-black text-sm hover:bg-emerald-600 transition-all shadow-lg active:scale-95"
              >
                GERAR TODOS <ChevronRight size={16} />
              </button>
            </div>
          )) : (
            <div className="col-span-full py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
              <Info size={40} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500 font-black">Orçamento Insuficiente</p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto mt-2">O valor informado não cobre nem o jogo mínimo de R$ {config.prices[0].price.toFixed(2)}.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 text-center">
          <Calculator size={56} className="text-slate-200 mb-4" />
          <h4 className="font-black text-slate-700">Aguardando Valor</h4>
          <p className="text-sm text-slate-400 max-w-xs mt-2">Informe um valor para simular as melhores combinações de jogos que cabem no seu bolso.</p>
        </div>
      )}
    </div>
  );
};

export default BudgetPlanner;
