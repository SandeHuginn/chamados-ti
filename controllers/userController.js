const { adminDb } = require('../config/firebaseAdmin');

// GET /users
exports.index = async (req, res) => {
    const resultado = await adminDb.collection('usuarios').get();

    const usuarios = resultado.docs.map((documento) => ({
        uid: documento.id,
        ...documento.data(),
    }));

    usuarios.sort((a, b) => a.nome.localeCompare(b.nome));

    res.render('users/index', {
        title: 'Gestão de Usuários',
        usuarios,
    });
};

// PUT /users/:uid
exports.update = async (req, res) => {
    const { uid } = req.params;
    const { perfil } = req.body;

    const perfisPermitidos = ['user', 'tecnico', 'admin'];

    if (!perfisPermitidos.includes(perfil)) {
        return res.redirect('/users?erro=Perfil inválido.');
    }

    const usuarioRef = adminDb.collection('usuarios').doc(uid);
    const usuarioDoc = await usuarioRef.get();

    if (!usuarioDoc.exists) {
        return res.redirect('/users?erro=Usuário não encontrado.');
    }

    await usuarioRef.update({ perfil });

    return res.redirect('/users?msg=Perfil atualizado com sucesso.');
};
