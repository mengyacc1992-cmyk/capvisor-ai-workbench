
import React from 'react';
import { TopicCard } from '../types';

interface Props {
  topics: TopicCard[];
  onSelect: (topic: TopicCard) => void;
}

const TopicGallery: React.FC<Props> = ({ topics, onSelect }) => {
  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold">Recommended Topics</h2>
          <p className="text-white/50">Multi-dimensional matrix results based on your configuration.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/30">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          8 Models Converged
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {topics.map((topic, i) => (
          <div 
            key={topic.id}
            className="group relative bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-amber-500/50 hover:bg-white/10 transition-all cursor-pointer flex flex-col justify-between overflow-hidden"
            onClick={() => onSelect(topic)}
          >
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="bg-amber-500 text-black text-[10px] font-bold px-2 py-1 rounded">HOT</span>
            </div>
            
            <div className="space-y-4">
              <div className="text-xs text-amber-500 font-mono">TOPIC_{i+1}</div>
              <h3 className="text-xl font-bold leading-tight group-hover:text-amber-400 transition-colors">{topic.title}</h3>
              <p className="text-sm text-white/50 line-clamp-3">{topic.summary}</p>
            </div>

            <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] text-white/30 uppercase tracking-tighter">Est. Engagement</span>
                <div className="flex items-center gap-1">
                   <div className="h-1 w-20 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500" style={{ width: `${topic.heat}%` }}></div>
                   </div>
                   <span className="text-xs font-bold">{topic.heat}k</span>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-black transition-all">
                →
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopicGallery;
