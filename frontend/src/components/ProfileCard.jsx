import { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import ScoreMeter from './ScoreMeter'

export default function ProfileCard({ profile, onDownload, onReset, t: initialT, language: initialLanguage }) {
  const [language, setLanguage] = useState(initialLanguage)
  const [t, setT] = useState(initialT)
  const [showVerificationModal, setShowVerificationModal] = useState(false)
  const [showInterviewModal, setShowInterviewModal] = useState(false)
  const [employerPhone, setEmployerPhone] = useState('')
  const [showTooltip, setShowTooltip] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  
  const refId = `RAZ-${(Math.abs(profile.name.split('').reduce((a, b) => (((a << 5) - a) + b.charCodeAt(0)) | 0, 0)) % 1000000).toString().padStart(6, '0')}`

  const isRTL = ['ur', 'ks', 'sd'].includes(language)

  const hindiTranslations = {
    verified_by: "रोज़गारAI द्वारा सत्यापित",
    verified_skills: "सत्यापित कौशल",
    download_pdf: "PDF कार्ड डाउनलोड करें",
    share_whatsapp: "WhatsApp पर शेयर करें",
    generate_another: "नई प्रोफ़ाइल बनाएं",
    scan_to_verify: "सत्यापित करने के लिए स्कैन करें",
  }

  const toggleLanguage = () => {
    const newLang = language === 'hi' ? 'en' : 'hi'
    setLanguage(newLang)
    if (newLang === 'hi') {
      setT({ ...initialT, ...hindiTranslations })
    } else {
      setT(initialT)
    }
  }

  const handleSpeak = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }

    const text = language === 'hi' ? profile.hindi_bio : profile.bio
    const utterance = new SpeechSynthesisUtterance(text)
    
    const voiceMap = {
      'en': 'en-IN', 'hi': 'hi-IN', 'bn': 'bn-IN', 'te': 'te-IN', 
      'mr': 'mr-IN', 'ta': 'ta-IN', 'gu': 'gu-IN', 'kn': 'kn-IN', 
      'ml': 'ml-IN', 'pa': 'pa-IN', 'ur': 'ur-PK'
    }
    
    utterance.lang = voiceMap[language] || 'en-IN'
    utterance.rate = 0.9
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    setIsSpeaking(true)
    window.speechSynthesis.speak(utterance)
  }

  const handleDownload = async () => {
    try {
      const response = await fetch('/api/download-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      })
      if (!response.ok) throw new Error('Download failed')
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `RozgarAI_${profile.name.replace(' ', '_')}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      alert('Failed to download PDF: ' + error.message)
    }
  }

  const handleWhatsAppShare = () => {
    const text = `🔨 *RozgarAI Verified Profile*%0A%0A👤 Name: ${profile.name}%0A🏙️ City: ${profile.city}%0A⚒️ Trade: ${profile.skill}%0A📊 KaamScore: ${profile.kaam_score}/100%0A🏅 Grade: ${profile.grade}%0A⭐ ${profile.achievement}%0A%0A✅ Verified by RozgarAI — rozgarai.in`
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  const getTranslatedGrade = (grade) => {
    const grades = {
      'Bronze': t.grade_bronze,
      'Silver': t.grade_silver,
      'Gold': t.grade_gold,
      'Platinum': t.grade_platinum
    }
    return grades[grade] || grade
  }

  return (
    <div className="space-y-6 animate-fade-up" dir={isRTL ? "rtl" : "ltr"}>
      <div className="glass-card rounded-[2.5rem] overflow-hidden relative group hover:shadow-[0_20px_80px_rgba(99,102,241,0.15)] transition-all duration-700">
        {/* Holographic Top Border */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient-x" />
        
        {/* Verification Badge */}
        <div className="absolute -left-12 top-8 -rotate-45 bg-indigo-600 text-white text-[8px] font-black py-1.5 w-48 text-center uppercase tracking-[0.3em] shadow-xl z-30">
          AI Certified
        </div>

        <div className="absolute top-6 right-6 z-20">
          <button 
            onClick={toggleLanguage}
            className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all duration-300 ${
              language === 'hi' 
                ? 'bg-gradient-to-r from-orange-400 to-yellow-400 text-white shadow-lg' 
                : 'bg-white/10 text-white/50 hover:bg-white/20'
            }`}
          >
            {language === 'en' ? 'हिंदी' : 'English'}
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* Top Section: Photo + Score */}
          <div className="flex flex-col items-center">
            <div className="relative mb-6 group/photo">
              <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative z-10 transition-transform duration-500 group-hover:scale-105">
                <div className="w-full h-full rounded-full bg-slate-900 overflow-hidden border-2 border-white/10">
                  {profile.photo_base64 ? (
                    <img src={profile.photo_base64} alt={profile.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-white/5 text-4xl">👤</div>
                  )}
                </div>
              </div>
              <div className="absolute inset-0 bg-indigo-500/30 blur-2xl rounded-full -z-10 animate-pulse" />
            </div>

            <div 
              className="cursor-pointer relative"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onClick={() => setShowTooltip(!showTooltip)}
            >
              <ScoreMeter 
                score={profile.kaam_score} 
                grade={getTranslatedGrade(profile.grade)} 
                t={t}
              />
              {showTooltip && profile.breakdown && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full mb-4 w-64 glass-card bg-white p-4 rounded-xl shadow-2xl z-30 animate-fade-in border border-blue-100 text-slate-800">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Score Breakdown:</p>
                  <div className="space-y-2 text-xs">
                    {Object.entries(profile.breakdown).map(([key, val]) => (
                      <div key={key} className="flex justify-between">
                        <span className="capitalize">{key}</span>
                        <span className="font-bold text-green-600">+{val} pts</span>
                      </div>
                    ))}
                    <div className="border-t pt-2 mt-2 flex justify-between font-black text-sm">
                      <span>Total</span>
                      <span className="text-indigo-600">{profile.kaam_score}/100</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Name & Title */}
          <div className="text-center">
            <h2 className="text-3xl font-black text-[var(--header-text)] tracking-tight mb-1">{profile.name}</h2>
            <p className="text-blue-400/60 font-medium tracking-wide uppercase text-xs">
              {profile.city} • {profile.skill}
            </p>
            <div className="mt-4 flex justify-center gap-2">
              <span className="px-4 py-1.5 bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-black rounded-full uppercase tracking-widest flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                {t.verified_by}
              </span>
            </div>
          </div>

          {/* Bio with Audio */}
          <div className="relative group/bio bg-white/5 p-6 rounded-3xl border border-white/5 hover:bg-white/[0.08] transition-all duration-300">
            <p className="text-sm text-blue-100/80 leading-relaxed text-center font-medium">
              "{language === 'hi' ? profile.hindi_bio : profile.bio}"
            </p>
            <button 
              onClick={handleSpeak}
              className={`absolute -top-3 -right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-xl hover:scale-110 active:scale-95 ${
                isSpeaking ? 'bg-indigo-500 text-white animate-pulse' : 'bg-slate-800 text-blue-200/40 hover:text-white'
              }`}
            >
              {isSpeaking ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
              )}
            </button>
          </div>

          {/* Verification QR */}
          <div className="flex items-center gap-4 bg-indigo-600/10 p-4 rounded-2xl border border-indigo-500/10 group/qr hover:bg-indigo-600/20 transition-all">
            <div className="w-16 h-16 bg-white rounded-lg p-1 shrink-0 flex items-center justify-center overflow-hidden shadow-inner transition-transform group-hover:scale-110">
              <QRCodeSVG 
                value={JSON.stringify({ ref: refId, name: profile.name, score: profile.kaam_score })}
                size={60} renderAs="svg" bgColor="transparent" fgColor="#1a1a2e"
              />
            </div>
            <div className={isRTL ? "text-right" : "text-left"}>
              <p className="text-[10px] font-black text-white uppercase tracking-widest">{t.scan_to_verify}</p>
              <p className="text-[9px] text-indigo-300/50 font-mono tracking-tighter">REF: {refId}</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-amber-400 font-black text-sm tracking-tighter italic animate-bounce-slow">
                {t.achievement_prefix}{profile.achievement}
              </p>
            </div>
          </div>

          {/* Market Insights */}
          <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl p-6 border border-white/5 space-y-4 hover:shadow-[0_0_20px_rgba(99,102,241,0.1)] transition-all">
            <div className="flex justify-between items-center">
              <p className="text-[10px] font-black text-blue-200/30 uppercase tracking-[0.2em]">Market Insights</p>
              <span className="px-2 py-1 bg-green-500/20 text-green-300 text-[8px] font-bold rounded-md uppercase">Fair Pay Advisory</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-[10px] text-blue-200/50 font-bold uppercase">Est. Monthly Salary</p>
                <p className="text-xl font-black text-white">
                  ₹{Math.floor((profile.daily_income * 26 * (0.9 + profile.kaam_score / 100)) / 100) * 100} - 
                  ₹{Math.floor((profile.daily_income * 26 * (1.1 + profile.kaam_score / 100)) / 100) * 100}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-blue-200/50 font-bold uppercase">Rec. Daily Rate</p>
                <p className="text-xl font-black text-green-400 animate-pulse">
                  ₹{Math.floor((profile.daily_income * (1 + (profile.kaam_score > 70 ? 0.2 : 0.1))) / 10) * 10}
                </p>
              </div>
            </div>
          </div>

          {/* Testimonials */}
          <div className="space-y-4">
            <p className="text-[10px] font-black text-blue-200/30 uppercase tracking-[0.2em]">Employer Testimonials</p>
            <div className="grid grid-cols-1 gap-3">
              {profile.reviews?.map((review, i) => (
                <div key={i} className="glass-card bg-white/5 p-4 rounded-2xl border border-white/5 relative overflow-hidden group/review hover:bg-white/10 transition-all">
                  <p className="text-xs text-blue-50/90 italic mb-2 relative z-10 leading-relaxed">"{review.comment}"</p>
                  <div className="flex justify-between items-center relative z-10">
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-wider">— {review.author}</span>
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(s => <span key={s} className="text-[8px] animate-pulse">⭐</span>)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Social Proof & Signature */}
          <div className="pt-6 border-t border-white/5 space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 overflow-hidden shadow-lg hover:z-20 transition-transform hover:scale-110">
                    <img src={`https://i.pravatar.cc/100?u=${i + 100}`} alt="User" className="w-full h-full object-cover" />
                  </div>
                ))}
                <div className="w-8 h-8 rounded-full border-2 border-slate-900 bg-indigo-600 flex items-center justify-center text-[8px] font-black text-white shadow-lg z-10 animate-pulse">+12</div>
              </div>
              <p className="text-[9px] text-blue-200/40 font-bold uppercase tracking-widest">Endorsed by local contractors</p>
            </div>

            <div className="flex flex-col items-center group/sign">
              <p className="text-2xl text-blue-200/40 opacity-50 font-signature transition-all duration-500 group-hover:opacity-80 group-hover:text-indigo-400" style={{ fontFamily: "'Dancing Script', cursive" }}>
                {profile.signature_name || profile.name}
              </p>
              <div className="h-px w-32 bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent mt-1" />
              <p className="text-[8px] text-blue-200/20 uppercase tracking-[0.3em] mt-3 font-bold">Digital Signature of Worker</p>
            </div>
          </div>
        </div>
      </div>

      {/* Buttons Section */}
      <div className="flex flex-col gap-3 px-2">
        <button
          onClick={() => {
            const text = `Hi ${profile.name}, I saw your RozgarAI profile (Score: ${profile.kaam_score}). I'd like to talk about a job for a ${profile.skill}.`
            window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
          }}
          className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-black rounded-2xl hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all shadow-xl uppercase tracking-widest text-sm flex items-center justify-center gap-2 active:scale-95"
        >
          Hire {profile.name.split(' ')[0]} Now
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button onClick={handleDownload} className="py-4 bg-white text-slate-900 font-black rounded-2xl hover:bg-blue-50 transition-all uppercase tracking-widest text-[10px] active:scale-95 shadow-lg">
            {t.download_pdf}
          </button>
          <button onClick={handleWhatsAppShare} style={{ background: '#25D366' }} className="py-4 text-white font-black rounded-2xl hover:opacity-90 transition-all uppercase tracking-widest text-[10px] active:scale-95 shadow-lg flex items-center justify-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            {t.share_whatsapp}
          </button>
        </div>

        <button
          onClick={() => setShowInterviewModal(true)}
          className="w-full py-4 bg-white/5 border border-indigo-500/20 text-indigo-300 font-bold rounded-2xl hover:bg-indigo-500/10 transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-2 active:scale-95 shadow-inner"
        >
          AI Job Interview Tips
        </button>

        <button onClick={onReset} className="w-full py-4 glass-card text-white/50 font-bold rounded-2xl hover:bg-white/5 transition-all uppercase tracking-widest text-sm active:scale-95">
          {t.generate_another}
        </button>
      </div>

      {/* Interview Modal */}
      {showInterviewModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-white w-full max-w-sm rounded-[2rem] p-8 relative animate-fade-up shadow-[0_20px_100px_rgba(99,102,241,0.3)]">
            <button onClick={() => setShowInterviewModal(false)} className="absolute top-6 right-6 text-slate-300 hover:text-slate-900 transition-colors">✕</button>
            <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 text-indigo-600 animate-bounce-slow">💡</div>
            <h3 className="text-xl font-black text-slate-900 mb-2">AI Job Interview Tips</h3>
            <div className="space-y-4 mb-8">
              {profile.interview_tips?.map((tip, i) => (
                <div key={i} className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-indigo-50/50 transition-colors">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-[10px] font-black flex items-center justify-center shrink-0 shadow-md">{i+1}</span>
                  <p className="text-sm text-slate-700 font-medium leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
            <button onClick={() => setShowInterviewModal(false)} className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all uppercase tracking-widest text-sm shadow-xl active:scale-95">Got it!</button>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s infinite ease-in-out;
        }
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s infinite linear;
        }
      `}} />
    </div>
  )
}