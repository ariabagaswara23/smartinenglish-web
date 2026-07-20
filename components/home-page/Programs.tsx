'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { BookOpen, Calendar, ClipboardList, Computer, GraduationCap, HeartHandshake, Languages, LucideIcon, Pencil, Percent, Target, UserCheck } from 'lucide-react';

// --- Types ---

interface SubProgram {
  name: string;
  description: string;
  badge?: string;
  // Modal detail fields
  detail?: {
    hargaDaftar: string;
    sppBulanan: string;
    /** Override label for sppBulanan (e.g. 'Harga Paket', 'Harga Pembelajaran') */
    sppLabel?: string;
    /** Override note for sppBulanan */
    sppNote?: string;
    hargaModul?: string;
    hargaUjian?: string;
    jadwal: string;
    materi: string[];
  };
}

interface Program {
  id: string;
  icon: LucideIcon;
  title: string;
  color: string;
  accentClass: string;
  badgeBg: string;
  borderAccent: string;
  description: string;
  subPrograms: SubProgram[];
}

// --- Data ---

const programs: Program[] = [
  {
    id: 'english',
    icon: Languages,
    title: 'Bahasa Inggris',
    color: 'bg-blue-600',
    accentClass: 'text-blue-700',
    badgeBg: 'bg-blue-50',
    borderAccent: 'border-blue-200',
    description: 'Program bahasa Inggris komprehensif untuk semua usia dan jenjang — dari pra-sekolah hingga persiapan ujian internasional.',
    subPrograms: [
      {
        name: 'Nursery Class',
        description: 'Program bahasa Inggris untuk anak pra-sekolah melalui lagu, permainan, dan storytelling.',
        badge: 'Pra-sekolah',
        detail: {
          hargaDaftar: 'Rp 200.000',
          sppBulanan: 'Rp 400.000',
          hargaModul: 'Rp 110.000',
          jadwal: '2× seminggu, 60 menit per pertemuan',
          materi: [
            'Vocabulary',
            'Words Pop',
            'Dialogue',
            'Manners',
            'Nursery Rhymes',
            'Games',
            'Easy Learning Methode'
          ],
        },
      },
      {
        name: 'English for Young Learner',
        description: 'Fondasi bahasa Inggris yang kuat untuk siswa Sekolah Dasar dengan metode belajar yang seru.',
        badge: 'SD',
        detail: {
          hargaDaftar: 'Rp 200.000',
          sppBulanan: 'Rp 150.000',
          hargaModul: 'Rp 90.000',
          jadwal: '2× seminggu, 60 menit per pertemuan',
          materi: [
            'Vocabulary',
            'Words Pop',
            'Dialogue',
            'Writing Skill',
            'Reading Skill',
            'Speaking Skill',
            'Expression',
            'Easy Learning Methode'
          ],
        },
      },
      {
        name: 'English for Teens (SMP)',
        description: 'Kemampuan bahasa Inggris menyeluruh untuk siswa SMP — reading, writing, listening & speaking.',
        badge: 'SMP',
        detail: {
          hargaDaftar: 'Rp 200.000',
          sppBulanan: 'Rp 180.000',
          hargaModul: 'Rp 90.000',
          jadwal: '2× seminggu, 60 menit per pertemuan',
          materi: [
            'Vocabulary',
            'Words Pop',
            'Dialogue',
            'Writing Skill',
            'Reading Skill',
            'Speaking Skill',
            'Expression',
            'Easy Learning Methode'
          ],
        },
      },
      {
        name: 'English for Teens (SMA)',
        description: 'Penguasaan bahasa Inggris tingkat lanjut bagi siswa SMA untuk persiapan akademik dan global.',
        badge: 'SMA',
        detail: {
          hargaDaftar: 'Rp 200.000',
          sppBulanan: 'Rp 240.000',
          hargaModul: 'Rp 80.000',
          jadwal: '2× seminggu, 60 menit per pertemuan',
          materi: [
            'Vocabulary',
            'Words Pop',
            'Dialogue',
            'Writing Skill',
            'Reading Skill',
            'Speaking Skill',
            'Expression',
            'Easy Learning Methode'
          ],
        },
      },
      {
        name: 'English for 9th Grader',
        description: 'Program intensif khusus siswa SMP Kelas 9 untuk mempersiapkan diri menghadapi ujian akhir.',
        badge: 'SMP Kelas 9',
        detail: {
          hargaDaftar: 'Rp 200.000',
          sppBulanan: 'Rp 240.000',
          hargaModul: 'Rp 100.000',
          jadwal: '2× seminggu, 60 menit per pertemuan',
          materi: [
            'Vocabulary',
            'Words Pop',
            'Functional Text',
            'Genre Text',
            'Expression',
            'Grammar Focus',
            'Supporting Materials',
            'Exam Simulation'
          ],
        },
      },
      {
        name: 'English for 12th Grader',
        description: 'Program intensif khusus siswa SMA Kelas 12 untuk ujian sekolah dan seleksi perguruan tinggi.',
        badge: 'SMA Kelas 12',
        detail: {
          hargaDaftar: 'Rp 200.000',
          sppBulanan: 'Rp 320.000',
          hargaModul: 'Rp 80.000',
          jadwal: '3× seminggu, 60 menit per pertemuan',
          materi: [
            'Vocabulary',
            'Functional Text',
            'Genre Text',
            'Expression',
            'Grammar Focus',
            'Supporting Materials',
            'Exam Simulation'
          ],
        },
      },
      {
        name: 'General English',
        description: 'Kelas bahasa Inggris untuk umum, mahasiswa, dan karyawan yang ingin meningkatkan kemampuan komunikasi.',
        badge: 'Umum',
        detail: {
          hargaDaftar: 'Rp 200.000',
          sppBulanan: 'Rp 420.000',
          hargaModul: 'Rp 80.000',
          jadwal: '3× seminggu, 60 menit per pertemuan',
          materi: [
            'Vocabulary',
            'Words Pop',
            'Functional Text',
            'Genre Text',
            'Expression',
            'Grammar Focus',
            'Supporting Materials',
          ],
        },
      },
      {
        name: 'Speaking Skill Package',
        description: 'Paket intensif berfokus pada kemampuan berbicara — melatih fluency, pronunciation & confidence.',
        badge: 'Paket Khusus',
        detail: {
          hargaDaftar: 'Rp 200.000',
          sppBulanan: 'Rp 1.500.000',
          sppLabel: 'Harga Paket',
          sppNote: 'Dibayar di awal per paket program',
          hargaModul: 'Rp 30.000',
          hargaUjian: 'Rp 100.000',
          jadwal: 'Tentative',
          materi: [
            'Vocabulary',
            'Shadowing Technique',
            'Self Talk',
            'Record and Review',
            'Phrasal Verbs',
            'Idiom',
            'Think in the Language',
          ],
        },
      },
      {
        name: 'Grammar Package',
        description: 'Paket belajar khusus memahami struktur dan tata bahasa Inggris secara mendalam dan terstruktur.',
        badge: 'Paket Khusus',
        detail: {
          hargaDaftar: 'Rp 200.000',
          sppBulanan: 'Rp 1.500.000',
          sppLabel: 'Harga Paket',
          sppNote: 'Dibayar di awal per paket program',
          hargaModul: 'Rp 100.000',
          hargaUjian: 'Rp 100.000',
          jadwal: 'Tentative',
          materi: [
            'Deductive and Inductive Learning',
            'Contextualization',
            'Presentation-Practive-Production'
          ],
        },
      },
      {
        name: 'TOEFL Class',
        description: 'Bimbingan intensif strategi dan latihan soal TOEFL untuk mencapai skor target perguruan tinggi.',
        badge: 'Persiapan TOEFL',
        detail: {
          hargaDaftar: 'Rp 200.000',
          sppBulanan: 'Rp 3.750.000',
          sppLabel: 'Harga Pembelajaran',
          sppNote: 'Biaya keseluruhan program pembelajaran',
          hargaModul: 'Rp 150.000',
          jadwal: '50x Pertemuan',
          materi: [
            'Diagnostic Test (Simulasi Awal)',
            'Grammar',
            'Reading Skill',
            'Listening Skill',
            'Full Practice Test',
          ],
        },
      },
    ],
  },
  {
    id: 'math',
    icon: Percent,
    title: 'Matematika',
    color: 'bg-emerald-600',
    accentClass: 'text-emerald-700',
    badgeBg: 'bg-emerald-50',
    borderAccent: 'border-emerald-200',
    description: 'Bimbingan matematika terstruktur dari dasar hingga tingkat lanjut, disesuaikan dengan kurikulum setiap jenjang pendidikan.',
    subPrograms: [
      {
        name: 'Matematika SD Kelas 1–5',
        description: 'Membangun fondasi numerasi yang kuat dengan pendekatan visual dan konsep yang mudah dipahami.',
        badge: 'SD Kelas 1–5',
        detail: {
          hargaDaftar: 'Rp 200.000',
          sppBulanan: 'Rp 150.000',
          jadwal: '2× seminggu, 60 menit per pertemuan',
          materi: [
            'Operasi bilangan (penjumlahan, pengurangan, perkalian, pembagian)',
            'Pecahan dan desimal',
            'Pengukuran (panjang, berat, waktu)',
            'Bangun datar dan bangun ruang dasar',
            'Statistika dasar (diagram batang & lingkaran)',
          ],
        },
      },
      {
        name: 'Matematika SD Kelas 6',
        description: 'Persiapan intensif untuk ujian akhir SD dengan penguatan materi dan latihan soal.',
        badge: 'SD Kelas 6',
        detail: {
          hargaDaftar: 'Rp 150.000',
          sppBulanan: 'Rp 250.000',
          hargaModul: 'Rp 90.000',
          jadwal: '3× seminggu, 60 menit per pertemuan',
          materi: [
            'Review materi matematika SD kelas 1–6',
            'Perbandingan & skala',
            'Luas & volume bangun ruang',
            'Debit dan kecepatan',
            'Latihan soal ujian akhir SD',
          ],
        },
      },
      {
        name: 'Matematika SMP Kelas 7–8',
        description: 'Pengenalan aljabar, geometri, dan statistika sesuai kurikulum SMP untuk membangun logika berpikir.',
        badge: 'SMP Kelas 7–8',
        detail: {
          hargaDaftar: 'Rp 150.000',
          sppBulanan: 'Rp 250.000',
          hargaModul: 'Rp 100.000',
          jadwal: '2× seminggu, 60 menit per pertemuan',
          materi: [
            'Aljabar & persamaan linear',
            'Himpunan & relasi fungsi',
            'Pythagoras & geometri',
            'Statistika & peluang dasar',
            'Sistem persamaan linear dua variabel',
          ],
        },
      },
      {
        name: 'Matematika SMP Kelas 9',
        description: 'Program intensif menghadapi ujian akhir SMP dengan pembahasan soal dan strategi menjawab.',
        badge: 'SMP Kelas 9',
        detail: {
          hargaDaftar: 'Rp 150.000',
          sppBulanan: 'Rp 300.000',
          hargaModul: 'Rp 110.000',
          jadwal: '3× seminggu, 60 menit per pertemuan',
          materi: [
            'Review materi matematika SMP kelas 7–9',
            'Bilangan berpangkat & bentuk akar',
            'Transformasi geometri',
            'Kesebangunan & kekongruenan',
            'Latihan soal ujian akhir SMP',
          ],
        },
      },
      {
        name: 'Matematika SMA Kelas 10–11',
        description: 'Pendalaman materi kalkulus, trigonometri, dan limit sesuai kurikulum SMA.',
        badge: 'SMA Kelas 10–11',
        detail: {
          hargaDaftar: 'Rp 150.000',
          sppBulanan: 'Rp 275.000',
          hargaModul: 'Rp 110.000',
          jadwal: '2× seminggu, 60 menit per pertemuan',
          materi: [
            'Fungsi & invers fungsi',
            'Trigonometri (sin, cos, tan & identitas)',
            'Limit fungsi aljabar & trigonometri',
            'Turunan & aplikasinya',
            'Matriks & determinan',
          ],
        },
      },
      {
        name: 'Matematika SMA Kelas 12',
        description: 'Bimbingan intensif persiapan ujian akhir SMA dan seleksi masuk perguruan tinggi.',
        badge: 'SMA Kelas 12',
        detail: {
          hargaDaftar: 'Rp 150.000',
          sppBulanan: 'Rp 325.000',
          hargaModul: 'Rp 130.000',
          jadwal: '3× seminggu, 60 menit per pertemuan',
          materi: [
            'Review materi matematika SMA kelas 10–12',
            'Integral & aplikasinya',
            'Peluang & statistika lanjutan',
            'Barisan & deret',
            'Latihan soal UTBK & ujian akhir SMA',
          ],
        },
      },
    ],
  },
  {
    id: 'calistung',
    icon: Pencil,
    title: 'Calistung',
    color: 'bg-orange-500',
    accentClass: 'text-orange-700',
    badgeBg: 'bg-orange-50',
    borderAccent: 'border-orange-200',
    description: 'Program Baca, Tulis, dan Hitung untuk anak usia dini — meletakkan fondasi literasi dan numerasi yang kokoh sejak dini.',
    subPrograms: [
      {
        name: 'Membaca',
        description: 'Belajar mengenal huruf, fonik, dan membaca lancar dengan metode yang menyenangkan untuk anak.',
        badge: 'Membaca',
        detail: {
          hargaDaftar: 'Rp 150.000',
          sppBulanan: 'Rp 180.000',
          hargaModul: 'Rp 70.000',
          jadwal: '2× seminggu, 45 menit per pertemuan',
          materi: [
            'Pengenalan huruf vokal & konsonan',
            'Suku kata & fonetik dasar',
            'Membaca kata per kata',
            'Membaca kalimat sederhana',
            'Membaca cerita pendek dengan pemahaman',
          ],
        },
      },
      {
        name: 'Menulis',
        description: 'Latihan menulis huruf dan kata dengan teknik yang tepat agar terbentuk kebiasaan menulis yang baik.',
        badge: 'Menulis',
        detail: {
          hargaDaftar: 'Rp 150.000',
          sppBulanan: 'Rp 180.000',
          hargaModul: 'Rp 70.000',
          jadwal: '2× seminggu, 45 menit per pertemuan',
          materi: [
            'Cara memegang pensil yang benar',
            'Menulis huruf kapital & kecil',
            'Menulis suku kata & kata',
            'Menulis kalimat sederhana',
            'Dikte & salin tulisan',
          ],
        },
      },
      {
        name: 'Berhitung',
        description: 'Pengenalan angka, operasi dasar, dan logika berpikir matematis yang menyenangkan untuk anak.',
        badge: 'Berhitung',
        detail: {
          hargaDaftar: 'Rp 150.000',
          sppBulanan: 'Rp 180.000',
          hargaModul: 'Rp 70.000',
          jadwal: '2× seminggu, 45 menit per pertemuan',
          materi: [
            'Mengenal angka 1–100',
            'Penjumlahan & pengurangan sederhana',
            'Konsep perkalian dasar',
            'Soal cerita matematika dasar',
            'Permainan logika & berhitung cepat',
          ],
        },
      },
    ],
  },
  {
    id: 'mengaji',
    icon: HeartHandshake,
    title: 'Mengaji',
    color: 'bg-teal-600',
    accentClass: 'text-teal-700',
    badgeBg: 'bg-teal-50',
    borderAccent: 'border-teal-200',
    description: "Program mengaji Al-Qur'an dengan metode yang terstruktur dan pengajar berpengalaman untuk semua usia.",
    subPrograms: [
      {
        name: "Iqro & Al-Qur'an Dasar",
        description: "Belajar membaca huruf hijaiyah dan Al-Qur'an dari nol dengan pendekatan yang sabar dan menyenangkan.",
        badge: 'Pemula',
        detail: {
          hargaDaftar: 'Rp 100.000',
          sppBulanan: 'Rp 150.000',
          hargaModul: 'Rp 50.000',
          jadwal: '2× seminggu, 45 menit per pertemuan',
          materi: [
            'Pengenalan huruf hijaiyah',
            'Harakat (fathah, kasroh, dhommah)',
            'Tanwin, sukun & tasydid',
            'Belajar Iqro jilid 1–6',
            "Membaca Al-Qur'an dengan tartil",
          ],
        },
      },
      {
        name: "Tahsin Al-Qur'an",
        description: "Memperbaiki dan memperindah bacaan Al-Qur'an sesuai kaidah tajwid yang benar.",
        badge: 'Lanjutan',
        detail: {
          hargaDaftar: 'Rp 100.000',
          sppBulanan: 'Rp 175.000',
          hargaModul: 'Rp 60.000',
          jadwal: '2× seminggu, 60 menit per pertemuan',
          materi: [
            'Makhorijul huruf (tempat keluarnya huruf)',
            'Hukum nun mati & tanwin',
            'Hukum mim mati',
            'Mad & pembagiannya',
            "Waqaf & ibtida' dalam Al-Qur'an",
          ],
        },
      },
    ],
  },
  {
    id: 'computer',
    icon: Computer,
    title: 'Komputer',
    color: 'bg-violet-600',
    accentClass: 'text-violet-700',
    badgeBg: 'bg-violet-50',
    borderAccent: 'border-violet-200',
    description: 'Penguasaan teknologi komputer dari dasar untuk pelajar dan umum — mempersiapkan generasi yang melek digital.',
    subPrograms: [
      {
        name: 'Komputer Dasar',
        description: 'Pengenalan perangkat komputer, sistem operasi, mengetik, dan penggunaan internet yang aman.',
        badge: 'Dasar',
        detail: {
          hargaDaftar: 'Rp 150.000',
          sppBulanan: 'Rp 220.000',
          hargaModul: 'Rp 90.000',
          jadwal: '2× seminggu, 60 menit per pertemuan',
          materi: [
            'Mengenal perangkat keras & lunak komputer',
            'Sistem operasi Windows (navigasi & manajemen file)',
            'Mengetik 10 jari (touch typing)',
            'Penggunaan internet yang aman & produktif',
            'Email & komunikasi digital dasar',
          ],
        },
      },
      {
        name: 'Microsoft Office',
        description: 'Pelatihan Word, Excel, dan PowerPoint untuk kebutuhan akademik maupun profesional.',
        badge: 'Office',
        detail: {
          hargaDaftar: 'Rp 150.000',
          sppBulanan: 'Rp 250.000',
          hargaModul: 'Rp 100.000',
          jadwal: '2× seminggu, 90 menit per pertemuan',
          materi: [
            'Microsoft Word (membuat dokumen, formatting, mail merge)',
            'Microsoft Excel (rumus dasar, grafik, pivot table)',
            'Microsoft PowerPoint (desain presentasi, animasi)',
            'Praktik membuat laporan & dokumen nyata',
          ],
        },
      },
    ],
  },
  {
    id: 'persiapan-tka',
    icon: Target,
    title: 'Persiapan TKA',
    color: 'bg-rose-600',
    accentClass: 'text-rose-700',
    badgeBg: 'bg-rose-50',
    borderAccent: 'border-rose-200',
    description: 'Bimbingan intensif persiapan Tes Kemampuan Akademik (TKA) untuk seleksi masuk jenjang berikutnya.',
    subPrograms: [
      {
        name: 'Persiapan TKA SD',
        description: 'Latihan soal dan strategi menghadapi tes masuk SD favorit dengan materi yang terstruktur.',
        badge: 'SD',
        detail: {
          hargaDaftar: 'Rp 150.000',
          sppBulanan: 'Rp 250.000',
          hargaModul: 'Rp 100.000',
          jadwal: '3× seminggu, 60 menit per pertemuan',
          materi: [
            'Matematika dasar & logika anak',
            'Bahasa Indonesia (membaca & menulis)',
            'Kemampuan verbal & non-verbal',
            'Latihan soal tes masuk SD favorit',
            'Simulasi tes & evaluasi',
          ],
        },
      },
      {
        name: 'Persiapan TKA SMP',
        description: 'Bimbingan intensif tes masuk SMP unggulan — meliputi Matematika, IPA, Bahasa Indonesia, dan Inggris.',
        badge: 'SMP',
        detail: {
          hargaDaftar: 'Rp 150.000',
          sppBulanan: 'Rp 300.000',
          hargaModul: 'Rp 120.000',
          jadwal: '3× seminggu, 90 menit per pertemuan',
          materi: [
            'Matematika SD kelas 4–6',
            'IPA dasar (sains & lingkungan)',
            'Bahasa Indonesia (membaca & menulis)',
            'Bahasa Inggris dasar',
            'Latihan soal TKA SMP & try out',
          ],
        },
      },
    ],
  },
  {
    id: 'private',
    icon: UserCheck,
    title: 'Private Class',
    color: 'bg-amber-500',
    accentClass: 'text-amber-700',
    badgeBg: 'bg-amber-50',
    borderAccent: 'border-amber-200',
    description: 'Kelas privat satu-per-satu atau kelompok kecil yang disesuaikan penuh dengan kebutuhan dan ritme belajar siswa.',
    subPrograms: [
      {
        name: 'Private Bahasa Inggris',
        description: 'Sesi privat bahasa Inggris yang intensif dan personal — jadwal, materi, dan metode fleksibel.',
        badge: 'Bahasa Inggris',
        detail: {
          hargaDaftar: 'Rp 150.000',
          sppBulanan: 'Rp 500.000',
          hargaModul: 'Rp 120.000',
          jadwal: '2× seminggu, 60–90 menit (fleksibel)',
          materi: [
            'Materi disesuaikan dengan kebutuhan siswa',
            'Conversation & speaking intensif',
            'Grammar & writing personal coaching',
            'Persiapan ujian / TOEFL (opsional)',
            'Feedback personal dari guru',
          ],
        },
      },
      {
        name: 'Private Matematika',
        description: 'Sesi privat matematika untuk memahami konsep yang sulit dengan penjelasan personal dari guru.',
        badge: 'Matematika',
        detail: {
          hargaDaftar: 'Rp 150.000',
          sppBulanan: 'Rp 500.000',
          hargaModul: 'Rp 110.000',
          jadwal: '2× seminggu, 60–90 menit (fleksibel)',
          materi: [
            'Materi disesuaikan jenjang siswa (SD/SMP/SMA)',
            'Pemahaman konsep dari dasar',
            'Latihan soal & pembahasan intensif',
            'Persiapan ujian / UTBK (opsional)',
            'Pendampingan PR & tugas sekolah',
          ],
        },
      },
      {
        name: 'Private Bimbel Umum',
        description: 'Bimbingan belajar privat untuk semua mata pelajaran sekolah sesuai dengan kebutuhan spesifik siswa.',
        badge: 'Bimbel',
        detail: {
          hargaDaftar: 'Rp 150.000',
          sppBulanan: 'Rp 600.000',
          hargaModul: 'Disesuaikan',
          jadwal: '2× seminggu, 60–90 menit (fleksibel)',
          materi: [
            'Semua mata pelajaran (IPA, IPS, Bahasa, dll)',
            'Pendampingan PR & tugas sekolah',
            'Review materi ujian harian & semester',
            'Persiapan ujian akhir / UTBK',
            'Jadwal & materi 100% fleksibel',
          ],
        },
      },
      {
        name: 'Private Calistung',
        description: 'Sesi privat calistung untuk anak yang memerlukan perhatian dan pendampingan lebih intensif.',
        badge: 'Calistung',
        detail: {
          hargaDaftar: 'Rp 150.000',
          sppBulanan: 'Rp 400.000',
          hargaModul: 'Rp 80.000',
          jadwal: '2× seminggu, 45–60 menit (fleksibel)',
          materi: [
            'Belajar membaca dari nol secara intensif',
            'Latihan menulis huruf & kalimat',
            'Berhitung dasar & operasi bilangan',
            'Pendekatan sabar & personal untuk anak',
            'Pantauan progres berkala untuk orang tua',
          ],
        },
      },
    ],
  },
];

// --- Modal Component ---

interface ModalProps {
  sub: SubProgram;
  accentClass: string;
  badgeBg: string;
  borderAccent: string;
  programIcon: LucideIcon;
  programTitle: string;
  onClose: () => void;
}

function ProgramModal({ sub, accentClass, badgeBg, borderAccent, programIcon, programTitle, onClose }: ModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  if (!sub.detail) return null;
  const { hargaDaftar, sppBulanan, sppLabel, sppNote, hargaModul, hargaUjian, jadwal, materi } = sub.detail;

  const priceItems = [
  { label: 'Harga Daftar', value: hargaDaftar, icon: ClipboardList, note: 'Dibayar sekali saat pendaftaran' },
  { label: sppLabel ?? 'SPP Bulanan', value: sppBulanan, icon: Calendar, note: sppNote ?? 'Dibayar setiap bulan' },
  ...(hargaModul ? [{ label: 'Harga Modul', value: hargaModul, icon: BookOpen, note: 'Buku ajar / modul pembelajaran' }] : []),
  ...(hargaUjian ? [{ label: 'Harga Ujian', value: hargaUjian, icon: GraduationCap, note: 'Biaya pelaksanaan ujian' }] : []),
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal Panel */}
      <div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`sticky top-0 z-10 bg-white border-b ${borderAccent} px-6 py-5 rounded-t-3xl flex items-start justify-between gap-4`}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{(() => {
            const Icon = programIcon;
            return <Icon className="w-6 h-6" />;
          })()}</span>
            <div>
              <p className={`text-[10px] font-bold tracking-widest uppercase ${accentClass}`}>{programTitle}</p>
              <h3 className="text-lg font-bold text-gray-900 leading-tight">{sub.name}</h3>
              {sub.badge && (
                <span className={`inline-block mt-1 text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full ${badgeBg} ${accentClass}`}>
                  {sub.badge}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            aria-label="Tutup modal"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-6 space-y-6">
          {/* Description */}
          <p className="text-gray-600 text-sm leading-relaxed">{sub.description}</p>

          {/* Schedule */}
          <div className={`flex items-center gap-3 p-4 rounded-2xl border ${borderAccent} ${badgeBg}`}>
            <Calendar className="w-6 h-6 text-black" />
            <div>
              <p className={`text-[10px] font-bold tracking-wider uppercase ${accentClass}`}>Jadwal Pertemuan</p>
              <p className="text-gray-800 font-semibold text-sm mt-0.5">{jadwal}</p>
            </div>
          </div>

          {/* Pricing */}
          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-3">Biaya Program</h4>
            <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3">
              {priceItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex flex-col gap-1 p-4 rounded-2xl border border-gray-100 bg-gray-50">
                    <div className={`${accentClass} p-2 w-fit rounded-xl bg-blue-50`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <p className="text-[10px] text-gray-400 font-medium mt-1">{item.label}</p>
                    <p className="text-base font-bold text-gray-900">{item.value}</p>
                    <p className="text-[10px] text-gray-400">{item.note}</p>
                  </div>
                );
              })}
</div>
            <p className="mt-3 text-[11px] text-gray-400 flex items-center gap-1.5">
              <span>ℹ️</span>
              Harga dapat berubah sewaktu-waktu. Hubungi kami untuk informasi terbaru.
            </p>
          </div>

          {/* Materi */}
          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-3">Materi yang Dipelajari</h4>
            <ul className="space-y-2">
              {materi.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                  <span className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full ${badgeBg} ${accentClass} flex items-center justify-center text-[10px] font-bold`}>
                    {i + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 rounded-b-3xl flex flex-col sm:flex-row gap-3">
          <Link
            href="/konsultasi"
            onClick={onClose}
            className="flex-1 inline-flex justify-center items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-all"
          >
            Konsultasi Dulu
          </Link>
          <Link
            href="/daftar"
            onClick={onClose}
            className="flex-1 inline-flex justify-center items-center gap-2 px-5 py-2.5 rounded-full bg-[#2546a1] text-white font-bold text-sm hover:bg-[#1a347d] transition-all shadow hover:shadow-md hover:-translate-y-0.5"
          >
            Daftar Sekarang
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

// --- Sub-component: SubProgramCard ---

interface SubProgramCardProps {
  sub: SubProgram;
  accentClass: string;
  badgeBg: string;
  onClick: () => void;
}

function SubProgramCard({ sub, accentClass, badgeBg, onClick }: SubProgramCardProps) {
  return (
    <button
      onClick={onClick}
      className="group text-left flex flex-col gap-2 p-4 rounded-2xl border border-gray-100 bg-white hover:border-gray-200 hover:shadow-md transition-all duration-200 w-full"
    >
      <div className="flex items-start justify-between gap-2">
        {sub.badge && (
          <span className={`self-start text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full ${badgeBg} ${accentClass}`}>
            {sub.badge}
          </span>
        )}
        {sub.detail && (
          <span className="flex-shrink-0 text-gray-300 group-hover:text-gray-500 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
        )}
      </div>
      <p className="text-sm font-semibold text-gray-800 leading-snug group-hover:text-gray-900">{sub.name}</p>
      <p className="text-xs text-gray-500 leading-relaxed">{sub.description}</p>
      {sub.detail && (
        <p className={`text-[10px] font-bold tracking-wide ${accentClass} opacity-0 group-hover:opacity-100 transition-opacity`}>
          Klik untuk lihat detail & harga →
        </p>
      )}
    </button>
  );
}

// --- Main Component ---

export default function Programs() {
  const [activeId, setActiveId] = useState<string>(programs[0].id);
  const [selectedSub, setSelectedSub] = useState<SubProgram | null>(null);

  const active = programs.find((p) => p.id === activeId)!;

  const handleClose = useCallback(() => setSelectedSub(null), []);

  return (
    <section className="py-20 md:py-28 bg-white relative overflow-hidden" id='program'>
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-50 rounded-full blur-[120px] opacity-40 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-50 rounded-full blur-[100px] opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-blue-100 bg-blue-50/50 mb-5">
            <span className="text-[11px] font-bold tracking-[0.15em] text-blue-700 uppercase">
              Program Unggulan
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#0f172a] leading-[1.1] tracking-tight">
            Semua yang Kamu Butuhkan,<br />
            <span className="italic text-primary font-serif">Ada di Sini.</span>
          </h2>
          <p className="mt-5 text-gray-500 text-lg max-w-xl mx-auto leading-relaxed">
            Dari Bahasa Inggris hingga Komputer — kami siapkan program belajar terbaik untuk setiap kebutuhan dan usia.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {programs.map((prog) => {
            const Icon = prog.icon; 

            return (
              <button
                key={prog.id}
                onClick={() => setActiveId(prog.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border ${
                  activeId === prog.id
                    ? `${prog.color} text-white border-transparent shadow-md scale-[1.03]`
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {/* Render sebagai komponen JSX */}
                <Icon className="w-4 h-4" />
                <span>{prog.title}</span>
              </button>
            );
          })}
        </div>

        {/* Active Program Panel */}
        <div className="rounded-3xl border border-gray-100 bg-gray-50 overflow-hidden shadow-sm">
          <div className="p-6 md:p-10">

            {/* Program Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl ${active.color} flex items-center justify-center text-2xl shadow-md flex-shrink-0`}>
                  <active.icon />
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-[#0f172a] tracking-tight">{active.title}</h3>
                  <p className="text-gray-500 text-sm mt-0.5 max-w-md">{active.description}</p>
                </div>
              </div>
              <Link
                href={`/program#${active.id}`}
                className="self-start sm:self-center inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline underline-offset-4 whitespace-nowrap"
              >
                Lihat semua
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Click hint */}
            <p className="text-xs text-gray-400 mb-4 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Klik kartu program untuk melihat detail, harga, dan materi pembelajaran.
            </p>

            {/* Sub-program Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {active.subPrograms.map((sub) => (
                <SubProgramCard
                  key={`${sub.name}-${sub.badge}`}
                  sub={sub}
                  accentClass={active.accentClass}
                  badgeBg={active.badgeBg}
                  onClick={() => setSelectedSub(sub)}
                />
              ))}
            </div>
          </div>

          {/* CTA Footer */}
          <div className="border-t border-gray-200 bg-white px-6 md:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              Tidak yakin program mana yang cocok?{' '}
              <Link href="/konsultasi" className="font-semibold text-primary hover:underline underline-offset-2">
                Konsultasi gratis bersama kami
              </Link>
            </p>
            <Link
              href="/daftar"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#2546a1] text-white font-bold text-sm hover:bg-[#1a347d] transition-all shadow hover:shadow-md hover:-translate-y-0.5 whitespace-nowrap"
            >
              Daftar Kelas Sekarang
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>

      </div>

      {/* Modal */}
      {selectedSub && (
        <ProgramModal
          sub={selectedSub}
          accentClass={active.accentClass}
          badgeBg={active.badgeBg}
          borderAccent={active.borderAccent}
          programIcon={active.icon}
          programTitle={active.title}
          onClose={handleClose}
        />
      )}
    </section>
  );
}
