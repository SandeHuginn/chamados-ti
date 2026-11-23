import { initializeApp } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js";

// Configurações do projeto Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBTl9E0puHeWTaRBXFBhdXhDBYIm7lk5So",
    authDomain: "chamados-ti-rbac-582bc.firebaseapp.com",
    projectId: "chamados-ti-rbac-582bc",
    storageBucket: "chamados-ti-rbac-582bc.firebasestorage.app",
    messagingSenderId: "423667340346",
    appId: "1:423667340346:web:ba756ead19cb1a5d4ad103"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Serviços utilizados pela aplicação
export const auth = getAuth(app);
export const db = getFirestore(app);
