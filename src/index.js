const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql");
// const moment = require("moment");
const multer = require("multer");
const app = express();
const port = 8000;

const route = require('./routes');
const db= require("../src/config/db");

db.connectToDatabase();

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "qlcv",
});

// Sử dụng middleware để phân tích cú pháp các yêu cầu có thân (request body)
app.use(bodyParser.json());

// Sử dụng middleware cho CORS
app.use(cors());

// Kết nối MySQL
// connection.connect((err) => {
//   if (err) {
//     console.error("Lỗi kết nối MySQL: " + err.stack);
//     return;
//   }
//   console.log("Kết nối thành công MySQL với ID: " + connection.threadId);
// });

// Cấu hình multer
// const upload = multer({
//   storage: multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, "src/public/pdf"); // Thay đổi đường dẫn thư mục lưu trữ tệp tải lên
//     },
//     filename: function (req, file, cb) {
//       const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//       cb(null, file.originalname); // Sử dụng file.originalname làm tên tệp
//     },
//   }),
// });
// // GET /api/congViec/timCongViec
// // GET http://localhost:8000/api/congViec/timCongViec?search=HHHFH
// app.get("/api/congViec/timCongViec", (req, res) => {
//   const searchTerm = req.query.search;
//   // Kiểm tra nếu không có giá trị tìm kiếm được cung cấp
//   if (!searchTerm) {
//     return res.status(400).json({ error: "Thiếu thông tin tìm kiếm" });
//   }
//   // Thực hiện truy vấn với điều kiện tìm kiếm tên công việc
//   const query =
//     "SELECT * FROM congviec WHERE trangthai != -3 AND tencongviec LIKE '%" +
//     searchTerm +
//     "%'";
//   connection.query(query, (err, results) => {
//     if (err) {
//       console.error("Lỗi truy vấn MySQL: " + err.stack);
//       return res.status(500).json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
//     }
//     // Trả về kết quả dưới dạng JSON
//     if (results.length == 0) {
//       return res.status(404).json({ error: "Không tìm thấy công việc" });
//     } else {
//       res.json(results);
//     }
//   });
// });

// // GET /api/congViec/danhSachCongViec
// // GET http://localhost:8000/api/congViec/danhSachCongViec
// app.get("/api/congViec/danhSachCongViec", (req, res) => {
//   const column = req.query.column;
//   const type = req.query.type;
//   const page = parseInt(req.query.page);
//   const limit = parseInt(req.query.limit);
//   const offset = (page - 1) * limit;

//   if (req.query.hasOwnProperty("sort")) {
//     const query =
//       "SELECT * FROM congviec WHERE trangthai != -3 ORDER BY " +
//       column +
//       " " +
//       type;
//     connection.query(query, (err, results) => {
//       if (err) {
//         console.error("Lỗi truy vấn MySQL: " + err.stack);
//         return res.status(500).json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
//       }
//       // Trả về kết quả dưới dạng JSON
//       // res.json(results);
//       if (results.length == 0) {
//         return res.status(404).json({ error: "Không có công việc" });
//       } else {
//         res.json(results);
//       }
//     });
//   } else if (
//     req.query.hasOwnProperty("page") &&
//     req.query.hasOwnProperty("limit")
//   ) {
//     const query = `SELECT * FROM congviec WHERE trangthai != -3 LIMIT ${limit} OFFSET ${offset}`;

//     connection.query(query, (err, results) => {
//       if (err) {
//         console.error("Lỗi truy vấn MySQL: " + err.stack);
//         return res.status(500).json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
//       }

//       if (results.length === 0) {
//         return res.status(404).json({ error: "Không có công việc" });
//       } else {
//         res.json(results);
//       }
//     });
//   } else {
//     // Thực hiện truy vấn
//     const query = "SELECT * FROM congviec WHERE trangthai != -3";
//     connection.query(query, (err, results) => {
//       if (err) {
//         console.error("Lỗi truy vấn MySQL: " + err.stack);
//         return res.status(500).json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
//       }
//       // Trả về kết quả dưới dạng JSON
//       // res.json(results);
//       if (results.length == 0) {
//         return res.status(404).json({ error: "Không có công việc" });
//       } else {
//         res.json(results);
//       }
//     });
//   }
// });

// // GET /api/congViec/:id
// // GET http://localhost:8000/api/congViec/:id
// app.get("/api/congViec/:id", (req, res) => {
//   const maCongViec = req.params.id;
//   const query =
//     "SELECT * FROM congviec WHERE macongviec = ? AND trangthai != -3";
//   // Thực hiện truy vấn
//   connection.query(query, [maCongViec], (err, results) => {
//     if (err) {
//       console.error("Lỗi truy vấn MySQL: " + err.stack);
//       return res.status(500).json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
//     }
//     // Trả về kết quả dưới dạng JSON
//     if (results.length == 0) {
//       return res.status(404).json({ error: "Không có công việc" });
//     } else {
//       res.json(results);
//     }
//   });
// });

// // POST /api/congViec/themCongViec
// // POST http://localhost:8000/api/congViec/themCongViec
// app.post("/api/congViec/themCongViec", (req, res) => {
//   const {
//     TenCongViec,
//     MoTaCongViec,
//     NgayBatDau,
//     NgayKetThuc,
//     TrangThai,
//     UuTien,
//     MaDuAn,
//   } = req.body;

//   // Thêm công việc vào cơ sở dữ liệu
//   const query = "INSERT INTO congviec SET ?";
//   const maCongViec = moment().format("DDMMYYYYHHmmss") +"" + Math.floor(Math.random() * 10000000);
//   const project = {
//     maCongViec,
//     TenCongViec,
//     MoTaCongViec,
//     NgayBatDau,
//     NgayKetThuc,
//     TrangThai,
//     UuTien,
//   };

//   connection.query(query, project, (err, result) => {
//     if (err) {
//       console.error("Lỗi khi thêm công việc:", err);
//       return res.status(500).json({ error: "Lỗi khi thêm công việc." });
//     }
//     // Thêm dữ liệu vào bảng congviec_duan
//     const queryString = "INSERT INTO congviec_duan (MaCV_DA, MaCongViec, MaDuAn, TrangThai) VALUES ?";
//     const values = MaDuAn.map((maDuAn) => [moment().format("DDMMYYYYHHmmss") +"" +Math.floor(Math.random() * 10000000), maCongViec, maDuAn, 1, ]);
//     console.log(values);
//     connection.query(queryString, [values], (error, results) => {
//       if (error) {
//         console.error("Lỗi khi thêm dữ liệu vào bảng congviec_duan:", error);
//         return res
//           .status(500)
//           .json({ error: "Lỗi khi thêm dữ liệu vào bảng congviec_duan." });
//       }

//       return res
//         .status(201)
//         .json({ success: "Công việc mới đã được tạo thành công." });
//     });
//   });
// });

// // app.get("/api/congViec/timCongViec", (req, res) => {
// //   const searchTerm = req.query.search;
// //   // Kiểm tra nếu không có giá trị tìm kiếm được cung cấp
// //   if (!searchTerm) {
// //     return res.status(400).json({ error: "Thiếu thông tin tìm kiếm" });
// //   }
// //   connection.query("SELECT * FROM congviec WHERE trangthai != -3 AND tencongviec LIKE '%?%'", [searchTerm], (err, results) => {
// //     if (err) {
// //       console.error("Lỗi truy vấn MySQL: " + err.stack);
// //       return res.status(500).json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
// //     }
// //     // Trả về kết quả dưới dạng JSON
// //     res.json(results);
// //     // if (results.length == 0) {
// //     //   return res.status(404).json({ error: "Không tìm thấy công việc" });
// //     // } else {

// //     // }
// //   });
// // });

// // PUT /api/congViec/suaCongViec
// // PUT http://localhost:8000/api/congViec/suaCongViec/sdsgdfg
// app.put("/api/congViec/suaCongViec/:id", (req, res) => {
//   const maCongViec = req.params.id;
//   const {
//     TenCongViec,
//     MoTaCongViec,
//     NgayBatDau,
//     NgayKetThuc,
//     TrangThai,
//     UuTien,
//   } = req.body;
//   const query =
//     "UPDATE congviec SET TenCongViec = ?, MoTaCongViec = ?, NgayBatDau = ?, NgayKetThuc = ?, TrangThai = ?, UuTien = ? WHERE MaCongViec = ?;";
//   connection.query(
//     query,
//     [
//       TenCongViec,
//       MoTaCongViec,
//       NgayBatDau,
//       NgayKetThuc,
//       TrangThai,
//       UuTien,
//       maCongViec,
//     ],
//     (error, results) => {
//       if (error) {
//         console.error("Error updating job:", error);
//         return res
//           .status(500)
//           .json({ error: "Đã xảy ra lỗi trong quá trình cập nhật công việc." });
//       }
//       if (results.affectedRows === 0) {
//         return res.status(404).json({ error: "Công việc không tồn tại." });
//       }
//       return res.json({ message: "Cập nhật công việc thành công." });
//     }
//   );
// });

// // PATCH /api/congViec/xoaCongViec
// // PATCH http://localhost:8000/api/congViec/xoaCongViec/sgdgfhj
// app.patch("/api/congViec/xoaCongViec/:id", (req, res) => {
//   const maCongViec = req.params.id;
//   const TrangThai = -3;
//   const query = "UPDATE congviec SET TrangThai = ? WHERE MaCongViec = ?;";
//   connection.query(query, [TrangThai, maCongViec], (error, results) => {
//     if (error) {
//       console.error("Error updating project:", error);
//       return res
//         .status(500)
//         .json({ error: "Đã xảy ra lỗi trong quá trình xóa công việc." });
//     }
//     if (results.affectedRows === 0) {
//       return res.status(404).json({ error: "Công việc không tồn tại." });
//     }
//     return res.json({ message: "Xóa công việc thành công." });
//   });
// });

// // DELETE /api/congViec/xoaCongViecVinhVien
// // DELETE http://localhost:8000/api/congViec/xoaCongViecVinhVien/sgdgfhj
// app.delete("/api/congViec/xoaCongViecVinhVien/:id", (req, res) => {
//   const maCongViec = req.params.id;
//   const query = "SELECT * FROM nguoidung_congviec WHERE macongviec = ?";
//   connection.query(query, [maCongViec], (error, results) => {
//     if (error) {
//       console.error("Error querying documents:", error);
//       return res
//         .status(500)
//         .json({ error: "Đã xảy ra lỗi trong quá trình truy vấn công việc." });
//     }

//     // Gán giá trị NULL cho khóa ngoại mã công việc
//     const updateQuery =
//       "UPDATE nguoidung_congviec SET macongviec = NULL WHERE macongviec = ?";
//     connection.query(
//       updateQuery,
//       [maCongViec],
//       (updateError, updateResults) => {
//         if (updateError) {
//           console.error("Error updating documents:", updateError);
//           return res.status(500).json({
//             error: "Đã xảy ra lỗi trong quá trình cập nhật công việc.",
//           });
//         }

//         // Tiếp tục xóa công việc sau khi đã gán giá trị NULL cho khóa ngoại
//         const deleteQuery = "DELETE FROM congviec WHERE macongviec = ?";
//         connection.query(
//           deleteQuery,
//           [maCongViec],
//           (deleteError, deleteResults) => {
//             if (deleteError) {
//               console.error("Error deleting project:", deleteError);
//               return res.status(500).json({
//                 error: "Đã xảy ra lỗi trong quá trình xóa công việc.",
//               });
//             }
//             if (deleteResults.affectedRows === 0) {
//               return res
//                 .status(404)
//                 .json({ error: "Công việc không tồn tại." });
//             }

//             return res.json({ message: "Xóa công việc vĩnh viễn thành công." });
//           }
//         );
//       }
//     );
//   });
// });

// // Phân công công việc
// // POST http://localhost:8000/api/congViec/phanCongCongViec/:id
// app.post("/api/congViec/phanCongCongViec/:id", upload.array("files", 10), (req, res) => {
//     const maCongViec = req.params.id;
//     const { MaNguoiDung } = req.body;
//     const taptin = req.files;
//     const queryThemNguoiDung_CV ="INSERT INTO NguoiDung_CongViec (MaND_CV, MaNguoiDung, MaCongViec) VALUES ?";
//     const queryThemTaiLieuCV ="INSERT INTO TaiLieuCV (MaTaiLieuCV, TenTaiLieuCV) VALUES ?";
//     const queryThemCV_TaiLieuCV ="INSERT INTO congviec_tailieucv (MaCV_TL, MaCongViec, MaTaiLieuCV) VALUES ?";

//     const values = MaNguoiDung.map((maNguoiDung) => [moment().format("DDMMYYYYHHmmss") +"" +Math.floor(Math.random() * 10000000), maNguoiDung, maCongViec, ]);
//     connection.query(
//       queryThemNguoiDung_CV,
//       [values],
//       (err, result) => {
//         if (err) {
//           console.error("Lỗi khi phân công công việc:", err);
//           return res
//             .status(500)
//             .json({ error: "Lỗi khi phân công công việc." });
//         }
//         if (taptin.length === 0) {
//           return res
//             .status(200)
//             .json({ success: "Công việc đã được cập nhật thành công." });
//         }

//         const values = taptin.map((file) => {
//           const maTaiLieuCV =moment().format("DDMMYYYYHHmmss") +"" +Math.floor(Math.random() * 10000000);
//           const maCV_TL =moment().format("DDMMYYYYHHmmss") +"" +Math.floor(Math.random() * 15000000);
//           return [maTaiLieuCV, file.originalname, maCV_TL];
//         });

//         connection.query(
//           queryThemTaiLieuCV,
//           [values.map((value) => [value[0], value[1]])],
//           (err, result) => {
//             if (err) {
//               console.error("Lỗi khi thêm tài liệu:", err);
//               return res.status(500).json({ error: "Lỗi khi thêm tài liệu." });
//             }

//             const valuesCV_TL = values.map((value) => [ value[2], maCongViec, value[0], ]);

//             connection.query(
//               queryThemCV_TaiLieuCV, [valuesCV_TL], (err, result) => {
//                 if (err) {
//                   console.error("Lỗi khi thêm tài liệu cho công việc:", err);
//                   return res
//                     .status(500)
//                     .json({ error: "Lỗi khi thêm tài liệu cho công việc." });
//                 }
//                 return res
//                   .status(201)
//                   .json({
//                     success: "Tài liệu cho công việc đã được tạo thành công.",
//                   });
//               }
//             );
//           }
//         );
//       }
//     );
//   }
// );


 route(app);


// Khởi động server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


