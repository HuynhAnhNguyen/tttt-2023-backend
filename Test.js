// ---------------------------------------------------------------------------------------------------

// // Định nghĩa tuyến API
// GET http://localhost:8000/api/duAn
app.get("/api/duAn", (req, res) => {
    // Thực hiện truy vấn
    connection.query("SELECT * FROM duan WHERE maduan != -2", (err, results) => {
      if (err) {
        console.error("Lỗi truy vấn MySQL: " + err.stack);
        return res.status(500).json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
      }
      // Trả về kết quả dưới dạng JSON
      res.json(results);
    });
  });
  
  // GET http://localhost:8000/api/searchDuAn?search=
  app.get("/api/searchDuAn", (req, res) => {
    const searchTerm = req.query.search;
    // Kiểm tra nếu không có giá trị tìm kiếm được cung cấp
    if (!searchTerm) {
      return res.status(400).json({ error: "Thiếu thông tin tìm kiếm" });
    }
    // Thực hiện truy vấn với điều kiện tìm kiếm tên dự án
    const query =
      "SELECT * FROM duan WHERE trangthai != -2 AND tenduan LIKE '%" +
      searchTerm +
      "%'";
    connection.query(query, (err, results) => {
      if (err) {
        console.error("Lỗi truy vấn MySQL: " + err.stack);
        return res.status(500).json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
      }
      // Trả về kết quả dưới dạng JSON
      if (results.length == 0) {
        return res.status(404).json({ error: "Không tìm thấy dự án" });
      } else {
        res.json(results);
      }
    });
  });
  
  // Định nghĩa tuyến API
  // GET /api/duAn/DA001
  app.get("/api/duAn/:id", (req, res) => {
    const maDuAn = req.params.id;
    // Thực hiện truy vấn
    connection.query(
      "SELECT * FROM duan WHERE maduan = ?",
      [maDuAn],
      (err, results) => {
        if (err) {
          console.error("Lỗi truy vấn MySQL: " + err.stack);
          return res.status(500).json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
        }
        // Trả về kết quả dưới dạng JSON
        res.json(results);
      }
    );
  });
  
  // API endpoint để thêm dự án mới
  app.post("/api/duAn/themDuAn", (req, res) => {
    const { TenDuAn, MoTaDuAn, NgayBatDau, NgayKetThuc, TrangThai } = req.body;
    const maduan = moment().format("DDMMYYYYHHmmss");
    // const maduan = moment().format('DDMMYYYYHHmmss')+ ''+Math.floor(Math.random() * 10000000);
    console.log(maduan);
    // Tạo một đối tượng dự án mới
    const project = {
      maduan,
      TenDuAn,
      MoTaDuAn,
      NgayBatDau,
      NgayKetThuc,
      TrangThai,
    };
    // Thêm dự án vào cơ sở dữ liệu
    connection.query("INSERT INTO duan SET ?", project, (err, result) => {
      if (err) {
        console.error("Lỗi khi thêm dự án:", err);
        return res.status(500).json({ error: "Lỗi khi thêm dự án." });
      }
      return res
        .status(201)
        .json({ success: "Dự án mới đã được tạo thành công." });
    });
  });
  
  // Cập nhật dự án
  app.put("/api/duAn/capNhatDuAn/:id", (req, res) => {
    const MaDuAn = req.params.id;
    const { TenDuAn, MoTaDuAn, NgayBatDau, NgayKetThuc, TrangThai } = req.body;
    const query =
      "UPDATE duan SET TenDuAn = ?, MoTaDuAn = ?, NgayBatDau = ?, NgayKetThuc = ?, TrangThai = ? WHERE MaDuAn = ?;";
    connection.query(
      query,
      [TenDuAn, MoTaDuAn, NgayBatDau, NgayKetThuc, TrangThai, MaDuAn],
      (error, results) => {
        if (error) {
          console.error("Error updating project:", error);
          return res
            .status(500)
            .json({ error: "Đã xảy ra lỗi trong quá trình cập nhật dự án." });
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ error: "Dự án không tồn tại." });
        }
        return res.json({ message: "Cập nhật dự án thành công." });
      }
    );
  });
  
  // Xóa dự án tạm thời
  app.patch("/api/duAn/xoaDuAn/:id", (req, res) => {
    const MaDuAn = req.params.id;
    const TrangThai = -2;
    const query = "UPDATE duan SET TrangThai = ? WHERE MaDuAn = ?;";
    connection.query(query, [TrangThai, MaDuAn], (error, results) => {
      if (error) {
        console.error("Error updating project:", error);
        return res
          .status(500)
          .json({ error: "Đã xảy ra lỗi trong quá trình xóa dự án." });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "Dự án không tồn tại." });
      }
      return res.json({ message: "Xóa dự án thành công." });
    });
  });
  
  // Xóa dự án vĩnh viễn
  app.delete("/api/duAn/xoaDuAnVinhVien/:id", (req, res) => {
    const MaDuAn = req.params.id;
    // Truy vấn tài liệu có khóa ngoại là mã dự án
    const query = "SELECT * FROM tailieu WHERE maduan = ?";
    connection.query(query, [MaDuAn], (error, results) => {
      if (error) {
        console.error("Error querying documents:", error);
        return res
          .status(500)
          .json({ error: "Đã xảy ra lỗi trong quá trình truy vấn tài liệu." });
      }
  
      // Gán giá trị NULL cho khóa ngoại mã dự án
      const updateQuery = "UPDATE tailieu SET maduan = NULL WHERE maduan = ?";
      connection.query(updateQuery, [MaDuAn], (updateError, updateResults) => {
        if (updateError) {
          console.error("Error updating documents:", updateError);
          return res
            .status(500)
            .json({ error: "Đã xảy ra lỗi trong quá trình cập nhật tài liệu." });
        }
  
        // Tiếp tục xóa dự án sau khi đã gán giá trị NULL cho khóa ngoại
        const deleteQuery = "DELETE FROM duan WHERE maduan = ?";
        connection.query(deleteQuery, [MaDuAn], (deleteError, deleteResults) => {
          if (deleteError) {
            console.error("Error deleting project:", deleteError);
            return res
              .status(500)
              .json({ error: "Đã xảy ra lỗi trong quá trình xóa dự án." });
          }
          if (deleteResults.affectedRows === 0) {
            return res.status(404).json({ error: "Dự án không tồn tại." });
          }
  
          return res.json({ message: "Xóa dự án vĩnh viễn thành công." });
        });
      });
    });
  });
  
  
  
  
  
  
  // function themDuLieuNguoiDung() {
  //   for (let i = 0; i < 1000; i++) {
  //     var d;
  //     if(i%2=== 0)
  //       d=1;
  //       else d=0;
  //     const maNguoiDung = moment().format('DDMMYYYYHHmmss') + '' + Math.floor(Math.random() * 10000000);
  //     const hoLot = 'Người dùng ' + i;
  //     const ten = 'Họ và tên ' + i;
  //     const email = 'email' + i + '@example.com';
  //     const diaChi = 'Địa chỉ ' + i;
  //     const soDienThoai = '0123456789';
  //     const viTri = 'Trưởng phòng ' + i;
  //     const gioiTinh = d;
  //     const trangThai = d;
  //     const username = 'username' + i;
  //     const password = 'password' + i;
  //     const maLoaiNguoiDung = null;
  
  //     const query = `INSERT INTO NguoiDung (MaNguoiDung, HoLot, Ten, Email, DiaChi, SoDienThoai, ViTri, GioiTinh, TrangThai, Username, Password, MaLoaiNguoiDung) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  //     const values = [maNguoiDung, hoLot, ten, email, diaChi, soDienThoai, viTri, gioiTinh, trangThai, username, password, maLoaiNguoiDung];
  
  //     connection.query(query, values, (error, results) => {
  //       if (error) {
  //         console.error(error);
  //       } else {
  //         console.log('Thêm người dùng thành công');
  //       }
  //     });
  //   }
  // }
  
  //  themDuLieuNguoiDung();
  
  // function themDuLieuDuAn() {
  //   for (let i = 0; i < 1000; i++) {
  //     const maDuAn = moment().format('DDMMYYYYHHmmss')+ ''+Math.floor(Math.random() * 10000000);
  //     const tenDuAn = 'Dự án ' + i;
  //     const moTaDuAn = 'Mô tả dự án ' + i;
  //     const ngayBatDau = moment(Date.now()).format("YYYY-MM-DD");
  //     const ngayKetThuc = moment(Date.now()).add(60, 'days').format("YYYY-MM-DD");
  //     const trangThai = 1;
  
  //     const query = `INSERT INTO DuAn (MaDuAn, TenDuAn, MoTaDuAn, NgayBatDau, NgayKetThuc, TrangThai) VALUES (?, ?, ?, ?, ?, ?)`;
  //     const values = [maDuAn, tenDuAn, moTaDuAn, ngayBatDau, ngayKetThuc, trangThai];
  
  //     connection.query(query, values, (error, results) => {
  //       if (error) {
  //         console.error(error);
  //       } else {
  //         console.log('Thêm dự án thành công');
  //       }
  //     });
  //   }
  // }
  
  //  themDuLieuDuAn();
  
  // function themCongViec() {
  //   for (let i = 0; i < 1000; i++) {
  //     const maCongViec = moment().format('DDMMYYYYHHmmss') + '' + Math.floor(Math.random() * 10000000);
  //     const tenCongViec = 'Công việc ' + i;
  //     const moTaCongViec = 'Mô tả công việc ' + i;
  //     const ngayBatDau = moment(Date.now()).format("YYYY-MM-DD");
  //     const ngayKetThuc = moment(Date.now()).add(60, 'days').format("YYYY-MM-DD");
  //     const trangThai = 1;
  //     const uuTien = Math.floor(Math.random() * 2) + 1;
  
  //     const query = `INSERT INTO CongViec (MaCongViec, TenCongViec, MoTaCongViec, NgayBatDau, NgayKetThuc, TrangThai, UuTien) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  //     const values = [maCongViec, tenCongViec, moTaCongViec, ngayBatDau, ngayKetThuc, trangThai, uuTien];
  
  //     connection.query(query, values, (error, results) => {
  //       if (error) {
  //         console.error(error);
  //       } else {
  //         console.log('Thêm công việc thành công');
  //       }
  //     });
  //   }
  // }

  //  themCongViec();
  
  
  
  // ------------------------------------------------------------------------------------------------
  // Thống kê số lượng user hiện tại
  // GET http://localhost:8000/api/soLuongUser
  app.get("/api/soLuongUser", (req, res) => {
    connection.query(
      "SELECT * FROM nguoidung",
      (err, results) => {
        if (err) {
          console.error("Lỗi truy vấn MySQL: " + err.stack);
          return res.status(500).json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
        }
        // Trả về kết quả dưới dạng JSON
        res.json(results);
      }
    );
  });
  
  // Thống kê số lượng user theo giới tính
  // GET http://localhost:8000/api/soLuongUserByGender
  app.get("/api/soLuongUserByGender", (req, res) => {
    connection.query(
      "SELECT CASE GioiTinh WHEN 0 THEN 'Nam' WHEN 1 THEN 'Nữ' ELSE 'Không xác định' END AS GioiTinh, COUNT(*) AS SoLuong FROM NguoiDung GROUP BY GioiTinh",
      (err, results) => {
        if (err) {
          console.error("Lỗi truy vấn MySQL: " + err.stack);
          return res.status(500).json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
        }
        // Trả về kết quả dưới dạng JSON
        res.json(results);
      }
    );
  });
  
  // Thống kế số lượng công việc
  // GET http://localhost:8000/api/soLuongCongViec
  app.get("/api/soLuongCongViec", (req, res) => {
    connection.query(
      "SELECT COUNT(*) AS SoLuong FROM congviec;",
      (err, results) => {
        if (err) {
          console.error("Lỗi truy vấn MySQL: " + err.stack);
          return res.status(500).json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
        }
        // Trả về kết quả dưới dạng JSON
        res.json(results);
      }
    );
  });
  
  // Thống kế số lượng công việc theo trạng thái
  // GET http://localhost:8000/api/soLuongCongViecByStatus
  app.get("/api/soLuongCongViecByStatus", (req, res) => {
    connection.query(
      "SELECT CASE TrangThai WHEN -3 THEN 'Đã xóa tạm thời' WHEN -2 THEN 'Đã xóa' WHEN -1 THEN 'Đang chuẩn bị' WHEN 0 THEN 'Đang thực hiện' WHEN 1 THEN 'Đã hoàn thành' WHEN 2 THEN 'Đã quá hạn'END AS TrangThai, COUNT(*) AS SoLuong FROM congviec GROUP BY TrangThai;",
      (err, results) => {
        if (err) {
          console.error("Lỗi truy vấn MySQL: " + err.stack);
          return res.status(500).json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
        }
        // Trả về kết quả dưới dạng JSON
        res.json(results);
      }
    );
  });
  
  // Thống kế số lượng công việc bắt đầu ngày hôm nay
  // GET http://localhost:8000/api/soLuongCongViecBatDauHomNay
  app.get("/api/soLuongCongViecBatDauHomNay", (req, res) => {
    connection.query(
      "SELECT COUNT(*) AS SoLuong FROM CongViec WHERE DATE(NgayBatDau) = CURDATE();",
      (err, results) => {
        if (err) {
          console.error("Lỗi truy vấn MySQL: " + err.stack);
          return res.status(500).json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
        }
        // Trả về kết quả dưới dạng JSON
        res.json(results);
      }
    );
  });
  
  // Thống kế số lượng công việc theo ngày bắt đầu
  // GET http://localhost:8000/api/soLuongCongViecTheoNgayBatDau
  app.get("/api/soLuongCongViecTheoNgayBatDau", (req, res) => {
    connection.query(
      "SELECT DATE(NgayBatDau) AS NgayBatDau, COUNT(*) AS SoLuong FROM CongViec GROUP BY NgayBatDau;",
      (err, results) => {
        if (err) {
          console.error("Lỗi truy vấn MySQL: " + err.stack);
          return res.status(500).json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
        }
        // Trả về kết quả dưới dạng JSON
        res.json(results);
      }
    );
  });
  
  // Thống kế số lượng công việc theo ngày kết thúc
  // GET http://localhost:8000/api/soLuongCongViecTheoNgayKetThuc
  app.get("/api/soLuongCongViecTheoNgayKetThuc", (req, res) => {
    connection.query(
      "SELECT DATE(NgayKetThuc) AS NgayKetThuc, COUNT(*) AS SoLuong FROM CongViec GROUP BY NgayKetThuc;",
      (err, results) => {
        if (err) {
          console.error("Lỗi truy vấn MySQL: " + err.stack);
          return res.status(500).json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
        }
        // Trả về kết quả dưới dạng JSON
        res.json(results);
      }
    );
  });
  
  
  
  // Thống kê số lượng dự án
  // GET http://localhost:8000/api/soLuongDuAn
  app.get("/api/soLuongDuAn", (req, res) => {
    connection.query(
      "SELECT COUNT(*) AS SoLuong FROM duan;",
      (err, results) => {
        if (err) {
          console.error("Lỗi truy vấn MySQL: " + err.stack);
          return res.status(500).json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
        }
        // Trả về kết quả dưới dạng JSON
        res.json(results);
      }
    );
  });
  
  // Thống kế số lượng dự án theo trạng thái
  // GET http://localhost:8000/api/soLuongDuAnByStatus
  app.get("/api/soLuongDuAnByStatus", (req, res) => {
    connection.query(
      "SELECT CASE TrangThai WHEN -3 THEN 'Đã xóa tạm thời' WHEN -2 THEN 'Đã xóa' WHEN -1 THEN 'Đang chuẩn bị' WHEN 0 THEN 'Đang thực hiện' WHEN 1 THEN 'Đã hoàn thành' WHEN 2 THEN 'Đã quá hạn' END AS TrangThai, COUNT(*) AS SoLuong FROM duan GROUP BY TrangThai;",
      (err, results) => {
        if (err) {
          console.error("Lỗi truy vấn MySQL: " + err.stack);
          return res.status(500).json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
        }
        // Trả về kết quả dưới dạng JSON
        res.json(results);
      }
    );
  });
  
  
  // GET http://localhost:8000/api/soLuongDuAnBatDauHomNay
  app.get("/api/soLuongDuAnBatDauHomNay", (req, res) => {
    connection.query(
      "SELECT COUNT(*) AS SoLuong FROM duan WHERE DATE(NgayBatDau) = CURDATE();",
      (err, results) => {
        if (err) {
          console.error("Lỗi truy vấn MySQL: " + err.stack);
          return res.status(500).json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
        }
        // Trả về kết quả dưới dạng JSON
        res.json(results);
      }
    );
  });
  
  // GET http://localhost:8000/api/soLuongDuAnTheoNgayBatDau
  app.get("/api/soLuongDuAnTheoNgayBatDau", (req, res) => {
    connection.query(
      "SELECT DATE(NgayBatDau) AS NgayBatDau, COUNT(*) AS SoLuong FROM duan GROUP BY NgayBatDau;",
      (err, results) => {
        if (err) {
          console.error("Lỗi truy vấn MySQL: " + err.stack);
          return res.status(500).json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
        }
        // Trả về kết quả dưới dạng JSON
        res.json(results);
      }
    );
  });
  
  
  // GET http://localhost:8000/api/soLuongDuAnTheoNgayKetThuc
  app.get("/api/soLuongDuAnTheoNgayKetThuc", (req, res) => {
    connection.query(
      "SELECT DATE(NgayKetThuc) AS NgayKetThuc, COUNT(*) AS SoLuong FROM duan GROUP BY NgayKetThuc;",
      (err, results) => {
        if (err) {
          console.error("Lỗi truy vấn MySQL: " + err.stack);
          return res.status(500).json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
        }
        // Trả về kết quả dưới dạng JSON
        res.json(results);
      }
    );
  });