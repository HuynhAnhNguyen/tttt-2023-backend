1. Danh sách công việc
Truy vấn: GET http://localhost:8000/api/congViec/danhSachCongViec
Ví dụ: GET http://localhost:8000/api/congViec/danhSachCongViec


1.1 Danh sách công việc sắp xếp
Truy vấn: GET http://localhost:8000/api/congViec/danhSachCongViec?sort&column=???&type=???
- Trong đó: 
+ column: là tên cột cần sắp xếp. Ví dụ: TenCongViec, MoTaCongViec, NgayBatDau, NgayKetThuc,  TrangThai, UuTien
+ type: là kiểu sắp xếp. Ví dụ: DESC (Sắp xếp giảm dần), ASC (Sắp xếp tăng dần).
Ví dụ: GET http://localhost:8000/api/congViec/danhSachCongViec?sort&column=TenCongViec&type=DESC

1.2 Danh sách công việc có phân trang
Truy vấn: GET http://localhost:8000/api/congViec/danhSachCongViec?page=???&limit=???
- Trong đó: 
+ page: là số trang. Ví dụ: page=3
+ limit: là số lượng kết quả cần hiển thị. Ví dụ: limit=5.
Ví dụ: GET http://localhost:8000/api/congViec/danhSachCongViec?page=3&limit=5



2. Công việc theo ID
Truy vấn: GET http://localhost:8000/api/congViec/:id
- Trong đó: 
+ :id: là mã công việc. Ví dụ: 040620232012201112321
Ví dụ: http://localhost:8000/api/congViec/040620232012201112321





<!-- 3. Tìm kiếm công việc theo tên
Truy vấn: GET http://localhost:8000/api/congViec/timCongViec?search=xxxx
- Trong đó: 
+ xxxx: là tên công việc. Ví dụ: HHHFH
Ví dụ: http://localhost:8000/api/congViec/timCongViec?search=HHHFH -->




4. Thêm công việc (bổ sung cho table congviec_duan)
-> Khi thêm công việc chọn những dự án có thể có công việc này
Truy vấn: POST http://localhost:8000/api/congViec/themCongViec
Data: 
{
    "TenCongViec": "Viết front-end", 
    "MoTaCongViec": "Viết front-end cho dự án thực tập thực tế học kì hè năm 2022-2023", 
    "NgayBatDau": "2023-05-15", 
    "NgayKetThuc": "2023-07-15", 
    "TrangThai": 0, 
    "UuTien": 1,
    "MaDuAn": ["130620232010211019583", "130620232010211061114", "130620232010211074825"]
}



5. Sửa công việc
Truy vấn: PUT http://localhost:8000/api/congViec/suaCongViec/:id
- Trong đó: 
+ :id: là mã công việc. Ví dụ: 040620232012201112321
Ví dụ: http://localhost:8000/api/congViec/suaCongViec/040620232012201112321
Data: 
{
        "TenCongViec": "Viết front-end edited",
        "MoTaCongViec": "Viết front-end cho dự án thực tập thực tế học kì hè năm 2022-2023",
        "NgayBatDau": "2023-05-15",
        "NgayKetThuc": "2023-07-15",
        "TrangThai": -1,
        "UuTien": 2
}



6. Xóa công việc tạm thời
Truy vấn: PATCH http://localhost:8000/api/congViec/xoaCongViec/:id
- Trong đó: 
+ :id: là mã công việc. Ví dụ: 040620232012201112321
Ví dụ: http://localhost:8000/api/congViec/xoaCongViec/040620232012201112321




7. Xóa vĩnh viễn công việc
Truy vấn: DELETE http://localhost:8000/api/congViec/xoaCongViecVinhVien/:id
- Trong đó: 
+ :id: là mã công việc. Ví dụ: 040620232012201112321
Ví dụ: http://localhost:8000/api/congViec/xoaCongViecVinhVien/040620232012201112321


8. Phân công công việc (bổ sung cho table nguoidung_congviec) 
-> Khi phân công công việc chọn người dùng làm công việc này
Truy vấn: POST http://localhost:8000/api/congViec/phanCongCongViec/:id
- Trong đó: 
+ :id: là mã công việc. Ví dụ: 040620232012201112321
Ví dụ: http://localhost:8000/api/congViec/phanCongCongViec/040620232012201112321