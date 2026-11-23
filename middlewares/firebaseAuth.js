const { adminAuth, adminDb } = require('../config/firebaseAdmin');

async function firebaseAuth(req, res, next) {
    try {
        // Localiza o cookie de sessão enviado pelo navegador
        const cookieSessao = (req.headers.cookie || '')
            .split(';')
            .find(cookie => cookie.trim().startsWith('session='));

        if (!cookieSessao) {
            return res.status(401).json({
                erro: 'Autenticação necessária.',
            });
        }

        // Recupera o valor do cookie
        const sessionCookie = decodeURIComponent(
            cookieSessao.trim().substring('session='.length)
        );

        // Valida a sessão com o Firebase Admin
        const decodedToken = await adminAuth.verifySessionCookie(
            sessionCookie,
            true
        );

        // Busca o perfil do usuário no Firestore
        const usuarioRef = adminDb.collection('usuarios').doc(decodedToken.uid);
        const usuarioDoc = await usuarioRef.get();

        if (!usuarioDoc.exists) {
            return res.status(403).json({
                erro: 'Perfil de usuário não encontrado.',
            });
        }

        const dadosUsuario = usuarioDoc.data();

        // Disponibiliza os dados autenticados para as rotas
        req.user = {
            uid: decodedToken.uid,
            email: decodedToken.email,
            displayName: decodedToken.name || null,
            nome: dadosUsuario.nome || decodedToken.name || 'Usuário',
            perfil: dadosUsuario.perfil,
        };

        next();

    } catch (erro) {
        console.error('Erro na autenticação do Firebase:', erro);

        return res.status(401).json({
            erro: 'Sessão inválida ou expirada.',
        });
    }
}

module.exports = firebaseAuth;
