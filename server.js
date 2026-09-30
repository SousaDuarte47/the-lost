const express = require('express');
const path = require('path');
const Datastore = require('nedb-promises');
const nodemailer = require('nodemailer');
const app = express();
const PORT = 3010;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const db = {};
db.users = Datastore.create(path.join(__dirname, 'users.db'));
db.posts = Datastore.create(path.join(__dirname, 'posts.db'));
db.codes = Datastore.create(path.join(__dirname, 'codes.db'));

console.log('Banco de dados NeDB inicializado com sucesso.');

app.post('/api/register', async (req, res) => {
    try {
        const { name, username, email, password } = req.body;
        const userByUsername = await db.users.findOne({ username: username });
        const userByEmail = await db.users.findOne({ email: email });
        if (userByUsername || userByEmail) {
            return res.status(400).json({ success: false, message: 'Usuario ou E-mail ja cadastrados!' });
        }
        const newUser = await db.users.insert({ name, username, email, password });
        res.json({ success: true, userId: newUser._id });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await db.users.findOne({ email: email, password: password });
        if (!user) return res.status(400).json({ success: false, message: 'E-mail ou senha incorretos!' });
        res.json({ success: true, user: { id: user._id, name: user.name, username: user.username, email: user.email } });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.post('/api/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await db.users.findOne({ email: email });
        if (!user) return res.status(400).json({ success: false, message: 'E-mail nao encontrado!' });

        const code = Math.floor(100000 + Math.random() * 900000).toString();
        await db.codes.remove({ email: email }, { multi: true });
        await db.codes.insert({ email: email, code: code, created_at: new Date() });

        console.log(`\n📧 [EMAIL ENVIADO PARA: ${email}]`);
        console.log(`🔑 Seu codigo de recuperacao do The Lost e: ${code}\n`);

        res.json({ success: true, message: 'Codigo gerado!' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.post('/api/reset-password', async (req, res) => {
    try {
        const { email, code, newPassword } = req.body;
        const validCode = await db.codes.findOne({ email: email, code: code });
        if (!validCode) {
            return res.status(400).json({ success: false, message: 'Codigo incorreto!' });
        }

        const user = await db.users.findOne({ email: email });
        if (user) {
            user.password = newPassword;
            await db.users.update({ _id: user._id }, user);
        }
        await db.codes.remove({ _id: validCode._id });
        res.json({ success: true, message: 'Senha atualizada!' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.post('/api/posts', async (req, res) => {
    try {
        const { user_id, text } = req.body;
        const user = await db.users.findOne({ _id: user_id });
        const name = user ? user.name : 'Usuario Anonimo';
        const username = user ? user.username : 'anonimo';
        const newPost = await db.posts.insert({ user_id, name, username, text, created_at: new Date() });
        res.json({ success: true, postId: newPost._id });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.get('/api/posts', async (req, res) => {
    try {
        const posts = await db.posts.find({}).sort({ created_at: -1 });
        res.json({ success: true, posts });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`The Lost rodando em http://localhost:${PORT}`);
});
