
import React, { useState, useEffect } from 'react';
import { LotteryType, Game, User } from './types';
import { LOTTERY_CONFIGS } from './constants';
import { Clover, History as HistoryIcon, LogIn, LogOut, Wallet, Info, Trophy, CloudMoon, ShieldAlert, CheckCircle2 } from 'lucide-react';
import GameGenerator from './components/GameGenerator';
import BudgetPlanner from './components/BudgetPlanner';
import History from './components/History';
import LoginModal from './components/LoginModal';
import DreamGenerator from './components/DreamGenerator';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'generate' | 'budget' | 'history' | 'dreams'>('generate');
  const [selectedLottery, setSelectedLottery] = useState<LotteryType>('MEGA_SENA');
  const [history, setHistory] = useState<Game[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAdult, setIsAdult] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('martins_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading history", e);
      }
    }
    const adultStatus = localStorage.getItem('martins_is_adult');
    if (adultStatus === 'true') setIsAdult(true);
  }, []);

  useEffect(() => {
    localStorage.setItem('martins_history', JSON.stringify(history));
  }, [history]);

  const handleAgeGate = (checked: boolean) => {
    setIsAdult(checked);
    localStorage.setItem('martins_is_adult', String(checked));
  };

  const addGamesToHistory = (newGames: Game[]) => {
    setHistory(prev => [...newGames, ...prev].slice(0, 100));
  };

  const config = LOTTERY_CONFIGS[selectedLottery];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="bg-emerald-800 text-white shadow-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-xl shadow-inner">
              <Clover className="text-emerald-700 w-7 h-7" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black tracking-tight leading-none">MARTINS DA SORTE</h1>
              <p className="text-[10px] text-emerald-200 uppercase font-bold tracking-widest mt-1">Simulador Educacional • 18+</p>
            </div>
          </div>

          <nav className="flex items-center gap-1 md:gap-4 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            <button 
              onClick={() => setActiveTab('generate')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'generate' ? 'bg-white text-emerald-800 shadow-md' : 'hover:bg-emerald-700/50'}`}
            >
              <Trophy size={16} /> Gerador
            </button>
            <button 
              onClick={() => setActiveTab('budget')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'budget' ? 'bg-white text-emerald-800 shadow-md' : 'hover:bg-emerald-700/50'}`}
            >
              <Wallet size={16} /> Orçamento
            </button>
            <button 
              onClick={() => setActiveTab('dreams')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'dreams' ? 'bg-white text-emerald-800 shadow-md' : 'hover:bg-emerald-700/50 text-emerald-200'}`}
            >
              <CloudMoon size={16} /> Sonhos da Sorte 🍀
            </button>
            <button 
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'history' ? 'bg-white text-emerald-800 shadow-md' : 'hover:bg-emerald-700/50'}`}
            >
              <HistoryIcon size={16} /> Histórico
            </button>
          </nav>

          <div className="hidden md:block">
            {user ? (
              <button onClick={() => setUser(null)} className="p-2 hover:bg-emerald-700 rounded-full transition-colors"><LogOut size={20} /></button>
            ) : (
              <button onClick={() => setIsLoginModalOpen(true)} className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg font-bold text-sm shadow-md transition-all">Login</button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-6">
        {/* Compliance Warning */}
        <div className="mb-6 bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl shadow-sm flex flex-col sm:flex-row gap-4 items-center">
          <ShieldAlert className="text-amber-600 flex-shrink-0" size={32} />
          <div className="flex-grow">
            <h3 className="font-black text-amber-900 text-sm">AVISO DE RESPONSABILIDADE</h3>
            <p className="text-xs text-amber-800 leading-relaxed">
              Este é um simulador matemático para fins educacionais. Não realizamos apostas, não aceitamos dinheiro e não garantimos prêmios. 
              Loterias são jogos de azar. Jogue com moderação e apenas o que puder perder. <strong>Organize seus jogos, evite padrões extremos.</strong>
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl border border-amber-200 shadow-inner w-full sm:w-auto">
            <input 
              type="checkbox" 
              id="age-gate" 
              checked={isAdult} 
              onChange={(e) => handleAgeGate(e.target.checked)}
              className="w-5 h-5 accent-emerald-600 cursor-pointer"
            />
            <label htmlFor="age-gate" className="text-xs font-bold text-slate-700 cursor-pointer select-none">Sou maior de 18 anos</label>
          </div>
        </div>

        {!isAdult ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="bg-slate-200 p-8 rounded-full">
              <ShieldAlert size={64} className="text-slate-400" />
            </div>
            <h2 className="text-2xl font-black text-slate-800">Acesso Restrito</h2>
            <p className="text-slate-500 max-w-md">Você precisa confirmar que possui mais de 18 anos para utilizar as ferramentas de simulação do Martins da Sorte.</p>
          </div>
        ) : (
          <>
            {/* Lottery Selector */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {(Object.keys(LOTTERY_CONFIGS) as LotteryType[]).map((type) => {
                const cfg = LOTTERY_CONFIGS[type];
                const active = selectedLottery === type;
                return (
                  <button
                    key={type}
                    onClick={() => setSelectedLottery(type)}
                    className={`p-5 rounded-2xl transition-all border-2 text-left relative overflow-hidden group ${active ? `${cfg.color} text-white border-transparent shadow-xl ring-4 ring-emerald-500/20` : 'bg-white border-slate-200 hover:border-emerald-300 shadow-sm'}`}
                  >
                    <div className="relative z-10">
                      <h4 className="font-black text-xl tracking-tight">{cfg.name}</h4>
                      <p className={`text-xs font-bold uppercase tracking-widest ${active ? 'text-white/70' : 'text-slate-400'}`}>01 a {cfg.rangeMax}</p>
                    </div>
                    {active && <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20" size={60} />}
                  </button>
                );
              })}
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {activeTab === 'generate' && <GameGenerator config={config} onSave={addGamesToHistory} type={selectedLottery} />}
              {activeTab === 'budget' && <BudgetPlanner config={config} onSave={addGamesToHistory} type={selectedLottery} />}
              {activeTab === 'dreams' && <DreamGenerator config={config} onSave={addGamesToHistory} type={selectedLottery} />}
              {activeTab === 'history' && <History history={history} onClear={() => setHistory([])} />}
            </div>
          </>
        )}
      </main>

      <footer className="bg-slate-900 text-white py-12 border-t border-emerald-900/20 mt-10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Clover className="text-emerald-500" />
              <span className="font-black text-xl">MARTINS DA SORTE</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              O simulador Martins da Sorte é uma ferramenta de estudo probabilístico. Nosso objetivo é mostrar o custo real das combinações e ajudar o usuário a organizar seus jogos de forma consciente.
            </p>
          </div>
          <div className="flex flex-col md:items-end justify-center">
            <p className="text-emerald-500 font-bold mb-2">Simulação Educacional</p>
            <p className="text-slate-500 text-xs">Versão 2.5.0 • Sem fins lucrativos</p>
            <p className="text-slate-600 text-[10px] mt-4 uppercase tracking-widest">© {new Date().getFullYear()} MARTINS DA SORTE</p>
          </div>
        </div>
      </footer>

      {isLoginModalOpen && <LoginModal onClose={() => setIsLoginModalOpen(false)} onLogin={(u) => { setUser(u); setIsLoginModalOpen(false); }} />}
    </div>
  );
};

export default App;
