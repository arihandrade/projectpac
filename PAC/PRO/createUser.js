const mysql = require('mysql');
const bcrypt = require('bcrypt');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sistema_login'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Conectado ao banco de dados MySQL');
});

const username = 'teste';
const password = '12';

bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
        throw err;
    }
    const sql = 'INSERT INTO usuarios (username, password) VALUES (?, ?)';
    db.query(sql, [username, hash], (err, result) => {
        if (err) {
            throw err;
        }
        console.log('Usuário criado com sucesso!');
        db.end();
    });
});
