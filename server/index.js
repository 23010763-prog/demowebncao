const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

// Cho phép tất cả Domain truy cập API
app.use(cors({ origin: '*' }));
app.use(express.json());

app.get('/api/data', (req, res) => {
  res.json({
    message: 'Hello from Node.js server!',
    items: [
      {
        id: 1,
        category: 'Student life',
        date: 'Jun 12, 2026',
        title: 'Big ideas start in the classroom',
        summary: 'From lectures to labs, Phenikaa students turn curious questions into projects that serve their communities.',
        image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=85',
        imageAlt: 'Students celebrating their graduation'
      },
      {
        id: 2,
        category: 'Research',
        date: 'Jun 8, 2026',
        title: 'Research with real-world impact',
        summary: 'Young research teams are bringing interdisciplinary ideas closer to the challenges people face every day.',
        image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1000&q=85',
        imageAlt: 'A researcher working in a laboratory'
      },
      {
        id: 3,
        category: 'Community',
        date: 'Jun 2, 2026',
        title: 'A community ready to make a difference',
        summary: 'A diverse campus community shares experiences, inspiration, and a commitment to a more sustainable future.',
        image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1000&q=85',
        imageAlt: 'Students learning and talking together'
      }
    ]
  });
});

// ROUTE XỬ LÝ POST VÀ IN LOG RA TERMINAL
app.post('/api/post', (req, res) => {
  // Lấy dữ liệu từ các nguồn gửi lên
  const param = req.query.id;
  const body = req.body;
  const headers = req.headers;
  const idHeader = req.headers['idheader'];

  // IN DỮ LIỆU RA TERMINAL CỦA VS CODE
  console.log('====================================');
  console.log('LOG DỮ LIỆU NHẬN ĐƯỢC TỪ POSTMAN:');
  console.log('1. Query Param (id):', param);
  console.log('2. Body:', body);
  console.log('3. Custom Header (idHeader):', idHeader);
  console.log('====================================');

  // Trả về JSON cho Postman
  res.json({
    message: 'This is a POST request!',
    param: param,
    body: body,
    idHeader: idHeader
  });
});

app.get('/', (req, res) => {
  res.send('Server Node.js đang chạy thành công!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});