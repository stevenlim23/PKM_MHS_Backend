// // Hosting Server
// module.exports = {
//   HOST: "localhost",
//   USER: "tugaskul_root",
//   PASSWORD: "myp455w0rdUIB",
//   DB: "tugaskul_PKMUibMhs",
//   dialect: "mysql",
//   pool: {
//     //pool configuration
//     max: 5, //maximum number of connection in pool
//     min: 0, //minimum number of connection in pool
//     acquire: 30000, //maximum time in ms that pool will try to get connection before throwing error
//     idle: 10000, //maximum time in ms, that a connection can be idle before being released
//   },
// };

// Local Server
module.exports = {
  HOST: "localhost",
  USER: "root",
  PASSWORD: "",
  DB: "db_pkmuib",
  dialect: "mysql",
  pool: {
    //pool configuration
    max: 5, //maximum number of connection in pool
    min: 0, //minimum number of connection in pool
    acquire: 30000, //maximum time in ms that pool will try to get connection before throwing error
    idle: 10000, //maximum time in ms, that a connection can be idle before being released
  },
};
