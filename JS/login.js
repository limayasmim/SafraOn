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
        const { data: cadastro, error } = await supabaseClient
            .from("cadastro")
            .select("*")
            .eq("nomeusuario", usuario)
            .eq("senha_usuario", senha)
            .maybeSingle();

        if (error || !cadastro) {
            alert("Usuário ou senha incorretos!");
            return;
        }

        const id_cadastro = cadastro.id_cadastro;

        // 2️⃣ BUSCA O USUÁRIO (id_usuario)
        const { data: usuarioData, error: usuarioError } = await supabaseClient
            .from("usuario")
            .select("id_usuario")
            .eq("id_cadastro", id_cadastro)
            .maybeSingle();

        if (usuarioError || !usuarioData) {
            alert("Erro ao carregar dados do usuário.");
            return;
        }

        const id_usuario = usuarioData.id_usuario;

        // 3️⃣ SALVA ID NO LOCALSTORAGE (ESSENCIAL!)
        localStorage.setItem("id_usuario", id_usuario);

        // 4️⃣ PROSSEGUE
        alert("Login realizado com sucesso!");
        window.location.href = "fazendas.html";
    }
}


// Iniciar o sistema
document.addEventListener("DOMContentLoaded", () => {
    new GerenciadorLogin();
});
