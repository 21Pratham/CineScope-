const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "manager",
  database: "cinemascope_db",
});

db.connect((err) => {
  if (err) {
    console.error("Failed to connect to MySQL:", err.message);
    console.error("Error Code:", err.code);
    console.error("Error Number:", err.errno);
    process.exit(1);
  }
  console.log("MySQL Connected...");
});
module.exports = db;
