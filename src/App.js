import React, { useEffect, useState, useCallback } from "react";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    karyawanNama: "",
    nama: "",
    umur: "",
    jenisKelamin: "",
    tanggalKunjungan: "",
    layanan: "",
    kebersihan: "",
    keramahan: "",
    kejelasanInformasi: "",
    kecepatanLayanan: "",
    fasilitasRumahSakit: "",
    profesionalisme: "",
    saran: "",
  });

  const [submitted, setSubmitted] = useState(false);

  // ====== KARYAWAN: Dropdown dari API ======
  const [karyawanOptions, setKaryawanOptions] = useState([]);
  const [selectedKaryawanId, setSelectedKaryawanId] = useState("");

  // ⚙️ Parsing respons API yang robust
  const normalizeKaryawanPayload = (payload) => {
    // payload bisa: {...}, [{...}], {data: {...}}, {data: [{...}]}
    const rawList = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.data)
      ? payload.data
      : payload?.data
      ? [payload.data]
      : [payload];

    // map aman
    return rawList
      .filter(Boolean)
      .map((d) => ({
        id: d?.id != null ? String(d.id) : "", // pastikan string
        nama: (d?.nama ?? d?.name ?? "").toString().trim(), // fallback jika field "name"
        departemen: (d?.departemen ?? d?.departemen_kode ?? d?.dept ?? "")
          .toString()
          .trim(),
        nik: (d?.nik ?? "").toString(),
        photo_url: (d?.photo_url ?? "").toString(),
      }))
      .filter((x) => x.id); // buang item tanpa id
  };

  // Fetch data karyawan dari API (jadwal hari ini)
  const fetchKaryawanList = useCallback(async () => {
    try {
      const url =
        "https://project.rsaisyiyahsitifatimah.com/api/datapegawai/jadwal-hari-ini";
      const res = await fetch(url, { headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
      const data = await res.json();

      const mapped = normalizeKaryawanPayload(data);
      setKaryawanOptions(mapped);
    } catch (err) {
      console.error("Gagal memuat data karyawan:", err);
      setKaryawanOptions([]); // kosongkan jika gagal
    }
  }, []);

  useEffect(() => {
    fetchKaryawanList();
  }, [fetchKaryawanList]);

  function handlePilihKaryawan(e) {
    const val = e.target.value;
    setSelectedKaryawanId(val);
    const k = karyawanOptions.find((x) => x.id === val);
    if (k) {
      setFormData((prev) => ({ ...prev, karyawanNama: k.nama }));
    }
  }

  const selectedKaryawan = karyawanOptions.find(
    (k) => k.id === selectedKaryawanId
  );
  // ====== END KARYAWAN ======

  // ====== PASIEN: Ambil dari API ======
  const [patientOptions, setPatientOptions] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState("");

  const mapApiPatient = (raw) => {
    const ageNumber = (() => {
      if (!raw?.umur) return "";
      const m = String(raw.umur).match(/\d+/);
      return m ? String(parseInt(m[0], 10)) : "";
    })();

    return {
      id: raw.no_rawat,
      displayName: raw.nm_pasien?.trim() || "-",
      nama: raw.nm_pasien?.trim() || "",
      umur: ageNumber,
      jenisKelamin:
        raw.jk === "L" ? "Laki-laki" : raw.jk === "P" ? "Perempuan" : "",
      tanggalKunjungan: raw.tgl_registrasi || "",
      layanan: raw.nm_poli || "",
    };
  };

  const fetchAllPatients = useCallback(async () => {
    try {
      const url =
        "https://project.rsaisyiyahsitifatimah.com/api/reg-periksa-hari-ini";
      const res = await fetch(url, { headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error("Gagal ambil data pasien");
      const json = await res.json();
      const arr = Array.isArray(json?.data) ? json.data : [];
      setPatientOptions(arr.map(mapApiPatient));
    } catch (err) {
      console.error("Gagal ambil data pasien:", err);
      setPatientOptions([]);
    }
  }, []);

  useEffect(() => {
    fetchAllPatients();
  }, [fetchAllPatients]);

  async function handlePilihPasien(e) {
    const id = e.target.value;
    setSelectedPatientId(id);
    const p = patientOptions.find((p) => p.id === id);
    if (p) {
      setFormData((prev) => ({
        ...prev,
        nama: p.nama,
        umur: p.umur,
        jenisKelamin: p.jenisKelamin,
        tanggalKunjungan: p.tanggalKunjungan,
        layanan: p.layanan,
      }));
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Data Form:", formData);
    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        karyawanNama: "",
        nama: "",
        umur: "",
        jenisKelamin: "",
        tanggalKunjungan: "",
        layanan: "",
        kebersihan: "",
        keramahan: "",
        kejelasanInformasi: "",
        kecepatanLayanan: "",
        fasilitasRumahSakit: "",
        profesionalisme: "",
        saran: "",
      });
      setSelectedKaryawanId("");
      setSelectedPatientId("");
    }, 3000);
  };

  if (submitted) {
    return (
      <div className="App">
        <div className="success-message">
          <h2>✓ Terima Kasih!</h2>
          <p>Penilaian Anda telah berhasil dikirim.</p>
          <p>
            Feedback Anda sangat berharga bagi kami untuk meningkatkan kualitas
            layanan.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="form-container">
        <h1>Form Penilaian Kepuasan Pasien</h1>
        <h2>Rumah Sakit Aisyiyah Siti Fatimah</h2>
        <p className="subtitle">Pendapat Anda sangat penting bagi kami</p>

        {/* FORM 1: Data Karyawan */}
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Data Karyawan</h3>

            <div className="form-group">
              <label>Pilih Karyawan:</label>
              <select
                value={selectedKaryawanId}
                onChange={handlePilihKaryawan}
                required
              >
                <option value="">-- Pilih Karyawan --</option>
                {karyawanOptions.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.nama}
                    {k.departemen ? ` — ${k.departemen}` : ""}
                  </option>
                ))}
              </select>

              {selectedKaryawan && (
                <div
                  className="karyawan-option-preview karyawan-with-photo"
                  aria-live="polite"
                >
                  {/* Logo Rumah Sakit (kiri) */}
                  <img
                    src={require("./image/LOGO RSU SIFAT .png")}
                    alt="Logo Rumah Sakit"
                    className="hospital-logo"
                  />

                  {/* Info teks tengah */}
                  <div className="karyawan-text">
                    <div className="karyawan-name">
                      {selectedKaryawan.nama || "-"}
                    </div>
                    <div className="karyawan-sep" />
                    <div className="karyawan-dept">
                      {selectedKaryawan.departemen || "-"}
                    </div>
                  </div>

                  {/* Foto Karyawan (kanan) */}
                  {selectedKaryawan.photo_url ? (
                    <img
                      className="karyawan-photo-right"
                      src={selectedKaryawan.photo_url}
                      alt={selectedKaryawan.nama}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="karyawan-photo-right initials">
                      {(selectedKaryawan.nama || "-")
                        .split(/\s+/)
                        .slice(0, 2)
                        .map((s) => s[0])
                        .join("")
                        .toUpperCase()}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </form>

        {/* FORM 2: Data Pasien & Penilaian */}
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Data Pasien</h3>

            <div className="form-group">
              <label>Nama Pasien: *</label>
              <select
                name="selectedPatientId"
                value={selectedPatientId}
                onChange={handlePilihPasien}
                required
              >
                <option value="">-- Pilih Nama Pasien --</option>
                {patientOptions.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.displayName}
                  </option>
                ))}
              </select>
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
                <option value="Front Office/Pendaftaran">
                  Front Office/Pendaftaran
                </option>
                <option value="Farmasi">Farmasi</option>
                <option value="Radiologi">Radiologi</option>
                <option value="Laboratorium">Laboratorium</option>
              </select>
            </div>
          </div>

          <div className="form-section">
            <h3>Penilaian Layanan</h3>
            <p className="section-note">
              Berikan penilaian dari 1 (Sangat Tidak Ramah) sampai 4 (Sangat
              Ramah)
            </p>

            <div className="form-group">
              <label>Keramahan Layanan: *</label>
              <div className="rating-group">
                {[1, 2, 3, 4].map((r) => (
                  <label key={r} className="radio-label">
                    <input
                      type="radio"
                      name="keramahan"
                      value={r}
                      checked={formData.keramahan === String(r)}
                      onChange={handleChange}
                      required
                    />
                    <span>{r}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Kejelasan Informasi : *</label>
              <div className="rating-group">
                {[1, 2, 3, 4].map((r) => (
                  <label key={r} className="radio-label">
                    <input
                      type="radio"
                      name="kejelasanInformasi"
                      value={r}
                      checked={formData.kejelasanInformasi === String(r)}
                      onChange={handleChange}
                      required
                    />
                    <span>{r}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Kecepatatan Layanan : *</label>
              <div className="rating-group">
                {[1, 2, 3, 4].map((r) => (
                  <label key={r} className="radio-label">
                    <input
                      type="radio"
                      name="kecepatanLayanan"
                      value={r}
                      checked={formData.kecepatanLayanan === String(r)}
                      onChange={handleChange}
                      required
                    />
                    <span>{r}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

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
