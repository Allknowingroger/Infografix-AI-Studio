
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie
} from 'recharts';
import { 
  Activity, ArrowRight, CheckCircle, HelpCircle, 
  Info, Layers, Zap, TrendingUp, Users, Target 
} from 'lucide-react';
import { InfographicData, InfographicType } from '../types';

interface Props {
  data: InfographicData;
}

const InfographicCard: React.FC<Props> = ({ data }) => {
  const renderStatistical = () => {
    if (!data.stats) return null;
    return (
      <div className="mt-6 space-y-6">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.stats}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" fontSize={10} tick={{fill: '#64748b'}} />
              <YAxis fontSize={10} tick={{fill: '#64748b'}} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {data.stats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={data.accentColor} fillOpacity={0.8} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {data.stats.slice(0, 4).map((stat, idx) => (
            <div key={idx} className="bg-white/50 p-4 rounded-xl border border-slate-100 flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white shrink-0"
                style={{ backgroundColor: data.accentColor }}
              >
                <TrendingUp size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{stat.label}</p>
                <p className="text-lg font-bold text-slate-800">{stat.value}{stat.unit || ''}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderProcess = () => {
    if (!data.steps) return null;
    return (
      <div className="mt-8 relative">
        <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-slate-200"></div>
        <div className="space-y-8">
          {data.steps.map((step, idx) => (
            <div key={idx} className="relative flex gap-6 items-start group">
              <div 
                className="z-10 w-14 h-14 rounded-full border-4 border-white shadow-md flex items-center justify-center text-xl font-bold text-white transition-transform group-hover:scale-110"
                style={{ backgroundColor: data.accentColor }}
              >
                {idx + 1}
              </div>
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex-1 transition-all group-hover:shadow-md">
                <h4 className="font-bold text-slate-800 text-lg mb-1">{step.title}</h4>
                <p className="text-slate-600 text-sm leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderComparison = () => {
    if (!data.comparison) return null;
    const { sideA, sideB } = data.comparison;
    return (
      <div className="mt-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 bg-white p-6 rounded-2xl border-t-4 shadow-sm" style={{ borderTopColor: data.accentColor }}>
          <h4 className="font-bold text-slate-800 text-xl mb-4 text-center underline decoration-2 underline-offset-4" style={{ textDecorationColor: data.accentColor }}>
            {sideA.title}
          </h4>
          <ul className="space-y-4">
            {sideA.points.map((p, i) => (
              <li key={i} className="flex gap-3 text-sm text-slate-600">
                <CheckCircle className="shrink-0" size={18} style={{ color: data.accentColor }} />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center justify-center p-4">
          <div className="bg-slate-800 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs">VS</div>
        </div>
        <div className="flex-1 bg-slate-50 p-6 rounded-2xl border-t-4 border-slate-400 shadow-sm">
          <h4 className="font-bold text-slate-800 text-xl mb-4 text-center">{sideB.title}</h4>
          <ul className="space-y-4">
            {sideB.points.map((p, i) => (
              <li key={i} className="flex gap-3 text-sm text-slate-600">
                <ArrowRight className="shrink-0 text-slate-400" size={18} />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  const renderEducational = () => {
    if (!data.points) return null;
    return (
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.points.map((point, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 group hover:border-slate-200 transition-colors">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:rotate-6"
              style={{ backgroundColor: `${data.accentColor}15`, color: data.accentColor }}
            >
              <Info size={24} />
            </div>
            <h4 className="font-bold text-slate-800 text-lg mb-2">{point.title}</h4>
            <p className="text-slate-600 text-sm leading-relaxed">{point.text}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-slate-50/50 rounded-[2.5rem] p-8 md:p-10 border border-slate-200 shadow-xl overflow-hidden relative">
      <div 
        className="absolute top-0 right-0 w-64 h-64 opacity-5 -mr-20 -mt-20 rounded-full"
        style={{ backgroundColor: data.accentColor }}
      />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <span 
            className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-white"
            style={{ backgroundColor: data.accentColor }}
          >
            {data.type}
          </span>
        </div>
        
        <header className="mb-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight mb-2">
            {data.title}
          </h2>
          <p className="text-slate-500 font-medium text-lg leading-snug">
            {data.subtitle}
          </p>
        </header>

        <div className="prose prose-slate max-w-none">
          <p className="text-slate-700 leading-relaxed text-sm mb-6 bg-white/60 p-4 rounded-xl border border-white">
            {data.summary}
          </p>
        </div>

        {data.type === InfographicType.STATISTICAL && renderStatistical()}
        {data.type === InfographicType.PROCESS && renderProcess()}
        {data.type === InfographicType.COMPARISON && renderComparison()}
        {data.type === InfographicType.EDUCATIONAL && renderEducational()}
      </div>
    </div>
  );
};

export default InfographicCard;
