import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import groupService from '../services/groupService';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../utils/api';

const EditGroup = () => {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

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
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState('');

  const categories = ['Anxiety Support', 'Stress Management', 'Mindfulness', 'Grief & Loss', 'General Wellness'];

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await groupService.getGroupDetail(id);
        if (response.success) {
          const g = response.data;
          setFormData({
            name: g.name,
            description: g.description || '',
            category: g.category,
            is_public: g.isPublic,
          });
          setRules(g.rules?.length > 0 ? g.rules.map(r => r.content || r) : ['']);
          if (g.imageUrl) setPreviewUrl(getImageUrl(g.imageUrl));
          
          // Verify if user is admin (Owner)
          const me = g.members?.find(m => m.id === user?.id);
          if (me?.role !== 'ADMIN') {
            alert('Hanya admin yang dapat mengedit grup ini.');
            navigate(`/groups/${id}`);
          }
        }
      } catch (err) {
        console.error('Failed to fetch group details:', err);
        setError('Gagal memuat detail grup.');
      } finally {
        setIsFetching(false);
      }
    };

    if (user && id) {
      fetchDetail();
    }
  }, [user, id, navigate]);

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

      const response = await groupService.updateGroup(id, data);
      if (response.success) {
        navigate(`/groups/${id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memperbarui grup.');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || isFetching) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#114B4B]"></div>
    </div>
  );

  if (!user) return null;

  return (
    <div className="bg-[#faf9f6] min-h-screen flex flex-col font-manrope">
      <Navbar />

      <main className="flex-1 w-full max-w-2xl mx-auto px-6 py-12 md:py-20 flex flex-col">
        {/* Header Section */}
        <header className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-[#114B4B] mb-3 tracking-tight">Pengaturan Circle</h1>
          <p className="text-gray-500 text-sm">Sesuaikan identitas, aturan, dan privasi komunitas Anda.</p>
        </header>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="bg-white rounded-[24px] p-8 md:p-12 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05),0_8px_10px_-6px_rgba(0,0,0,0.05)] border border-gray-50 animate-fade-in space-y-10">
          {error && (
            <div className="p-4 bg-red-50 text-red-500 text-sm rounded-xl text-center border border-red-100">
              {error}
            </div>
          )}

          {/* Section: Identitas Utama */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#114B4B]/10 flex items-center justify-center text-[#114B4B] font-bold text-sm">1</div>
              <h2 className="text-xl font-bold text-[#114B4B]">Informasi Dasar</h2>
            </div>

            <div className="space-y-6">
              {/* Photo Edit */}
              <div className="flex flex-col items-center justify-center py-4">
                <div 
                  onClick={() => fileInputRef.current.click()}
                  className="w-32 h-32 rounded-full border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden relative group cursor-pointer hover:border-[#114B4B]/50 transition-all"
                >
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
                      <span className="text-[10px] font-semibold text-center">Ganti<br/>Foto</span>
                    </div>
                  )}
                </div>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                <p className="text-[10px] text-gray-400 font-bold mt-3 uppercase tracking-wider">Ketuk untuk mengubah foto</p>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-700">Nama Circle</label>
                <input 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Mindful Mornings Jakarta"
                  className="w-full bg-[#f4f3f1] border-none rounded-lg p-4 text-sm focus:ring-1 focus:ring-[#114B4B] placeholder:text-gray-400 font-medium"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-700">Deskripsi</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Ceritakan tujuan grup ini..."
                  rows="4"
                  className="w-full bg-[#f4f3f1] border-none rounded-lg p-4 text-sm focus:ring-1 focus:ring-[#114B4B] placeholder:text-gray-400 resize-none font-medium"
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-semibold text-gray-700">Kategori</label>
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
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Section: Privasi */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#114B4B]/10 flex items-center justify-center text-[#114B4B] font-bold text-sm">2</div>
              <h2 className="text-xl font-bold text-[#114B4B]">Privasi & Akses</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <p className="font-semibold text-gray-800 text-sm">Grup Privat</p>
                  <p className="text-[10px] text-gray-500 mt-1">Hanya yang memiliki kode yang bisa bergabung.</p>
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
                  <p className="font-semibold text-gray-800 text-sm">Grup Publik</p>
                  <p className="text-[10px] text-gray-500 mt-1">Siapa saja bisa menemukan dan bergabung.</p>
                  {formData.is_public === true && (
                    <div className="absolute top-3 right-3 w-5 h-5 bg-[#114B4B] rounded-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-[12px] font-bold">check</span>
                    </div>
                  )}
                </div>
              </label>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Section: Aturan */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#114B4B]/10 flex items-center justify-center text-[#114B4B] font-bold text-sm">3</div>
              <h2 className="text-xl font-bold text-[#114B4B]">Aturan Komunitas</h2>
            </div>
            
            <div className="space-y-3">
              {rules.map((rule, index) => (
                <div key={index} className="flex gap-2 items-center bg-[#f4f3f1] p-2 rounded-lg">
                  <span className="material-symbols-outlined text-gray-400 text-sm px-2">drag_indicator</span>
                  <input 
                    value={rule}
                    onChange={(e) => handleRuleChange(index, e.target.value)}
                    placeholder={`Aturan #${index + 1}`}
                    className="flex-1 bg-transparent border-none text-sm focus:ring-0 outline-none p-0 text-gray-700 font-medium"
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

          {/* Actions */}
          <div className="pt-10 border-t border-gray-100 flex flex-col sm:flex-row justify-center gap-3">
            <button 
              type="button" 
              onClick={() => navigate(`/groups/${id}`)}
              className="px-8 py-3 bg-white border border-gray-300 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors w-full sm:w-1/2"
            >
              Batal
            </button>
            <button 
              type="submit" 
              disabled={isLoading}
              className="px-8 py-3 bg-[#114B4B] text-white rounded-xl text-sm font-bold hover:bg-[#0a2e2e] transition-all flex items-center justify-center gap-2 w-full sm:w-1/2 disabled:opacity-70 shadow-lg shadow-[#114B4B]/20"
            >
              {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'} 
              {!isLoading && <span className="material-symbols-outlined text-sm font-bold">check_circle</span>}
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default EditGroup;
