const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./db')

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS cjs_user (username TEXT, password TEXT)")
    db.run("CREATE TABLE IF NOT EXISTS cjs_product (name TEXT, price INTEGER, description TEXT)")
    db.run("CREATE TABLE IF NOT EXISTS cjs_session (token TEXT, user_id INTEGER)")
    db.run("CREATE TABLE IF NOT EXISTS cjs_cart_item (product_id, quantity, user_id)")
    db.get('SELECT COUNT(*) AS count FROM cjs_user', [], (err, row) => {
        let count = row.count
        if (count == 0) {
            let stmt = db.prepare("INSERT INTO cjs_user (username, password) VALUES (?, ?)")
            users.forEach(v => {
                stmt.run(v.username, v.password)
            })
        }
    })
    db.get('SELECT COUNT(*) AS count FROM cjs_product', [], (err, row) => {
        let count = row.count
        if (count == 0) {
            let stmt = db.prepare("INSERT INTO cjs_product (name, price, description) VALUES (?, ?, ?)")
            products.forEach(v => {
                stmt.run(v.name, v.price, v.description)
            })
        }
    })
})

let products = [
    {
        id: 1,
        name: 'Americano',
        price: 100,
        description: 'Espresso, diluted with hot water for a lighter experience',
    },
    {
        id: 2,
        name: 'Cappuccino',
        price: 110,
        description: 'Espresso with steamed milk',
    },
    {
        id: 3,
        name: 'Espresso',
        price: 90,
        description: 'A strong shot of coffee',
    },
    {
        id: 4,
        name: 'Macchiato',
        price: 120,
        description: 'Espresso with a small amount of milk',
    },
]

let users = [
    {
        id: 1,
        username: 'zagreus',
        password: 'cerberus',
    },
    {
        id: 2,
        username: 'melinoe',
        password: 'b4d3ec1',
    }
]

let sessions = {}

function getProductById(id) {
    return new Promise((resolve, reject) => {
        let query = 'SELECT rowid, * FROM cjs_product WHERE rowid = ?'
        db.get(query, [id], (err, row) => {
            resolve({
                id: row.rowid,
                name: row.name,
                price: row.price,
                description: row.description,
            })
        })
    })
}

function getProducts() {
    return new Promise((resolve, reject) => {
        db.all('SELECT rowid, * FROM cjs_product', (err, rows) => {
            let result = rows.map(x => {
                return {id: x.rowid, name: x.name, price: x.price, description: x.description}
            })
            console.log(result)
            resolve(result)
        })
    })
}

function getUsers() {
    return new Promise((resolve, reject) => {
        let query = 'SELECT rowid, * FROM cjs_user'
        db.all(query, [], (err, rows) => {
            let results = []
            rows.forEach(row => {
                results.push({
                    id: row.rowid,
                    username: row.username,
                    password: row.password,
                })
            })
            resolve(results)
        })
    })
}

function getUserById(id) {
    return new Promise((resolve, reject) => {
        let query = 'SELECT * FROM cjs_user WHERE rowid = ?'
        db.get(query, [id], (err, row) => {
            resolve({
                id: id,
                username: row.username,
                password: row.password,
            })
        })
    })
}

function getUserByUsername(username) {
    return new Promise((resolve, reject) => {
        let query = 'SELECT rowid, * FROM cjs_user WHERE username = ?'
        db.get(query, [username], (err, row) => {
            resolve({
                id: row.rowid,
                username: row.username,
                password: row.password,
            })
        })
    })
}

function getSessions() {
    return new Promise((resolve, reject) => {
        let query = 'SELECT rowid, * FROM cjs_session'
        db.all(query, (err, rows) => {
            let results = {}
            rows.forEach(row => {
                results[row.token] = row.user_id
            })
            resolve(results)
        })
    })
}

function getUserBySessionToken(sessionToken) {
    return new Promise((resolve, reject) => {
        let query = 'SELECT * FROM cjs_session WHERE token = ?'
        db.get(query, [sessionToken], (err, row) => {
            if (row) {
                let userId = row.user_id
                resolve(getUserById(userId))
            } else {
                resolve('')
            }
        })
    })
}

function setSession(sessionToken, userId) {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            let stmt = db.prepare('INSERT INTO cjs_session (token, user_id) VALUES (?, ?)')
            stmt.run(sessionToken, userId)
            resolve(true)
        })
    })
}

function createCartItem(productId, quantity, userId) {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            let stmt = db.prepare('INSERT INTO cjs_cart_item (product_id, quantity, user_id) VALUES (?, ?, ?)')
            stmt.run(productId, quantity, userId)
            resolve(true)
        })
    })
}

module.exports = {
    getProducts,
    getProductById,
    getUsers,
    getUserById,
    getUserByUsername,
    getSessions,
    getUserBySessionToken,
    setSession,
    createCartItem,
}
