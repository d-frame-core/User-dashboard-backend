import { createConnection } from "mysql2";

//Making Connection with Aurora DB(Public) on AWS using mySQL2 library
const connection = createConnection({
    host: "<Cluster EndPoint>",
    user: "Cluster Username",
    password: "<Cluster Password>",
    port: 3306, //<Port of cluster(3306)>
    database: "<Database name given while creating DB on AWS>",
  });

connection.connect(function (err) {
  if (err) throw err;
  console.log("Connected to AWS Aurora DB");
});

const sql =
  "CREATE TABLE users (publicAddress VARCHAR(70), initVector VARCHAR(70), securityKey VARCHAR(70))";
connection.query(sql, function (err, result) {
  if (err) throw err;
  console.log("Table Created");
});

connection.end();
