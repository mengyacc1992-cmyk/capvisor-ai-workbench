import React, { useState, useEffect } from 'react';
import { AppView, ParameterState, TopicCard, AssetCardData, FaceShape, HatType } from './types';
import ParameterDeck from './components/ParameterDeck';
import TopicGallery from './components/TopicGallery';
import CASEditor from './components/CASEditor';
import { generateTopics, generateSkeleton } from './services/geminiService';
import { login, logout, User } from './services/auth';
import { getToken } from './services/apiClient';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.DECK);
  const [params, setParams] = useState<ParameterState>({
    origin: ['显脸大'],
    scene: ['通勤'],
    faceShape: FaceShape.SQUARE_ROUND,
    gender: '女',
    hatType: HatType.FISHERMAN,
    volume: 12,
    depth: 1
  });
  
  const [topics, setTopics] = useState<TopicCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<TopicCard | null>(null);
  const [assetStream, setAssetStream] = useState<AssetCardData[]>([]);
  const [authing, setAuthing] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loginForm, setLoginForm] = useState({ email: 'demo@capvisor.ai', password: '' });

  useEffect(() => {
    const existing = getToken();
    if (existing) setToken(existing);
  }, []);

  const handleLogin = async () => {
    setAuthing(true);
    try {
      const res = await login(loginForm.email, loginForm.password);
      setUser(res.user);
      setToken(res.token);
    } catch (error: any) {
      console.error(error);
      alert(error?.message || 'Login failed');
    } finally {
      setAuthing(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setToken(null);
  };

  const handleStartGeneration = async () => {
    setLoading(true);
    try {
      const result = await generateTopics(params);
      setTopics(result);
      setView(AppView.TOPICS);
    } catch (error) {
      console.error(error);
      alert("Failed to generate topics.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTopic = async (topic: TopicCard) => {
    setSelectedTopic(topic);
    setLoading(true);
    try {
      const skeleton = await generateSkeleton(topic, params);
      setAssetStream(skeleton);
      setView(AppView.EDITOR);
    } catch (error) {
      console.error(error);
      alert("Failed to initialize CAS Editor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-white">
      {!token && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[200] p-6">
          <div className="w-full max-w-sm bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
            <h2 className="text-xl font-bold">Sign in</h2>
            <p className="text-sm text-white/50">使用你在 env 中配置的账号</p>
            <input
              className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
              placeholder="Email"
              value={loginForm.email}
              onChange={(e) => setLoginForm((f) => ({ ...f, email: e.target.value }))}
            />
            <input
              className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
              placeholder="Password"
              type="password"
              value={loginForm.password}
              onChange={(e) => setLoginForm((f) => ({ ...f, password: e.target.value }))}
            />
            <button
              onClick={handleLogin}
              disabled={authing}
              className="w-full py-2 rounded-lg bg-amber-500 text-black font-bold hover:bg-amber-400 transition-colors"
            >
              {authing ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 sticky top-0 bg-[#0a0a0a]/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center font-bold text-black">CV</div>
          <h1 className="text-xl font-bold tracking-tight">CapVisor <span className="text-amber-500">Workbench</span> <span className="text-xs text-white/40 ml-1">v2.0</span></h1>
        </div>
        
        <div className="flex items-center gap-3">
          {user && <span className="text-xs text-white/50">{user.email}</span>}
          {view !== AppView.DECK && (
            <button 
              onClick={() => setView(AppView.DECK)}
              className="text-xs px-3 py-1.5 rounded-full border border-white/10 hover:bg-white/5 transition-colors"
            >
              ← Back to Deck
            </button>
          )}
          {token && (
            <button 
              onClick={handleLogout}
              className="text-xs px-3 py-1.5 rounded-full border border-white/10 hover:bg-white/5 transition-colors"
            >
              Logout
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-[100] flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
            <p className="text-amber-500 font-medium animate-pulse">Syncing with Creative Brain...</p>
          </div>
        )}

        {view === AppView.DECK && (
          <div className="h-full overflow-y-auto custom-scrollbar p-8">
             <ParameterDeck params={params} setParams={setParams} onGenerate={handleStartGeneration} />
          </div>
        )}

        {view === AppView.TOPICS && (
          <div className="h-full overflow-y-auto custom-scrollbar p-8">
            <TopicGallery topics={topics} onSelect={handleSelectTopic} />
          </div>
        )}

        {view === AppView.EDITOR && selectedTopic && (
          <CASEditor 
            stream={assetStream} 
            setStream={setAssetStream} 
            topic={selectedTopic} 
            params={params} 
          />
        )}
      </main>
    </div>
  );
};

export default App;
