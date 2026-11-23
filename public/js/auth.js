import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js";

import { auth, db } from "./firebase-config.js";

// Elementos da interface
const usuarioNome = document.getElementById("usuario-nome");
const usuarioEmail = document.getElementById("usuario-email");
const usuarioPerfil = document.getElementById("usuario-perfil");
const btnLogout = document.getElementById("btn-logout");

// Elementos que dependem do perfil
const elementosAdmin = document.querySelectorAll(".somente-admin");
const elementosTecnico = document.querySelectorAll(".somente-tecnico");

// Observa o estado da autenticação
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "/login";
        return;
    }

    try {
        // Busca o documento do usuário no Firestore
        const referencia = doc(db, "usuarios", user.uid);
        const documento = await getDoc(referencia);

        if (!documento.exists()) {
            await signOut(auth);
            window.location.href = "/login";
            return;
        }

        const dadosUsuario = documento.data();
        const perfil = dadosUsuario.perfil;

        console.log("Perfil identificado:", perfil);

        // Exibe os dados do usuário
        if (usuarioNome) {
            usuarioNome.textContent =
                dadosUsuario.nome || user.displayName || "Usuário";
        }

        if (usuarioEmail) {
            usuarioEmail.textContent = user.email || "";
        }

        if (usuarioPerfil) {
            usuarioPerfil.textContent = perfil;
        }

        // Controle dos elementos administrativos
        elementosAdmin.forEach((elemento) => {
            elemento.hidden = perfil !== "admin";
        });

        // Controle dos elementos de atendimento
        elementosTecnico.forEach((elemento) => {
            elemento.hidden = !["tecnico", "admin"].includes(perfil);
        });

        // Libera a interface após verificar o perfil
        document.documentElement.classList.remove("verificando-perfil");

    } catch (erro) {
        console.error("Erro ao verificar autenticação:", erro);

        await signOut(auth);
        window.location.href = "/login";
    }
});

// Realiza o logout
if (btnLogout) {
    btnLogout.addEventListener("click", async () => {
        try {
            await signOut(auth);
            window.location.href = "/login";
        } catch (erro) {
            console.error("Erro ao sair:", erro);
            alert("Não foi possível encerrar sua sessão.");
        }
    });
}