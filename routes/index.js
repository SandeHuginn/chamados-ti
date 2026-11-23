const express = require('express');
const dashboard = require('../controllers/dashboardController');
const tickets = require('../controllers/ticketController');
const comments = require('../controllers/commentController');
const technicians = require('../controllers/technicianController');
const categories = require('../controllers/categoryController');
const { adminAuth } = require('../config/firebaseAdmin');
const firebaseAuth = require('../middlewares/firebaseAuth');
const adminOnly = require('../middlewares/adminAuth');
const users = require('../controllers/userController');
const router = express.Router();


// Cria uma sessão autenticada pelo Firebase
router.post('/sessionLogin', async (req, res) => {
    const idToken = req.body.idToken;

    if (!idToken) {
        return res.status(400).json({
            erro: 'Token de autenticação não informado.',
        });
    }

    try {
        // Verifica a validade do token
        await adminAuth.verifyIdToken(idToken, true);

        // Define a duração da sessão: 5 dias
        const expiresIn = 5 * 24 * 60 * 60 * 1000;

        // Cria o cookie de sessão
        const sessionCookie = await adminAuth.createSessionCookie(
            idToken,
            { expiresIn }
        );

        res.cookie('session', sessionCookie, {
            maxAge: expiresIn,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
        });

        return res.status(200).json({
            mensagem: 'Sessão criada com sucesso.',
        });

    } catch (erro) {
        console.error('Erro ao criar sessão:', erro);

        return res.status(401).json({
            erro: 'Não foi possível autenticar a sessão.',
        });
    }
});

// Autenticação
router.get('/login', (req, res) => {
    res.render('login', {
        title: 'Entrar',
        currentPath: '/login',
        msg: null,
        erro: null
    });
});

// Dashboard
router.get('/', firebaseAuth, dashboard.index);

// Chamados
router.get('/tickets', firebaseAuth, tickets.index);
router.get('/tickets/new', firebaseAuth, tickets.new);
router.post('/tickets', firebaseAuth, tickets.create);
router.get('/tickets/:id', firebaseAuth, tickets.show);
router.get('/tickets/:id/edit', tickets.edit);
router.put('/tickets/:id', tickets.update);
router.patch('/tickets/:id/quick', tickets.quickUpdate);
router.delete('/tickets/:id', firebaseAuth, adminOnly, tickets.destroy);
router.post('/tickets/:id/comments', comments.create);

// Técnicos - acesso exclusivo para administradores
router.get('/technicians', firebaseAuth, adminOnly, technicians.index);
router.get('/technicians/new', firebaseAuth, adminOnly, technicians.new);
router.post('/technicians', firebaseAuth, adminOnly, technicians.create);
router.get('/technicians/:id/edit', firebaseAuth, adminOnly, technicians.edit);
router.put('/technicians/:id', firebaseAuth, adminOnly, technicians.update);
router.delete('/technicians/:id', firebaseAuth, adminOnly, technicians.destroy);

// Gestão de Usuários - acesso exclusivo para administradores
router.get('/users', firebaseAuth, adminOnly, users.index);

// Atualização de perfil - acesso exclusivo para administradores
router.put('/users/:uid', firebaseAuth, adminOnly, users.update);
router.post('/users/:uid', firebaseAuth, adminOnly, users.update);

// Categorias
router.get('/categories', categories.index);
router.get('/categories/new', categories.new);
router.post('/categories', categories.create);
router.get('/categories/:id/edit', categories.edit);
router.put('/categories/:id', categories.update);
router.delete('/categories/:id', categories.destroy);

module.exports = router;
