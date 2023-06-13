
// // Định nghĩa tuyến API
// GET http://localhost:8000/api/duAn
app.get('/api/duAn', (req, res) => {
    // Thực hiện truy vấn
    connection.query('SELECT * FROM duan WHERE maduan != -2', (err, results) => {
      if (err) {
        console.error('Lỗi truy vấn MySQL: ' + err.stack);
        return res.status(500).json({ error: 'Lỗi truy vấn cơ sở dữ liệu' });
      }
      // Trả về kết quả dưới dạng JSON
      res.json(results);
    });
  });
  
  // GET http://localhost:8000/api/searchDuAn?search=
  app.get('/api/searchDuAn', (req, res) => {
    const searchTerm = req.query.search;
    // Kiểm tra nếu không có giá trị tìm kiếm được cung cấp
    if (!searchTerm) {
      return res.status(400).json({ error: 'Thiếu thông tin tìm kiếm' });
    }
    // Thực hiện truy vấn với điều kiện tìm kiếm tên dự án
    const query = "SELECT * FROM duan WHERE maduan != -2 AND tenduan LIKE '%" + searchTerm + "%'";
    connection.query(query, (err, results) => {
      if (err) {
        console.error('Lỗi truy vấn MySQL: ' + err.stack);
        return res.status(500).json({ error: 'Lỗi truy vấn cơ sở dữ liệu' });
      }
      // Trả về kết quả dưới dạng JSON
      if(results.length==0){
        return res.status(404).json({ error: 'Không tìm thấy dự án' });
      }else{
        res.json(results);
      }
  
    });
  });
  
  // Định nghĩa tuyến API
  app.get('/api/duAn/:id', (req, res) => {
    const maDuAn = req.params.id;
    // Thực hiện truy vấn
    connection.query('SELECT * FROM duan WHERE maduan = ?', [maDuAn], (err, results) => {
      if (err) {
        console.error('Lỗi truy vấn MySQL: ' + err.stack);
        return res.status(500).json({ error: 'Lỗi truy vấn cơ sở dữ liệu' });
      }
      // Trả về kết quả dưới dạng JSON
      res.json(results);
    });
  });
  
  
  // API endpoint để thêm dự án mới
  app.post('/api/duAn/themDuAn', (req, res) => {
    const { TenDuAn, MoTaDuAn, NgayBatDau, NgayKetThuc, TrangThai } = req.body;
    const maduan = moment().format('DDMMYYYYHHmmss');
    // const maduan = moment().format('DDMMYYYYHHmmss')+ ''+Math.floor(Math.random() * 10000000);
    console.log(maduan);
    // Tạo một đối tượng dự án mới
    const project = {maduan, TenDuAn, MoTaDuAn, NgayBatDau, NgayKetThuc, TrangThai };
    // Thêm dự án vào cơ sở dữ liệu
    connection.query('INSERT INTO duan SET ?', project, (err, result) => {
      if (err) {
        console.error('Lỗi khi thêm dự án:', err);
        return res.status(500).json({ error: 'Lỗi khi thêm dự án.' });
      }
      return res.status(201).json({ success: 'Dự án mới đã được tạo thành công.' });
    });
  });
  
  // Cập nhật dự án
  app.put('/api/duAn/capNhatDuAn/:id', (req, res) => {
    const MaDuAn = req.params.id;
    const { TenDuAn, MoTaDuAn, NgayBatDau, NgayKetThuc, TrangThai } = req.body;
    const query = 'UPDATE duan SET TenDuAn = ?, MoTaDuAn = ?, NgayBatDau = ?, NgayKetThuc = ?, TrangThai = ? WHERE MaDuAn = ?;';
    connection.query(query, [TenDuAn, MoTaDuAn, NgayBatDau, NgayKetThuc, TrangThai, MaDuAn], (error, results) => {
      if (error) {
        console.error('Error updating project:', error);
        return res.status(500).json({ error: 'Đã xảy ra lỗi trong quá trình cập nhật dự án.' });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: 'Dự án không tồn tại.' });
      }
      return res.json({ message: 'Cập nhật dự án thành công.' });
    });
  })
  
  // Xóa dự án tạm thời
  app.patch('/api/duAn/xoaDuAn/:id', (req, res) => {
    const MaDuAn = req.params.id;
    const TrangThai = -2;
    const query = 'UPDATE duan SET TrangThai = ? WHERE MaDuAn = ?;';
    connection.query(query, [TrangThai, MaDuAn], (error, results) => {
      if (error) {
        console.error('Error updating project:', error);
        return res.status(500).json({ error: 'Đã xảy ra lỗi trong quá trình xóa dự án.' });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: 'Dự án không tồn tại.' });
      }
      return res.json({ message: 'Xóa dự án thành công.' });
    });
  });
  
  // Xóa dự án vĩnh viễn
  app.delete('/api/duAn/xoaDuAnVinhVien/:id', (req, res) => {
    const MaDuAn = req.params.id;
  
    // Truy vấn tài liệu có khóa ngoại là mã dự án
    const query = 'SELECT * FROM tailieu WHERE maduan = ?';
    connection.query(query, [MaDuAn], (error, results) => {
      if (error) {
        console.error('Error querying documents:', error);
        return res.status(500).json({ error: 'Đã xảy ra lỗi trong quá trình truy vấn tài liệu.' });
      }
  
      // Gán giá trị NULL cho khóa ngoại mã dự án
      const updateQuery = 'UPDATE tailieu SET maduan = NULL WHERE maduan = ?';
      connection.query(updateQuery, [MaDuAn], (updateError, updateResults) => {
        if (updateError) {
          console.error('Error updating documents:', updateError);
          return res.status(500).json({ error: 'Đã xảy ra lỗi trong quá trình cập nhật tài liệu.' });
        }
  
        // Tiếp tục xóa dự án sau khi đã gán giá trị NULL cho khóa ngoại
        const deleteQuery = 'DELETE FROM duan WHERE maduan = ?';
        connection.query(deleteQuery, [MaDuAn], (deleteError, deleteResults) => {
          if (deleteError) {
            console.error('Error deleting project:', deleteError);
            return res.status(500).json({ error: 'Đã xảy ra lỗi trong quá trình xóa dự án.' });
          }
          if (deleteResults.affectedRows === 0) {
            return res.status(404).json({ error: 'Dự án không tồn tại.' });
          }
  
          return res.json({ message: 'Xóa dự án vĩnh viễn thành công.' });
        });
      });
    });
  });
  