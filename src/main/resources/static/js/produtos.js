let produtoEditandoId = null;
async function carregarProdutos() {

    try {

        const response = await fetch("/api/produtos");

        if (!response.ok) {
            throw new Error("Erro ao carregar produtos");
        }

        const produtos = await response.json();

        const lista = document.getElementById("listaProdutos");

        lista.innerHTML = "";

        produtos.forEach(produto => {

            const item = document.createElement("div");

            item.classList.add("produto-card");

            const precoFormatado =
                produto.preco != null
                    ? Number(produto.preco).toFixed(2)
                    : "0.00";

            item.innerHTML = `

                <div>

                    <h3>${produto.nome}</h3>

                    <p class="desc">
                        ${produto.descricao || "Sem descrição"}
                    </p>

                </div>

                <div>

                    <div class="produto-details">

                        <div class="produto-row">
                            <span>Preço</span>
                            <span class="preco-tag">
                                R$ ${precoFormatado}
                            </span>
                        </div>

                        <div class="produto-row">
                            <span>Estoque</span>
                            <span>
                                ${produto.quantidade || 0} unid.
                            </span>
                        </div>

                        <div class="produto-row">
                            <span>Fornecedor</span>
                            <span>
                                #${produto.idFornecedor || "N/A"}
                            </span>
                        </div>

                    </div>

                    <div class="acoes">

                        <button
                            class="btn-stock"
                            onclick="entradaEstoque(${produto.id})">
                            Entrada
                        </button>

                        <button
                            class="btn-stock-out"
                            onclick="saidaEstoque(${produto.id})">
                            Saída
                        </button>

                        <button
                            class="btn-edit"
                            onclick="editarProduto(${produto.id})">
                            Alterar
                        </button>

                        <button
                            class="btn-danger"
                            onclick="deletarProduto(${produto.id})">
                            Excluir
                        </button>

                    </div>

                </div>
            `;

            lista.appendChild(item);
        });


    } catch (erro) {

        console.error("ERRO AO CARREGAR:", erro);

        document.getElementById("mensagem").innerText =
            "Erro ao carregar produtos";
    }
}

async function cadastrarProduto() {

    const produto = {

        nome: document.getElementById("nome").value,

        descricao: document.getElementById("descricao").value,

        preco: parseFloat(
            document.getElementById("preco").value
        ),
        quantidade:parseInt(
        document.getElementById(
            "quantidade"
        ).value
    ) || 0,

        idFornecedor: document.getElementById(
            "idFornecedor"
        ).value
            ? parseInt(
                document.getElementById(
                    "idFornecedor"
                ).value
            )
            : null,

        ativo: true
    };

    // VALIDAÇÃO
    if (!produto.idFornecedor) {

        document.getElementById("mensagem")
            .innerText =
                "Selecione um fornecedor";

        return;
    }

    try {

        let response;

        if (produtoEditandoId !== null) {

            response = await fetch(
                `/api/produtos/${produtoEditandoId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(produto)
                }
            );

        } else {

            response = await fetch("/api/produtos", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(produto)
            });
        }

        if (!response.ok) {

            const erroTexto =
                await response.text();

            throw new Error(erroTexto);
        }

        document.getElementById("mensagem")
            .innerText =
                "Produto salvo com sucesso";

        limparFormulario();

        carregarProdutos();

    } catch (erro) {

        console.error(
            "ERRO AO SALVAR:",
            erro
        );

        document.getElementById("mensagem")
            .innerText =
                erro.message;
    }
}

async function deletarProduto(id) {

    try {

        await fetch(`/api/produtos/${id}`, {
            method: "DELETE"
        });

        carregarProdutos();

    } catch (erro) {

        console.error("ERRO AO DELETAR:", erro);
    }
}

function limparFormulario() {

    document.getElementById("nome").value = "";

    document.getElementById("descricao").value = "";

    document.getElementById("preco").value = "";

    document.getElementById("quantidade").value = "";

    document.getElementById("idFornecedor").value = "";

    // sai do modo edição
    produtoEditandoId = null;

    // volta texto do botão
    document.querySelector(".btn-primary")
        .innerText = "Cadastrar Produto";
}

function gerarGrafico(produtos) {

    const canvas =
        document.getElementById("graficoProdutos");

    if (!canvas) return;

    if (typeof Chart === "undefined") return;

    const nomes =
        produtos.map(p => p.nome);

    const quantidades =
        produtos.map(p => p.quantidade || 0);

    if (window.graficoProdutosInstance) {
        window.graficoProdutosInstance.destroy();
    }

    window.graficoProdutosInstance =
        new Chart(canvas, {

            type: "pie",

            data: {

                labels: nomes,

                datasets: [{
                    data: quantidades
                }]
            }
        });
}

async function editarProduto(id) {

    try {

        const response =
            await fetch(`/api/produtos/${id}`);

        const produto = await response.json();

        // guarda ID em edição
        produtoEditandoId = id;

        // preenche formulário
        document.getElementById("nome").value =
            produto.nome;

        document.getElementById("descricao").value =
            produto.descricao;

        document.getElementById("preco").value =
            produto.preco;

        document.getElementById("quantidade").value =
            produto.quantidade;

        document.getElementById("idFornecedor").value =
            produto.idFornecedor;

        // muda botão
        const botao =
            document.querySelector(".btn-primary");

        botao.innerText = "Salvar Alterações";
       // SCROLL AUTOMÁTICO
document.querySelector(".cadastro")
    .scrollIntoView({
        behavior: "smooth"
    });

    } catch (erro) {

        console.error(
            "ERRO AO CARREGAR PRODUTO:",
            erro
        );
    }

}
async function carregarFornecedores() {

    try {

        const response =
            await fetch("/api/fornecedores");

        if (!response.ok) {

            throw new Error(
                "Erro ao carregar fornecedores"
            );
        }

        const fornecedores =
            await response.json();

        const select =
            document.getElementById(
                "idFornecedor"
            );

        // limpa opções antigas
        select.innerHTML = `
            <option value="">
                Selecione um fornecedor
            </option>
        `;

        fornecedores.forEach(fornecedor => {

            const option =
                document.createElement("option");

            option.value = fornecedor.id;

            option.textContent =
                `${fornecedor.id} - ${fornecedor.nome}`;

            select.appendChild(option);
        });

    } catch (erro) {

        console.error(
            "ERRO AO CARREGAR FORNECEDORES:",
            erro
        );
    }
}
window.onload = () => {
    carregarProdutos();
    carregarFornecedores();
};

async function entradaEstoque(idProduto) {

    const quantidade = parseInt(
        prompt("Quantidade de entrada:")
    );

    if (!quantidade || quantidade <= 0) {
        alert("Quantidade inválida");
        return;
    }

    const usuarioSalvo =
        localStorage.getItem("usuario");

    let usuarioLogin = "Não identificado";

    if (usuarioSalvo) {
        try {

            const usuario = JSON.parse(usuarioSalvo);

            usuarioLogin =
                usuario.codigo ||
                usuario.login ||
                usuario.nome ||
                "Não identificado";

        } catch (erro) {
            console.error(
                "Erro ao ler usuário:",
                erro
            );
        }
    }

    try {

        const response = await fetch(
            `/api/estoque/entrada` +
            `?idProduto=${idProduto}` +
            `&quantidade=${quantidade}` +
            `&observacao=${encodeURIComponent(
                "Entrada manual"
            )}` +
            `&usuarioLogin=${encodeURIComponent(
                usuarioLogin
            )}`,
            {
                method: "POST"
            }
        );

        if (response.ok) {

            alert(
                "Entrada realizada com sucesso!"
            );

            carregarProdutos();

        } else {

            const erro =
                await response.text();

            console.error(
                "Erro na entrada:",
                erro
            );

            alert(
                erro ||
                "Erro ao realizar entrada"
            );
        }

    } catch (erro) {

        console.error(
            "Erro na requisição:",
            erro
        );

        alert(
            "Erro de conexão com o servidor"
        );
    }
}

async function saidaEstoque(idProduto) {

    const quantidade = parseInt(
        prompt("Quantidade de saída:")
    );


    if (!quantidade || quantidade <= 0) {

        alert("Quantidade inválida");

        return;
    }


    // ======================================
    // USUÁRIO LOGADO
    // ======================================

    const usuarioSalvo =
        localStorage.getItem("usuario");


    let usuarioLogin =
        "Não identificado";


    if (usuarioSalvo) {

        try {

            const usuario =
                JSON.parse(usuarioSalvo);


            usuarioLogin =
                usuario.codigo ||
                usuario.login ||
                usuario.nome ||
                "Não identificado";


        } catch (erro) {

            console.error(
                "Erro ao ler usuário:",
                erro
            );

        }

    }


    // ======================================
    // SAÍDA
    // ======================================

    try {

        const response = await fetch(

            `/api/estoque/saida` +
            `?idProduto=${idProduto}` +
            `&quantidade=${quantidade}` +
            `&observacao=${encodeURIComponent(
                "Saída manual"
            )}` +
            `&usuarioLogin=${encodeURIComponent(
                usuarioLogin
            )}`,

            {
                method: "POST"
            }

        );


        if (response.ok) {

            alert(
                "Saída realizada com sucesso!"
            );

            carregarProdutos();


        } else {

            const erro =
                await response.text();


            console.error(
                "Erro na saída:",
                erro
            );


            alert(
                erro ||
                "Erro ao realizar saída"
            );

        }


    } catch (erro) {

        console.error(
            "Erro na requisição:",
            erro
        );

        alert(
            "Erro de conexão com o servidor"
        );

    }

}