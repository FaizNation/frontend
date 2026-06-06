const GroupRules = ({ rules }) => {
  return (
    <section className="pt-4">
      <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined text-[#114B4B]">gavel</span> Aturan Komunitas
      </h2>
      <div className="space-y-6">
        {rules && rules.length > 0 ? (
          rules.map((rule, idx) => (
            <div key={rule.id || idx} className="flex gap-4 items-start border-l-2 border-[#114B4B] pl-4">
              <div className="w-6 h-6 rounded-full bg-[#114B4B] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">{rule.content || rule}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="py-6 px-4 text-center border-2 border-dashed border-[#114B4B]/10 rounded-[32px] bg-white/50">
            <p className="text-sm text-gray-400 italic">belum ada beraturan di grup ini</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default GroupRules;
