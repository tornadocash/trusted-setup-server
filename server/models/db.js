const mysql = require('mysql2/promise')

// const [rows,] = connection.query('select max(id) as max from contributions')
// console.log('rows', rows)
//   let [rows,] = await connection.query('show tables like \'contributions\'')
//   if (rows.length === 0) {
//     console.log('Database appears to be empty, creating tables')
//     const sqlFile = await fs.readFile('seed.sql')
//     for (let s of sqlFile.toString().split(';')) {
//       if (s.trim().length > 0) {
//         await connection.query(s)
//       }
//     }
//   }
//   [rows,] = await connection.query('select max(id) as max from contributions')
//   currentContributionIndex = (rows[0].max || 0) + 1
//   console.log('Current contribution index:', currentContributionIndex)


module.exports = async function() {
  this.sql = await mysql.createPool({
    host: process.env.MYSQL_HOST || 'localhost',
    port: process.env.MYSQL_PORT || '3306',
    user: process.env.MYSQL_USER || 'root',
    database: process.env.MYSQL_DATABASE || 'phase2',
    password: process.env.MYSQL_PASSWORD,
    connectionLimit: 100
  })

  return this
}