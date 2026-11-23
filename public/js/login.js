import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    updateProfile
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js";

import {
    doc,
    getDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js";

import { auth, db } from "./firebase-config.js";

// Elementos da tela
const form = document.getElementById("login-form");
const campoNome = document.getElementById("nome");
const campoEmail = document.getElementById("email");
const campoSenha = document.getElementById("senha");

const btnLogin = document.getElementById("btn-login");
const btnCadastro = document.getElementById("btn-cadastro");
const btnGoogle = document.getElementById("btn-google");

const mensagem = document.getElementById("auth-message");

let modoCadastro = false;

// Exibe mensagens na tela
function mostrarMensagem(texto, tipo = "error") {
    mensagem.textContent = texto;
    mensagem.className = `auth-message ${tipo}`;
    mensagem.hidden = false;
}

// Traduz erros do Firebase
function traduzirErro(erro) {
    const erros = {
        "auth/invalid-credential": "E-mail ou senha incorretos.",
        "auth/invalid-email": "Informe um e-mail válido.",
        "auth/email-already-in-use": "Este e-mail já está cadastrado.",
        "auth/weak-password": "A senha deve possuir pelo menos 6 caracteres.",
        "auth/user-not-found": "Não encontramos uma conta com esse e-mail.",
        "auth/wrong-password": "A senha informada está incorreta.",
        "auth/popup-closed-by-user": "A janela de login do Google foi fechada.",
        "auth/popup-blocked": "O navegador bloqueou a janela de login.",
        "auth/network-request-failed": "Falha na conexão. Verifique sua internet."
    };

    return erros[erro.code] || "Não foi possível realizar a operação. Tente novamente.";
}

// Verifica ou cria o perfil do usuário
async function verificarPerfil(usuario) {
    const referencia = doc(db, "usuarios", usuario.uid);
    const documento = await getDoc(referencia);

    if (!documento.exists()) {
        await setDoc(referencia, {
            uid: usuario.uid,
            nome: usuario.displayName || campoNome.value.trim() || "Usuário",
            email: usuario.email,
            perfil: "user"
        });
    }
}

// Cria uma sessão no backend
async function criarSessao(usuario) {
    const idToken = await usuario.getIdToken();

    const resposta = await fetch('/sessionLogin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            idToken: idToken,
        }),
    });

    const resultado = await resposta.json();

    if (!resposta.ok) {
        throw new Error(
            resultado.erro || 'Não foi possível criar a sessão.'
        );
    }
}

// Alterna entre login e cadastro
btnCadastro.addEventListener("click", () => {
    modoCadastro = !modoCadastro;

    campoNome.disabled = !modoCadastro;
    campoNome.required = modoCadastro;

    btnLogin.textContent = modoCadastro
        ? "Criar Conta"
        : "Entrar";

    btnCadastro.textContent = modoCadastro
        ? "Cancelar cadastro"
        : "Criar Conta";

    mensagem.hidden = true;
});

// Login ou cadastro por e-mail
form.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const email = campoEmail.value.trim();
    const senha = campoSenha.value;
    const nome = campoNome.value.trim();

    try {
        if (modoCadastro) {
            if (!nome) {
                mostrarMensagem("Informe seu nome completo.");
                return;
            }

            const resultado = await createUserWithEmailAndPassword(
                auth,
                email,
                senha
            );

            await updateProfile(resultado.user, {
                displayName: nome
            });

            await verificarPerfil(resultado.user);

            mostrarMensagem("Conta criada com sucesso!", "success");

        } else {
            const resultado = await signInWithEmailAndPassword(
                auth,
                email,
                senha
            );

            await verificarPerfil(resultado.user);
            await criarSessao(resultado.user);

            window.location.href = "/";
        }

    } catch (erro) {
        console.error(erro);
        mostrarMensagem(traduzirErro(erro));
    }
});

// Login com Google
btnGoogle.addEventListener("click", async () => {
    const provedor = new GoogleAuthProvider();

    try {
        const resultado = await signInWithPopup(auth, provedor);

        await verificarPerfil(resultado.user);
        await criarSessao(resultado.user);

        window.location.href = "/";

    } catch (erro) {
        console.error(erro);
        mostrarMensagem(traduzirErro(erro));
    }
});
