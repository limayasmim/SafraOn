const supabaseClient = window.supabase;

class GerenciadorLogin {
    
    constructor() {
        this.usuarioInput = document.getElementById("nomeusuario");
        this.senhaInput = document.getElementById("senha_usuario");

        this.iniciar();
    }

    iniciar() {
        const botaoLogin = document.getElementById("btnLogin");
        botaoLogin.addEventListener("click", (e) => {
            e.preventDefault();
            this.realizarLogin();
        });
    }

    async realizarLogin() {
        const usuario = this.usuarioInput.value.trim();
        const senha = this.senhaInput.value.trim();

        if (!usuario || !senha) {
            alert("Preencha todos os campos!");
            return;
        }

        // Consulta no banco
        const { data, error } = await supabaseClient
            .from("cadastro")
            .select("*")
            .eq("nomeusuario", usuario)
            .eq("senha_usuario", senha)
            .maybeSingle();

        if (error || !data) {
            alert("Usuário ou senha incorretos!");
            return;
        }

        // Login bem-sucedido
        alert("Login realizado com sucesso!");
        window.location.href = "fazendas.html";
    }
}

// Iniciar o sistema
document.addEventListener("DOMContentLoaded", () => {
    new GerenciadorLogin();
});
