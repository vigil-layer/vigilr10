import React, { useState, useEffect } from 'react';
import { Terminal, Activity, Eye, Scan, Binary, Shield } from 'lucide-react';

interface SystemBootProps {
  onComplete: () => void;
}

const SentinelOptic = ({ active, dissolve }: { active: boolean, dissolve: boolean }) => (
  <div className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ${dissolve ? 'opacity-0 scale-150 blur-2xl' : 'opacity-100 scale-100 blur-0'}`}>
    <svg viewBox="0 0 200 100" className="w-48 h-24 overflow-visible">
      <defs>
        <filter id="eyeGlow">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <linearGradient id="eyeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {/* Main Eyelid Path (Technical Frame) */}
      <path 
        d="M20,50 Q100,0 180,50 Q100,100 20,50" 
        fill="none" 
        stroke="rgba(34,211,238,0.2)" 
        strokeWidth="0.5" 
      />
      
      {/* Dynamic Iris/Pupil Group */}
      <g className="eye-iris">
        <animateTransform 
          attributeName="transform" 
          type="translate" 
          values="-5,0; 5,0; -5,0" 
          dur="4s" 
          repeatCount="indefinite" 
          begin="2s"
        />
        
        {/* Outer Iris Ring */}
        <circle 
          cx="100" cy="50" r="28" 
          fill="none" 
          stroke="rgba(34,211,238,0.4)" 
          strokeWidth="1" 
          strokeDasharray="4 4"
          className="animate-spin-slow"
        />
        
        {/* Core Pupil Reticle */}
        <circle 
          cx="100" cy="50" r="12" 
          fill="rgba(34,211,238,0.1)" 
          stroke="#22d3ee" 
          strokeWidth="1.5" 
          filter="url(#eyeGlow)"
          className={active ? 'animate-pulse' : ''}
        />
        
        {/* Inner Reticle Marks */}
        <line x1="100" y1="42" x2="100" y2="46" stroke="#22d3ee" strokeWidth="1" />
        <line x1="100" y1="54" x2="100" y2="58" stroke="#22d3ee" strokeWidth="1" />
        <line x1="92" y1="50" x2="96" y2="50" stroke="#22d3ee" strokeWidth="1" />
        <line x1="104" y1="50" x2="108" y2="50" stroke="#22d3ee" strokeWidth="1" />
      </g>

      {/* Scanning Line */}
      <line 
        x1="40" y1="30" x2="160" y2="30" 
        stroke="rgba(34,211,238,0.6)" 
        strokeWidth="1" 
        filter="url(#eyeGlow)"
      >
        <animate 
          attributeName="y1" 
          values="30; 70; 30" 
          dur="3s" 
          repeatCount="indefinite" 
        />
        <animate 
          attributeName="y2" 
          values="30; 70; 30" 
          dur="3s" 
          repeatCount="indefinite" 
        />
        <animate 
          attributeName="opacity" 
          values="0; 1; 0" 
          dur="3s" 
          repeatCount="indefinite" 
        />
      </line>

      {/* Top and Bottom Eyelid (Shutters) */}
      <g className="eyelids transition-all duration-700">
        <rect 
          x="0" y="0" width="200" height="50" 
          fill="#020202"
          className={`transition-transform duration-1000 ${active ? '-translate-y-full' : 'translate-y-0'}`}
        />
        <rect 
          x="0" y="50" width="200" height="50" 
          fill="#020202"
          className={`transition-transform duration-1000 ${active ? 'translate-y-full' : 'translate-y-0'}`}
        />
      </g>
    </svg>
  </div>
);

export const SystemBoot: React.FC<SystemBootProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'KERNEL' | 'MESH' | 'IDENTITY' | 'EXIT'>('KERNEL');
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  // PROGRESS MASTER CLOCK
  useEffect(() => {
    const pInterval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) return 100;
        // Optimized increments to ensure high-speed feel finishing in ~5s
        const inc = p < 30 ? 1.2 : p < 75 ? 0.6 : 1.8;
        return Math.min(100, p + inc);
      });
    }, 40);

    return () => clearInterval(pInterval);
  }, []);

  // SYNC PHASES AND COMPLETION WITH PROGRESS BAR
  useEffect(() => {
    if (progress === 0) {
      setLogs(["BOOT_SEQUENCE_INITIATED", "ENCRYPTED_HANDSHAKE_ESTABLISHED"]);
    } else if (progress >= 30 && progress < 70 && phase === 'KERNEL') {
      setPhase('MESH');
      setLogs(prev => ["CALIBRATING_SACCADIC_MESH", "SYNCING_SENTINEL_NODES", ...prev]);
    } else if (progress >= 70 && progress < 100 && phase === 'MESH') {
      setPhase('IDENTITY');
      setLogs(prev => ["VIGIL_WORDMARK_DECRYPTION", "CORE_SYNC_SUCCESSFUL", ...prev]);
    } else if (progress === 100 && phase === 'IDENTITY') {
      // Anchor completion strictly to 100% bar state
      const exitSequence = setTimeout(() => {
        setPhase('EXIT');
        setTimeout(onComplete, 1200); // 1.2s for the exit blur/scale animation
      }, 400); // Brief pause at 100% for confirmation before fade
      return () => clearTimeout(exitSequence);
    }
  }, [progress, phase, onComplete]);

  return (
    <div className={`fixed inset-0 z-[300] bg-[#020202] flex flex-col items-center justify-center overflow-hidden transition-all duration-1000 ${phase === 'EXIT' ? 'scale-110 opacity-0 blur-3xl' : 'opacity-100'}`}>
      
      {/* Background Data Flow */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* Forensic Scanning Grid */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
         <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/10" />
         <div className="absolute top-0 left-1/2 w-[1px] h-full bg-white/10" />
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/5 rounded-full animate-pulse" />
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border border-white/5 rounded-full" />
      </div>

      {/* Central Identity Monolith */}
      <div className="relative z-20 flex flex-col items-center gap-16">
        
        {/* The Forensic Reticle */}
        <div className="relative w-80 h-80 flex items-center justify-center">
           {/* Rotating Elements */}
           <div className={`absolute inset-0 border-[3px] border-white/5 rounded-full border-t-cyan-500/40 animate-spin-slow`} />
           <div className={`absolute inset-8 border border-white/5 rounded-full border-b-cyan-500/20 animate-spin-slow-reverse`} />
           
           {/* SENTINEL OPTIC EYE */}
           <SentinelOptic active={phase !== 'KERNEL'} dissolve={phase === 'IDENTITY'} />

           {/* ITALIACIZED TEXT WORDMARK */}
           <div className={`transition-all duration-1000 ${phase === 'IDENTITY' ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-90 blur-xl'}`}>
              <div className="text-center relative">
                {/* Refractive Shadow Layers */}
                <div className="absolute inset-0 text-cyan-500/30 blur-sm translate-x-1 -translate-y-1 animate-pulse italic font-black text-5xl md:text-6xl tracking-[0.1em] select-none whitespace-nowrap">
                  VIGIL
                </div>
                <div className="relative text-white italic font-black text-5xl md:text-6xl tracking-[0.15em] drop-shadow-[0_0_30px_rgba(255,255,255,0.4)] animate-pulse-flicker whitespace-nowrap">
                  VIGIL
                </div>
              </div>
           </div>

           {/* Scanning Crosshair (+) */}
           <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
              <div className="w-full h-[1px] bg-cyan-500/20 shadow-[0_0_15px_cyan]" />
              <div className="absolute h-full w-[1px] bg-cyan-500/20 shadow-[0_0_15px_cyan]" />
           </div>
        </div>

        {/* Tactical Readouts */}
        <div className="flex flex-col items-center gap-5 w-72">
           <div className="flex justify-between w-full text-[9px] font-black text-zinc-600 uppercase tracking-widest italic">
              <span className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-cyan-500 animate-pulse" />
                SYNCING_PROTOCOLS
              </span>
              <span className="tabular-nums">{Math.floor(progress)}%</span>
           </div>
           <div className="w-full h-[1px] bg-zinc-900 relative overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-white transition-all duration-500 ease-out shadow-[0_0_20px_white]"
                style={{ width: `${progress}%` }}
              />
           </div>
           <div className="h-6 overflow-hidden text-center">
              <p className="text-[11px] font-black text-cyan-500 uppercase tracking-[0.8em] animate-in slide-in-from-bottom duration-500 italic">
                {phase === 'KERNEL' ? 'KERNEL_INITIALIZING' : phase === 'MESH' ? 'MAPPING_HUMAN_PROTOCOL' : 'NODE_IDENTITY_STABLE'}
              </p>
           </div>
        </div>
      </div>

      {/* Registry Logs: Left Anchor */}
      <div className="absolute bottom-16 left-16 hidden lg:flex flex-col gap-3 max-w-xs opacity-40">
         <div className="flex items-center gap-3 mb-2">
            <Terminal size={12} className="text-zinc-600" />
            <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest italic">Registry Init Log</span>
         </div>
         <div className="space-y-2">
           {logs.map((log, i) => (
             <div key={i} className="text-[10px] font-mono text-zinc-600 animate-in slide-in-from-left-4 duration-500">
               <span className="text-zinc-800 mr-2">&gt;&gt;</span> {log}
             </div>
           ))}
         </div>
      </div>

      {/* Neural Status: Right Anchor */}
      <div className="absolute bottom-16 right-16 hidden lg:flex flex-col items-end gap-5 opacity-40">
         <div className="flex items-center gap-5">
            <div className="text-right">
               <div className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Resilience Threshold</div>
               <div className="text-sm font-black text-white italic tracking-tighter uppercase">Optimal_Sync</div>
            </div>
            <Activity size={28} className="text-emerald-500 animate-pulse" />
         </div>
         <div className="h-[1px] w-32 bg-zinc-900" />
         <div className="text-[9px] font-black text-zinc-800 uppercase tracking-[0.6em] italic">VIG-OS-MASTER-SYNC</div>
      </div>

      <style>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes spin-slow-reverse { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
        .animate-spin-slow { animation: spin-slow 12s linear infinite; }
        .animate-spin-slow-reverse { animation: spin-slow-reverse 18s linear infinite; }
        
        @keyframes pulse-flicker {
          0%, 100% { opacity: 1; filter: blur(0px); }
          92% { opacity: 1; filter: blur(0px); }
          94% { opacity: 0.8; filter: blur(1px); }
          96% { opacity: 0.3; filter: blur(2px); }
          98% { opacity: 0.9; filter: blur(0.5px); }
        }
        .animate-pulse-flicker { animation: pulse-flicker 4s infinite linear; }

        @keyframes scan-horizontal {
          0% { top: 30%; opacity: 0; }
          50% { opacity: 1; }
          100% { top: 70%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};
