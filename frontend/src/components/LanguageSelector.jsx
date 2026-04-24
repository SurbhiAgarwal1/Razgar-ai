import { useState, useRef, useEffect } from 'react'
import { languageList } from '../translations'

export default function LanguageSelector({ currentLanguage, onLanguageChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedLang = languageList.find(l => l.code === currentLanguage) || languageList[0]

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 glass-card rounded-full text-sm font-semibold hover:bg-white/10 transition group"
        title="Change Language"
      >
        <span className="text-lg group-hover:scale-110 transition-transform">🌐</span>
        <span className="hidden sm:inline">{selectedLang.native}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 max-h-[300px] overflow-y-auto glass-card rounded-xl shadow-2xl z-[1000] border border-white/10 animate-fade-in custom-scrollbar">
          <div className="py-2">
            {languageList.map((lang) => {
              const isRTL = ['ur', 'ks', 'sd'].includes(lang.code)
              return (
                <button
                  key={lang.code}
                  onClick={() => {
                    onLanguageChange(lang.code)
                    setIsOpen(false)
                  }}
                  className={`w-full px-4 py-2.5 text-left hover:bg-white/10 transition-colors flex items-center justify-between ${
                    currentLanguage === lang.code ? 'bg-blue-600/20 text-blue-400' : 'text-white/80'
                  }`}
                  dir={isRTL ? 'rtl' : 'ltr'}
                >
                  <div className={`flex flex-col ${isRTL ? 'items-end' : 'items-start'}`}>
                    <span className="text-sm font-bold">{lang.native}</span>
                    <span className="text-[10px] opacity-50 uppercase tracking-wider">{lang.label}</span>
                  </div>
                  {currentLanguage === lang.code && (
                    <span className="text-blue-400">✓</span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  )
}
