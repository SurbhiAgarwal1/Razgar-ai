import { useState, useEffect } from 'react'
import axios from 'axios'
import WorkerForm from './components/WorkerForm'
import ProfileCard from './components/ProfileCard'
import LoadingState from './components/LoadingState'
import LanguageSelector from './components/LanguageSelector'
import translations from './translations'


export default function App() {
  const [view, setView] = useState('form')
  const [profile, setProfile] = useState(null)
  const [language, setLanguage] = useState('en')
  const [t, setT] = useState(translations['en'])

  useEffect(() => {
    setT(translations[language])
  }, [language])

  const handleSubmit = async (formData) => {
    setView('loading')
    try {
      const response = await axios.post('/api/generate', formData)
      setProfile(response.data)
      setView('result')
    } catch (error) {
      alert(error.response?.data?.detail || 'Failed to generate profile')
      setView('form')
    }
  }

  const handleReset = () => {
    setProfile(null)
    setView('form')
  }

  return (
    <div className="min-h-screen relative">
      {/* Dynamic Nebula Background */}
      <div className="mesh-bg" />

      <div className="max-w-2xl mx-auto py-16 px-6 relative z-10">
        <header className="flex justify-between items-center mb-20 px-6">
          <div className="flex items-center gap-6 group">
            <div className="w-16 h-16 glass-panel bg-indigo-600/30 flex items-center justify-center text-white font-black text-4xl shadow-[0_0_30px_rgba(99,102,241,0.4)] rotate-3 group-hover:rotate-0 transition-all">R</div>
            <div className="space-y-1">
              <h1 className="text-4xl font-black text-white tracking-tighter flex items-center gap-2">
                ROZGAR<span className="text-indigo-400 italic">AI</span>
              </h1>
              <p className="text-[10px] font-black text-indigo-300/40 uppercase tracking-[0.5em]">Identity & Economic Portal</p>
            </div>
          </div>
          
          <LanguageSelector 
            currentLanguage={language} 
            onLanguageChange={setLanguage} 
          />
        </header>

        <main className="relative">
          {view === 'form' && (
            <div className="animate-nebula">
              <WorkerForm onSubmit={handleSubmit} t={t} language={language} />
            </div>
          )}

          {view === 'loading' && <LoadingState t={t} />}

          {view === 'result' && profile && (
            <ProfileCard 
              profile={profile} 
              onReset={handleReset}
              t={t}
              language={language}
            />
          )}
        </main>

        <footer className="mt-32 pt-16 border-t border-white/5 text-center">
          <div className="flex justify-center gap-12 mb-10 opacity-10 contrast-150 brightness-200">
            <img src="https://upload.wikimedia.org/wikipedia/commons/e/e4/Digital_India_logo.svg" alt="Digital India" className="h-12" />
            <img src="https://upload.wikimedia.org/wikipedia/en/thumb/4/41/Flag_of_India.svg/255px-Flag_of_India.svg.png" alt="India" className="h-12" />
          </div>
          <p className="text-[11px] font-black text-white/20 uppercase tracking-[0.4em] mb-6">Secured via Quantum Encryption Protocol</p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-[10px] text-white/10 font-bold uppercase tracking-widest">
            <span>© 2026 ROZGARAI WORLDWIDE</span>
            <span>•</span>
            <span>AES-256 GCM SECURED</span>
            <span>•</span>
            <span>DATA SOVEREIGNTY PROTOCOL</span>
          </div>
        </footer>
      </div>
    </div>
  )
}