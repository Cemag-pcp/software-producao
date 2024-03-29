// Script para carregar os itens em lote
// Evitando o carregamento da tabela inteira de uma só vez

const modalPesquisaPeca = document.getElementById("modal_pesquisa_peca");
const tableBody = document.querySelector("#modal_pesquisa_peca .responsive-table tbody");
const divResultado = document.getElementById("resultado");
const campoRolagem = document.getElementById("tabela-solicitar-peca");

let page = 1;
const perPage = 10;
let allDataLoaded = false;

campoRolagem.addEventListener("scroll", function () {
    if (!allDataLoaded && campoRolagem.scrollTop + campoRolagem.clientHeight >= campoRolagem.scrollHeight - 1) {
        page++;
        fetchMoreData();
    }
});

// Função para limpar os dados das células <td> na tabela
function limparDadosDaTabela() {
    const tdElements = document.querySelectorAll("#modal_pesquisa_peca .responsive-table tbody td");
    tdElements.forEach(td => {
        td.textContent = ""; // Define o conteúdo da célula como vazio
    });
}

// Adicione um ouvinte de evento ao evento de abertura do modal
$('#modal_pesquisa_peca').on('show.bs.modal', function () {
    // Função para limpar os dados das células <td> na tabela
    function limparDadosDaTabela() {
        const tdElements = document.querySelectorAll("#modal_pesquisa_peca .responsive-table tbody tr");
        tdElements.forEach(td => {
            td.textContent = ""; // Define o conteúdo da célula como vazio
        });
    }

    // Chame a função para limpar os dados da tabela ao abrir o modal
    limparDadosDaTabela();
});

// Função para buscar mais dados
function fetchMoreData() {
    if (allDataLoaded) {
        return; // Evite fazer mais solicitações quando todos os itens já foram carregados
    }

    // Obtenha os valores selecionados nos campos de filtro
    const filtroPeca = document.getElementById('filtroPeca').value;
    const filtroProcesso = document.getElementById('filtroProcesso').value;
    const filtroCarreta = document.getElementById('filtroCarreta').value;
    const filtroConjunto = document.getElementById('filtroConjunto').value;

    // Faça uma solicitação para buscar mais dados do servidor
    fetch(`/api/base_carretas?page=${page}&per_page=${perPage}&peca=${filtroPeca}&processo=${filtroProcesso}&carreta=${filtroCarreta}&conjunto=${filtroConjunto}`)
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) {
                allDataLoaded = true; // Marque que todos os dados foram carregados
                return;
            }

            // Atualize a tabela com os resultados adicionados
            data.forEach(item => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td data-label="Processo">${item.processo}</td>
                    <td data-label="Código">${item.codigo}</td>
                    <td data-label="Peça">${item.descricao}</td>
                    <td data-label="Quantidade">${item.quantidade}</td>
                    <td data-label="Carreta">${item.carreta}</td>
                    <td data-label="Conjunto">${item.conjunto}</td>
                    <td data-label="Quantidade necessária"><input type="number" id="quantidade_solicitada" class="form-control2"></td>
                    <td data-label="Observação"><textarea name="observacao" rows="5" cols="30" class="form-control-textarea"></textarea></td>
                    <td><button class="solicitar">Solicitar</button></td>
                    `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error("Erro ao buscar mais dados.", error);
        });
}

// Manipulador de eventos para os botões "Solicitar" "AQUI TABELA PEÇA SOLICITADA"
tableBody.addEventListener("click", function (event) {
    if (event.target.classList.contains("solicitar")) {
       
        // Obtenha os dados relevantes da linha (você pode usar os métodos do DOM para percorrer os elementos da linha)
        const row = event.target.parentElement.parentElement;
        const processo = row.querySelector("td:first-child").textContent;
        const codigo = row.querySelector("td:nth-child(2)").textContent;
        const descricao = row.querySelector("td:nth-child(3)").textContent;
        const carreta = row.querySelector("td:nth-child(5)").textContent;
        const conjunto = row.querySelector("td:nth-child(6)").textContent;
        const quantidadeSolicitada = row.querySelector("td:nth-child(7) input").value;
        const observacao = row.querySelector("td:nth-child(8) textarea").value;

        if(!quantidadeSolicitada){
            alert("Preencha o campo de quantidade")
        } else {
            let origem = "Solicitadas";
            console.log(processo,codigo, descricao, carreta, conjunto, observacao, quantidadeSolicitada,'',origem)
            enviarDadosParaBackend(processo,codigo, descricao, carreta, conjunto, observacao, quantidadeSolicitada,'',origem,'','');
        }
    }
});

// Aqui está enviando para o BackEnd da rota 'solicitar-peca', enviando a tabela de Resultado "AQUI TABELA RESULTADO LEVANTAMENTO"
divResultado.addEventListener("click", function (event) {
    // Obtenha a linha atual
    if (event.target.classList.contains("solicitar")) {
    const row = event.target.parentElement.parentElement;

    // Obtenha os dados relevantes da linha
    const dataRange = document.getElementById("inputDate1").value;
    const codigo = row.querySelector("td:first-child").textContent;
    const conjunto = row.querySelector("td:nth-child(2)").textContent;
    const descricao = row.querySelector("td:nth-child(3)").textContent;
    const materiaPrima = row.querySelector("td:nth-child(4)").textContent;
    const quantidadeNecessaria = Number(row.querySelector("td:nth-child(5)").textContent);
    const carreta = row.querySelector("td:nth-child(6)").textContent;
    const quantidadeEstoque = row.querySelector("td:nth-child(7) input").value;
    const observacao = row.querySelector("td:nth-child(8) textarea").value;

        // Adicione verificação para quantidadeNecessaria se necessário
        if (!quantidadeNecessaria || !quantidadeEstoque || quantidadeEstoque < 0) {
            alert("Preencha os campos de quantidade");
        } else if (quantidadeEstoque >= quantidadeNecessaria) {
            alert("A quantidade no estoque já é maior ou igual a quantidade necessária");
        } else {
            let origem = "Levantamento";
            console.log(quantidadeNecessaria,quantidadeEstoque)
            enviarDadosParaBackend('',codigo, descricao, carreta, conjunto, observacao, quantidadeNecessaria,quantidadeEstoque,origem,dataRange,materiaPrima);
        }
    }
});

function enviarDadosParaBackend(processo,codigo, descricao, carreta, conjunto, observacao, quantidadeSolicitada, quantidadeEstoque='',origem,dataRange,materiaPrima) {
    // Faça uma solicitação para enviar os dados para o backend
    const tabelaId = $('#tabela-levantamento-peca').data('tabela-id');

    // Obtenha os dados da tabela
    const tabela = $('#' + tabelaId);
    const tbody = tabela.find('tbody');
    const linhas = tbody.find('tr[style*="table-row"]');
    const dadosTabela = [];

    // Itere sobre as linhas da tabela e obtenha os dados
    linhas.each(function() {
        const colunas = $(this).find('td');
        const dadosLinha = [];
        colunas.each(function() {
            dadosLinha.push($(this).text());
        });
        dadosTabela.push(dadosLinha);
    });
    $("#loading-overlay").show();
    fetch("/solicitar-peca", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            processo: processo,
            codigo: codigo,
            descricao: descricao,
            carreta: carreta,
            conjunto: conjunto,
            observacao: observacao,
            quantidadeSolicitada: quantidadeSolicitada,
            quantidadeEstoque: quantidadeEstoque,
            origem:origem,
            dataRange:dataRange,
            materiaPrima:materiaPrima,
            dadosTabela: dadosTabela
        }),
    })
        .then(response => response.json())
        .then(data => {
            $("#loading-overlay").hide();
            alert("Solicitação enviada.");
        })
        .catch(error => {
            $("#loading-overlay").hide();
            console.error("Erro ao enviar os dados para o backend.", error);
        });
}

// Adicione um evento de clique ao botão "Filtrar" para recarregar a tabela
document.getElementById('btnFiltrar').addEventListener('click', function () {
    $("#loading-overlay").show();

    setTimeout(() => {
        $("#loading-overlay").hide(); // Oculta a mensagem após 5 segundos (5000 ms)
    }, 2000);

    allDataLoaded = false; // Redefina a variável de controle quando o filtro é aplicado
    page = 1; // Reinicie a página ao aplicar o filtro
    tableBody.innerHTML = ''; // Limpe a tabela
    fetchMoreData(); // Busque dados filtrados

    btnFiltrar.style.backgroundColor = 'rgb(61, 55, 97)';
});
