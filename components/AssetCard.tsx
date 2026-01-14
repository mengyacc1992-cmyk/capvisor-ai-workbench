
import React, { useEffect, useState } from 'react';
import { AssetCardData } from '../types';
import { KNOWLEDGE_BASE } from '../constants';
import { translateLogicToPrompt } from '../services/geminiService';

interface Props {
  card: AssetCardData;
  index: number;
  onUpdate: (updates: Partial<AssetCardData>) => void;
  onGenerate: () => void;
}

const AssetCard: React.FC<Props> = ({ card, index, onUpdate, onGenerate }) => {
  const [isTranslating, setIsTranslating] = useState(false);

  // Requirement: Automatically extract L2 knowledge from post script
  useEffect(() => {
    const timer = setTimeout(() => {
      const found = KNOWLEDGE_BASE.find(k => card.script.includes(k.l2) || card.script.includes(k.l1));
      if (found && found.l2 !== card.l2Knowledge) {
        onUpdate({ l1Knowledge: found.l1, l2Knowledge: found.l2 });
      }
    }, 1000); // Debounce distillation
    return () => clearTimeout(timer);
  }, [card.script]);

  const handleTranslate = async () => {
    if (!card.visualLogic) return;
    setIsTranslating(true);
    try {
      const english = await translateLogicToPrompt(card.visualLogic);
      onUpdate({ prompt: english });
    } catch (e) {
      console.error(e);
    } finally {
      setIsTranslating(false);
    }
  };

  const getLogicColor = () => {
    switch(card.logicType) {
      case '引入': return 'bg-blue-500';
      case '痛点分析': return 'bg-red-500';
      case '美学原理': return 'bg-purple-500';
      case '解决方案': return 'bg-green-500';
      case '产品种草': return 'bg-amber-500';
      default: return 'bg-white/20';
    }
  };

  return (
    <div className="group relative flex flex-col md:flex-row gap-8 bg-[#0c0c0c] border border-white/5 rounded-[40px] p-8 transition-all hover:bg-white/[0.01] hover:border-white/10">
      
      {/* Index & Side Label */}
      <div className="w-10 flex flex-col items-center flex-shrink-0">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-lg ${getLogicColor()} text-black mb-3 shadow-xl`}>
          {index + 1}
        </div>
        <div className="text-[9px] font-bold text-white/10 uppercase vertical-text tracking-widest">
          {card.logicType}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Headline */}
        <div className="w-full mb-6">
          <input 
            value={card.headline}
            onChange={(e) => onUpdate({ headline: e.target.value })}
            placeholder="雷区1：紧贴头皮的超薄软塌帽"
            className="w-full bg-transparent text-3xl font-black text-white focus:text-amber-500 focus:outline-none placeholder:text-white/5 transition-colors truncate"
          />
        </div>

        <div className="flex flex-col xl:flex-row gap-8 items-start">
          
          {/* Left Column: Visual & Script */}
          <div className="flex-1 flex flex-col gap-6 w-full">
            
            {/* RED FRAME: Visual & Prompt Area */}
            <div className="relative w-full rounded-[32px] border border-white/10 bg-[#111] overflow-hidden min-h-[440px] flex flex-col shadow-2xl">
              {card.visualStatus === 'rendering' ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-4">
                  <div className="w-8 h-8 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
                  <span className="text-[10px] text-amber-500 font-black animate-pulse uppercase tracking-widest">Generating Visual...</span>
                </div>
              ) : card.imageUrl ? (
                <div className="relative flex-1 group/img">
                  <img src={card.imageUrl} className="w-full h-full object-cover" alt="Generated" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                    <button onClick={onGenerate} className="px-6 py-2 bg-white text-black rounded-full font-bold text-xs shadow-xl hover:scale-105 active:scale-95 transition-all">Regenerate</button>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-xl p-4 rounded-2xl border border-white/10">
                    <div className="text-[9px] text-white/40 font-bold uppercase mb-1 flex justify-between">
                      <span>English Prompt</span>
                      <span>Score: {card.score}</span>
                    </div>
                    <div className="text-[11px] text-white/70 line-clamp-1 leading-relaxed italic">{card.prompt}</div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col p-6 space-y-4">
                  <div className="flex-1 space-y-4">
                    <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Visual Logic</div>
                    <textarea 
                      value={card.visualLogic}
                      onChange={(e) => onUpdate({ visualLogic: e.target.value })}
                      className="w-full h-20 bg-transparent text-sm text-white/90 focus:outline-none resize-none custom-scrollbar leading-relaxed"
                      placeholder="模特戴着平直窄檐帽的侧脸对比..."
                    />

                    <div className="bg-black/30 rounded-2xl p-4 border border-white/5 space-y-2">
                       <div className="flex justify-between items-center">
                         <span className="text-[9px] text-amber-500/50 font-bold uppercase tracking-widest">Prompt Translation</span>
                         <button 
                           onClick={handleTranslate}
                           disabled={isTranslating}
                           className="text-[9px] font-bold text-amber-500 hover:text-amber-400 transition-colors flex items-center gap-1"
                         >
                           {isTranslating ? 'Translating...' : 'Translate'} 
                         </button>
                       </div>
                       <textarea 
                        value={card.prompt}
                        onChange={(e) => onUpdate({ prompt: e.target.value })}
                        className="w-full h-20 bg-transparent text-[11px] text-white/40 focus:outline-none resize-none custom-scrollbar italic leading-relaxed"
                        placeholder="Close-up portrait of model with square jawline..."
                       />
                    </div>
                  </div>

                  <button 
                    onClick={onGenerate}
                    className="w-full py-4 bg-white hover:bg-amber-400 text-black font-black text-xs rounded-2xl transition-all shadow-xl active:scale-[0.98]"
                  >
                    GENERATE IMAGE
                  </button>
                </div>
              )}
            </div>

            {/* BLUE FRAME: Post Script Area */}
            <div className="bg-white/[0.03] rounded-[32px] p-6 border border-white/5 space-y-3">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">Post Script</span>
                    <span className="text-[8px] bg-white/10 text-white/40 px-1.5 py-0.5 rounded-full font-mono">DRAFT_V1</span>
                  </div>
                  <div className="text-[9px] text-amber-500/40 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-amber-500/40 animate-pulse"></span>
                    <span>Live Distillation</span>
                  </div>
               </div>
               <textarea 
                  value={card.script}
                  onChange={(e) => onUpdate({ script: e.target.value })}
                  className="w-full h-24 bg-transparent text-sm text-white/80 focus:outline-none resize-none custom-scrollbar leading-relaxed"
                  placeholder="这种平直窄檐帽根本盖不住下颌..."
               />
            </div>
          </div>

          {/* GREEN FRAME: Narrow Knowledge Sidebar */}
          <div className="w-full xl:w-56 flex flex-col self-stretch">
             <div className="bg-[#111] rounded-[32px] p-5 border border-white/5 flex-1 flex flex-col shadow-xl">
               <div className="space-y-4 mb-auto">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">L2 Unit</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
                  </div>
                  
                  <div className="relative group/kb">
                    <select 
                      className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-[11px] font-bold text-white focus:outline-none focus:border-amber-500 appearance-none transition-all cursor-pointer hover:bg-black"
                      value={card.l2Knowledge}
                      onChange={(e) => {
                        const k = KNOWLEDGE_BASE.find(k => k.l2 === e.target.value);
                        if (k) onUpdate({ l1Knowledge: k.l1, l2Knowledge: k.l2 });
                      }}
                    >
                      <option value="">Knowledge Base</option>
                      {KNOWLEDGE_BASE.map(k => (
                        <option key={k.id} value={k.l2}>{k.l1}</option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-20">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
               </div>

               <div className="mt-8">
                 <div className="bg-amber-500/[0.02] border border-amber-500/5 p-4 rounded-2xl space-y-3">
                   <div className="text-[8px] text-amber-500/60 font-black uppercase tracking-widest">Active Formula</div>
                   <div className="text-[11px] text-amber-500/90 leading-relaxed font-bold">
                     {KNOWLEDGE_BASE.find(k => k.l2 === card.l2Knowledge)?.formula || 'Waiting for script distillation...'}
                   </div>
                   
                   {card.l2Knowledge && (
                     <div className="flex items-center gap-1.5 pt-3 border-t border-amber-500/5">
                        <span className="w-1 h-1 rounded-full bg-amber-500/50 animate-pulse"></span>
                        <span className="text-[8px] text-amber-500/50 font-black uppercase tracking-tighter">Auto-Linked</span>
                     </div>
                   )}
                 </div>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetCard;
