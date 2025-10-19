import React, { useEffect, useRef, useState, useCallback } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    // --- Data Karyawan (auto-fill via scan) ---
    karyawanNama: '',

    // --- Data Pasien (akan auto terisi dari DB saat pilih nama) ---
    nama: '',
    umur: '',
    jenisKelamin: '',
    tanggalKunjungan: '',
    layanan: '',

    // --- Penilaian ---
    kebersihan: '',
    keramahan: '',
    kejelasanInformasi: '',
    kecepatanLayanan: '',
    fasilitasRumahSakit: '',
    profesionalisme: '',
    saran: ''
  });

  const [submitted, setSubmitted] = useState(false);

  // ====== KARYAWAN: Auto-fill via Scan Barcode + Dropdown ======
  const [karyawanOptions, setKaryawanOptions] = useState([]);
  const [selectedKaryawanId, setSelectedKaryawanId] = useState('');
  const bufferRef = useRef('');
  const lastKeyTimeRef = useRef(0);

  // ⬇️ MEMOIZED: fetchKaryawanByBarcode
  const fetchKaryawanByBarcode = useCallback(async (barcode) => {
    const FAKE_DB = {
      'EMP001': [{ id: '1', nama: 'Farhan Rahmansyah', nip: '19876', jabatan: 'Analis Data' }],
      'EMP777': [
        { id: '7', nama: 'Siti Aminah', nip: '20123', jabatan: 'Admin' },
        { id: '8', nama: 'Amin Syah',   nip: '20124', jabatan: 'Staff' },
      ],
    };
    await new Promise((r) => setTimeout(r, 200));
    return FAKE_DB[barcode] ?? [];
    // Contoh API:
    // const res = await fetch(`/api/karyawan?barcode=${encodeURIComponent(barcode)}`);
    // return await res.json();
  }, []);

  // ⬇️ MEMOIZED: handleBarcode
  const handleBarcode = useCallback(async (barcode) => {
    const result = await fetchKaryawanByBarcode(barcode);
    setKaryawanOptions(result);
    if (result.length === 1) {
      const k = result[0];
      setSelectedKaryawanId(k.id);
      setFormData((prev) => ({ ...prev, karyawanNama: k.nama }));
    } else {
      setSelectedKaryawanId('');
    }
  }, [fetchKaryawanByBarcode]);

  useEffect(() => {
    function onKeyDown(e) {
      const now = Date.now();
      const isRapid = now - lastKeyTimeRef.current < 25;
      lastKeyTimeRef.current = now;

      if (e.key === 'Enter') {
        const barcode = bufferRef.current.trim();
        bufferRef.current = '';
        if (!barcode) return;
        handleBarcode(barcode);
        e.preventDefault();
        return;
      }
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      if (!isRapid) bufferRef.current = '';
      if (e.key.length === 1) bufferRef.current += e.key;
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleBarcode]); // ✅ deps diperbaiki

  function handlePilihKaryawan(e) {
    const val = e.target.value;
    setSelectedKaryawanId(val);
    const k = karyawanOptions.find((x) => x.id === val);
    if (k) {
      setFormData((prev) => ({ ...prev, karyawanNama: k.nama }));
    }
  }
  // ====== END KARYAWAN ======

  // ====== PASIEN: Dropdown ambil dari "database" dan auto-fill ======
  const [patientOptions, setPatientOptions] = useState([]); // list pasien untuk dropdown
  const [selectedPatientId, setSelectedPatientId] = useState(''); // id pasien yang dipilih

  // Mock “database” pasien
  const FAKE_PATIENTS = [
    {
      id: 'P001',
      nama: 'Andi Prasetyo',
      umur: 34,
      jenisKelamin: 'Laki-laki',
      tanggalKunjungan: '2025-10-18',
      layanan: 'Front Office/Pendaftaran',
    },
    {
      id: 'P002',
      nama: 'Sari Wulandari',
      umur: 28,
      jenisKelamin: 'Perempuan',
      tanggalKunjungan: '2025-10-19',
      layanan: 'Farmasi',
    },
  ];

  // ⬇️ MEMOIZED: fetchAllPatients
  const fetchAllPatients = useCallback(async () => {
    // Ganti ke API real:
    // const res = await fetch('/api/patients');
    // return await res.json();
    await new Promise((r) => setTimeout(r, 200));
    return FAKE_PATIENTS;
  }, []); // tidak bergantung pada state/props

  async function fetchPatientById(id) {
    // Ganti ke API real:
    // const res = await fetch(`/api/patients/${id}`);
    // return await res.json();
    await new Promise((r) => setTimeout(r, 150));
    return FAKE_PATIENTS.find(p => p.id === id) || null;
  }

  // Ambil list pasien saat halaman dibuka
  useEffect(() => {
    (async () => {
      const list = await fetchAllPatients();
      setPatientOptions(list);
    })();
  }, [fetchAllPatients]); // ✅ deps diperbaiki

  // Saat pilih pasien, auto-fill field Data Pasien
  async function handlePilihPasien(e) {
    const id = e.target.value;
    setSelectedPatientId(id);
    if (!id) return;

    const p = await fetchPatientById(id);
    if (p) {
      setFormData(prev => ({
        ...prev,
        // auto-fill sesuai kebutuhan
        nama: p.nama || '',
        umur: String(p.umur ?? ''),
        jenisKelamin: p.jenisKelamin || '',
        tanggalKunjungan: p.tanggalKunjungan || '',
        layanan: p.layanan || ''
      }));
    }
  }
  // ====== END PASIEN ======

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Data Form:', formData);
    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        karyawanNama: '',
        nama: '',
        umur: '',
        jenisKelamin: '',
        tanggalKunjungan: '',
        layanan: '',
        kebersihan: '',
        keramahan: '',
        kejelasanInformasi: '',
        kecepatanLayanan: '',
        fasilitasRumahSakit: '',
        profesionalisme: '',
        saran: ''
      });
      setKaryawanOptions([]);
      setSelectedKaryawanId('');
      setSelectedPatientId('');
    }, 3000);
  };

  if (submitted) {
    return (
      <div className="App">
        <div className="success-message">
          <h2>✓ Terima Kasih!</h2>
          <p>Penilaian Anda telah berhasil dikirim.</p>
          <p>Feedback Anda sangat berharga bagi kami untuk meningkatkan kualitas layanan.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="form-container">
        <h1>📋 Form Penilaian Kepuasan Pasien</h1>
        <h2>Rumah Sakit</h2>
        <p className="subtitle">Pendapat Anda sangat penting bagi kami</p>

        {/* FORM 1: Data Karyawan */}
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Data Karyawan</h3>

            {karyawanOptions.length > 0 && (
              <div className="form-group">
                <label>Pilih Karyawan (hasil scan):</label>
                <select value={selectedKaryawanId} onChange={handlePilihKaryawan}>
                  <option value="">-- Pilih --</option>
                  {karyawanOptions.map((k) => (
                    <option key={k.id} value={k.id}>
                      {k.nama}{k.nip ? ` • NIP ${k.nip}` : ''}
                    </option>
                  ))}
                </select>
                <p className="hint">Scan barcode karyawan (scanner USB)—biasanya diakhiri tombol Enter.</p>
              </div>
            )}

            <div className="form-group">
              <label>Nama Lengkap (Karyawan): *</label>
              <input
                type="text"
                name="karyawanNama"
                value={formData.karyawanNama}
                onChange={handleChange}
                required
                placeholder="Terisi otomatis setelah scan / isi manual"
              />
            </div>
          </div>
        </form>

        {/* FORM 2: Data Pasien & Penilaian */}
        <form onSubmit={handleSubmit}>
          {/* Data Pasien */}
          <div className="form-section">
            <h3>Data Pasien</h3>

            {/* Dropdown Nama Pasien dari DB */}
            <div className="form-group">
              <label>Nama Pasien (ambil dari database): *</label>
              <select
                name="selectedPatientId"
                value={selectedPatientId}
                onChange={handlePilihPasien}
                required
              >
                <option value="">-- Pilih Nama Pasien --</option>
                {patientOptions.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.nama}
                  </option>
                ))}
              </select>
              <p className="hint">Setelah dipilih, data pasien akan terisi otomatis.</p>
            </div>

            {/* Field di bawah akan terisi otomatis, tapi tetap bisa diubah manual jika perlu */}
            <div className="form-group">
              <label>Nama Lengkap: *</label>
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                required
                placeholder="Masukkan nama lengkap"
              />
            </div>

            <div className="form-group">
              <label>Umur: *</label>
              <input
                type="number"
                name="umur"
                value={formData.umur}
                onChange={handleChange}
                required
                placeholder="Masukkan umur"
                min="1"
                max="120"
              />
            </div>

            <div className="form-group">
              <label>Jenis Kelamin: *</label>
              <select
                name="jenisKelamin"
                value={formData.jenisKelamin}
                onChange={handleChange}
                required
              >
                <option value="">Pilih jenis kelamin</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>

            <div className="form-group">
              <label>Tanggal Kunjungan: *</label>
              <input
                type="date"
                name="tanggalKunjungan"
                value={formData.tanggalKunjungan}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Jenis Layanan: *</label>
              <select
                name="layanan"
                value={formData.layanan}
                onChange={handleChange}
                required
              >
                <option value="">Pilih jenis layanan</option>
                <option value="Front Office/Pendaftaran">Front Office/Pendaftaran</option>
                <option value="Farmasi">Farmasi</option>
                <option value="Radiologi">Radiologi</option>
                <option value="Laboratorium">Laboratorium</option>
              </select>
            </div>
          </div>

          {/* Penilaian */}
          <div className="form-section">
            <h3>Penilaian Layanan</h3>
            <p className="section-note">Berikan penilaian dari 1 (Sangat Tidak Ramah) sampai 4 (Sangat Ramah)</p>

            <div className="form-group">
              <label>Keramahan Layanan: *</label>
              <div className="rating-group">
                {[1, 2, 3, 4].map(rating => (
                  <label key={rating} className="radio-label">
                    <input
                      type="radio"
                      name="keramahan"
                      value={rating}
                      checked={formData.keramahan === String(rating)}
                      onChange={handleChange}
                      required
                    />
                    <span>{rating}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Kejelasan Informasi: *</label>
              <div className="rating-group">
                {[1, 2, 3, 4].map(rating => (
                  <label key={rating} className="radio-label">
                    <input
                      type="radio"
                      name="kejelasanInformasi"
                      value={rating}
                      checked={formData.kejelasanInformasi === String(rating)}
                      onChange={handleChange}
                      required
                    />
                    <span>{rating}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Kecepatan Layanan: *</label>
              <div className="rating-group">
                {[1, 2, 3, 4].map(rating => (
                  <label key={rating} className="radio-label">
                    <input
                      type="radio"
                      name="kecepatanLayanan"
                      value={rating}
                      checked={formData.kecepatanLayanan === String(rating)}
                      onChange={handleChange}
                      required
                    />
                    <span>{rating}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Saran */}
          <div className="form-section">
            <h3>Saran & Kritik</h3>
            <div className="form-group">
              <label>Saran untuk Peningkatan Layanan:</label>
              <textarea
                name="saran"
                value={formData.saran}
                onChange={handleChange}
                rows="5"
                placeholder="Tuliskan saran atau kritik Anda di sini..."
              />
            </div>
          </div>

          <button type="submit" className="submit-btn">
            Kirim Penilaian
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
