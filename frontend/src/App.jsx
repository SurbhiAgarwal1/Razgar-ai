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
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto py-12 px-6">
        <header className="flex justify-between items-center mb-16 px-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-emerald-600 rounded-[1.5rem] flex items-center justify-center text-white font-black text-3xl shadow-xl shadow-emerald-200 rotate-3">R</div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tighter flex items-center gap-1">
                ROZGAR<span className="text-emerald-600 italic">AI</span>
              </h1>
              <p className="text-[10px] font-black text-emerald-600/50 uppercase tracking-[0.4em]">Digital Empowerment Portal</p>
            </div>
          </div>
          
          <LanguageSelector 
            currentLanguage={language} 
            onLanguageChange={setLanguage} 
          />
        </header>

        {view === 'form' && (
          <div className="animate-fade-up">
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

        <footer className="mt-32 pt-12 border-t border-slate-200/60 text-center">
          <div className="flex justify-center gap-10 mb-8 opacity-30 grayscale contrast-125">
            <img src="https://upload.wikimedia.org/wikipedia/commons/e/e4/Digital_India_logo.svg" alt="Digital India" className="h-10" />
            <img src="https://upload.wikimedia.org/wikipedia/en/thumb/4/41/Flag_of_India.svg/255px-Flag_of_India.svg.png" alt="India" className="h-10" />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Official Identification & Assessment Hub</p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[9px] text-slate-400 font-bold uppercase tracking-widest">
            <span>© 2026 ROZGARAI FOUNDATION</span>
            <span>•</span>
            <span>AES-256 SECURED</span>
            <span>•</span>
            <span>PRIVACY FIRST PROTOCOL</span>
          </div>
        </footer>
      </div>
    </div>
  )
}