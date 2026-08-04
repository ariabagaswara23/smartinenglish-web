export default function ImpactCounter() {
  const startYear = 2007;
  const currentYear = new Date().getFullYear();
  const yearsOfExperience = currentYear - startYear;
  const stats = [
  { 
    value: "5.000+", 
    label: "Siswa & Alumni" 
  },
  { 
    value: `${yearsOfExperience}+`, 
    label: "Tahun Pengalaman" 
  },
  { 
    value: "15+", 
    label: "Pengajar Dedikatif" 
  },
  { 
    value: "B", 
    label: "Akreditasi" 
  },
];

  return (
    <section className="py-12 bg-primary relative overflow-hidden">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.15]" 
        style={{
          backgroundImage: 'radial-gradient(#ffffff 2px, transparent 2px)',
          backgroundSize: '32px 32px'
        }}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 text-center divide-x-0 md:divide-x divide-blue-400/50">
          {stats.map((stat, index) => (
            <div key={index} className="px-4 py-6">
              <div className="text-4xl md:text-5xl font-extrabold text-white mb-2 drop-shadow-sm">
                {stat.value}
              </div>
              <div className="text-blue-100 font-medium text-sm md:text-base">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
