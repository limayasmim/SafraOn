const supabaseClient = window.supabase;

class GerenciadorCadastro {
    constructor() {
        this.nome = document.getElementById("nome");
        this.cpf = document.getElementById("CPF");
        this.telefone = document.getElementById("telefone");
        this.email = document.getElementById("email");
        this.estado = document.getElementById("estado");
        this.usuario = document.getElementById("usuario");

        this.senha = document.getElementById("senha");
        this.confirmar = document.getElementById("confirmar");

        this.iniciar();
    }

    iniciar() {
        const botao = document.querySelector("button");
        botao.addEventListener("click", (e) => {
            e.preventDefault();
            this.salvarCadastro();
        });
    }

    async salvarCadastro() {
        if (
            !this.nome.value ||
            !this.cpf.value ||
            !this.telefone.value ||
            !this.email.value ||
            !this.usuario.value ||
            !this.senha.value ||
            !this.confirmar.value
        ) {
            alert("Preencha todos os campos!");
            return;
        }

        if (this.senha.value !== this.confirmar.value) {
            alert("As senhas não coincidem!");
            return;
        }

        const { data, error } = await supabaseClient
            .from("usuarios")
            .insert([
                {
                    nome: this.nome.value,
                    cpf: this.cpf.value,
                    telefone: this.telefone.value,
                    email: this.email.value,
                    estado: this.estado.value,
                    usuario: this.usuario.value,
                    senha: this.senha.value
                }
            ]);

        if (error) {
            console.error("ERRO DO SUPABASE:", error);
            alert("Erro ao cadastrar. Veja o console.");
            return;
        }

        alert("Cadastro concluído com sucesso!");
        window.location.href = "login.html";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new GerenciadorCadastro();
});


// Inicia o cadastro
document.addEventListener("DOMContentLoaded", () => {
    new GerenciadorCadastro();
});

