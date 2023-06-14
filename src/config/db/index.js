const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'qlcv'
});

async function connectToDatabase() {
  connection.connect((err) => {
    if (err) {
      console.error("Lỗi kết nối MySQL: " + err.stack);
      return;
    }
    console.log("Kết nối thành công MySQL với ID: " + connection.threadId);
  });
}
module.exports= {connectToDatabase};