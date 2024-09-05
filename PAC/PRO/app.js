const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const session = require('express-session');
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

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

app.get('/', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username && password) {
        db.query('SELECT * FROM usuarios WHERE username = ?', [username], async (error, results) => {
            if (results.length == 0 || !(await bcrypt.compare(password, results[0].password))) {
                res.send('Usuário ou senha incorretos!');
            } else {
                req.session.loggedin = true;
                req.session.username = username;
                res.redirect('/menu');
            }
            res.end();
        });
    } else {
        res.send('Por favor, insira usuário e senha!');
        res.end();
    }
});

app.get('/menu', (req, res) => {
    if (req.session.loggedin) {
        res.render('menu');
    } else {
        res.send('Faça login primeiro!');
    }
    res.end();
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

app.listen(3000, () => {
    console.log('Servidor iniciado na porta 3000');
});

// Rota para exibir o formulário de alteração de senha
app.get('/alterar-senha', (req, res) => {
    if (req.session.loggedin) {
        res.render('alterar-senha');
    } else {
        res.send('Faça login primeiro!');
    }
    res.end();
});

// Rota para processar a alteração de senha
app.post('/alterar-senha', (req, res) => {
    if (req.session.loggedin) {
        const { oldPassword, newPassword } = req.body;
        const username = req.session.username;

        db.query('SELECT * FROM usuarios WHERE username = ?', [username], async (error, results) => {
            if (results.length == 0 || !(await bcrypt.compare(oldPassword, results[0].password))) {
                res.send('Senha antiga incorreta!');
            } else {
                const hashedPassword = await bcrypt.hash(newPassword, 10);
                db.query('UPDATE usuarios SET password = ? WHERE username = ?', [hashedPassword, username], (err, result) => {
                    if (err) {
                        throw err;
                    }
                    res.send('Senha alterada com sucesso!');
                });
            }
            res.end();
        });
    } else {
        res.send('Faça login primeiro!');
        res.end();
    }
});

// Rota para exibir o formulário de cadastro de material
app.get('/cadastrar-material', (req, res) => {
    if (req.session.loggedin) {
        res.render('cadastrar-material');
    } else {
        res.send('Faça login primeiro!');
    }
    res.end();
});

// Rota para processar o cadastro de material
app.post('/cadastrar-material', (req, res) => {
    if (req.session.loggedin) {
        const { material, fabricante, referencia, quantidade, unidade, estoque } = req.body;
        let tabela;

        if (estoque === 'normal') {
            tabela = 'estoque_normal';
        } else if (estoque === 'doacao') {
            tabela = 'estoque_doacao';
        }

        const sqlSelect = `SELECT * FROM ${tabela} WHERE material = ? AND fabricante = ? AND referencia = ?`;
        db.query(sqlSelect, [material, fabricante, referencia], (err, results) => {
            if (err) {
                throw err;
            }

            if (results.length > 0) {
                // Material já existe, atualizar a quantidade
                const novoEstoque = results[0].quantidade + parseInt(quantidade);
                const sqlUpdate = `UPDATE ${tabela} SET quantidade = ? WHERE id = ?`;
                db.query(sqlUpdate, [novoEstoque, results[0].id], (err, result) => {
                    if (err) {
                        throw err;
                    }
                    res.render('cadastro-sucesso');
                });
            } else {
                // Material não existe, inserir novo registro
                const sqlInsert = `INSERT INTO ${tabela} (material, fabricante, referencia, quantidade, unidade) VALUES (?, ?, ?, ?, ?)`;
                db.query(sqlInsert, [material, fabricante, referencia, quantidade, unidade], (err, result) => {
                    if (err) {
                        throw err;
                    }
                    res.render('cadastro-sucesso');
                });
            }
        });
    } else {
        res.send('Faça login primeiro!');
        res.end();
    }
});


app.get('/exibir-estoque', (req, res) => {
    if (req.session.loggedin) {
        const sql = 'SELECT id, material, fabricante, referencia, quantidade, DATE_FORMAT(data, "%d/%m/%Y") as data FROM estoque_normal';
        db.query(sql, (err, results) => {
            if (err) {
                throw err;
            }
            res.render('exibir-estoque', { estoque: results });
        });
    } else {
        res.send('Faça login primeiro!');
    }
});


// Rota para exibir o estoque de doação
app.get('/exibir-doacao', (req, res) => {
    if (req.session.loggedin) {
        const sql = 'SELECT id, material, fabricante, referencia, quantidade, DATE_FORMAT(data, "%d/%m/%Y") as data FROM estoque_doacao';
        db.query(sql, (err, results) => {
            if (err) {
                throw err;
            }
            res.render('exibir-doacao', { estoque: results });
        });
    } else {
        res.send('Faça login primeiro!');
    }
});

// Rota para exibir o formulário de saída de material
app.get('/saida-material', (req, res) => {
    if (req.session.loggedin) {
        res.render('saida-material');
    } else {
        res.send('Faça login primeiro!');
    }
});

// Rota para processar a saída de material
app.post('/saida-material', (req, res) => {
    if (req.session.loggedin) {
        const { codigo, quantidade, estoque } = req.body;
        let tabela;

        if (estoque === 'normal') {
            tabela = 'estoque_normal';
        } else if (estoque === 'doacao') {
            tabela = 'estoque_doacao';
        }

        const sqlSelect = `SELECT * FROM ${tabela} WHERE id = ?`;
        db.query(sqlSelect, [codigo], (err, results) => {
            if (err) {
                throw err;
            }

            if (results.length > 0) {
                const novoEstoque = results[0].quantidade - parseInt(quantidade);
                if (novoEstoque < 0) {
                    res.render('saida-material-erro', { mensagem: 'Quantidade insuficiente no estoque.' });
                } else if (novoEstoque === 0) {
                    const sqlDelete = `DELETE FROM ${tabela} WHERE id = ?`;
                    db.query(sqlDelete, [codigo], (err, result) => {
                        if (err) {
                            throw err;
                        }
                        res.render('saida-material-sucesso', { mensagem: 'Saída de material registrada com sucesso. O material foi removido do estoque porque a quantidade ficou zerada.' });
                    });
                } else {
                    const sqlUpdate = `UPDATE ${tabela} SET quantidade = ? WHERE id = ?`;
                    db.query(sqlUpdate, [novoEstoque, codigo], (err, result) => {
                        if (err) {
                            throw err;
                        }
                        res.render('saida-material-sucesso', { mensagem: 'Saída de material registrada com sucesso.' });
                    });
                }
            } else {
                res.render('saida-material-erro', { mensagem: 'Material não encontrado.' });
            }
        });
    } else {
        res.send('Faça login primeiro!');
    }
});

// Rota para exibir a página de relatório
app.get('/relatorio', (req, res) => {
    if (req.session.loggedin) {
        res.render('relatorio');
    } else {
        res.send('Faça login primeiro!');
    }
});

// Rota para exibir o relatório de todas as entradas
app.get('/relatorio-entrada', (req, res) => {
    if (req.session.loggedin) {
        const sqlNormal = 'SELECT * FROM estoque_normal';
        const sqlDoacao = 'SELECT * FROM estoque_doacao';

        db.query(sqlNormal, (err, resultsNormal) => {
            if (err) {
                throw err;
            }
            db.query(sqlDoacao, (err, resultsDoacao) => {
                if (err) {
                    throw err;
                }
                res.render('relatorio-entrada', { estoqueNormal: resultsNormal, estoqueDoacao: resultsDoacao });
            });
        });
    } else {
        res.send('Faça login primeiro!');
    }
});

app.post('/saida-material', (req, res) => {
    const { material, codigo, quantidade, tipoEstoque } = req.body;
    const data = new Date().toISOString().slice(0, 19).replace('T', ' ');

    let tabelaEstoque = tipoEstoque === 'normal' ? 'estoque_normal' : 'estoque_doacao';

    // Retirar do estoque e adicionar na tabela de saídas
    const sqlRetirar = `UPDATE ${tabelaEstoque} SET quantidade = quantidade - ? WHERE id = ?`;
    const sqlInserirSaida = `INSERT INTO todas_saidas (data, material, quantidade, referencia, fabricante, tipo_estoque) VALUES (?, ?, ?, ?, ?, ?)`;

    db.query(`SELECT * FROM ${tabelaEstoque} WHERE id = ?`, [codigo], (err, result) => {
        if (err) throw err;

        if (result.length > 0) {
            const item = result[0];
            const novaQuantidade = item.quantidade - quantidade;

            if (novaQuantidade < 0) {
                res.send('Quantidade insuficiente em estoque.');
                return;
            }

            db.query(sqlRetirar, [quantidade, codigo], (err) => {
                if (err) throw err;

                // Se a quantidade for zero, remova o item do estoque
                if (novaQuantidade === 0) {
                    db.query(`DELETE FROM ${tabelaEstoque} WHERE id = ?`, [codigo], (err) => {
                        if (err) throw err;
                    });
                }

                // Inserir registro na tabela todas_saidas
                db.query(sqlInserirSaida, [data, material, quantidade, item.referencia, item.fabricante, tipoEstoque], (err) => {
                    if (err) throw err;
                    res.redirect('/menu');
                });
            });
        } else {
            res.send('Material não encontrado no estoque.');
        }
    });
});

// Rota para exibir o relatório de todas as saídas
app.get('/relatorio-todas-saidas', (req, res) => {
    if (req.session.loggedin) {
        const sqlSaidas = 'SELECT * FROM todas_saidas';

        db.query(sqlSaidas, (err, resultsSaidas) => {
            if (err) {
                throw err;
            }
            res.render('relatorio-todas-saidas', {
                saidas: resultsSaidas
            });
        });
    } else {
        res.send('Faça login primeiro!');
    }
});