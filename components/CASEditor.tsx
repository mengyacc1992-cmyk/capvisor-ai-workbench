
import React, { useState } from 'react';
import { AssetCardData, TopicCard, ParameterState } from '../types';
import AssetCard from './AssetCard';
import { generateAssetImage, scoreAsset } from '../services/geminiService';

interface Props {
  stream: AssetCardData[];
  setStream: React.Dispatch<React.SetStateAction<AssetCardData[]>>;
  topic: TopicCard;
  params: ParameterState;
}

const CASEditor: React.FC<Props> = ({ stream, setStream, topic, params }) => {
  const [isRendering, setIsRendering] = useState(false);

  const updateCard = (id: string, updates: Partial<AssetCardData>) => {
    setStream(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const handleSingleRender = async (id: string, prompt: string) => {
    updateCard(id, { visualStatus: 'rendering' });
    try {
      const url = await generateAssetImage(prompt);
      const score = await scoreAsset(url, prompt);
      updateCard(id, { imageUrl: url, score, visualStatus: 'done' });
    } catch (err) {
      console.error(err);
      updateCard(id, { visualStatus: 'skeleton' });
      alert("Generation failed. Please try again.");
    }
  };

  return (
    <div className="flex h-full bg-[#0a0a0a]">
      {/* Sidebar - Context & Assets */}
      <aside className="w-80 border-r border-white/10 flex flex-col bg-[#0d0d0d]">
        <div className="p-6 border-b border-white/10">
          <div className="text-[10px] text-amber-500 font-mono mb-1 uppercase tracking-widest">Global Context</div>
          <h2 className="font-bold text-lg mb-4 truncate">{topic.title}</h2>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs p-2 rounded bg-white/5">
              <span className="text-white/40">Face Shape</span>
              <span className="font-medium">{params.faceShape}</span>
            </div>
            <div className="flex items-center justify-between text-xs p-2 rounded bg-white/5">
              <span className="text-white/40">Hat Type</span>
              <span className="font-medium">{params.hatType}</span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
          <div>
            <h3 className="text-xs font-bold text-white/30 uppercase tracking-widest mb-4">Draft Assets</h3>
            <div className="grid grid-cols-2 gap-2">
              {stream.map((card, i) => (
                <div 
                  key={card.id}
                  className={`aspect-[3/4] rounded-lg border flex items-center justify-center text-[10px] transition-all cursor-pointer ${
                    card.imageUrl ? 'border-amber-500/50' : 'border-white/5 bg-white/5 text-white/20'
                  }`}
                >
                  {card.imageUrl ? (
                    <img src={card.imageUrl} className="w-full h-full object-cover rounded-lg" alt="" />
                  ) : (
                    <span>P{i+1}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Stream Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col items-center">
        <div className="w-full max-w-4xl p-12 space-y-12 pb-24">
          <div className="space-y-16">
            {stream.map((card, index) => (
              <AssetCard 
                key={card.id} 
                card={card} 
                index={index}
                onUpdate={(updates) => updateCard(card.id, updates)}
                onGenerate={() => handleSingleRender(card.id, card.prompt)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CASEditor;
