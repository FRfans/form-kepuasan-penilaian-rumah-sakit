import React, { useState } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    nama: '',
    umur: '',
    jenisKelamin: '',
    tanggalKunjungan: '',
    layanan: '',
    kebersihan: '',
    keramahan: '',
    kecepatanLayanan: '',
    fasilitasRumahSakit: '',
    profesionalisme: '',
    saran: ''
  });

  const [submitted, setSubmitted] = useState(false);

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
    
    // Reset form setelah 3 detik
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        nama: '',
        umur: '',
        jenisKelamin: '',
        tanggalKunjungan: '',
        layanan: '',
        kebersihan: '',
        keramahan: '',
        kecepatanLayanan: '',
        fasilitasRumahSakit: '',
        profesionalisme: '',
        saran: ''
      });
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

        <form onSubmit={handleSubmit}>
          {/* Data Karyawan */}
          <div className="form-section">
            <h3>Data Karyawan</h3>
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
          </div>
        </form>
        
        <form onSubmit={handleSubmit}>
          {/* Data Pasien */}
          <div className="form-section">
            <h3>Data Pasien</h3>
            
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
              </select>
            </div>
          </div>

          {/* Penilaian */}
          <div className="form-section">
            <h3>Penilaian Layanan</h3>
            <p className="section-note">Berikan penilaian dari 1 (Sangat Tidak Puas) sampai 5 (Sangat Puas)</p>

            <div className="form-group">
              <label>Keramahan Layanan: *</label>
              <div className="rating-group">
                {[1, 2, 3, 4, 5].map(rating => (
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
                {[1, 2, 3, 4, 5].map(rating => (
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
                {[1, 2, 3, 4, 5].map(rating => (
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
