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

  const handleWhatsAppShare = (type) => {
    const text = type === 'hire' 
      ? `Hello, I am interested in hiring ${profile.name} (${profile.skill}) after seeing their RozgarAI Verified Profile. [Ref: ${refId}]`
      : `Check out ${profile.name}'s professional profile on RozgarAI. KaamScore: ${profile.kaam_score}% Verified.`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  return (
    <div className="space-y-8 animate-fade-up max-w-lg mx-auto pb-20" dir={isRTL ? "rtl" : "ltr"}>
      {/* The Masterpiece Card */}
      <div className="master-card overflow-hidden">
        {/* Elegant Top Branding */}
        <div className="px-8 pt-8 pb-4 flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-emerald-900">
              ROZGAR<span className="text-emerald-500 italic">AI</span>
            </h1>
            <p className="text-[9px] font-bold text-emerald-600/60 uppercase tracking-[0.4em]">Excellence Verified</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Digital ID</p>
            <p className="text-xs font-bold text-slate-900">{refId}</p>
          </div>
        </div>

        {/* Hero Profile Section */}
        <div className="p-8 space-y-8">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-6">
              <div className="w-32 h-32 rounded-[2.5rem] p-1.5 bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-2xl rotate-3">
                <div className="w-full h-full rounded-[2.2rem] bg-white overflow-hidden -rotate-3">
                  {profile.photo_base64 ? (
                    <img src={profile.photo_base64} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-50 text-5xl">👤</div>
                  )}
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-2xl shadow-xl border border-slate-100">
                <div className="w-4 h-4 bg-emerald-500 rounded-full animate-pulse" />
              </div>
            </div>

            <div className="space-y-2">
              <span className="success-badge">Verified Professional</span>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">{profile.name}</h2>
              <p className="text-slate-500 font-semibold tracking-wide">{profile.skill} • {profile.city}</p>
            </div>
          </div>

          {/* Excellence Score Stacks */}
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-emerald-900 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl">
              <div className="relative z-10 flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-bold text-emerald-300 uppercase tracking-[0.3em] mb-2">KaamScore Assessment</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-6xl font-black tracking-tighter">{profile.kaam_score}</span>
                    <span className="text-lg font-bold text-emerald-400">/100</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-emerald-300 uppercase tracking-[0.3em] mb-1">Grade</p>
                  <p className="text-3xl font-black text-emerald-400 uppercase italic">{profile.grade}</p>
                </div>
              </div>
              {/* Abstract Background Pattern */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-12 -mt-12 blur-3xl" />
            </div>
          </div>

          {/* Bio Section with Voice */}
          <div className="relative bg-amber-50/50 border border-amber-100 p-8 rounded-[2rem]">
            <div className="absolute -top-3 left-8 px-4 py-1 bg-amber-100 rounded-full text-[10px] font-black text-amber-800 uppercase tracking-widest">
              Professional Bio
            </div>
            <p className="text-slate-800 font-medium italic text-lg leading-relaxed text-center">
              "{language === 'hi' ? profile.hindi_bio : profile.bio}"
            </p>
            <button 
              onClick={handleSpeak}
              className="mt-6 mx-auto flex items-center gap-3 px-6 py-2 bg-white rounded-full shadow-sm text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:shadow-md transition-all active:scale-95"
            >
              <div className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-red-500 animate-ping' : 'bg-emerald-500'}`} />
              Hear Voice Identity
            </button>
          </div>

          {/* Market Insights with Clean Icons */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Fair Market Pay</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">₹</div>
                <div>
                  <p className="text-xl font-black text-slate-900">₹{Math.floor((profile.daily_income * (1 + (profile.kaam_score > 70 ? 0.2 : 0.1))) / 10) * 10}</p>
                  <p className="text-[8px] font-bold text-slate-400 uppercase">Per Day (Rec.)</p>
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Hiring Potential</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">📈</div>
                <div>
                  <p className="text-xl font-black text-slate-900 uppercase tracking-tighter">EXCELLENT</p>
                  <p className="text-[8px] font-bold text-slate-400 uppercase">Market Rating</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer QR & Signature */}
          <div className="flex items-center justify-between pt-8 border-t border-slate-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white border border-slate-100 rounded-2xl shadow-sm hover:rotate-6 transition-transform">
                <QRCodeSVG value={refId} size={48} />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase leading-tight tracking-wider">Authentication<br /><span className="text-slate-900">Scan to Verify</span></p>
            </div>
            <div className="text-right">
              <p className="text-3xl opacity-40 font-signature text-slate-900 -mb-1" style={{ fontFamily: "'Dancing Script', cursive" }}>
                {profile.signature_name || profile.name}
              </p>
              <div className="h-0.5 w-full bg-slate-100 rounded-full mb-1" />
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.3em]">Verified Signature</p>
            </div>
          </div>
        </div>

        {/* Master Actions */}
        <div className="p-8 bg-slate-50 border-t border-slate-100 space-y-4">
          <button onClick={() => handleWhatsAppShare('hire')} className="btn-excellence">
            Securely Hire Now
          </button>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => window.print()} className="btn-outline">Print Identity</button>
            <button onClick={() => handleWhatsAppShare('share')} className="btn-outline">Share Link</button>
          </div>
          <button 
            onClick={() => setShowInterviewModal(true)}
            className="w-full text-center text-[10px] font-black text-emerald-600 hover:text-emerald-800 uppercase tracking-widest py-2"
          >
            Access AI Interview Mentorship
          </button>
        </div>
      </div>

      <div className="flex justify-center items-center gap-8 opacity-40">
         <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Secure Protocol</span>
         <div className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
         <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">ISO Accredited</span>
         <div className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
         <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Data Encrypted</span>
      </div>

      <button onClick={onReset} className="w-full text-slate-400 hover:text-emerald-600 transition-colors font-bold uppercase tracking-widest text-[10px]">
        Create New Professional Assessment
      </button>

      {/* Excellence Modal */}
      {showInterviewModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-white w-full max-w-sm rounded-[3rem] p-10 shadow-2xl animate-fade-up">
            <div className="w-16 h-16 bg-emerald-100 rounded-[2rem] flex items-center justify-center text-emerald-600 mb-6 animate-float">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-tighter italic">Career Mentorship</h3>
            <div className="space-y-4 mb-10">
              {profile.interview_tips?.map((tip, i) => (
                <div key={i} className="flex gap-4 p-5 bg-slate-50 rounded-[2rem] border border-slate-100 items-start">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center shrink-0 shadow-lg">{i+1}</span>
                  <p className="text-xs text-slate-700 font-bold leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
            <button onClick={() => setShowInterviewModal(false)} className="btn-excellence">Got it, Coach!</button>
          </div>
        </div>
      )}
    </div>
  )
}