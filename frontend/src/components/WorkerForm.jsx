import { useState, useRef } from 'react'

const CITIES = [
  "Mumbai", "Delhi", "Bengaluru", "Hyderabad", 
  "Chennai", "Pune", "Kolkata", "Ahmedabad", "Jaipur", "Surat", "Other"
]

const SKILLS = [
  "Carpenter", "Plumber", "Electrician", "Mason", "Welder", 
  "Painter", "Auto Driver", "Tailor", "Cook", "Other"
]

export default function WorkerForm({ onSubmit, t, language }) {
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    skill: '',
    years_experience: 1,
    daily_income: 100,
    employer_name: '',
    photo_base64: null
  })
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(null)
  const fileInputRef = useRef(null)

  const isRTL = ['ur', 'ks', 'sd'].includes(language)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'years_experience' || name === 'daily_income' ? Number(value) : value
    }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Photo size should be less than 2MB")
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
        setFormData(prev => ({ ...prev, photo_base64: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.city || !formData.skill) {
      alert('Please fill in all required fields')
      return
    }
    setLoading(true)
    onSubmit(formData)
  }

  const inputClass = "w-full px-4 py-3 glass-input rounded-xl focus:outline-none transition-all duration-300"
  const labelClass = "block text-sm font-semibold text-blue-100/70 mb-2"

  return (
    <form 
      onSubmit={handleSubmit} 
      className="glass-card p-8 rounded-3xl space-y-6 relative overflow-hidden"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-50" />
      
      <div className="flex flex-col items-center mb-8">
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="w-24 h-24 rounded-full border-2 border-dashed border-indigo-500/30 flex items-center justify-center cursor-pointer overflow-hidden group relative bg-white/5 hover:bg-white/10 transition-all"
        >
          {preview ? (
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="text-center">
              <span className="text-2xl mb-1 block">👤</span>
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-tighter">Add Photo</span>
            </div>
          )}
          <div className="absolute inset-0 bg-indigo-600/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <span className="text-white text-xs font-bold">Change</span>
          </div>
        </div>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={handleFileChange}
        />
        <p className="text-[10px] text-blue-200/30 mt-3 font-bold uppercase tracking-widest">Profile Photo (Optional)</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className={labelClass}>{t.form_name}</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder={t.form_name}
            className={inputClass}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>{t.form_city}</label>
            <select
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={inputClass}
              required
            >
              <option value="" className="bg-slate-900">{t.form_city}</option>
              {CITIES.map(city => (
                <option key={city} value={city} className="bg-slate-900">{city}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>{t.form_trade}</label>
            <select
              name="skill"
              value={formData.skill}
              onChange={handleChange}
              className={inputClass}
              required
            >
              <option value="" className="bg-slate-900">{t.form_trade}</option>
              {SKILLS.map(skill => (
                <option key={skill} value={skill} className="bg-slate-900">{skill}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass}>
            {t.form_experience}: <span className="text-indigo-400 font-bold">{formData.years_experience} {t.years}</span>
          </label>
          <input
            type="range"
            name="years_experience"
            min="1"
            max="30"
            value={formData.years_experience}
            onChange={handleChange}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
        </div>

        <div>
          <label className={labelClass}>
            {t.form_income}: <span className="text-indigo-400 font-bold">₹{formData.daily_income} {t.per_day}</span>
          </label>
          <input
            type="range"
            name="daily_income"
            min="100"
            max="2000"
            step="50"
            value={formData.daily_income}
            onChange={handleChange}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
        </div>

        <div>
          <label className={labelClass}>{t.form_employer}</label>
          <input
            type="text"
            name="employer_name"
            value={formData.employer_name}
            onChange={handleChange}
            placeholder={t.form_employer_hint}
            className={inputClass}
          />
          <p className="text-[10px] text-blue-200/40 mt-2 uppercase tracking-wider font-bold">{t.form_employer_hint}</p>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold rounded-2xl hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all duration-300 disabled:opacity-50 group overflow-hidden relative"
      >
        <span className="relative z-10">{loading ? t.form_loading : t.form_submit}</span>
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
      </button>
    </form>
  )
}