// const supabaseClient = window.supabase;

// class GerenciadorCadastro {
//     constructor() {
//         this.nome = document.getElementById("nome");
//         this.cpf = document.getElementById("cpf");
//         this.telefone = document.getElementById("telefone");
//         this.email = document.getElementById("email");
//         this.estado = document.getElementById("estado");
//         this.usuario = document.getElementById("usuario");

//         this.senha = document.getElementById("senha");
//         this.confirmar = document.getElementById("confirmar");

//         this.iniciar();
//     }

//     iniciar() {
//         const botao = document.querySelector("button");
//         botao.addEventListener("click", (e) => {
//             e.preventDefault();
//             this.salvarCadastro();
//         });
//     }

//     async salvarCadastro() {
//         if (
//             !this.nome.value ||
//             !this.cpf.value ||
//             !this.telefone.value ||
//             !this.email.value ||
//             !this.usuario.value ||
//             !this.senha.value ||
//             !this.confirmar.value
//         ) {
//             alert("Preencha todos os campos!");
//             return;
//         }

//         if (this.senha.value !== this.confirmar.value) {
//             alert("As senhas não coincidem!");
//             return;
//         }

//         const { data, error } = await supabaseClient
//             .from("cadastro")
//             .insert([
//                 {
//                     nome_completo: this.nome.value,
//                     cpf: this.cpf.value,
//                     telefone: this.telefone.value,
//                     email: this.email.value,
//                     estado: this.estado.value,
//                     nomeusuario: this.usuario.value,
//                     senha_usuario: this.senha.value
//                 }
//             ])
//             .select();

//         if (error) {
//             console.error("ERRO DO SUPABASE:", error);
//             alert("Erro ao cadastrar. Veja o console.");
//             return;
//         }

//         const id_cadastro = data[0].id_cadastro;

//         const { error: relError } = await supabaseClient
//             .from("usuario")
//             .insert([
//                 {
//                     id_cadastro: id_cadastro
//                 }
//             ]);

//         if (relError) {
//             console.error("ERRO RELACIONAMENTO:", relError);
//             alert("Erro ao relacionar usuário.");
//             return;
//         }


//         alert("Cadastro concluído com sucesso!");
//         window.location.href = "login.html";
//     }
// }

// document.addEventListener("DOMContentLoaded", () => {
//     new GerenciadorCadastro();
// });



const supabaseClient = window.supabase;

class GerenciadorCadastro {

    constructor() {
        this.nome = document.getElementById("nome");
        this.cpf = document.getElementById("cpf");
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
            !this.estado.value ||
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

        // 1️⃣ INSERE NA TABELA CADASTRO
        const { data, error } = await supabaseClient
            .from("cadastro")
            .insert([
                {
                    nome_completo: this.nome.value,
                    cpf: this.cpf.value,
                    telefone: this.telefone.value,
                    email: this.email.value,
                    estado: this.estado.value,
                    nomeusuario: this.usuario.value,
                    senha_usuario: this.senha.value
                }
            ])
            .select();

        if (error) {
            console.error("ERRO CADASTRO:", error);
            alert("Erro ao realizar cadastro.");
            return;
        }

        // Obtém o ID do cadastro inserido
        const id_cadastro = data[0].id_cadastro;

        // 2️⃣ INSERE NA TABELA USUARIO (RELACIONAL)
        const { error: relError } = await supabaseClient
            .from("usuario")
            .insert([
                {
                    id_cadastro: id_cadastro
                }
            ]);

        if (relError) {
            console.error("ERRO RELAÇÃO USUARIO:", relError);
            alert("Erro ao vincular cadastro ao usuário.");
            return;
        }

        alert("Cadastro realizado com sucesso!");
        window.location.href = "login.html";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new GerenciadorCadastro();
});
