let graficoProdutos = null;


async function carregarDashboard() {

    const botao =
        document.getElementById("btnAtualizar");

    const status =
        document.getElementById("statusAtualizacao");


    try {


        // BOTÃO

        if (botao) {

            botao.disabled = true;

            botao.innerText =
                "⏳ Atualizando...";

        }


        // STATUS

        if (status) {

            status.innerText =
                "Consultando banco...";

        }


        // BUSCAR PRODUTOS

        const resposta =
            await fetch(
                "/api/produtos",
                {
                    cache: "no-store"
                }
            );


        if (!resposta.ok) {

            throw new Error(
                "Erro HTTP: " +
                resposta.status
            );

        }


        const produtos =
            await resposta.json();


        console.log(
            "Produtos recebidos:",
            produtos
        );


        // CRIAR GRÁFICO

        criarGrafico(produtos);


        // STATUS

        if (status) {

            status.innerText =
                "Atualizado às " +
                new Date()
                    .toLocaleTimeString("pt-BR");

        }


    }

    catch (erro) {


        console.error(
            "Erro ao carregar dashboard:",
            erro
        );


        if (status) {

            status.innerText =
                "❌ Erro ao carregar dados";

        }


    }

    finally {


        if (botao) {

            botao.disabled = false;

            botao.innerText =
                "🔄 Atualizar";

        }

    }

}



function criarGrafico(produtos) {


    const canvas =
        document.getElementById(
            "graficoProdutos"
        );


    // VERIFICAÇÃO

    if (!canvas) {

        console.error(
            "ERRO: canvas graficoProdutos não existe no HTML."
        );

        return;

    }


    // NOMES

    const nomes =
        produtos.map(

            produto =>
                produto.nome ||
                "Sem nome"

        );


    // QUANTIDADES

    const quantidades =
        produtos.map(

            produto =>
                Number(
                    produto.quantidade
                ) || 0

        );


    console.log(
        "Nomes:",
        nomes
    );

    console.log(
        "Quantidades:",
        quantidades
    );


    // DESTRUIR GRÁFICO ANTERIOR

    if (graficoProdutos) {

        graficoProdutos.destroy();

    }


    // CRIAR GRÁFICO

    graficoProdutos =
        new Chart(

            canvas,

            {

                type: "bar",


                data: {

                    labels: nomes,


                    datasets: [

                        {

                            label:
                                "Quantidade em estoque",

                            data:
                            quantidades,

                            borderWidth: 1,

                            borderRadius: 6

                        }

                    ]

                },


                options: {

                    responsive: true,

                    maintainAspectRatio:
                        false,


                    scales: {

                        x: {

                            ticks: {

                                color:
                                    "#94a3b8"

                            },

                            grid: {

                                display: false

                            }

                        },


                        y: {

                            beginAtZero: true,

                            ticks: {

                                precision: 0,

                                color:
                                    "#94a3b8"

                            }

                        }

                    },


                    plugins: {

                        legend: {

                            labels: {

                                color:
                                    "#ffffff"

                            }

                        },


                        tooltip: {

                            callbacks: {

                                label:
                                    function(context) {

                                        return (
                                            " " +
                                            context
                                                .parsed
                                                .y +
                                            " unidades"
                                        );

                                    }

                            }

                        }

                    }

                }

            }

        );

}



// CARREGAR UMA VEZ
// QUANDO ABRIR O DASHBOARD

carregarDashboard();