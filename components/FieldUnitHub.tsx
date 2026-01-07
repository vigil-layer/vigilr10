import React, { useState, useEffect } from 'react';
import { 
  Zap, Activity, Smartphone, ChevronRight, Fingerprint, 
  Terminal, Globe, ShieldCheck,
  Loader2, Power, Scan, Target,
  FileCheck, Link, Activity as Pulse, Folder,
  FileCode, Copy, Check, Download,
  Radar, Lock, CheckCircle2
} from 'lucide-react';
import { analyzeAddressInterception, InterceptionSynthesisResponse } from '../services/geminiService';
import { calculateCompositeThreat, getAxesFromVerdict } from '../utils/threatIndex';
import { SILO_MANIFEST, ManifestFile } from '../registry/fieldUnitSilo';

type NodeState = 'UNAUTHORIZED' | 'HANDSHAKE' | 'PRO_ACTIVE';
type HubView = 'INTERCEPT' | 'SYNC';

interface HoverScanState {
  address: string | null;
  x: number;
  y: number;
  result: InterceptionSynthesisResponse | null;
  loading: boolean;
  localVerdict: string | null;
  localConfidence: number | null;
}

const CURRENT_SILO_VERSION = "0.0.4.5";

const NeuralParityHeader = ({ synced }: { synced: boolean }) => (
  <div className="flex items-center gap-6">
    <div className="flex items-center gap-3">
      <div className={`w-2 h-2 rounded-full animate-pulse ${synced ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-red-600 shadow-[0_0_10px_#ef4444]'}`} />
      <div className="flex flex-col">
        <span className={`text-[10px] font-black uppercase tracking-widest ${synced ? 'text-emerald-500' : 'text-red-500'}`}>
          NEURAL PARITY: {synced ? 'ACTIVE' : 'PENDING_UPDATE'}
        </span>
      </div>
    </div>
    <div className="h-6 w-[1px] bg-zinc-800" />
    <div className="hidden md:flex items-center gap-6 overflow-hidden">
      {['VALIDATOR.JS', 'DIFF.JS', `MANIFEST_${CURRENT_SILO_VERSION}`].map((file, i) => (
        <div key={i} className="flex items-center gap-2 shrink-0">
          <FileCheck size={11} className="text-zinc-600" />
          <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-tighter">{file}</span>
        </div>
      ))}
    </div>
  </div>
);

const DeploymentManifestCard = () => (
  <div className="bg-[#080808] border border-zinc-900 rounded-[2.5rem] p-10 flex flex-col h-full relative overflow-hidden group shadow-2xl">
    <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
      <Fingerprint className="w-64 h-64 text-white" strokeWidth={0.5} />
    </div>
    <div className="relative z-10 space-y-10 flex-1">
      <div className="space-y-4">
        <div className="px-4 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg inline-block">
          <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">DEPLOYMENT_MANIFEST</span>
        </div>
        <h3 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-[0.8]">VIGIL <br/> FIELD UNIT.</h3>
      </div>
      <div className="space-y-6">
        {['12MS LATENCY', 'SHADOW DOM', 'MESH SYNC'].map((item, i) => (
          <div key={i} className="flex items-start gap-4">
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-800 mt-1.5" />
            <div className="space-y-1">
              <h5 className="text-[11px] font-black text-white uppercase tracking-widest">{item}</h5>
              <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">PROTOCOL STANDARD</p>
            </div>
          </div>
        ))}
      </div>
    </div>
    <button className="relative z-10 mt-12 w-full py-5 bg-white text-black rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all hover:bg-emerald-500 hover:text-white flex items-center justify-between px-8 group/btn active:scale-95">
      <div className="flex items-center gap-3"><Smartphone size={16} /><span>INSTALL UNIT</span></div>
      <ChevronRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
    </button>
  </div>
);

export const FieldUnitHub: React.FC = () => {
  const [nodeState, setNodeState] = useState<NodeState>(() => 
    localStorage.getItem('vigil_node_verified') === 'true' ? 'PRO_ACTIVE' : 'UNAUTHORIZED'
  );
  const [syncedFiles, setSyncedFiles] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('vigil_synced_files_v12');
    if (saved) return JSON.parse(saved);
    const initial: Record<string, boolean> = {};
    SILO_MANIFEST.forEach(f => { initial[f.path] = false; });
    return initial;
  });

  const [view, setView] = useState<HubView>('INTERCEPT');
  const [activeFile, setActiveFile] = useState<ManifestFile>(SILO_MANIFEST[0]);
  const [intercepts, setIntercepts] = useState<string[]>([]);
  const [hoverScan, setHoverScan] = useState<HoverScanState>({ 
    address: null, x: 0, y: 0, result: null, loading: false, localVerdict: null, localConfidence: null 
  });
  const [copyFeedback, setCopyFeedback] = useState(false);
  const isSynced = Object.values(syncedFiles).every(v => v === true);

  useEffect(() => {
    const chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
    const addr = () => Array.from({length: 44}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    setIntercepts(Array.from({length: 12}, addr));
  }, []);

  const initiateHandshake = () => {
    setNodeState('HANDSHAKE');
    setTimeout(() => {
      setNodeState('PRO_ACTIVE');
      localStorage.setItem('vigil_node_verified', 'true');
    }, 2000);
  };

  const handleInterceptHover = async (e: React.MouseEvent, addr: string) => {
    const localV = addr.startsWith('Ab1C') ? 'MALICIOUS' : 'SUSPICIOUS';
    const axes = getAxesFromVerdict(localV === 'MALICIOUS' ? 'POISON' : 'NEW');
    const localConf = calculateCompositeThreat(axes);

    setHoverScan({ 
      address: addr, x: e.clientX, y: e.clientY, 
      result: null, loading: true, 
      localVerdict: localV, localConfidence: localConf 
    });

    try {
      const res = await analyzeAddressInterception(addr);
      setHoverScan(prev => ({ ...prev, result: res, loading: false }));
    } catch {
      setHoverScan(prev => ({ ...prev, loading: false }));
    }
  };

  return (
    <section id="field-unit" className="px-6 md:px-20 py-24 bg-[#020202] relative z-10 overflow-hidden border-t border-zinc-900/50">
      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-600/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center">
            <Smartphone className="w-6 h-6 text-emerald-500 animate-pulse" />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">Field Unit // Command Center</span>
            <h2 className="text-4xl md:text-7xl font-black text-white italic uppercase tracking-tighter leading-[0.8]">The Unit.</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-9">
            <div className="bg-[#050505] border-2 border-zinc-900 rounded-[3.5rem] overflow-hidden flex flex-col shadow-2xl h-[800px] relative">
              <div className="h-16 bg-[#0a0a0a] border-b border-zinc-900 flex items-center px-10 justify-between shrink-0">
                <NeuralParityHeader synced={isSynced} />
                <div className="flex items-center gap-3 text-[9px] font-black text-zinc-700 uppercase italic">
                  <Link size={11} /> Shadow Sync v1.5
                </div>
              </div>

              <div className="h-14 bg-zinc-950/50 border-b border-zinc-900 flex items-center px-10 justify-between shrink-0">
                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${nodeState === 'PRO_ACTIVE' ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-800'}`} />
                    <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-widest">VIG-NODE-0.5</span>
                  </div>
                  <div className="p-1 bg-black border border-zinc-900 rounded-lg flex gap-1">
                    <button onClick={() => setView('INTERCEPT')} className={`px-4 py-1.5 rounded text-[8px] font-black uppercase transition-all ${view === 'INTERCEPT' ? 'bg-zinc-800 text-white' : 'text-zinc-600'}`}>Intercept Log</button>
                    <button onClick={() => setView('SYNC')} className={`px-4 py-1.5 rounded text-[8px] font-black uppercase transition-all ${view === 'SYNC' ? 'bg-blue-600 text-white' : 'text-zinc-600'}`}>Physical Sync</button>
                  </div>
                </div>
              </div>

              {nodeState === 'UNAUTHORIZED' && (
                <div className="absolute inset-0 top-30 z-50 bg-[#050505]/95 backdrop-blur-xl flex flex-col items-center justify-center p-12 text-center space-y-8">
                   <Lock className="w-16 h-16 text-zinc-800" />
                   <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Identity Locked.</h3>
                   <button onClick={initiateHandshake} className="px-12 py-5 bg-white text-black text-[11px] font-black uppercase tracking-[0.4em] rounded-2xl hover:bg-emerald-500 hover:text-white">CONNECT SENTINEL</button>
                </div>
              )}

              <div className="flex-1 overflow-hidden">
                {view === 'INTERCEPT' ? (
                  <div className="p-10 space-y-8 overflow-y-auto h-full no-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                       {intercepts.map((addr, i) => (
                         <div key={i} onMouseEnter={(e) => handleInterceptHover(e, addr)} onMouseLeave={() => setHoverScan(prev => ({ ...prev, address: null }))} className="p-5 bg-zinc-900/40 border border-zinc-900 rounded-2xl flex items-center justify-between group hover:border-red-500/30 cursor-crosshair">
                            <div className="font-mono text-[10px] text-zinc-500 group-hover:text-zinc-200">{addr.slice(0, 4)}...{addr.slice(-4)}</div>
                            <Radar size={12} className="text-zinc-800 group-hover:text-red-500" />
                         </div>
                       ))}
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-12 h-full">
                    <div className="col-span-7 p-10 border-r border-zinc-900/50 overflow-y-auto no-scrollbar">
                       <pre className="font-mono text-[11px] text-zinc-500 leading-relaxed"><code>{activeFile.content}</code></pre>
                    </div>
                    <div className="col-span-5 p-10 space-y-2 overflow-y-auto no-scrollbar">
                       {SILO_MANIFEST.map(file => (
                         <button key={file.path} onClick={() => setActiveFile(file)} className={`w-full p-4 rounded-xl border transition-all text-left ${activeFile.path === file.path ? 'bg-blue-600/10 border-blue-600 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}>
                           <span className="text-[10px] font-mono uppercase">{file.path}</span>
                         </button>
                       ))}
                    </div>
                  </div>
                )}
              </div>

              {hoverScan.address && (
                <div className="fixed pointer-events-none z-[60] bg-[#0a0a0a] border-2 rounded-[2.5rem] p-6 shadow-2xl border-blue-600 w-64" style={{ left: hoverScan.x + 20, top: hoverScan.y - 100 }}>
                   <div className="text-[10px] font-black text-zinc-500 uppercase mb-2">Verdict</div>
                   <div className="text-2xl font-black text-white italic">{hoverScan.localVerdict}</div>
                   <div className="mt-4 h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: `${hoverScan.localConfidence}%` }} />
                   </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-3"><DeploymentManifestCard /></div>
        </div>
      </div>
    </section>
  );
};