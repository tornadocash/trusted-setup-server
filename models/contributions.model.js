const db = require('./db.js')
const crypto = require('crypto')

let sql
const Contributions = { }

Contributions.currentContributionIndex = async function() {
  const [rows,] = await sql.query('select max(id) as max from contributions')
  return (rows[0].max || 0) + 1
}

Contributions.insertContributionInfo = async function(name, company) {
  const token = crypto.randomBytes(32).toString('hex')
  await sql.execute(
    'insert into contributions(token, name, company) values(?, ?, ?)',
    [token, name, company]
  )
}
  
// async function insertContributionInfoByToken(token, name, company) {
//   const [rows, _] = await db.execute(
//     'update contributions set name = ?, company = ? where token = ? limit 1',
//     [name, company, token]
//   )
// }

async function main () {
  ({ sql } = await db())
  const contribitionIndex = await Contributions.currentContributionIndex()
  console.log('Next contribution index is', contribitionIndex)
}
main()

module.exports = Contributions