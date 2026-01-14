
import React, { useState } from 'react';
import { ParameterState, FaceShape, HatType } from '../types';
import { FACE_SHAPES, HAT_TYPES, ORIGINS, SCENES } from '../constants';

interface Props {
  params: ParameterState;
  setParams: React.Dispatch<React.SetStateAction<ParameterState>>;
  onGenerate: () => void;
}

const ParameterDeck: React.FC<Props> = ({ params, setParams, onGenerate }) => {
  const [toast, setToast] = useState<string | null>(null);

  const toggleList = (field: 'origin' | 'scene', value: string) => {
    setParams(prev => {
      const list = prev[field];
      const newList = list.includes(value) 
        ? list.filter(v => v !== value) 
        : [...list, value];
      
      // Real-time RAG Logic Simulation
      if (field === 'origin' && value === '显脸大' && !list.includes(value)) {
        showToast("💡 知识库建议关联'增加颅顶高度'知识点");
      }
      
      return { ...prev, [field]: newList };
    });
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24">
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-amber-500 text-black px-4 py-2 rounded-full font-medium shadow-2xl animate-bounce z-50">
          {toast}
        </div>
      )}

      <section>
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <span className="text-amber-500">01</span> Parameter Deck
          <span className="text-xs font-normal text-white/30 uppercase tracking-widest bg-white/5 px-2 py-1 rounded">Content Asset Origin</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Origins & Scenes */}
          <div className="space-y-8">
            <div>
              <label className="block text-sm font-medium text-white/50 mb-4 uppercase tracking-wider">User Pain Points (Origin)</label>
              <div className="flex flex-wrap gap-2">
                {ORIGINS.map(o => (
                  <button
                    key={o}
                    onClick={() => toggleList('origin', o)}
                    className={`px-4 py-2 rounded-lg text-sm border transition-all ${
                      params.origin.includes(o) 
                        ? 'bg-amber-500 border-amber-500 text-black font-semibold' 
                        : 'border-white/10 text-white/60 hover:border-white/30'
                    }`}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/50 mb-4 uppercase tracking-wider">Scenarios</label>
              <div className="flex flex-wrap gap-2">
                {SCENES.map(s => (
                  <button
                    key={s}
                    onClick={() => toggleList('scene', s)}
                    className={`px-4 py-2 rounded-lg text-sm border transition-all ${
                      params.scene.includes(s) 
                        ? 'bg-amber-500 border-amber-500 text-black font-semibold' 
                        : 'border-white/10 text-white/60 hover:border-white/30'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Core Attributes */}
          <div className="space-y-8 bg-white/5 p-6 rounded-2xl border border-white/10">
            <div>
              <label className="block text-sm font-medium text-white/50 mb-4 uppercase tracking-wider">Face Shape & Gender</label>
              <div className="grid grid-cols-2 gap-4">
                <select 
                  value={params.faceShape}
                  onChange={(e) => setParams(p => ({ ...p, faceShape: e.target.value as FaceShape }))}
                  className="bg-black border border-white/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
                >
                  {FACE_SHAPES.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
                <div className="flex bg-black border border-white/20 rounded-lg p-1">
                  {(['女', '男'] as const).map(g => (
                    <button
                      key={g}
                      onClick={() => setParams(p => ({ ...p, gender: g }))}
                      className={`flex-1 py-1 rounded-md text-sm transition-all ${
                        params.gender === g ? 'bg-amber-500 text-black' : 'text-white/60'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/50 mb-4 uppercase tracking-wider">Hat Anchor (Product)</label>
              <select 
                value={params.hatType}
                onChange={(e) => setParams(p => ({ ...p, hatType: e.target.value as HatType }))}
                className="w-full bg-black border border-white/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
              >
                {HAT_TYPES.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white/5 p-8 rounded-3xl border border-white/10 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-8">
          <div>
            <div className="flex justify-between items-end mb-4">
              <label className="text-sm font-medium text-white/50 uppercase tracking-wider">Volume (Plog Count)</label>
              <span className="text-2xl font-bold text-amber-500">{params.volume} <span className="text-xs text-white/30">Pages</span></span>
            </div>
            <input 
              type="range" min="10" max="20" 
              value={params.volume}
              onChange={(e) => setParams(p => ({ ...p, volume: parseInt(e.target.value) }))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/50 mb-4 uppercase tracking-wider">Theory Depth (Knowledge RAG)</label>
            <div className="flex gap-4">
              {[1, 2, 3].map(d => (
                <button
                  key={d}
                  onClick={() => setParams(p => ({ ...p, depth: d }))}
                  className={`flex-1 py-3 rounded-xl border transition-all text-sm flex flex-col items-center gap-1 ${
                    params.depth === d ? 'border-amber-500 bg-amber-500/10 text-amber-500' : 'border-white/10 text-white/40'
                  }`}
                >
                  <span className="font-bold">Level {d}</span>
                  <span className="text-[10px] opacity-60">
                    {d === 1 ? 'Aesthetics' : d === 2 ? 'Tips' : 'Hardcore'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <button 
          onClick={onGenerate}
          className="w-full md:w-auto px-12 py-10 bg-amber-500 hover:bg-amber-400 text-black font-black text-xl rounded-2xl transition-all shadow-xl shadow-amber-500/20 active:scale-95 flex flex-col items-center"
        >
          GENERATE TOPICS
          <span className="text-[10px] font-normal opacity-70 tracking-tighter">Powered by CapVisor Intelligence</span>
        </button>
      </section>
    </div>
  );
};

export default ParameterDeck;
