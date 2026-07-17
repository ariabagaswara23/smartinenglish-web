export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: string;
  imageUrl: string;
}

export const mockBlogs: BlogPost[] = [
  {
    id: "1",
    title: "5 Tips Efektif Belajar Bahasa Inggris untuk Pemula",
    slug: "5-tips-efektif-belajar-bahasa-inggris-untuk-pemula",
    excerpt: "Memulai belajar bahasa Inggris bisa jadi menantang. Berikut adalah 5 tips praktis yang dapat membantu Anda menguasai bahasa Inggris dengan lebih cepat dan menyenangkan.",
    content: `<p class="mb-4">Belajar bahasa Inggris terkadang terasa berat bagi pemula, namun dengan pendekatan yang tepat, proses ini bisa menjadi sangat menyenangkan. Berikut adalah beberapa tips yang bisa Anda coba:</p>
<h3 class="text-xl font-bold mt-6 mb-3 text-gray-900">1. Mulai dari Kosakata Dasar</h3>
<p class="mb-4">Jangan terburu-buru belajar tata bahasa yang rumit. Mulailah dengan menghafal kosakata dasar yang sering digunakan sehari-hari. Anda bisa membuat <em>flashcard</em> atau menggunakan aplikasi belajar bahasa.</p>
<h3 class="text-xl font-bold mt-6 mb-3 text-gray-900">2. Tonton Film Berbahasa Inggris</h3>
<p class="mb-4">Menonton film atau serial berbahasa Inggris dengan subtitle adalah cara yang sangat menyenangkan untuk membiasakan telinga Anda dengan pelafalan <em>native speaker</em>.</p>
<h3 class="text-xl font-bold mt-6 mb-3 text-gray-900">3. Jangan Takut Salah</h3>
<p class="mb-4">Kesalahan adalah bagian dari proses belajar. Jangan biarkan rasa takut salah membuat Anda enggan untuk berbicara dalam bahasa Inggris. Semakin sering Anda berlatih, semakin lancar Anda nantinya.</p>`,
    category: "Tips Pembelajaran",
    author: "Tim Akademik",
    date: "12 Juli 2026",
    imageUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "2",
    title: "Pengumuman: Pembukaan Kelas Baru Semester Ganjil 2026",
    slug: "pengumuman-pembukaan-kelas-baru-semester-ganjil-2026",
    excerpt: "Kabar gembira! smArt in english resmi membuka pendaftaran untuk kelas baru di semester ganjil 2026. Segera daftarkan diri Anda dan nikmati promo khusus early bird.",
    content: `<p class="mb-4">Halo sobat <strong>smArt in english</strong>! Kami dengan bangga mengumumkan bahwa pendaftaran kelas baru untuk Semester Ganjil tahun ajaran 2026 telah resmi dibuka.</p>
<p class="mb-4">Program yang tersedia mencakup:</p>
<ul class="list-disc pl-6 mb-4 space-y-2">
  <li>Kelas English for Kids & Teens</li>
  <li>Kelas English for Adults</li>
  <li>Kelas Persiapan TOEFL / IELTS</li>
</ul>
<p class="mb-4">Kami memiliki promo spesial <em>early bird</em> berupa potongan biaya pendaftaran sebesar 20% bagi 50 pendaftar pertama. Promo ini berlaku hingga akhir bulan ini. Jadi, jangan sampai ketinggalan ya!</p>
<p class="mb-4">Untuk informasi lebih lanjut mengenai jadwal, biaya, dan tata cara pendaftaran, silakan hubungi tim administrasi kami melalui WhatsApp atau langsung datang ke kantor kami.</p>`,
    category: "Announcement",
    author: "Admin",
    date: "15 Juli 2026",
    imageUrl: "https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "3",
    title: "Mengenal Perbedaan Penggunaan 'Much' dan 'Many'",
    slug: "mengenal-perbedaan-penggunaan-much-dan-many",
    excerpt: "Sering bingung kapan harus menggunakan 'much' dan kapan harus menggunakan 'many'? Mari kita bahas perbedaannya dengan cara yang sederhana dan mudah dipahami.",
    content: `<p class="mb-4">Dalam bahasa Inggris, kata <em>much</em> dan <em>many</em> sama-sama berarti 'banyak'. Namun, penggunaannya berbeda tergantung pada jenis kata benda yang diikutinya.</p>
<h3 class="text-xl font-bold mt-6 mb-3 text-gray-900">Many untuk Countable Nouns</h3>
<p class="mb-4">Gunakan <strong>many</strong> untuk benda-benda yang bisa dihitung (<em>countable nouns</em>). Contohnya: buku, mobil, teman, apel, dll.</p>
<ul class="list-disc pl-6 mb-4 space-y-2">
  <li><em>I have many friends.</em> (Saya punya banyak teman.)</li>
  <li><em>There are many cars on the street.</em> (Ada banyak mobil di jalan.)</li>
</ul>
<h3 class="text-xl font-bold mt-6 mb-3 text-gray-900">Much untuk Uncountable Nouns</h3>
<p class="mb-4">Gunakan <strong>much</strong> untuk benda-benda yang tidak bisa dihitung (<em>uncountable nouns</em>) atau dianggap sebagai satu kesatuan. Contohnya: air, uang, waktu, gula, dll.</p>
<ul class="list-disc pl-6 mb-4 space-y-2">
  <li><em>I don't have much time.</em> (Saya tidak punya banyak waktu.)</li>
  <li><em>She put too much sugar in her tea.</em> (Dia menaruh terlalu banyak gula di tehnya.)</li>
</ul>
<p class="mb-4">Semoga penjelasan singkat ini membantu Anda agar tidak bingung lagi ya!</p>`,
    category: "Tips Pembelajaran",
    author: "Tutor Sarah",
    date: "17 Juli 2026",
    imageUrl: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  }
];
