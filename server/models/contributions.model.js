const crypto = require('crypto')
const db = require('./db.js')

let sql
const Contributions = {}

Contributions.currentContributionIndex = async function() {
  const [rows] = await sql.query('select max(id) as max from contributions')
  return (rows[0].max || 0) + 1
}

Contributions.insertContributionInfo = async function(name, company) {
  const token = crypto.randomBytes(32).toString('hex')
  await sql.execute('insert into contributions(token, name, company) values(?, ?, ?)', [
    token,
    name,
    company
  ])
}

Contributions.updateContributionInfo = async function(token, name, company) {
  await sql.execute('insert into contributions(token, name, company) values(?, ?, ?)', [
    token,
    name,
    company
  ])
}

Contributions.getContributions = async function() {
  const [rows] = await db.execute('select id, name, company from contributions')
  return rows
}

async function main() {
  ;({ sql } = await db())
  const contribitionIndex = await Contributions.currentContributionIndex()
  console.log('Next contribution index is', contribitionIndex)
}
main()

module.exports = Contributions
