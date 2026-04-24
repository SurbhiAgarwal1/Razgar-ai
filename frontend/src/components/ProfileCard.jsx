import { useState, useRef } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import ScoreMeter from './ScoreMeter'

export default function ProfileCard({ profile, onReset, t: initialT, language: initialLanguage }) {
  const [language, setLanguage] = useState(initialLanguage)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [showInterviewModal, setShowInterviewModal] = useState(false)
  const cardRef = useRef(null)
  
  const refId = `RAZ-${(Math.abs(profile.name.split('').reduce((a, b) => (((a << 5) - a) + b.charCodeAt(0)) | 0, 0)) % 1000000).toString().padStart(6, '0')}`
  const isRTL = ['ur', 'ks', 'sd'].includes(language)

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const card = cardRef.current
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = (y - centerY) / 20
    const rotateY = (centerX - x) / 20
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`
  }

  const handleMouseLeave = () => {
    if (!cardRef.current) return
    cardRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`
  }

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
      ? `[OFFICIAL HIRING REQUEST] I am interested in ${profile.name} (${profile.skill}). Reference ID: ${refId}.`
      : `[ROZGARAI VERIFIED PROFILE] Name: ${profile.name} | KaamScore: ${profile.kaam_score}% | Status: ACTIVE.`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  return (
    <div className="space-y-12 animate-reveal max-w-lg mx-auto pb-32" dir={isRTL ? "rtl" : "ltr"}>
      <div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="luxury-glass overflow-hidden relative transition-all duration-200 ease-out"
      >
        {/* Holographic Top Rim */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent z-20" />
        
        <div className="p-12 space-y-12">
          {/* Header Branding */}
          <div className="flex justify-between items-start">
            <div className="group">
              <h1 className="text-3xl font-black tracking-tighter text-white flex items-center gap-1">
                ROZGAR<span className="text-indigo-400">AI</span>
              </h1>
              <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.6em]">Digital Identity Protocol</p>
            </div>
            <div className="px-5 py-2 glass-panel bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
              <p className="text-[9px] font-black text-indigo-300 uppercase tracking-widest">ID: {refId}</p>
            </div>
          </div>

          {/* Luxury Profile Section */}
          <div className="flex flex-col items-center text-center space-y-8">
            <div className="relative group/photo">
              <div className="w-40 h-40 rounded-full p-1.5 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shadow-[0_0_80px_rgba(99,102,241,0.4)] transition-transform duration-700 hover:scale-105">
                <div className="w-full h-full rounded-full bg-slate-950 overflow-hidden border-2 border-white/10 relative">
                  {profile.photo_base64 ? (
                    <img src={profile.photo_base64} alt="Identity" className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">👤</div>
                  )}
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-12 h-12 glass-panel bg-indigo-500 flex items-center justify-center rounded-[1.25rem] shadow-2xl border border-white/30 z-20">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-5xl font-black text-white tracking-tighter">{profile.name}</h2>
              <div className="flex items-center justify-center gap-4">
                <span className="px-4 py-1.5 bg-white/5 text-indigo-200 text-[10px] font-black rounded-xl border border-white/5 uppercase tracking-[0.2em]">{profile.skill}</span>
                <span className="px-4 py-1.5 bg-white/5 text-indigo-200 text-[10px] font-black rounded-xl border border-white/5 uppercase tracking-[0.2em]">{profile.city}</span>
              </div>
            </div>
          </div>

          {/* Assessment Metrics */}
          <div className="grid grid-cols-2 gap-6">
            <div className="luxury-glass bg-white/[0.03] p-10 text-center relative group overflow-hidden">
              <p className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.3em] mb-4">KaamScore Assessment</p>
              <h3 className="text-6xl font-black text-white tracking-tighter">{profile.kaam_score}%</h3>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </div>
            <div className={`luxury-glass p-10 text-center relative overflow-hidden shimmer-gold border-none`}>
               <p className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-4 relative z-10">Certification Grade</p>
               <h3 className="text-3xl font-black text-white uppercase tracking-[0.15em] italic relative z-10">{profile.grade}</h3>
            </div>
          </div>

          {/* Narrative & Voice */}
          <div className="luxury-glass bg-white/[0.02] p-12 relative overflow-hidden group">
            <p className="text-2xl text-white/90 font-medium italic leading-relaxed text-center">
              "{language === 'hi' ? profile.hindi_bio : profile.bio}"
            </p>
            <button 
              onClick={handleSpeak}
              className="mt-10 mx-auto flex items-center gap-4 px-8 py-4 luxury-glass bg-white/5 text-[10px] font-black text-indigo-300 uppercase tracking-[0.3em] hover:bg-white/10 transition-all"
            >
              <div className={`w-3 h-3 rounded-full ${isSpeaking ? 'bg-indigo-400 animate-pulse' : 'bg-white/10'}`} />
              Verify Audio Narrative
            </button>
          </div>

          {/* Market Intelligence Data */}
          <div className="space-y-8 pt-6">
            <div className="flex justify-between items-center px-4">
              <p className="text-[11px] font-black text-white/20 uppercase tracking-[0.4em]">Economic Value Indicators</p>
              <span className="px-3 py-1 bg-green-500/10 text-green-400 text-[9px] font-black rounded-full border border-green-500/20 uppercase tracking-widest">Active Market</span>
            </div>
            <div className="grid grid-cols-2 gap-8 px-4">
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Target Daily Wage</p>
                <p className="text-3xl font-black text-white tracking-tighter">₹{Math.floor((profile.daily_income * (1 + (profile.kaam_score > 70 ? 0.2 : 0.1))) / 10) * 10}<span className="text-xs text-white/30 ml-1 font-bold">AVG</span></p>
              </div>
              <div className="space-y-2 text-right">
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Hiring Potential</p>
                <p className="text-3xl font-black text-indigo-400 uppercase tracking-tighter italic">ELITE</p>
              </div>
            </div>
          </div>

          {/* Authentication & Signature */}
          <div className="flex items-center justify-between pt-12 border-t border-white/5">
            <div className="flex items-center gap-6">
              <div className="p-4 luxury-glass bg-white rounded-[2rem] shadow-[0_0_40px_rgba(255,255,255,0.1)] transition-transform hover:rotate-6">
                <QRCodeSVG value={`https://rozgarai.in/verify/${refId}`} size={56} fgColor="#020617" />
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-black text-white uppercase">Secure Scan</p>
                <p className="text-[9px] text-white/20 font-bold uppercase tracking-widest">Authenticated Hub</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-4xl opacity-50 font-signature text-white mb-3" style={{ fontFamily: "'Dancing Script', cursive" }}>
                {profile.signature_name || profile.name}
              </p>
              <p className="text-[9px] font-black text-white/10 uppercase tracking-[0.5em]">Identity Seal</p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="p-12 bg-white/[0.03] border-t border-white/5 space-y-6">
          <button onClick={() => handleAction('hire')} className="btn-premium">
            SECURELY CONTACT PROFESSIONAL
          </button>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => window.print()} className="luxury-glass py-5 text-[11px] font-black text-white/40 uppercase tracking-widest hover:text-white transition-all">
              OFFICIAL PRINT
            </button>
            <button onClick={() => handleAction('share')} className="luxury-glass py-5 text-[11px] font-black text-white/40 uppercase tracking-widest hover:text-white transition-all">
              SHARE IDENTITY
            </button>
          </div>
          <button 
            onClick={() => setShowInterviewModal(true)}
            className="w-full text-center text-[10px] font-black text-indigo-400 hover:text-indigo-300 uppercase tracking-[0.4em] py-4 transition-all"
          >
            OPEN AI PERFORMANCE MENTOR
          </button>
        </div>
      </div>

      <div className="flex justify-center items-center gap-12 opacity-10 grayscale brightness-200">
         <span className="text-[10px] font-black uppercase tracking-[0.5em]">Privacy Secured</span>
         <span className="text-[10px] font-black uppercase tracking-[0.5em]">ISO Accredited</span>
         <span className="text-[10px] font-black uppercase tracking-[0.5em]">Digital India</span>
      </div>

      <button onClick={onReset} className="w-full text-white/10 hover:text-white/30 transition-colors font-black uppercase tracking-[0.3em] text-[10px]">
        CREATE NEW OFFICIAL ASSESSMENT
      </button>

      {/* Luxury Mentorship Modal */}
      {showInterviewModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-[40px] flex items-center justify-center z-[100] p-8">
          <div className="luxury-glass w-full max-w-sm p-14 space-y-12 animate-reveal relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[120px] -mr-32 -mt-32" />
            
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-24 h-24 luxury-glass bg-indigo-600/20 flex items-center justify-center rounded-[2.5rem] text-white border border-indigo-500/30 shadow-2xl">
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-black text-white italic tracking-tighter">AI PERFORMANCE MENTOR</h3>
                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Personalized Insights</p>
              </div>
            </div>

            <div className="space-y-5">
              {profile.interview_tips?.map((tip, i) => (
                <div key={i} className="luxury-glass bg-white/[0.03] p-8 flex gap-6 items-start group border-white/5">
                  <span className="w-10 h-10 rounded-full bg-indigo-600 text-white text-xs font-black flex items-center justify-center shrink-0 shadow-2xl">{i+1}</span>
                  <p className="text-[15px] text-white/80 font-medium leading-relaxed italic">{tip}</p>
                </div>
              ))}
            </div>

            <button onClick={() => setShowInterviewModal(false)} className="btn-premium">
              CONFIRM PERFORMANCE ADVISORY
            </button>
          </div>
        </div>
      )}
    </div>
  )
}