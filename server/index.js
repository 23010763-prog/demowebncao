const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

// Cho phép tất cả Domain truy cập API
app.use(cors({ origin: '*' }));
app.use(express.json());

app.get('/api/data', (req, res) => {
  res.json({ message: 'Hello from Node.js server!' });
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