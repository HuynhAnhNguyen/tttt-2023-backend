const connection = require("../models/Connection");
const moment = require("moment");

class CongViecController{

    danhSachCongViec(req, res, next){
        const column = req.query.column;
        const type = req.query.type;
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const offset = (page - 1) * limit;

        if (req.query.hasOwnProperty("sort")) {
            const query =
            "SELECT * FROM congviec WHERE trangthai != -3 ORDER BY " +
            column +
            " " +
            type;
            connection.query(query, (err, results) => {
            if (err) {
                console.error("Lỗi truy vấn MySQL: " + err.stack);
                return res.status(500).json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
            }
            // Trả về kết quả dưới dạng JSON
            // res.json(results);
            if (results.length == 0) {
                return res.status(404).json({ error: "Không có công việc" });
            } else {
                res.json(results);
            }
            });
            } else if (
                req.query.hasOwnProperty("page") &&
                req.query.hasOwnProperty("limit")
            ) {
                const query = `SELECT * FROM congviec WHERE trangthai != -3 LIMIT ${limit} OFFSET ${offset}`;

                connection.query(query, (err, results) => {
                if (err) {
                    console.error("Lỗi truy vấn MySQL: " + err.stack);
                    return res.status(500).json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
                }

                if (results.length === 0) {
                    return res.status(404).json({ error: "Không có công việc" });
                } else {
                    res.json(results);
                }
                });
        } else {
            // Thực hiện truy vấn
            const query = "SELECT * FROM congviec WHERE trangthai != -3";
            connection.query(query, (err, results) => {
            if (err) {
                console.error("Lỗi truy vấn MySQL: " + err.stack);
                return res.status(500).json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
            }
            // Trả về kết quả dưới dạng JSON
            // res.json(results);
            if (results.length == 0) {
                return res.status(404).json({ error: "Không có công việc" });
            } else {
                res.json(results);
            }
            });
        }
    };


    chiTietCongViec(req, res, next) {
        const maCongViec = req.params.id;
        const query = "SELECT * FROM congviec WHERE macongviec = ? AND trangthai != -3";
        // Thực hiện truy vấn
        connection.query( query, [maCongViec], (err, results) => {
            if (err) {
            console.error("Lỗi truy vấn MySQL: " + err.stack);
            return res.status(500).json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
            }
            // Trả về kết quả dưới dạng JSON
            if (results.length == 0) {
            return res.status(404).json({ error: "Không có công việc" });
            } else {
            res.json(results);
            }
        }
        );
    };

    timCongViec(req, res, next){
        const searchTerm = req.query.search;
        // Kiểm tra nếu không có giá trị tìm kiếm được cung cấp
        if (!searchTerm) {
            return res.status(400).json({ error: "Thiếu thông tin tìm kiếm" });
        }
        // Thực hiện truy vấn với điều kiện tìm kiếm tên công việc
        const query =
            "SELECT * FROM congviec WHERE trangthai != -3 AND tencongviec LIKE '%" +
            searchTerm +
            "%'";
        connection.query(query, (err, results) => {
            if (err) {
            console.error("Lỗi truy vấn MySQL: " + err.stack);
            return res.status(500).json({ error: "Lỗi truy vấn cơ sở dữ liệu" });
            }
            // Trả về kết quả dưới dạng JSON
            if (results.length == 0) {
            return res.status(404).json({ error: "Không tìm thấy công việc" });
            } else {
            res.json(results);
            }
        });
    };

    themCongViec(req, res, next){
        const {
            TenCongViec,
            MoTaCongViec,
            NgayBatDau,
            NgayKetThuc,
            TrangThai,
            UuTien,
            MaDuAn,
          } = req.body;
        
          // Thêm công việc vào cơ sở dữ liệu
        const query = "INSERT INTO congviec SET ?";
        const maCongViec = moment().format("DDMMYYYYHHmmss") +"" + Math.floor(Math.random() * 10000000);
        const project = {
            maCongViec,
            TenCongViec,
            MoTaCongViec,
            NgayBatDau,
            NgayKetThuc,
            TrangThai,
            UuTien,
        };
        
        connection.query(query, project, (err, result) => {
            if (err) {
              console.error("Lỗi khi thêm công việc:", err);
              return res.status(500).json({ error: "Lỗi khi thêm công việc." });
            }
            // Thêm dữ liệu vào bảng congviec_duan
            const queryString = "INSERT INTO congviec_duan (MaCV_DA, MaCongViec, MaDuAn, TrangThai) VALUES ?";
            const values = MaDuAn.map((maDuAn) => [moment().format("DDMMYYYYHHmmss") +"" +Math.floor(Math.random() * 10000000), maCongViec, maDuAn, 1, ]);
            console.log(values);
            connection.query(queryString, [values], (error, results) => {
              if (error) {
                console.error("Lỗi khi thêm dữ liệu vào bảng congviec_duan:", error);
                return res
                  .status(500)
                  .json({ error: "Lỗi khi thêm dữ liệu vào bảng congviec_duan." });
              }
        
              return res
                .status(201)
                .json({ success: "Công việc mới đã được tạo thành công." });
            });
        });
    };

    suaCongViec(req, res, next){
        const maCongViec = req.params.id;
        const {
            TenCongViec,
            MoTaCongViec,
            NgayBatDau,
            NgayKetThuc,
            TrangThai,
            UuTien,
        } = req.body;
        const query ="UPDATE congviec SET TenCongViec = ?, MoTaCongViec = ?, NgayBatDau = ?, NgayKetThuc = ?, TrangThai = ?, UuTien = ? WHERE MaCongViec = ?;";
        connection.query(query,
            [
                TenCongViec,
                MoTaCongViec,
                NgayBatDau,
                NgayKetThuc,
                TrangThai,
                UuTien,
                maCongViec,
            ],
            (error, results) => {
                if (error) {
                console.error("Error updating job:", error);
                return res
                    .status(500)
                    .json({ error: "Đã xảy ra lỗi trong quá trình cập nhật công việc." });
                }
                if (results.affectedRows === 0) {
                return res.status(404).json({ error: "Công việc không tồn tại." });
                }
                return res.json({ message: "Cập nhật công việc thành công." });
            }
        );
    };

    xoaCongViecTamThoi(req, res, next) {
        const maCongViec = req.params.id;
        const TrangThai = -3;
        const query = "UPDATE congviec SET TrangThai = ? WHERE MaCongViec = ?;";
        connection.query(query, [TrangThai, maCongViec], (error, results) => {
        if (error) {
            console.error("Error updating project:", error);
            return res
            .status(500)
            .json({ error: "Đã xảy ra lỗi trong quá trình xóa công việc." });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "Công việc không tồn tại." });
        }
        return res.json({ message: "Xóa công việc thành công." });
        });
    };

    xoaCongViecVinhVien(req, res, next) {
        const maCongViec = req.params.id;
        const query = "SELECT * FROM nguoidung_congviec WHERE macongviec = ?";
        connection.query(query, [maCongViec], (error, results) => {
        if (error) {
            console.error("Error querying documents:", error);
            return res
            .status(500)
            .json({ error: "Đã xảy ra lỗi trong quá trình truy vấn công việc." });
        }
    
        // Gán giá trị NULL cho khóa ngoại mã công việc
        const updateQuery =
            "UPDATE nguoidung_congviec SET macongviec = NULL WHERE macongviec = ?";
        connection.query(
            updateQuery,
            [maCongViec],
            (updateError, updateResults) => {
            if (updateError) {
                console.error("Error updating documents:", updateError);
                return res.status(500).json({
                error: "Đã xảy ra lỗi trong quá trình cập nhật công việc.",
                });
            }
    
            // Tiếp tục xóa công việc sau khi đã gán giá trị NULL cho khóa ngoại
            const deleteQuery = "DELETE FROM congviec WHERE macongviec = ?";
            connection.query(
                deleteQuery,
                [maCongViec],
                (deleteError, deleteResults) => {
                if (deleteError) {
                    console.error("Error deleting project:", deleteError);
                    return res.status(500).json({
                    error: "Đã xảy ra lỗi trong quá trình xóa công việc.",
                    });
                }
                if (deleteResults.affectedRows === 0) {
                    return res
                    .status(404)
                    .json({ error: "Công việc không tồn tại." });
                }
    
                return res.json({ message: "Xóa công việc vĩnh viễn thành công." });
                }
            );
            }
        );
        });
    };




};


module.exports = new CongViecController();