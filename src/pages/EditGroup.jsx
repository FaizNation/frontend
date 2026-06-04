import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import groupService from '../services/groupService';
import { useAuth } from '../context/AuthContext';

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

  const categories = ['Mindfulness', 'Sleep', 'Anxiety', 'Depression', 'Work-Life Balance'];

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
          if (g.imageUrl) setPreviewUrl(g.imageUrl);
          
          // Verify if user is admin (Owner)
          const me = g.members.find(m => m.id === user.id);
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
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  if (!user) return null;

  return (
    <div className="bg-[#F9FBFB] min-h-screen flex flex-col font-manrope">
      <Navbar />

      <main className="flex-1 max-w-[800px] w-full mx-auto px-6 py-12 md:py-20">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-black text-[#2D6A6A] mb-3 tracking-tight">Pengaturan Circle</h1>
          <p className="text-on-surface-variant font-medium">Perbarui identitas dan aturan komunitas Anda.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-[32px] p-8 md:p-12 shadow-xl shadow-teal-900/5 border border-outline-variant/20 space-y-10 animate-fade-in">
          {error && (
            <div className="p-4 bg-red-50 text-red-500 text-sm rounded-2xl text-center font-bold border border-red-100">
              {error}
            </div>
          )}

          {/* Section: Identitas */}
          <div className="space-y-6">
            <h2 className="text-lg font-black text-[#2D6A6A] flex items-center gap-2 uppercase tracking-widest text-[11px]">
              <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px]">1</span>
              Identitas Circle
            </h2>

            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Image Upload */}
              <div className="w-full md:w-40 flex flex-col items-center gap-3">
                <div 
                  onClick={() => fileInputRef.current.click()}
                  className="w-40 h-40 bg-[#F9FAFB] rounded-[32px] border-2 border-dashed border-outline-variant/50 flex flex-col items-center justify-center cursor-pointer overflow-hidden group hover:border-primary/50 transition-all"
                >
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-4xl text-outline-variant group-hover:text-primary transition-colors">add_photo_alternate</span>
                      <span className="text-[10px] font-black text-outline-variant mt-2 group-hover:text-primary">GANTI FOTO</span>
                    </>
                  )}
                </div>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                <p className="text-[10px] text-center text-outline-variant font-bold">Maks. 5MB (PNG/JPG)</p>
              </div>

              <div className="flex-1 w-full space-y-6">
                <div className="space-y-1">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Nama Circle</label>
                  <input 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Cth: Mindful Jakarta"
                    className="w-full px-5 py-4 bg-[#F9FAFB] border-none rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all font-bold text-on-surface"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Kategori</label>
                  <select 
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-[#F9FAFB] border-none rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all font-bold text-on-surface appearance-none"
                  >
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Deskripsi Singkat</label>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Ceritakan tentang apa circle ini..."
                rows="4"
                className="w-full px-5 py-4 bg-[#F9FAFB] border-none rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all font-medium text-on-surface resize-none"
                required
              />
            </div>
          </div>

          {/* Section: Privasi */}
          <div className="space-y-6">
            <h2 className="text-lg font-black text-[#2D6A6A] flex items-center gap-2 uppercase tracking-widest text-[11px]">
              <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px]">2</span>
              Pengaturan Akses
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="relative cursor-pointer group">
                <input 
                  type="radio" 
                  name="is_public" 
                  checked={formData.is_public === true} 
                  onChange={() => setFormData({...formData, is_public: true})} 
                  className="peer sr-only" 
                />
                <div className="p-6 bg-[#F9FAFB] border-2 border-transparent rounded-[24px] peer-checked:border-primary/20 peer-checked:bg-white peer-checked:shadow-sm transition-all h-full">
                  <span className="material-symbols-outlined text-primary mb-3">public</span>
                  <p className="font-black text-sm text-on-surface mb-1">Publik</p>
                  <p className="text-[10px] text-on-surface-variant font-medium">Siapapun bisa menemukan dan bergabung dengan circle ini.</p>
                </div>
              </label>

              <label className="relative cursor-pointer group">
                <input 
                  type="radio" 
                  name="is_public" 
                  checked={formData.is_public === false} 
                  onChange={() => setFormData({...formData, is_public: false})} 
                  className="peer sr-only" 
                />
                <div className="p-6 bg-[#F9FAFB] border-2 border-transparent rounded-[24px] peer-checked:border-amber-200 peer-checked:bg-white peer-checked:shadow-sm transition-all h-full">
                  <span className="material-symbols-outlined text-amber-600 mb-3">lock</span>
                  <p className="font-black text-sm text-on-surface mb-1">Privat</p>
                  <p className="text-[10px] text-on-surface-variant font-medium">Hanya anggota yang memiliki kode unik yang bisa bergabung.</p>
                </div>
              </label>
            </div>
          </div>

          {/* Section: Aturan */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-black text-[#2D6A6A] flex items-center gap-2 uppercase tracking-widest text-[11px]">
                <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px]">3</span>
                Aturan Circle (Opsional)
              </h2>
              <button 
                type="button" 
                onClick={addRule}
                className="text-[10px] font-black text-primary hover:underline flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-xs">add_circle</span> TAMBAH
              </button>
            </div>

            <div className="space-y-3">
              {rules.map((rule, index) => (
                <div key={index} className="flex gap-3">
                  <input 
                    value={rule}
                    onChange={(e) => handleRuleChange(index, e.target.value)}
                    placeholder={`Aturan #${index + 1}`}
                    className="flex-1 px-5 py-3 bg-[#F9FAFB] border-none rounded-xl focus:ring-1 focus:ring-primary outline-none transition-all text-sm font-medium"
                  />
                  {rules.length > 1 && (
                    <button type="button" onClick={() => removeRule(index)} className="text-red-400 hover:text-red-600">
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-8 border-t border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2 text-on-surface-variant text-[10px] font-bold opacity-60">
              <span className="material-symbols-outlined text-sm">info</span>
              Perubahan privasi akan memengaruhi cara user bergabung.
            </div>
            <div className="flex gap-4 w-full md:w-auto">
              <button 
                type="button" 
                onClick={() => navigate(`/groups/${id}`)}
                className="flex-1 md:flex-none px-10 py-4 border border-outline-variant text-outline font-black text-xs rounded-2xl hover:bg-gray-50 transition-all"
              >
                BATAL
              </button>
              <button 
                type="submit" 
                disabled={isLoading}
                className="flex-1 md:flex-none px-12 py-4 bg-primary text-white font-black text-xs rounded-2xl shadow-xl shadow-primary/20 hover:opacity-90 active:scale-95 transition-all disabled:opacity-70"
              >
                {isLoading ? 'MENYIMPAN...' : 'SIMPAN PERUBAHAN'}
              </button>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default EditGroup;
