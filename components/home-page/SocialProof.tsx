// components/SocialProof.tsx
export default function SocialProof() {
  const stats = [
    { value: '2.000+', label: 'Alumni Sukses' },
    { value: '19', label: 'Tahun Pengalaman' },
    { value: '100%', label: 'Tutor Tersertifikasi' },
    { value: 'B', label: 'Akreditasi' },
  ];

  return (
    <section className="bg-[#F5F3EF] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col justify-center">
              <span className="text-2xl md:text-3xl font-extrabold text-[#1e3a8a]">
                {stat.value}
              </span>
              <span className="text-xs md:text-sm font-medium text-gray-500 mt-1">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}