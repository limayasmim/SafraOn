const supabaseClient = window.supabase;

class GerenciadorLogin {
    
    constructor() {
        this.usuarioInput = document.getElementById("usuario");
        this.senhaInput = document.getElementById("senha");

        this.iniciar();
    }

    iniciar() {
        const botaoLogin = document.querySelector("button");
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
            .from("usuarios")
            .select("*")
            .eq("usuario", usuario)
            .eq("senha", senha)
            .single();

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
