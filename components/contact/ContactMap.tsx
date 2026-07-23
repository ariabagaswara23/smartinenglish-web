import React from "react";

export default function ContactMap() {
  return (
    <div className="w-full h-[400px] lg:h-full min-h-[400px] rounded-2xl overflow-hidden shadow-sm border border-gray-100 relative group">
      {/* Decorative overlay on hover */}
      <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300 pointer-events-none z-10" />
      
      {/* Google Maps Embed iframe */}
      <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3857.743459208389!2d107.52945697487341!3d-6.9035552930957875!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e5a6861a4e29%3A0x4847b6aafad51b7c!2sSmart%20In%20English%20&#39;SMILE&#39;!5e1!3m2!1sid!2sid!4v1784838793010!5m2!1sid!2sid" width="100%" height="100%" style={{ border: 0 }} allowFullScreen={false} loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Lokasi Smart In English" className="w-full h-full object-cover relative z-0"></iframe>
    </div>
  );
}
