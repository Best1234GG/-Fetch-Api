import React, { useEffect, useState } from 'react';

const App = () => {
  const API_KEY = "e1b70ddd6a654e5d393e5098f8baebb0";

  const [data, setData] = useState(null);
  const [displayCity, setDisplayCity] = useState("Bangkok");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("Bangkok");

  const fetchWeatherByCoords = async (lat, lon, cityName, countryCode) => {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=th`;

    try {
      const res = await fetch(weatherUrl);
      const result = await res.json();

      if (result.cod === 200) {
        setData(result);
        setDisplayCity(cityName || result.name);
      } else {
        setData(null);
        alert(`เกิดข้อผิดพลาดในการโหลดข้อมูลสภาพอากาศ.`);
      }
    } catch (error) {
      setData(null);
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อ.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCoordsAndWeather = async (searchCity) => {
    setLoading(true);
    const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${searchCity},th&limit=1&appid=${API_KEY}`;

    try {
      const geoRes = await fetch(geoUrl);
      const geoResult = await geoRes.json();

      if (geoResult.length > 0) {
        const { lat, lon, name, country } = geoResult[0];
        await fetchWeatherByCoords(lat, lon, name, country);
      } else {
        setData(null);
        alert(`ไม่พบเมือง "${searchCity}" กรุณาลองใช้ชื่อภาษาอังกฤษหรือชื่อเต็ม.`);
        setLoading(false);
      }
    } catch (error) {
      setData(null);
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อ Geocoding.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoordsAndWeather(searchTerm);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() !== "") {
      fetchCoordsAndWeather(searchTerm.trim());
    }
  };

  if (loading && !data) {
    return <div style={styles.loading}>กำลังโหลดข้อมูลสภาพอากาศ...</div>;
  }

  if (!data && !loading) {
    return (
      <div style={styles.container}>
        <h1 style={styles.header}>Weather App</h1>
        <form onSubmit={handleSearch} style={styles.form}>
          <input
            type="text"
            placeholder="ป้อนชื่อเมือง (ไทย/อังกฤษ)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.input}
          />
          <button type="submit" style={styles.button}>ค้นหา</button>
        </form>
        <p style={{ color: 'red', marginTop: '20px' }}>กรุณาค้นหาเมืองเพื่อเริ่มต้น</p>
      </div>
    );
  }

  const { main, weather, wind, sys } = data;
  const weatherMain = weather[0];

  return (
    <div style={styles.container}>

      <form onSubmit={handleSearch} style={styles.form}>
        <input
          type="text"
          placeholder="ป้อนชื่อเมือง (ไทย/อังกฤษ)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>ค้นหา</button>
      </form>

      <h1 style={styles.header}>{displayCity}, {sys.country}</h1>
      <p style={styles.subHeader}>
        {weatherMain.description.toUpperCase()}
      </p>

      <div style={styles.tempContainer}>
        <p style={styles.temperature}>{Math.round(main.temp)}°C</p>
        <p style={styles.feelsLike}>รู้สึกเหมือน: {Math.round(main.feels_like)}°C</p>
      </div>

      <div style={styles.detailGrid}>
        <p>💧 ความชื้น: **{main.humidity}%**</p>
        <p>💨 ความเร็วลม: **{wind.speed} m/s**</p>
        <p>⬇️ ความกดอากาศ: **{main.pressure} hPa**</p>
        <p>สูงสุด/ต่ำสุด: **{Math.round(main.temp_max)}°C** / **{Math.round(main.temp_min)}°C**</p>
      </div>
      {loading && <p style={styles.loadingSmall}>กำลังโหลดข้อมูลใหม่...</p>}

    </div>
  );
};

const styles = {
  container: {
    padding: '30px',
    maxWidth: '500px',
    margin: '50px auto',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    backgroundColor: '#f7f7f7',
  },
  header: {
    fontSize: '36px',
    marginBottom: '5px',
    color: '#333',
  },
  subHeader: {
    fontSize: '18px',
    color: '#555',
    marginBottom: '20px',
  },
  tempContainer: {
    margin: '30px 0',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    border: '1px solid #ddd',
  },
  temperature: {
    fontSize: '60px',
    fontWeight: 'bold',
    margin: '0',
    color: '#007bff',
  },
  feelsLike: {
    fontSize: '16px',
    color: '#777',
    marginTop: '5px',
  },
  detailGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px',
    textAlign: 'left',
    fontSize: '14px',
    marginTop: '30px',
  },
  loading: {
    fontSize: '24px',
    textAlign: 'center',
    padding: '50px',
  },
  loadingSmall: {
    marginTop: '20px',
    color: '#007bff',
  },
  form: {
    display: 'flex',
    marginBottom: '30px',
    justifyContent: 'center',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '5px 0 0 5px',
    width: '70%',
  },
  button: {
    padding: '10px 15px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '0 5px 5px 0',
    cursor: 'pointer',
  }
};

export default App;