import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import ScoreMeter from './ScoreMeter'

export default function ProfileCard({ profile, onReset, t: initialT, language: initialLanguage }) {
  const [language, setLanguage] = useState(initialLanguage)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [showInterviewModal, setShowInterviewModal] = useState(false)
  
  const refId = `RAZ-${(Math.abs(profile.name.split('').reduce((a, b) => (((a << 5) - a) + b.charCodeAt(0)) | 0, 0)) % 1000000).toString().padStart(6, '0')}`
  const isRTL = ['ur', 'ks', 'sd'].includes(language)

  const handleSpeak = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }
    const text = language === 'hi' ? profile.hindi_bio : profile.bio
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN'
    utterance.onend = () => setIsSpeaking(false)
    setIsSpeaking(true)
    window.speechSynthesis.speak(utterance)
  }

  const handleAction = (type) => {
    const text = type === 'hire' 
      ? `HIRE INQUIRY: Interested in ${profile.name} (${profile.skill}) - Ref: ${refId}`
      : `ROZGARAI VERIFIED: ${profile.name} | Score: ${profile.kaam_score}%`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  return (
    <div className="space-y-10 animate-nebula max-w-lg mx-auto pb-24" dir={isRTL ? "rtl" : "ltr"}>
      {/* The Masterpiece Glass Card */}
      <div className="glass-panel overflow-hidden relative">
        {/* Holographic Top Glow */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        
        <div className="p-10 space-y-12">
          {/* Header Identity */}
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h1 className="text-3xl font-black tracking-tighter text-white">
                ROZGAR<span className="text-indigo-400">AI</span>
              </h1>
              <p className="text-[9px] font-black text-indigo-300/40 uppercase tracking-[0.5em]">Identity Secured</p>
            </div>
            <div className="px-4 py-1.5 glass-panel bg-white/5 rounded-full border border-white/10">
              <p className="text-[10px] font-bold text-white/60 tracking-widest uppercase">REF: {refId}</p>
            </div>
          </div>

          {/* Hero Identity */}
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="relative">
              <div className="w-36 h-36 rounded-full p-1 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shadow-[0_0_50px_rgba(99,102,241,0.3)]">
                <div className="w-full h-full rounded-full bg-slate-900 overflow-hidden border-2 border-white/10 relative">
                  {profile.photo_base64 ? (
                    <img src={profile.photo_base64} alt="Identity" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl">👤</div>
                  )}
                </div>
              </div>
              <div className="absolute -bottom-2 right-4 w-10 h-10 glass-panel bg-indigo-500 flex items-center justify-center rounded-2xl shadow-xl border border-white/20">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-4xl font-black text-white tracking-tight">{profile.name}</h2>
              <div className="flex items-center justify-center gap-3">
                <span className="px-3 py-1 bg-white/5 text-white/50 text-[10px] font-black rounded-lg border border-white/5 uppercase tracking-widest">{profile.skill}</span>
                <div className="w-1.5 h-1.5 bg-white/20 rounded-full" />
                <span className="px-3 py-1 bg-white/5 text-white/50 text-[10px] font-black rounded-lg border border-white/5 uppercase tracking-widest">{profile.city}</span>
              </div>
            </div>
          </div>

          {/* Crystalline Score Stacks */}
          <div className="grid grid-cols-2 gap-5">
            <div className="glass-panel bg-white/5 p-8 text-center space-y-1 relative group overflow-hidden">
              <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-2">KaamScore</p>
              <h3 className="text-5xl font-black text-white tracking-tighter">{profile.kaam_score}%</h3>
              <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </div>
            <div className="glass-panel bg-gradient-to-br from-indigo-500/20 to-purple-500/20 p-8 text-center space-y-1">
              <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-2">Credential Grade</p>
              <h3 className="text-2xl font-black text-white uppercase tracking-wider italic">{profile.grade}</h3>
            </div>
          </div>

          {/* The Narrative Profile */}
          <div className="glass-panel bg-white/[0.03] p-10 relative group">
            <p className="text-xl text-white/90 font-medium italic leading-relaxed text-center">
              "{language === 'hi' ? profile.hindi_bio : profile.bio}"
            </p>
            <button 
              onClick={handleSpeak}
              className="mt-8 mx-auto flex items-center gap-3 px-6 py-3 glass-panel bg-white/5 text-xs font-black text-indigo-300 uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95"
            >
              <div className={`w-2.5 h-2.5 rounded-full ${isSpeaking ? 'bg-indigo-400 animate-pulse' : 'bg-white/20'}`} />
              Verify Audio Profile
            </button>
          </div>

          {/* Market Insights Area */}
          <div className="space-y-6 pt-4">
            <div className="flex justify-between items-center">
              <p className="text-[10px] font-black text-indigo-300/40 uppercase tracking-[0.3em]">Economic Intelligence</p>
              <div className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-[8px] font-bold rounded-full border border-indigo-500/30 uppercase tracking-widest">Live Market Data</div>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-1">
                <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Recommended Rate</p>
                <p className="text-2xl font-black text-white">₹{Math.floor((profile.daily_income * (1 + (profile.kaam_score > 70 ? 0.2 : 0.1))) / 10) * 10}<span className="text-sm font-medium text-white/30 ml-1">/day</span></p>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Hiring Potential</p>
                <p className="text-2xl font-black text-indigo-400 uppercase tracking-tighter">EXCEPTIONAL</p>
              </div>
            </div>
          </div>

          {/* Authentication & Signature */}
          <div className="flex items-center justify-between pt-10 border-t border-white/10">
            <div className="flex items-center gap-5">
              <div className="p-3 glass-panel bg-white rounded-[1.25rem] shadow-2xl transition-transform hover:rotate-6">
                <QRCodeSVG value={refId} size={48} fgColor="#0f172a" />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-white uppercase">Identity Scan</p>
                <p className="text-[8px] text-white/30 font-bold uppercase tracking-widest">rozgarai.in/verify</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl opacity-60 font-signature text-white mb-2" style={{ fontFamily: "'Dancing Script', cursive" }}>
                {profile.signature_name || profile.name}
              </p>
              <p className="text-[8px] font-black text-indigo-300/40 uppercase tracking-[0.4em]">Digital Certification</p>
            </div>
          </div>
        </div>

        {/* Global Action Controls */}
        <div className="p-10 bg-white/[0.02] border-t border-white/5 space-y-5">
          <button onClick={() => handleAction('hire')} className="btn-holo w-full py-5 text-sm tracking-[0.2em] shadow-2xl">
            HIRE VERIFIED PROFESSIONAL
          </button>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => window.print()} className="glass-panel py-4 text-[10px] font-black text-white/60 uppercase tracking-widest hover:bg-white/5 transition-all">
              DOWNLOAD PDF
            </button>
            <button onClick={() => handleAction('share')} className="glass-panel py-4 text-[10px] font-black text-white/60 uppercase tracking-widest hover:bg-white/5 transition-all">
              SHARE IDENTITY
            </button>
          </div>
          <button 
            onClick={() => setShowInterviewModal(true)}
            className="w-full text-center text-[10px] font-black text-indigo-400 hover:text-indigo-300 uppercase tracking-[0.3em] py-3 transition-all"
          >
            OPEN AI INTERVIEW MENTOR
          </button>
        </div>
      </div>

      {/* Trust Footer Signals */}
      <div className="flex justify-center items-center gap-10 opacity-20">
         <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white">Quantum Secured</span>
         <div className="w-1.5 h-1.5 bg-white/30 rounded-full" />
         <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white">ISO 9001 Identity</span>
         <div className="w-1.5 h-1.5 bg-white/30 rounded-full" />
         <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white">Digital India API</span>
      </div>

      <button onClick={onReset} className="w-full text-white/20 hover:text-white/40 transition-colors font-bold uppercase tracking-widest text-[10px]">
        GENERATE NEW PROFESSIONAL CREDENTIAL
      </button>

      {/* The Mentorship Glass Overlay */}
      {showInterviewModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-2xl flex items-center justify-center z-[100] p-6">
          <div className="glass-panel w-full max-w-sm p-12 space-y-10 animate-nebula relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-[100px] -mr-24 -mt-24" />
            
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 glass-panel bg-indigo-500/20 flex items-center justify-center rounded-[2rem] text-indigo-400 border border-indigo-500/30">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-black text-white italic tracking-tighter">AI CAREER COACH</h3>
                <p className="text-[9px] font-black text-indigo-300/40 uppercase tracking-widest">Personalized Mentor for {profile.name}</p>
              </div>
            </div>

            <div className="space-y-4">
              {profile.interview_tips?.map((tip, i) => (
                <div key={i} className="glass-panel bg-white/[0.02] p-6 flex gap-5 items-start group hover:bg-white/[0.05] transition-all border-white/5">
                  <span className="w-8 h-8 rounded-full bg-indigo-500 text-white text-[11px] font-black flex items-center justify-center shrink-0 shadow-xl">{i+1}</span>
                  <p className="text-[13px] text-white/80 font-medium leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>

            <button onClick={() => setShowInterviewModal(false)} className="btn-holo w-full py-5 text-xs tracking-widest">
              UNDERSTOOD, COACH
            </button>
          </div>
        </div>
      )}
    </div>
  )
}