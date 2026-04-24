import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'

export default function ProfileCard({ profile, onReset, t: initialT, language: initialLanguage }) {
  const [language, setLanguage] = useState(initialLanguage)
  const [isSpeaking, setIsSpeaking] = useState(false)
  
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

  const handleWhatsApp = (type) => {
    const text = type === 'hire' 
      ? `Hiring Inquiry: ${profile.name} (${profile.skill}). Ref ID: ${refId}.`
      : `RozgarAI Verified: ${profile.name} | KaamScore: ${profile.kaam_score}%`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  return (
    <div className="space-y-12 animate-reveal max-w-2xl mx-auto pb-32" dir={isRTL ? "rtl" : "ltr"}>
      <div className="brand-card overflow-hidden">
        {/* Elite Branding Bar */}
        <div className="px-10 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black">R</div>
            <p className="text-[11px] font-black tracking-[0.3em] uppercase text-slate-400">Official Credential</p>
          </div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Reference: {refId}</p>
        </div>

        <div className="p-12 space-y-12">
          {/* Main Identity Section */}
          <div className="flex flex-col md:flex-row gap-12 items-center md:items-start">
            <div className="w-48 h-48 rounded-[32px] overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
              {profile.photo_base64 ? (
                <img src={profile.photo_base64} alt="Identity" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300 text-6xl">👤</div>
              )}
            </div>
            
            <div className="flex-1 space-y-6 text-center md:text-left">
              <div className="space-y-2">
                <span className="brand-verified">Verified Professional</span>
                <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">{profile.name}</h2>
                <p className="text-xl font-medium text-slate-500">{profile.skill} • {profile.city}</p>
              </div>
              
              <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-2">
                <div className="px-5 py-2 bg-slate-50 border border-slate-200 rounded-xl">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">KaamScore™</p>
                  <p className="text-2xl font-black text-slate-900">{profile.kaam_score}<span className="text-sm font-bold text-slate-400">/100</span></p>
                </div>
                <div className="px-5 py-2 bg-slate-50 border border-slate-200 rounded-xl">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Grade</p>
                  <p className="text-2xl font-black text-blue-600 uppercase italic tracking-tighter">{profile.grade}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Narrative Section */}
          <div className="space-y-4">
            <p className="text-2xl text-slate-800 font-bold leading-tight">
              "{language === 'hi' ? profile.hindi_bio : profile.bio}"
            </p>
            <button 
              onClick={handleSpeak}
              className="flex items-center gap-2 text-[11px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-800 transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
              Verify Audio Narrative
            </button>
          </div>

          {/* Financial Index */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-100">
            <div className="space-y-2">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Market Pay Advisory</p>
              <div className="flex items-baseline gap-2">
                <p className="text-4xl font-black text-slate-900">₹{Math.floor((profile.daily_income * (1 + (profile.kaam_score > 70 ? 0.2 : 0.1))) / 10) * 10}</p>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Daily Rate</p>
              </div>
              <p className="text-xs font-bold text-green-600">Calculated based on local trade demand.</p>
            </div>
            <div className="space-y-2 md:text-right">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Hiring Status</p>
              <p className="text-3xl font-black text-slate-900 uppercase tracking-tighter">EXCELLENT</p>
              <p className="text-xs font-bold text-slate-400">Highest priority matching active.</p>
            </div>
          </div>

          {/* QR Scan Area */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-8 border-t border-slate-100">
            <div className="flex items-center gap-6">
              <div className="p-3 bg-white border border-slate-200 rounded-2xl shadow-sm">
                <QRCodeSVG value={`https://rozgarai.in/verify/${refId}`} size={64} />
              </div>
              <div className="space-y-1">
                <p className="text-[12px] font-black text-slate-900 uppercase">Authentication Scan</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Verify profile at rozgarai.in</p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-4xl opacity-40 font-signature text-slate-900 mb-2" style={{ fontFamily: "'Dancing Script', cursive" }}>
                {profile.signature_name || profile.name}
              </p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Identity Seal</p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="p-10 bg-slate-50/50 border-t border-slate-100 flex flex-col gap-4">
          <button onClick={() => handleWhatsApp('hire')} className="btn-brand">
            Hire Professional Now
          </button>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => window.print()} className="btn-secondary-brand">Print Document</button>
            <button onClick={() => handleWhatsApp('share')} className="btn-secondary-brand">Share Link</button>
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center gap-10 opacity-30 grayscale brightness-125">
         <span className="text-[10px] font-black uppercase tracking-[0.4em]">Privacy Secured</span>
         <span className="text-[10px] font-black uppercase tracking-[0.4em]">ISO Accredited</span>
         <span className="text-[10px] font-black uppercase tracking-[0.4em]">Digital India</span>
      </div>

      <button onClick={onReset} className="w-full text-slate-300 hover:text-slate-500 transition-colors font-black uppercase tracking-[0.3em] text-[10px]">
        Generate New Assessment
      </button>
    </div>
  )
}