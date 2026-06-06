const WelcomeHeader = ({ name, hasCheckedInToday, onCheckinClick }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
      <div>
        <h1 className="font-manrope text-4xl text-primary mb-1 font-bold">Halo, {name?.split(' ')[0]}.</h1>
        <p className="text-lg text-on-surface-variant">Bagaimana perasaanmu hari ini? Mari luangkan waktu sejenak untuk evaluasi.</p>
      </div>
      <button 
        onClick={() => !hasCheckedInToday && onCheckinClick()}
        className={`font-medium px-6 py-3 rounded-xl transition-all shadow-sm flex items-center gap-2 ${
          hasCheckedInToday 
            ? 'bg-secondary-container text-on-secondary-container cursor-default opacity-80' 
            : 'bg-primary text-on-primary hover:opacity-90 active:scale-95'
        }`}
      >
        <span className="material-symbols-outlined text-xl">
          {hasCheckedInToday ? 'task_alt' : 'edit_note'}
        </span>
        {hasCheckedInToday ? 'Sudah Check-In' : 'Check-in Sekarang'}
      </button>
    </div>
  );
};

export default WelcomeHeader;
