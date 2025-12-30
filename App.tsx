
import React, { useState, useCallback, useRef } from 'react';
import { 
  Sparkles, Send, Loader2, Info, BookOpen, Layout, 
  PieChart, Repeat, Image as ImageIcon, Wand2, Upload, Trash2, Download
} from 'lucide-react';
import { generateInfographics, editImageWithAI } from './geminiService';
import { InfographicData } from './types';
import InfographicCard from './components/InfographicCard';

type AppMode = 'infographics' | 'studio';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>('infographics');
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Infographics state
  const [results, setResults] = useState<InfographicData[]>([]);

  // Studio state
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [sourceMime, setSourceMime] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      if (mode === 'infographics') {
        const infographics = await generateInfographics(prompt);
        setResults(infographics);
      } else {
        if (!sourceImage) {
          setError('Please upload an image first.');
          setIsLoading(false);
          return;
        }
        const base64Data = sourceImage.split(',')[1];
        const result = await editImageWithAI(base64Data, sourceMime || 'image/png', prompt);
        setEditedImage(result);
      }
    } catch (err) {
      console.error(err);
      setError(`Failed to process request: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setSourceImage(event.target?.result as string);
      setSourceMime(file.type);
      setEditedImage(null);
    };
    reader.readAsDataURL(file);
  };

  const clearStudio = () => {
    setSourceImage(null);
    setSourceMime(null);
    setEditedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-200">
                  <Layout className="text-white" size={24} />
                </div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight">
                  Infografix<span className="text-indigo-600">AI</span>
                </h1>
              </div>

              <nav className="flex bg-slate-100 p-1 rounded-xl">
                <button 
                  onClick={() => setMode('infographics')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'infographics' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  <PieChart size={18} />
                  Infographics
                </button>
                <button 
                  onClick={() => setMode('studio')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'studio' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  <Wand2 size={18} />
                  Image Studio
                </button>
              </nav>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 max-w-2xl w-full">
              <div className="relative group">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={mode === 'infographics' 
                    ? "Explain the water cycle..." 
                    : "Add a retro filter, remove the person, make it night..."
                  }
                  className="w-full bg-slate-50 border-2 border-slate-200 focus:border-indigo-500 focus:ring-0 rounded-2xl py-3 pl-5 pr-14 text-slate-800 font-medium transition-all group-hover:border-slate-300"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !prompt.trim() || (mode === 'studio' && !sourceImage)}
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-xl transition-colors flex items-center justify-center"
                >
                  {isLoading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Send size={18} />
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl mb-8 flex items-center gap-3">
            <Info size={20} />
            <p className="font-medium text-sm">{error}</p>
          </div>
        )}

        {/* Infographics Mode */}
        {mode === 'infographics' && (
          <>
            {!results.length && !isLoading && !error && (
              <div className="text-center py-20 max-w-2xl mx-auto">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-50 rounded-3xl mb-8">
                  <Sparkles className="text-indigo-600" size={40} />
                </div>
                <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Visualize Any Data</h2>
                <p className="text-slate-500 text-lg mb-10">
                  Generate 4 unique infographic styles from a simple topic description.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Stats', icon: PieChart },
                    { label: 'Flows', icon: Repeat },
                    { label: 'Versus', icon: BookOpen },
                    { label: 'Guides', icon: Info }
                  ].map((item, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center gap-2">
                      <item.icon size={20} className="text-indigo-500" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isLoading && (
              <div className="space-y-12">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white rounded-[2rem] p-10 border border-slate-100 animate-pulse">
                    <div className="h-10 w-2/3 bg-slate-100 rounded-lg mb-10"></div>
                    <div className="h-64 w-full bg-slate-50 rounded-2xl"></div>
                  </div>
                ))}
              </div>
            )}

            {results.length > 0 && (
              <div className="space-y-16 lg:space-y-24">
                {results.map((info) => (
                  <InfographicCard key={info.id} data={info} />
                ))}
              </div>
            )}
          </>
        )}

        {/* Image Studio Mode */}
        {mode === 'studio' && (
          <div className="max-w-5xl mx-auto">
            {!sourceImage ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="group relative border-2 border-dashed border-slate-300 bg-white hover:border-indigo-400 hover:bg-indigo-50/30 rounded-[2.5rem] p-20 flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden"
              >
                <div className="bg-indigo-50 text-indigo-600 p-6 rounded-3xl mb-6 group-hover:scale-110 transition-transform">
                  <Upload size={48} />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Upload Source Image</h3>
                <p className="text-slate-500 text-center max-w-sm">
                  Choose a photo to transform with AI. You can then use prompts to add filters, objects, or change the scene.
                </p>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>
            ) : (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <ImageIcon size={20} className="text-indigo-600" />
                    Studio Workspace
                  </h3>
                  <button 
                    onClick={clearStudio}
                    className="flex items-center gap-2 text-slate-400 hover:text-red-500 text-sm font-bold uppercase tracking-wider transition-colors"
                  >
                    <Trash2 size={16} />
                    Reset Studio
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Source */}
                  <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Original Image</span>
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
                      <img src={sourceImage} alt="Source" className="w-full h-full object-contain" />
                    </div>
                  </div>

                  {/* Result */}
                  <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">AI Edited Result</span>
                      {editedImage && (
                        <a 
                          href={editedImage} 
                          download="ai-edit.png"
                          className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                        >
                          <Download size={16} />
                        </a>
                      )}
                    </div>
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center">
                      {isLoading ? (
                        <div className="flex flex-col items-center gap-4 text-slate-400">
                          <Loader2 size={48} className="animate-spin text-indigo-600" />
                          <p className="text-sm font-medium animate-pulse">Applying AI Magic...</p>
                        </div>
                      ) : editedImage ? (
                        <img src={editedImage} alt="AI Result" className="w-full h-full object-contain" />
                      ) : (
                        <div className="text-center p-8 text-slate-300">
                          <Wand2 size={48} className="mx-auto mb-4 opacity-20" />
                          <p className="text-sm font-medium">Use the prompt above to edit this image</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-indigo-600 text-white p-8 rounded-[2rem] shadow-xl shadow-indigo-200">
                  <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                    <Sparkles size={20} />
                    Ready to transform?
                  </h4>
                  <p className="opacity-80 text-sm mb-6 max-w-2xl">
                    Type instructions in the top search bar. Try commands like "Add snow to the mountains", "Give this person a superhero costume", or "Apply a neon futuristic aesthetic".
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-slate-400 text-sm font-medium">
            &copy; {new Date().getFullYear()} Infografix AI & Studio. Built with Gemini 2.5 & 3.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
