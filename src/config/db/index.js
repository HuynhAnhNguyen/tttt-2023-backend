const mysql = require('mysql');
// const connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'qlcv_dev'
// });

async function connectToDatabase() {
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'qlcv_dev'
  });
  connection.connect((err) => {
    if (err) {
      console.error('Không thể kết nối với MySQL:', err);
      return;
    }
    console.log('Kết nối thành công MySQL!');
  });
}
module.exports= {connectToDatabase};