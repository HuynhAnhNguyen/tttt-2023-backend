const express = require('express');
const router = express.Router();

const congViecController = require('../app/controllers/CongViecController');

router.get('/danhSachCongViec', congViecController.danhSachCongViec);
router.get('/:id', congViecController.chiTietCongViec);
router.get('/timCongViec', congViecController.timCongViec);
router.get('/themCongViec', congViecController.themCongViec);
router.get('/suaCongViec/:id', congViecController.suaCongViec);
router.get('/xoaCongViec/:id', congViecController.xoaCongViecTamThoi);
router.get('/xoaCongViecVinhVien/:id', congViecController.xoaCongViecVinhVien);

module.exports = router;