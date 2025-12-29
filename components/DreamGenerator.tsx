
import React, { useState } from 'react';
import { LotteryConfig, Game, LotteryType } from '../types';
import { LOTTERY_CONFIGS } from '../constants';
import { GoogleGenAI, Type } from "@google/genai";
import { CloudMoon, Sparkles, Wand2, Info, Save, HelpCircle, BookOpen, Quote, Loader2, Check, Footprints, Target } from 'lucide-react';

interface DreamGeneratorProps {
  config: LotteryConfig;
  type: LotteryType;
  onSave: (games: Game[]) => void;
}

interface BichoData {
  nome: string;
  grupo: number | null;
  dezenas: number[];
  dezena: number;
  centena: number;
  milhar: number;
  observacao: string;
}

interface AIDreamResponse {
  titulo: string;
  significado: string;
  variacoes: { titulo: string; texto: string }[];
  bicho: BichoData;
  loterias_caixa_sugestoes: {
    mega_sena: number[];
    quina: number[];
    lotofacil: number[];
    timemania: number[];
  };
  metodo: string;
  aviso: string;
}

const DreamGenerator: React.FC<DreamGeneratorProps> = ({ onSave }) => {
  const [dreamText, setDreamText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<AIDreamResponse | null>(null);
  const [savedTypes, setSavedTypes] = useState<Set<string>>(new Set());

  const interpretDreamWithAI = async () => {
    if (!dreamText.trim()) {
      alert("Por favor, descreva o seu sonho primeiro!");
      return;
    }

    setIsGenerating(true);
    setAiResult(null);
    setSavedTypes(new Set());
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const prompt = `
        Você é um assistente cultural brasileiro especializado em interpretação POPULAR de sonhos (estilo João Bidu/Almanaque).
        O usuário sonhou com: "${dreamText}"

        OBJETIVO:
        Gerar uma interpretação simbólica, cultural e popular do sonho em formato JSON estrito.
        Explique o significado, variações e apresente números tradicionalmente associados (Bicho, Federal e Loterias Caixa).

        REGRAS:
        - Use linguagem brasileira, popular e acolhedora.
        - Não prometa ganhos. Uso recreativo e educativo.
        - bicho.nome: Nome do bicho associado (ex: Cachorro, Leão).
        - bicho.grupo: Grupo do bicho (1-25).
        - bicho.dezenas: As 4 dezenas do grupo.
        - bicho.dezena, bicho.centena, bicho.milhar: Exemplos de números da sorte baseados no sonho.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              titulo: { type: Type.STRING },
              significado: { type: Type.STRING },
              variacoes: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    titulo: { type: Type.STRING },
                    texto: { type: Type.STRING }
                  },
                  required: ["titulo", "texto"]
                }
              },
              bicho: {
                type: Type.OBJECT,
                properties: {
                  nome: { type: Type.STRING },
                  grupo: { type: Type.INTEGER },
                  dezenas: { type: Type.ARRAY, items: { type: Type.INTEGER } },
                  dezena: { type: Type.INTEGER },
                  centena: { type: Type.INTEGER },
                  milhar: { type: Type.INTEGER },
                  observacao: { type: Type.STRING }
                },
                required: ["nome", "grupo", "dezenas", "dezena", "centena", "milhar", "observacao"]
              },
              loterias_caixa_sugestoes: {
                type: Type.OBJECT,
                properties: {
                  mega_sena: { type: Type.ARRAY, items: { type: Type.INTEGER } },
                  quina: { type: Type.ARRAY, items: { type: Type.INTEGER } },
                  lotofacil: { type: Type.ARRAY, items: { type: Type.INTEGER } },
                  timemania: { type: Type.ARRAY, items: { type: Type.INTEGER } }
                },
                required: ["mega_sena", "quina", "lotofacil", "timemania"]
              },
              metodo: { type: Type.STRING },
              aviso: { type: Type.STRING }
            },
            required: ["titulo", "significado", "variacoes", "bicho", "loterias_caixa_sugestoes", "metodo", "aviso"]
          }
        }
      });

      const data = JSON.parse(response.text || '{}') as AIDreamResponse;
      
      // Ordenar números das loterias
      data.loterias_caixa_sugestoes.mega_sena.sort((a, b) => a - b);
      data.loterias_caixa_sugestoes.quina.sort((a, b) => a - b);
      data.loterias_caixa_sugestoes.lotofacil.sort((a, b) => a - b);
      data.loterias_caixa_sugestoes.timemania.sort((a, b) => a - b);

      setAiResult(data);
    } catch (error) {
      console.error("Erro na interpretação do sonho:", error);
      alert("Não foi possível interpretar agora. Tente novamente em alguns instantes.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveGame = (lType: LotteryType, numbers: number[]) => {
    const lConfig = LOTTERY_CONFIGS[lType];
    const price = lConfig.prices[0].price || 0;
    
    onSave([{
      id: `SONHO-${lType.substring(0,3)}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
      lotteryType: lType,
      numbers,
      numDezenas: numbers.length,
      timestamp: Date.now(),
      cost: price,
      source: 'Sonho'
    }]);
    
    setSavedTypes(prev => new Set(prev).add(lType));
  };

  const formatNumber = (n: number) => n < 10 ? `0${n}` : `${n}`;

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-emerald-500/20 p-4 rounded-2xl border border-emerald-500/30 backdrop-blur-sm">
              <CloudMoon size={32} className="text-emerald-400" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight">Sonhos da Sorte 🍀</h2>
              <p className="text-emerald-100/60 text-xs font-bold uppercase tracking-widest mt-1">
                Consultoria Cultural Martins & Gemini AI
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-10">
        {/* Input Area */}
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 group relative">
              <label className="text-xs font-black text-slate-500 uppercase flex items-center gap-2">
                <BookOpen size={14} className="text-emerald-600" /> O que aconteceu no seu sonho?
              </label>
              <div className="cursor-help text-emerald-600 hover:text-emerald-500 transition-colors">
                <HelpCircle size={14} />
              </div>
            </div>
            
            <textarea 
              value={dreamText}
              disabled={isGenerating}
              onChange={(e) => setDreamText(e.target.value)}
              placeholder="Ex: Sonhei que encontrava um baú de moedas de ouro em uma praia ensolarada..."
              className="w-full h-32 bg-slate-50 border border-slate-200 rounded-3xl p-6 text-slate-700 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium resize-none shadow-inner disabled:opacity-50"
            ></textarea>
          </div>

          <button 
            onClick={interpretDreamWithAI}
            disabled={isGenerating || !dreamText.trim()}
            className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-600/20 active:scale-95 flex items-center justify-center gap-3 disabled:bg-slate-100 disabled:text-slate-300 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Loader2 className="animate-spin" size={24} />
                <span>INTERPRETANDO...</span>
              </>
            ) : (
              <>
                <Wand2 size={24} /> INTERPRETAR SONHO E GERAR PALPITES
              </>
            )}
          </button>
        </div>

        {/* Results Area */}
        {aiResult && (
          <div className="animate-in slide-in-from-bottom-6 duration-500 space-y-8">
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Meaning Header Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-[2rem] p-8 relative">
                <Quote className="absolute top-6 left-6 text-emerald-100" size={48} />
                <div className="relative z-10">
                  <h3 className="text-emerald-800 font-black text-xl mb-4 flex items-center gap-2">
                    <Sparkles size={20} className="text-emerald-500" /> {aiResult.titulo}
                  </h3>
                  <p className="text-slate-600 leading-relaxed font-medium mb-6">
                    {aiResult.significado}
                  </p>
                  
                  {aiResult.variacoes.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      {aiResult.variacoes.map((v, i) => (
                        <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                          <h4 className="text-xs font-black text-emerald-700 uppercase mb-1">{v.titulo}</h4>
                          <p className="text-xs text-slate-500">{v.texto}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Cultural/Folklore Reference Section */}
              <div className="bg-emerald-50 border border-emerald-100 rounded-[2.5rem] p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-emerald-600 p-2 rounded-xl text-white">
                    <Target size={20} />
                  </div>
                  <h3 className="text-emerald-900 font-black text-lg uppercase tracking-tight">
                    Acredite na sua sorte <span className="text-emerald-600/50 text-sm font-bold">(Referência Cultural)</span>
                  </h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Bicho Card */}
                  <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Jogo do Bicho</span>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                        <Footprints size={32} />
                      </div>
                      <div>
                        <h4 className="text-2xl font-black text-slate-800">{aiResult.bicho.nome}</h4>
                        <p className="text-xs font-bold text-emerald-600 uppercase">Grupo: {aiResult.bicho.grupo}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {aiResult.bicho.dezenas.map(d => (
                        <span key={d} className="bg-slate-50 text-slate-600 text-xs font-black px-2 py-1 rounded-lg border border-slate-100">
                          {formatNumber(d)}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Federal Numbers Card */}
                  <div className="lg:col-span-2 bg-slate-900 p-6 rounded-3xl shadow-xl flex flex-col justify-between">
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest block mb-6">Loteria Federal / Milhar</span>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <span className="text-[10px] text-white/40 uppercase block mb-1">Dezena</span>
                        <div className="bg-white/10 text-white font-black text-xl py-2 rounded-xl border border-white/10">
                          {formatNumber(aiResult.bicho.dezena)}
                        </div>
                      </div>
                      <div className="text-center">
                        <span className="text-[10px] text-white/40 uppercase block mb-1">Centena</span>
                        <div className="bg-white/10 text-white font-black text-xl py-2 rounded-xl border border-white/10">
                          {aiResult.bicho.centena}
                        </div>
                      </div>
                      <div className="text-center">
                        <span className="text-[10px] text-white/40 uppercase block mb-1">Milhar</span>
                        <div className="bg-emerald-600 text-white font-black text-xl py-2 rounded-xl shadow-lg shadow-emerald-600/20">
                          {aiResult.bicho.milhar}
                        </div>
                      </div>
                    </div>
                    <p className="text-[9px] text-white/30 font-bold uppercase mt-6 text-center italic">
                      {aiResult.bicho.observacao}
                    </p>
                  </div>
                </div>
              </div>

              {/* Caixa Sugestões Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(Object.entries(aiResult.loterias_caixa_sugestoes)).map(([key, nums]) => {
                  const lotteryKey = key === 'mega_sena' ? 'MEGA_SENA' : 
                                   key === 'quina' ? 'QUINA' : 
                                   key === 'lotofacil' ? 'LOTOFACIL' : 'TIMEMANIA';
                  const lConfig = LOTTERY_CONFIGS[lotteryKey as LotteryType];
                  const isSaved = savedTypes.has(lotteryKey);

                  return (
                    <div key={key} className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200 relative flex flex-col justify-between group overflow-hidden">
                      <div className={`absolute top-0 left-0 w-full h-1 ${lConfig.color}`}></div>
                      
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-4">
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest text-white ${lConfig.color}`}>
                            {lConfig.name}
                          </span>
                          <span className="text-slate-400 text-[9px] font-bold uppercase">Simbólico</span>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {nums.map((n, i) => (
                            <div key={i} className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 text-slate-900 font-black text-xs border border-slate-100">
                              {formatNumber(n)}
                            </div>
                          ))}
                        </div>
                      </div>

                      <button 
                        onClick={() => handleSaveGame(lotteryKey as LotteryType, nums)}
                        disabled={isSaved}
                        className={`w-full py-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all ${
                          isSaved 
                            ? 'bg-slate-100 text-emerald-600 cursor-default' 
                            : 'bg-emerald-600 text-white hover:bg-emerald-500 active:scale-95 shadow-lg shadow-emerald-600/10'
                        }`}
                      >
                        {isSaved ? <><Check size={14} /> SALVO NO HISTÓRICO</> : <><Save size={14} /> SALVAR ESTE JOGO</>}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Method & Disclaimer */}
              <div className="bg-slate-50 border border-slate-200 p-6 rounded-3xl space-y-4">
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Como chegamos a esses números?</h4>
                  <p className="text-xs text-slate-500 italic">{aiResult.metodo}</p>
                </div>
                <div className="flex gap-3 pt-4 border-t border-slate-200">
                  <Info size={18} className="text-amber-500 flex-shrink-0" />
                  <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                    <strong>AVISO:</strong> {aiResult.aviso} O Martins da Sorte é apenas um simulador educativo. Loterias são jogos de azar. Jogue com moderação.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!aiResult && !isGenerating && (
          <div className="py-20 flex flex-col items-center justify-center text-center opacity-40">
            <CloudMoon size={64} className="text-slate-300 mb-4" />
            <h4 className="font-black text-slate-400 text-lg uppercase tracking-widest">Aguardando seu sonho...</h4>
            <p className="text-sm text-slate-400 max-w-xs mt-2">
              A interpretação detalhada e os palpites culturais aparecerão aqui após clicar no botão acima.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DreamGenerator;
