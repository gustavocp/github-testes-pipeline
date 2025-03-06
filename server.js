const express = require("express");
const bodyParser = require("body-parser");
const os = require("os");
const requestIp = require("request-ip");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Simulação de um banco de dados (em memória)
let users = [];

// Endpoint de saúde
app.get("/ping", (req, res) => {
    const hostname = os.hostname(); // Nome do servidor
    const serverIp = getServerIp(); // Pega o IPv4 correto
    const containerId = process.env.HOSTNAME || "Unknown"; // ID do Container Docker
    const nodeVersion = process.version; // Versão do Node.js
    const uptime = process.uptime(); // Tempo de execução em segundos
    const memoryUsage = process.memoryUsage().rss / 1024 / 1024; // Memória em MB

    res.json({
        message: "pong",
        hostname,
        serverIp,
        containerId,
        nodeVersion,
        uptime: `${uptime.toFixed(2)}s`,
        memoryUsage: `${memoryUsage.toFixed(2)} MB`
    });
});


// CRUD de Usuários
app.get("/users", (req, res) => {
    res.json(users);
});

app.post("/users", (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).json({ error: "Nome e email são obrigatórios." });
    }
    const newUser = { id: users.length + 1, name, email };
    users.push(newUser);
    res.status(201).json(newUser);
});

app.put("/users/:id", (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    const userIndex = users.findIndex((user) => user.id == id);

    if (userIndex === -1) {
        return res.status(404).json({ error: "Usuário não encontrado." });
    }

    users[userIndex] = { ...users[userIndex], name, email };
    res.json(users[userIndex]);
});

app.delete("/users/:id", (req, res) => {
    const { id } = req.params;
    users = users.filter((user) => user.id != id);
    res.status(204).send();
});

// Iniciar o servidor
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
}

module.exports = app; // Exportar para os testes
