import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import groupService from '../services/groupService';
import { useAuth } from '../context/AuthContext';

const CreateGroup = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Mindfulness',
    is_public: true,
  });
  
  const [rules, setRules] = useState(['']);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = ['Anxiety Support', 'Stress Management', 'Mindfulness', 'Grief & Loss', 'General Wellness'];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file maksimal 5MB');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRuleChange = (index, value) => {
    const newRules = [...rules];
    newRules[index] = value;
    setRules(newRules);
  };

  const addRule = () => setRules([...rules, '']);
  const removeRule = (index) => setRules(rules.filter((_, i) => i !== index));

  const validateStep1 = () => {
    if (!formData.name.trim()) return 'Nama circle harus diisi.';
    if (!formData.description.trim()) return 'Deskripsi circle harus diisi.';
    return null;
  };

  const nextStep = () => {
    setError('');
    if (step === 1) {
      const err = validateStep1();
      if (err) return setError(err);
    }
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('category', formData.category);
      data.append('is_public', formData.is_public);
      
      const filteredRules = rules.filter(r => r.trim() !== '');
      filteredRules.forEach((rule, index) => {
        data.append(`rules[${index}]`, rule);
      });

      if (selectedFile) {
        data.append('image', selectedFile);
      }

      const response = await groupService.createGroup(data);
      if (response.success) {
        navigate(`/groups/${response.data.id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal membuat grup. Pastikan semua field terisi.');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#114B4B]"></div>
    </div>
  );

  if (!user) return null;

  return (
    <div className="bg-[#fcfcfc] min-h-screen flex flex-col font-['Inter',sans-serif]">
      <Navbar />

      <main className="flex-1 w-full max-w-2xl mx-auto px-6 py-12 md:py-20 flex flex-col">
        {/* Header Section */}
        <header className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-[#114B4B] mb-3 tracking-tight">Buat Circle mu Sendiri</h1>
          <p className="text-gray-500 text-sm">Tempat yang aman dimulai dari sini. Mari kita bangun komunitas baru Anda.</p>
        </header>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2 mb-10 w-full max-w-lg mx-auto">
          {/* Step 1 */}
          <div className="flex-1 flex flex-col items-center">
            <div className={`h-1.5 w-full rounded-full transition-colors duration-300 ${step >= 1 ? 'bg-[#114B4B]' : 'bg-gray-200'}`}></div>
            <p className={`text-[10px] font-bold mt-2 uppercase tracking-tight ${step >= 1 ? 'text-[#114B4B]' : 'text-gray-400'}`}>Basic Info</p>
          </div>
          {/* Step 2 */}
          <div className="flex-1 flex flex-col items-center">
            <div className={`h-1.5 w-full rounded-full transition-colors duration-300 ${step >= 2 ? 'bg-[#114B4B]' : 'bg-gray-200'}`}></div>
            <p className={`text-[10px] font-bold mt-2 uppercase tracking-tight ${step >= 2 ? 'text-[#114B4B]' : 'text-gray-400'}`}>Privasi & Aturan</p>
          </div>
          {/* Step 3 */}
          <div className="flex-1 flex flex-col items-center">
            <div className={`h-1.5 w-full rounded-full transition-colors duration-300 ${step >= 3 ? 'bg-[#114B4B]' : 'bg-gray-200'}`}></div>
            <p className={`text-[10px] font-bold mt-2 uppercase tracking-tight ${step >= 3 ? 'text-[#114B4B]' : 'text-gray-400'}`}>Identitas Grup</p>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-[24px] p-8 md:p-12 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05),0_8px_10px_-6px_rgba(0,0,0,0.05)] border border-gray-50 animate-fade-in flex-grow">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-500 text-sm rounded-xl text-center border border-red-100">
              {error}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-8 animate-fade-in">
              <h2 className="text-xl font-semibold text-[#114B4B] mb-6">Step 1: Basic Info</h2>
              
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-700">Circle Name</label>
                <input 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Mindful Mornings Jakarta"
                  className="w-full bg-[#f4f3f1] border-none rounded-lg p-4 text-sm focus:ring-1 focus:ring-[#114B4B] placeholder:text-gray-400"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-700">Description</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="What is the purpose of this circle? Who is it for?"
                  rows="4"
                  className="w-full bg-[#f4f3f1] border-none rounded-lg p-4 text-sm focus:ring-1 focus:ring-[#114B4B] placeholder:text-gray-400 resize-none"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-semibold text-gray-700">Category (Select one)</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFormData({ ...formData, category: cat })}
                      className={`px-4 py-2.5 rounded-full text-xs font-medium transition-all ${
                        formData.category === cat 
                          ? 'bg-[#114B4B] text-white shadow-sm' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-8 border-t border-gray-100 flex justify-center gap-3">
                <button 
                  type="button" 
                  onClick={() => navigate('/groups')}
                  className="px-8 py-2.5 bg-white border border-gray-300 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors w-1/2"
                >
                  Batal
                </button>
                <button 
                  type="button" 
                  onClick={nextStep}
                  className="px-8 py-2.5 bg-[#114B4B] text-white rounded-lg text-sm font-medium hover:bg-[#0a2e2e] transition-colors flex items-center justify-center gap-2 w-1/2"
                >
                  Next <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-fade-in">
              <h2 className="text-xl font-semibold text-[#114B4B] mb-6">Step 2: Privasi & Aturan</h2>
              
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-gray-700 mb-2">Visibilitas</label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="relative cursor-pointer group">
                    <input 
                      type="radio" 
                      name="is_public" 
                      checked={formData.is_public === false} 
                      onChange={() => setFormData({...formData, is_public: false})} 
                      className="peer sr-only" 
                    />
                    <div className="p-6 bg-gray-50 border-2 border-transparent rounded-xl peer-checked:border-[#114B4B] peer-checked:bg-white peer-checked:shadow-sm transition-all h-full relative">
                      <span className="material-symbols-outlined text-[#52b1b1] mb-2 text-2xl">lock</span>
                      <p className="font-semibold text-gray-800">Grup Privat</p>
                      {formData.is_public === false && (
                        <div className="absolute top-3 right-3 w-5 h-5 bg-[#114B4B] rounded-full flex items-center justify-center">
                          <span className="material-symbols-outlined text-white text-[12px] font-bold">check</span>
                        </div>
                      )}
                    </div>
                  </label>

                  <label className="relative cursor-pointer group">
                    <input 
                      type="radio" 
                      name="is_public" 
                      checked={formData.is_public === true} 
                      onChange={() => setFormData({...formData, is_public: true})} 
                      className="peer sr-only" 
                    />
                    <div className="p-6 bg-gray-50 border-2 border-transparent rounded-xl peer-checked:border-[#114B4B] peer-checked:bg-white peer-checked:shadow-sm transition-all h-full relative">
                      <span className="material-symbols-outlined text-gray-400 mb-2 text-2xl">public</span>
                      <p className="font-semibold text-gray-800">Grup Publik</p>
                      {formData.is_public === true && (
                        <div className="absolute top-3 right-3 w-5 h-5 bg-[#114B4B] rounded-full flex items-center justify-center">
                          <span className="material-symbols-outlined text-white text-[12px] font-bold">check</span>
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-semibold text-gray-700 mb-2">Aturan</label>
                <div className="space-y-3">
                  {rules.map((rule, index) => (
                    <div key={index} className="flex gap-2 items-center bg-[#f4f3f1] p-2 rounded-lg">
                      <span className="material-symbols-outlined text-gray-400 text-sm px-2">drag_indicator</span>
                      <input 
                        value={rule}
                        onChange={(e) => handleRuleChange(index, e.target.value)}
                        placeholder={`e.g., Jaga kerahasiaan cerita anggota lain.`}
                        className="flex-1 bg-transparent border-none text-sm focus:ring-0 outline-none p-0 text-gray-700"
                      />
                      {rules.length > 1 && (
                        <button type="button" onClick={() => removeRule(index)} className="text-gray-400 hover:text-red-500 p-2">
                          <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button 
                  type="button" 
                  onClick={addRule}
                  className="text-sm font-semibold text-[#114B4B] hover:underline flex items-center gap-1 mt-2"
                >
                  <span className="material-symbols-outlined text-sm">add</span> Tambah Aturan Lainnya
                </button>
              </div>

              <div className="pt-8 border-t border-gray-100 flex justify-center gap-3">
                <button 
                  type="button" 
                  onClick={prevStep}
                  className="px-8 py-2.5 bg-white border border-gray-300 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors w-1/2"
                >
                  Batal
                </button>
                <button 
                  type="button" 
                  onClick={nextStep}
                  className="px-8 py-2.5 bg-[#114B4B] text-white rounded-lg text-sm font-medium hover:bg-[#0a2e2e] transition-colors flex items-center justify-center gap-2 w-1/2"
                >
                  Next <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-fade-in flex flex-col items-center">
              <div className="w-full">
                 <h2 className="text-xl font-semibold text-[#114B4B] mb-6">Step 3: Identitas grup</h2>
              </div>
              
              <div 
                onClick={() => fileInputRef.current.click()}
                className="w-full max-w-sm border-2 border-dashed border-gray-200 rounded-3xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-[#114B4B]/50 hover:bg-[#f9fbfb] transition-all"
              >
                <div className="w-32 h-32 rounded-full border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center mb-6 overflow-hidden relative group">
                  {previewUrl ? (
                    <>
                       <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                       <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <span className="material-symbols-outlined text-white">edit</span>
                       </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400 gap-1">
                      <span className="material-symbols-outlined text-2xl">add_a_photo</span>
                      <span className="text-[10px] font-semibold">Unggah<br/>Foto Profil</span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-700 font-medium mb-1">Tarik & lepas foto ke area ini</p>
                <p className="text-xs text-gray-500">atau klik untuk menelusuri file komputer Anda.</p>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
              </div>

              <div className="pt-8 border-t border-gray-100 flex justify-center gap-3 w-full">
                <button 
                  type="button" 
                  onClick={prevStep}
                  className="px-8 py-2.5 bg-white border border-gray-300 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors w-1/2"
                >
                  Batal
                </button>
                <button 
                  type="button" 
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="px-8 py-2.5 bg-[#114B4B] text-white rounded-lg text-sm font-medium hover:bg-[#0a2e2e] transition-colors flex items-center justify-center gap-2 w-1/2 disabled:opacity-70"
                >
                  {isLoading ? 'Memproses...' : 'Buat'} 
                  {!isLoading && <span className="material-symbols-outlined text-sm font-bold">check_circle</span>}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CreateGroup;
