import { useState, useEffect } from 'react'

export default function LoadingState({ t }) {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)

  const loadingSteps = [
    "Establishing secure connection...",
    "Analyzing work experience...",
    "Calculating KaamScore trust metrics...",
    "Generating AI professional summary...",
    "Syncing with RozgarAI Trust Network...",
    "Finalizing your digital credential..."
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + 1
        if (next >= 100) {
          clearInterval(interval)
          return 100
        }
        return next
      })
    }, 40)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const stepIndex = Math.min(Math.floor((progress / 100) * loadingSteps.length), loadingSteps.length - 1)
    setCurrentStep(stepIndex)
  }, [progress])

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-2xl flex items-center justify-center z-50 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 blur-[120px] rounded-full" />
      
      <div className="text-center p-8 max-w-md w-full relative">
        <div className="mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-2xl shadow-indigo-500/20 mb-8 animate-float">
            <svg className="w-10 h-10 text-white animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-4">
            {t.app_title}
          </h1>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
            <p className="text-blue-200/60 font-bold tracking-[0.2em] uppercase text-[10px]">
              AI Processing Engine Active
            </p>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="relative pt-1">
            <div className="flex mb-4 items-center justify-between">
              <div>
                <span className="text-[10px] font-black inline-block py-1 px-2 uppercase rounded-full text-indigo-400 bg-indigo-500/10 tracking-widest">
                  {loadingSteps[currentStep]}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-black inline-block text-indigo-400">
                  {progress}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-1.5 mb-4 text-xs flex rounded-full bg-white/5">
              <div 
                style={{ width: `${progress}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-300 ease-out"
              />
            </div>
          </div>
          
          <p className="text-sm text-blue-100/40 font-medium">
            {t.form_loading}
          </p>
        </div>
      </div>
    </div>
  )
}