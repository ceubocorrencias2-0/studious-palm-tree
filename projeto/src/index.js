const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');

const app = express();
const PORT = 3000;

app.use(express.static('src'));

// Middleware para analisar corpos de solicitação JSON
app.use(bodyParser.json());

// Configuração da conexão com o SQL Server
const config = {
    user: 'isabelle',
    password: 'isabelle',
    server: 'ISABELLE/SQLEXPRESS',
    database: 'OCODB',
    options: {
        encrypt: false, // Use true se estiver usando conexão segura
        enableArithAbort: true // Evita problemas de desconexão no SQL Server
    }
};

// Endpoint para lidar com o login
app.post('/login', (req, res) => {
    const { ra, senha } = req.body;

    sql.connect(config, (err) => {
        if (err) {
            console.error('Erro ao conectar ao banco de dados:', err);
            res.status(500).json({ message: 'Erro ao conectar ao banco de dados' });
            return;
        }

        const request = new sql.Request();
        request.query(`SELECT * FROM usuarios WHERE ra = '${ra}' AND senha = '${senha}'`, (err, result) => {
            if (err) {
                console.error('Erro ao executar a consulta:', err);
                res.status(500).json({ message: 'Erro ao consultar o banco de dados' });
                return;
            }

            if (result.recordset.length > 0) {
                res.status(200).json({ message: 'Login bem-sucedido' });
            } else {
                res.status(401).json({ message: 'RA ou senha inválidos' });
            }
        });
    });
});

// Rota para servir a página ocorrencias.html na raiz '/'
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${3000}`);
});
