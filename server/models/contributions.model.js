const crypto = require('crypto')
const fs = require('fs')
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

  const [rows] = await sql.query("show tables like 'contributions'")
  if (rows.length === 0) {
    console.log('Database appears to be empty, creating tables')
    const sqlFile = await fs.readFileSync('seed.sql')
    for (const s of sqlFile.toString().split(';')) {
      if (s.trim().length > 0) {
        await sql.query(s)
      }
    }
  }

  const contribitionIndex = await Contributions.currentContributionIndex()
  console.log('Next contribution index is', contribitionIndex)
}
main()

module.exports = Contributions
