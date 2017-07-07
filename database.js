Const pg = require(‘pg-promise)()
Const db = pg(`postgres://${process.env.user}@localhost:5432/todo`)

Const inseertTask = db.oneOrNOne(‘INSERT INTO tasks(name) VALUES($1)’)

const TASKS = {
Insert: name => db.one(insertTask, [name]),

}

module.exports = {tasks}i
