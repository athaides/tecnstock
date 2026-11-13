// ==========================================
// CARREGAR RELATÓRIOS
// ==========================================

async function carregarRelatorios() {

    try {

        const response =
            await fetch("/api/produtos");


        if (!response.ok) {

            throw new Error(
                "Erro ao carregar produtos"
            );

        }


        const produtos =
            await response.json();


        // ======================================
        // TOTAL DE PRODUTOS
        // ======================================

        const totalProdutos =
            document.getElementById(
                "totalProdutos"
            );


        if (totalProdutos) {

            totalProdutos.innerText =
                produtos.length;

        }


        // ======================================
        // ESTOQUE ATUAL
        // ======================================

        let totalEstoque = 0;


        produtos.forEach(produto => {

            totalEstoque +=
                Number(
                    produto.quantidade
                ) || 0;

        });


        const estoque =
            document.getElementById(
                "totalEstoque"
            );


        if (estoque) {

            estoque.innerText =
                totalEstoque;

        }


    } catch (erro) {

        console.error(
            "Erro ao carregar relatórios:",
            erro
        );

    }

}



// ==========================================
// CARREGAR SAÍDAS
// ==========================================

async function carregarSaidas() {

    try {

        const response =
            await fetch(
                "/api/estoque/saidas"
            );


        if (!response.ok) {

            throw new Error(
                "Erro ao carregar histórico"
            );

        }


        const saidas =
            await response.json();


        const corpo =
            document.getElementById(
                "corpoSaidas"
            );


        if (!corpo) {

            console.error(
                "Elemento corpoSaidas não encontrado"
            );

            return;
        }


        corpo.innerHTML = "";


        // ======================================
        // SE NÃO TIVER SAÍDAS
        // ======================================

        if (saidas.length === 0) {

            corpo.innerHTML = `

                <tr>

                    <td colspan="5"
                        style="text-align:center;">

                        Nenhuma saída registrada.

                    </td>

                </tr>

            `;

            return;
        }


        // ======================================
        // MOSTRAR SAÍDAS
        // ======================================

        saidas.forEach(saida => {

            let dataFormatada =
                "Não informado";


            if (
                saida.dataMovimentacao
            ) {

                const data =
                    new Date(
                        saida.dataMovimentacao
                    );


                dataFormatada =
                    data.toLocaleString(
                        "pt-BR"
                    );

            }


            const linha = `

                <tr>

                    <td>
                        ${
                saida.nomeProduto
                || "N/A"
            }
                    </td>


                    <td>
                        ${
                saida.quantidade
                || 0
            }
                    </td>


                    <td>
                        ${
                saida.fornecedorNome
                || "N/A"
            }
                    </td>


                    <td>
                        ${
                saida.usuarioLogin
                || "N/A"
            }
                    </td>


                    <td>
                        ${dataFormatada}
                    </td>

                </tr>

            `;


            corpo.innerHTML += linha;

        });


    } catch (erro) {

        console.error(
            "Erro ao carregar saídas:",
            erro
        );

    }

}



// ==========================================
// INICIAR RELATÓRIO
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        carregarRelatorios();

        carregarSaidas();

    }
);