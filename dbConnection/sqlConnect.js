// const sql = require('mssql');

// // Configuration for Windows Authentication
// var config = {
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     server: process.env.DB_SERVER,
//     pool: {
//       max: 10,
//       min: 0
//     },
//     options: {
//       encrypt: true, // for azure
//       trustServerCertificate: true // change to true for local dev / self-signed certs
//     }
//   }  
// let pool;

// // Connect to the database
// async function connectToDatabase() {
//     try {
//         pool = await sql.connect(config);
//     } catch (err) {
//         console.error('Database connection failed:', err.message);  // Log the error message
//         console.error(err);
//     }
// }

// module.exports = {
//     connectToDatabase,
//     pool
// }


const sql = require('mssql');

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    server: process.env.DB_SERVER,
    pool: {
      max: 10,
      min: 0
    },
    options: {
      encrypt: true, // for azure
      trustServerCertificate: true // change to true for local dev / self-signed certs
    }
  }

// Create and export a pool connection
const poolPromise = sql.connect(config)
    .then(pool => {
        console.log('Connected to SQL Server');
        return pool;
    })
    .catch(err => {
        console.error('Database connection failed:', err.message);
        throw err;
    });

module.exports = {
    sql,
    poolPromise
};
