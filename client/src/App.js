import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
  fetch('/api/data')
    .then((res) => res.json())
    .then((data) => setMessage(data.message))
    .catch((err) => console.error(err));
}, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Bài Tập Thực Hành Fullstack</h1>
        <p>Thông điệp từ Server Express:</p>
        <h2 style={{ color: '#61dafb' }}>{message || 'Đang tải dữ liệu...'}</h2>
      </header>
    </div>
  );
}

export default App;