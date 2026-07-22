import React from "react";

export default function ContactMap() {
  return (
    <div className="w-full h-[400px] lg:h-full min-h-[400px] rounded-2xl overflow-hidden shadow-sm border border-gray-100 relative group">
      {/* Decorative overlay on hover */}
      <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300 pointer-events-none z-10" />
      
      {/* Google Maps Embed iframe */}
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126920.24021319717!2d106.74542261623838!3d-6.229746462719246!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e945e34b9d%3A0x5371bf0fdad786a2!2sJakarta%2C%20Daerah%20Khusus%20Ibukota%20Jakarta!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen={false}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="w-full h-full object-cover relative z-0"
        title="Lokasi smArt in english di Google Maps"
      />
    </div>
  );
}
