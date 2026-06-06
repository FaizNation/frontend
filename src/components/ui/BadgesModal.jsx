// import { useState, useEffect } from 'react';
// import dashboardService from '../../services/dashboardService';

// const BadgesModal = ({ isOpen, onClose }) => {
//   const [badges, setBadges] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchBadges = async () => {
//       setIsLoading(true);
//       setError('');
//       try {
//         const response = await dashboardService.getAllBadges();
//         if (response.success) {
//           setBadges(response.data);
//         }
//       } catch (err) {
//         setError(err.response?.data?.message || 'Gagal memuat daftar lencana.');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     if (isOpen) {
//       document.body.style.overflow = 'hidden';
//       fetchBadges();
//     } else {
//       document.body.style.overflow = 'unset';
//     }
//     return () => {
//       document.body.style.overflow = 'unset';
//     };
//   }, [isOpen]);

//   if (!isOpen) return null;

//   return (
//     <div 
//       className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in"
//       onClick={(e) => e.target === e.currentTarget && onClose()}
//     >
//       {/* Modal Container */}
//       <div 
//         className="bg-white w-full max-w-2xl max-h-[90vh] rounded-xl shadow-2xl flex flex-col relative overflow-hidden font-lexend animate-zoom-in"
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Modal Header */}
//         <div className="px-8 pt-8 pb-4 flex justify-between items-start sticky top-0 bg-white z-10 border-b border-outline-variant/20">
//           <div className="w-full">
//             <h1 className="font-manrope text-2xl text-primary-container mb-1 font-bold">Koleksi Lencana</h1>
//             <p className="text-sm text-on-surface-variant">Kumpulkan lencana dengan menjaga konsistensi check-in Anda.</p>
//           </div>
//           <button 
//             onClick={onClose}
//             className="absolute right-6 top-6 p-2 rounded-full hover:bg-surface-container transition-colors text-outline"
//           >
//             <span className="material-symbols-outlined">close</span>
//           </button>
//         </div>

//         {/* Modal Body (Scrollable) */}
//         <div className="flex-1 overflow-y-auto px-8 py-6 bg-[#f9fbfb]">
//           {error && (
//             <div className="p-3 mb-6 bg-red-50 text-red-500 text-sm rounded-xl text-center font-medium border border-red-100">
//               {error}
//             </div>
//           )}

//           {isLoading ? (
//             <div className="flex justify-center items-center py-12">
//               <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               {badges.map((badge) => (
//                 <div 
//                   key={badge.id} 
//                   className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${
//                     badge.isUnlocked 
//                       ? 'bg-white border-primary/20 shadow-sm' 
//                       : 'bg-surface-container-low border-outline-variant/20 opacity-70 grayscale'
//                   }`}
//                 >
//                   <div className={`p-3 rounded-full flex-shrink-0 ${badge.isUnlocked ? 'bg-secondary-container text-secondary' : 'bg-surface-variant text-outline'}`}>
//                     {badge.iconUrl ? (
//                       <img src={badge.iconUrl} alt={badge.name} className="w-8 h-8 object-contain" />
//                     ) : (
//                       <span className="material-symbols-outlined text-3xl" style={badge.isUnlocked ? { fontVariationSettings: "'FILL' 1" } : {}}>
//                         {badge.name.toLowerCase().includes('mula') ? 'workspace_premium' : badge.name.toLowerCase().includes('hari') ? 'local_fire_department' : 'military_tech'}
//                       </span>
//                     )}
//                   </div>
                  
//                   <div className="flex flex-col flex-1">
//                     <div className="flex justify-between items-start gap-2">
//                       <h3 className="font-manrope font-bold text-on-surface text-base">{badge.name}</h3>
//                       {!badge.isUnlocked && (
//                         <span className="material-symbols-outlined text-outline text-sm" title="Terkunci">lock</span>
//                       )}
//                     </div>
//                     <p className="text-xs text-on-surface-variant mt-1 mb-2">{badge.description}</p>
                    
//                     <div className="mt-auto">
//                       <p className="text-[10px] text-outline font-medium uppercase tracking-wider">Syarat</p>
//                       <p className="text-xs text-on-surface font-medium">{badge.criteria}</p>
//                     </div>
                    
//                     {badge.isUnlocked && badge.unlockedAt && (
//                       <p className="text-[10px] text-primary mt-2 font-medium bg-primary/5 inline-block px-2 py-1 rounded-md w-max">
//                         Diraih: {new Date(badge.unlockedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               ))}
              
//               {badges.length === 0 && !isLoading && !error && (
//                 <div className="col-span-full py-8 text-center text-on-surface-variant italic">
//                   Belum ada data lencana yang tersedia dari sistem.
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BadgesModal;
