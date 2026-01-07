
import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldAlert, X, ShieldX, Trophy, HeartPulse, ShieldCheck, User, Zap, 
  Terminal as TerminalIcon, Battery, BatteryLow, LayoutDashboard, 
  Target, Fingerprint, Cpu, Search, Brain, Activity, ZapOff, 
  Shield, List, BookOpen, Layers, HardDrive, Network, Eye,
  AlertOctagon, Users, AlertTriangle, FileWarning, Gavel, Lock, Radio,
  Smartphone
} from 'lucide-react';

interface HeaderProps {
  activeAnchor: string;
  scrollToSection: (id: string) => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (val: boolean) => void;
  onVersionClick?: () => void;
  isUnlocked?: boolean;
  powerSave?: boolean;
  onTogglePowerSave?: () => void;
  releasePhase: number;
  scrollPercentage: number;
  ambientStatus?: string;
}

export const Header: React.FC<HeaderProps> = ({ 
  activeAnchor, scrollToSection, isMenuOpen, setIsMenuOpen, onVersionClick, isUnlocked, powerSave, onTogglePowerSave, releasePhase, scrollPercentage, ambientStatus 
}) => {
  const [userData, setUserData] = useState<{ handle: string, bri: number } | null>(null);
  const [glitchText, setGlitchText] = useState(ambientStatus || 'STATUS: [PERIMETER_SYNC_INIT]');
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const checkUser = () => {
      const handle = localStorage.getItem('vigil_user_handle');
      const bri = localStorage.getItem('vigil_user_bri');
      if (handle) setUserData({ handle, bri: bri ? parseInt(bri) : 100 });
      else setUserData(null);
    };
    checkUser();
    const interval = setInterval(checkUser, 2000);
    return () => clearInterval(interval);
  }, []);

  // Glitch effect on status change - Triggered by Prop updates
  useEffect(() => {
    if (ambientStatus) {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789//[]_';
      let iterations = 0;
      const interval = setInterval(() => {
        setGlitchText(prev => 
          ambientStatus.split('').map((char, index) => {
            if (index < iterations) return ambientStatus[index];
            return chars[Math.floor(Math.random() * chars.length)];
          }).join('')
        );
        if (iterations >= ambientStatus.length) clearInterval(interval);
        iterations += 1;
      }, 25);
      return () => clearInterval(interval);
    }
  }, [ambientStatus]);

  useEffect(() => {
    if (activeAnchor && navRef.current) {
      const activeElement = navRef.current.querySelector(`[data-active="true"]`);
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [activeAnchor]);

  const navItems = [
    { id: 'hero', label: 'Control Surface', icon: <LayoutDashboard size={14} />, phase: 1 },
    
    { type: 'header', label: 'Hub 01 // Execution', phase: 2 },
    { id: 'system-simulation', label: 'Intent Validator', icon: <ShieldCheck size={14} />, phase: 2 },
    { id: 'mimicry-lab', label: 'Mimicry Lab', icon: <Fingerprint size={14} />, phase: 2 },
    
    { type: 'header', label: 'Hub 02 // Synthesis', phase: 3 },
    { id: 'intel-forge', label: 'Intelligence Forge', icon: <Zap size={14} />, color: 'cyan', phase: 3 },
    { id: 'reputation-search', label: 'Reputation Sync', icon: <Search size={14} />, color: 'cyan', phase: 3 },

    { type: 'header', label: 'Hub 05 // Watch', phase: 5 },
    { id: 'field-unit', label: 'Field Unit Hub', icon: <Smartphone size={14} />, color: 'emerald', phase: 5 },

    { type: 'header', label: 'Analysis // Threat', phase: 1 },
    { id: 'the-threat', label: 'Vulnerability Matrix', icon: <AlertOctagon size={14} />, color: 'red', phase: 1 },
    
    { type: 'header', label: 'Hub 03 // Biological', phase: 4 },
    { id: 'neural-firewall', label: 'Neural Firewall', icon: <Brain size={14} />, color: 'purple', phase: 4 },
    { id: 'neural-audit', label: 'Saccadic Audit', icon: <Eye size={14} />, color: 'cyan', phase: 4 },
    
    { type: 'header', label: 'Hub 04 // Apex', phase: 5 },
    { id: 'entropy-collider', label: 'Entropy Collider', icon: <Activity size={14} />, color: 'amber', phase: 5 },

    { type: 'header', label: 'Propaganda // Intelligence', phase: 2 },
    { id: 'comms-terminal', label: 'Comms Terminal', icon: <Radio size={14} />, color: 'red', phase: 2 },

    { type: 'header', label: 'Registry // Intelligence', phase: 1 },
    { id: 'features', label: 'Safety Co-pilot', icon: <List size={14} />, phase: 1 },
    { id: 'research-intro', label: 'Threat Research', icon: <BookOpen size={14} />, phase: 1 },
    
    { type: 'header', label: 'Protocol // Identity', phase: 5 },
    { id: 'about-us', label: 'Our Story', icon: <Users size={14} />, phase: 5 },

    { type: 'header', label: 'Community // Live', phase: 2 },
    { id: 'community-challenge', label: 'Active Challenge', icon: <Trophy size={14} />, color: 'amber', phase: 2 },

    { type: 'header', label: 'Deployment', phase: 5 },
    { id: 'cta', label: 'Pro Node Sync', icon: <Layers size={14} />, phase: 5 },
    { id: 'footer', label: 'Governance', icon: <HardDrive size={14} />, phase: 1 },
  ];

  const visibleItems = navItems.filter(item => (item.phase || 1) <= releasePhase);

  return (
    <aside className={`fixed inset-x-0 bottom-0 top-10 z-[100] bg-[#050505]/98 backdrop-blur-2xl md:backdrop-blur-none md:relative md:top-0 md:h-full w-full md:w-72 border-r border-zinc-900/50 transition-all duration-500 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
      <div className="flex flex-col h-full overflow-hidden">
        
        {/* PINNED IDENTITY HEADER */}
        <div className="p-6 shrink-0 relative z-30 bg-[#050505] border-b border-zinc-900/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 cursor-pointer group" onClick={() => scrollToSection('hero')}>
              <div className="w-6 h-6 bg-white flex items-center justify-center rounded-sm transition-all group-hover:rotate-90 group-hover:scale-110 duration-500">
                <div className="w-3 h-3 bg-black rotate-45" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tighter uppercase italic text-white leading-none">Vigil</span>
                <span className="text-[8px] font-black text-zinc-700 tracking-[0.4em] uppercase -mt-0.5">Layer Standard</span>
              </div>
            </div>
            <button onClick={() => setIsMenuOpen(false)} className="md:hidden text-zinc-500 hover:text-white p-2"><X className="w-6 h-6" /></button>
          </div>
          
          {/* AMBIENT TELEMETRY DISPLAY - ADAPTIVE BRIEFING */}
          <div className="mt-6 flex items-center gap-3 px-4 py-2.5 bg-zinc-950/20 border border-zinc-900/50 rounded-xl animate-sync-color-border overflow-hidden group">
             <div className="w-1.5 h-1.5 rounded-full shrink-0 animate-sync-color-bg shadow-[0_0_8px_currentColor]" />
             <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest whitespace-nowrap animate-sync-color-text font-mono truncate">
               {glitchText}
             </span>
          </div>
        </div>

        {/* NAVIGATION SCROLL VIEWPORT */}
        <div className="flex-1 min-0 relative overflow-y-auto custom-scrollbar px-6 py-4">
          <nav 
            ref={navRef} 
            className="space-y-1 pb-10 transition-all duration-700 ease-out"
          >
            {visibleItems.map((item, idx) => {
              if (item.type === 'header') return (
                <div key={idx} className="text-[9px] text-zinc-700 font-black uppercase tracking-[0.5em] mt-10 mb-4 px-4 flex items-center gap-3">
                  <div className="h-[1px] w-6 bg-zinc-900" />
                  {item.label}
                </div>
              );
              
              const isActive = activeAnchor === item.id;
              return (
                <button 
                  key={item.id} 
                  onClick={() => scrollToSection(item.id || '')} 
                  data-active={isActive} 
                  className={`w-full text-left px-4 py-3 rounded-2xl transition-all duration-500 flex items-center group relative border ${isActive ? 'bg-[#0a0a0a] border-zinc-800 scale-[1.02] shadow-lg' : 'text-zinc-600 border-transparent hover:text-zinc-300 hover:bg-zinc-950/40'}`}
                >
                  <div className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all duration-500 mr-4 shrink-0 ${isActive ? (item.color === 'emerald' ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'text-blue-500 bg-blue-500/10 border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]') : 'text-zinc-800 border-zinc-900/50'}`}>
                    {item.icon}
                  </div>
                  <span className={`text-[11px] font-black tracking-[0.2em] uppercase transition-all duration-500 ${isActive ? 'text-white translate-x-1' : 'group-hover:translate-x-0.5'}`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
        
        {/* PINNED BOTTOM CONTROLS SECTION */}
        <div className="p-6 border-t border-zinc-900/50 shrink-0 space-y-3 bg-[#050505] z-30 shadow-[0_-20px_40px_rgba(0,0,0,0.5)]">
          <button 
            onClick={onTogglePowerSave} 
            className={`w-full py-3.5 px-5 rounded-2xl border-2 flex items-center justify-between transition-all group active:scale-[0.98] ${powerSave ? 'bg-amber-600/10 border-amber-600/30 text-amber-500 shadow-[0_0_20px_rgba(217,119,6,0.1)]' : 'bg-[#080808] border-zinc-900 text-zinc-600 hover:border-zinc-800 shadow-inner'}`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-colors ${powerSave ? 'bg-amber-500 text-black border-amber-400' : 'bg-zinc-950 border-zinc-800 group-hover:border-zinc-700'}`}>
                {powerSave ? <BatteryLow size={14} /> : <Battery size={14} />}
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Power Save</span>
            </div>
            <div className={`w-1.5 h-1.5 rounded-full ${powerSave ? 'bg-amber-500 animate-pulse shadow-[0_0_8px_#f59e0b]' : 'bg-zinc-900'}`} />
          </button>

          <button 
            onClick={onVersionClick} 
            className="w-full py-3.5 px-4 rounded-2xl border-2 border-zinc-900 bg-[#080808] text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em] italic hover:text-blue-500 hover:border-blue-900/50 transition-all flex items-center justify-center group active:scale-[0.98]"
          >
            <TerminalIcon size={12} className="mr-2 opacity-50 group-hover:opacity-100 transition-opacity" />
            v 0.0.1.1 <span className="ml-2 not-italic text-[8px] opacity-40">DEFINITIVE</span>
          </button>
        </div>

      </div>
    </aside>
  );
};

export const SecurityAnnouncementBar: React.FC = () => (
  <div className="fixed top-0 left-0 right-0 h-10 z-[120] bg-red-600/10 backdrop-blur-md border-b border-red-500/20 flex items-center justify-center px-4 overflow-hidden">
    <div className="flex items-center gap-4 animate-in slide-in-from-top-4 duration-1000">
      <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
      <p className="text-[8.5px] md:text-[10px] font-bold text-white uppercase tracking-[0.15em]">
        Vigil has <span className="text-red-500 underline decoration-2 font-black">NO OFFICIAL TOKEN</span>. Avoid all phishing attempts.
      </p>
      <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
    </div>
  </div>
);

export const SecurityModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 bg-black/90 backdrop-blur-3xl animate-in fade-in duration-700">
      <div className="w-full max-w-2xl bg-[#080808] border border-red-900/40 rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-14 animate-flash-red relative overflow-hidden shadow-[0_0_100px_rgba(239,68,68,0.1)]">
        
        {/* Background Text Decor */}
        <div className="absolute top-0 right-0 p-8 opacity-[0.02] select-none pointer-events-none">
           <span className="text-[14rem] font-black italic leading-none">!</span>
        </div>

        <div className="relative z-10 flex flex-col items-center text-center space-y-10">
          <div className="space-y-4">
             <div className="flex items-center justify-center gap-3">
                <ShieldAlert className="w-12 h-12 text-red-600" />
                <div className="h-[1px] w-8 bg-red-900/50" />
                <span className="text-[11px] font-black text-red-500 uppercase tracking-[0.6em]">VIG-MASTER-NOTICE-01</span>
             </div>
             <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter leading-none">Security <br/> Protocol.</h2>
          </div>

          <div className="w-full space-y-6">
             <div className="p-6 bg-red-600/5 border border-red-500/20 rounded-2xl text-left flex items-start gap-5 shadow-inner">
                <AlertTriangle className="w-6 h-6 text-red-500 shrink-0 mt-1" />
                <div className="space-y-1">
                   <h4 className="text-[10px] font-black text-white uppercase tracking-widest underline decoration-red-600/40 underline-offset-4 mb-2">CRITICAL: TOKEN STATUS</h4>
                   <p className="text-zinc-400 text-xs md:text-sm font-medium leading-relaxed">
                     VIGIL represents a security standard for human-layer interception. We officially state that <span className="text-white font-black px-2 py-0.5 bg-red-600/20 rounded border border-red-500/40">NO OFFICIAL TOKEN EXISTS</span>. Any contract claiming association is a malicious phishing attempt.
                   </p>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                   { icon: <ZapOff className="w-4 h-4" />, t: "ADVISORY ONLY", d: "VIGIL provides warnings, not guarantees. We do not control or sign transactions." },
                   { icon: <Gavel className="w-4 h-4" />, t: "NO ADVICE", d: "Content is informational and does not constitute financial or legal instruction." },
                   { icon: <ShieldX className="w-4 h-4" />, t: "RISK ACCEPTANCE", d: "Security is probabilistic. Final execution remains the user's sole responsibility." },
                   { icon: <Lock className="w-4 h-4" />, t: "NON-CUSTODIAL", d: "We never access, store, or transmit your private keys or seed phrases." }
                ].map((point, i) => (
                   <div key={i} className="p-4 bg-zinc-950 border border-zinc-900 rounded-xl text-left space-y-2 group hover:border-zinc-800 transition-colors">
                      <div className="flex items-center gap-3 text-zinc-500 group-hover:text-zinc-300">
                         {point.icon}
                         <span className="text-[9px] font-black uppercase tracking-widest">{point.t}</span>
                      </div>
                      <p className="text-[10px] text-zinc-600 font-bold leading-relaxed uppercase italic">{point.d}</p>
                   </div>
                ))}
             </div>
          </div>

          <div className="w-full space-y-4 pt-4 border-t border-zinc-900/50">
             <button 
               onClick={onClose} 
               className="w-full py-5 bg-red-600 text-white text-xs font-black uppercase tracking-[0.5em] rounded-2xl hover:bg-red-500 shadow-[0_0_40px_rgba(239,68,68,0.2)] transition-all active:scale-[0.98]"
             >
               Acknowledge and Continue
             </button>
             <p className="text-[8px] font-black text-zinc-700 uppercase tracking-[0.4em]">
                Registry Sync Established // Operational Access Granted
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};
