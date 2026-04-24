import { useState, useEffect } from 'react'
import axios from 'axios'
import WorkerForm from './components/WorkerForm'
import ProfileCard from './components/ProfileCard'
import LoadingState from './components/LoadingState'
import LanguageSelector from './components/LanguageSelector'
import translations from './translations'


export default function App() {
  const [view, setView] = useState('form')
  const [profileData, setProfileData] = useState(null)
  const [language, setLanguage] = useState('en')
  const [theme, setTheme] = useState('dark')
  const [t, setT] = useState(translations['en'])

  useEffect(() => {
    setT(translations[language])
  }, [language])

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-mode')
    } else {
      document.body.classList.remove('light-mode')
    }
  }, [theme])

  const handleSubmit = async (formData) => {
    setView('loading')
    
    try {
      const response = await axios.post('/api/generate', formData)
      setProfileData(response.data)
      setView('result')
    } catch (error) {
      const message = error.response?.data?.detail || error.message || 'Something went wrong'
      alert(message)
      setView('form')
    }
  }

  const handleReset = () => {
    setProfileData(null)
    setView('form')
  }

  return (
    <div className="min-h-screen relative overflow-hidden transition-all duration-500">
      <div className="max-w-xl mx-auto py-12 px-6 relative z-10">
        <header className="flex justify-between items-center mb-16">
          <div className="flex flex-col">
            <h1 className="text-3xl font-black tracking-tighter text-[var(--header-text)] group transition-all duration-500 flex items-center gap-2">
              ROZGAR<span className="text-indigo-500 group-hover:text-indigo-400">AI</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
            </h1>
            <p className="text-[10px] font-bold text-blue-400/60 uppercase tracking-[0.3em] mt-1">Worker Identity 2.0</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-10 h-10 glass-card rounded-xl flex items-center justify-center text-[var(--header-text)] hover:scale-105 active:scale-95 transition-all shadow-lg"
              title="Toggle Theme"
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.364-7.364l-.707-.707M6.364 19.364l-.707.707M12 21v1m0-1a5 5 0 01-5-5v-1.724a2 2 0 00-.714-1.542l-1.012-.81a1.106 1.106 0 01-.44-1.121L5 7a7 7 0 1114 0l.166 3.802a1.105 1.105 0 01-.44 1.121l-1.012.81a2 2 0 00-.714 1.542V15a5 5 0 01-5 5z" /></svg>
              ) : (
                <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
              )}
            </button>

            <LanguageSelector 
              currentLanguage={language} 
              onLanguageChange={setLanguage} 
            />
          </div>
        </header>

        {view === 'form' && (
          <div className="animate-fade-up">
            <WorkerForm onSubmit={handleSubmit} t={t} language={language} />
          </div>
        )}

        {view === 'loading' && <LoadingState t={t} />}

        {view === 'result' && profileData && (
          <ProfileCard 
            profile={profileData} 
            onDownload={() => {}}
            onReset={handleReset}
            t={t}
            language={language}
          />
        )}
      </div>

      {/* Decorative Blur Backgrounds */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none opacity-50">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-purple-500/10 blur-[100px] rounded-full" />
      </div>
    </div>
  )
}