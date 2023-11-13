// Script para carregar os itens em lote
// Evitando o carregamento da tabela inteira de uma só vez

const modalPesquisaPeca = document.getElementById("modal_pesquisa_peca");
const tableBody = document.querySelector("#modal_pesquisa_peca .responsive-table tbody");
const campoRolagem = document.getElementById("tabela-solicitar-peca");

let page = 1;
const perPage = 10;
let allDataLoaded = false;

campoRolagem.addEventListener("scroll", function () {
    if (!allDataLoaded && campoRolagem.scrollTop + campoRolagem.clientHeight >= campoRolagem.scrollHeight - 1) {
        console.log("Rolou");
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
                    <td data-label="Código">${item.codigo}</td>
                    <td data-label="Peça">${item.descricao}</td>
                    <td data-label="Quantidade">${item.quantidade}</td>
                    <td data-label="Carreta">${item.carreta}</td>
                    <td data-label="Conjunto">${item.conjunto}</td>
                    <td data-label="Quantidade"><input type="number" id="quantidade_solicitada" class="form-control2"></td>
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

// Manipulador de eventos para os botões "Solicitar"
tableBody.addEventListener("click", function (event) {
    if (event.target.classList.contains("solicitar")) {
       
        // Obtenha os dados relevantes da linha (você pode usar os métodos do DOM para percorrer os elementos da linha)
        const row = event.target.parentElement.parentElement;
        const codigo = row.querySelector("td:first-child").textContent;
        const descricao = row.querySelector("td:nth-child(2)").textContent;
        const carreta = row.querySelector("td:nth-child(4)").textContent;
        const conjunto = row.querySelector("td:nth-child(5)").textContent;
        const quantidadeSolicitada = row.querySelector("td:nth-child(6) input").value;
        const observacao = row.querySelector("td:nth-child(7) textarea").value;

        if(!quantidadeSolicitada){
            alert("Preencha o campo de quantidade")
        } else {
            enviarDadosParaBackend(codigo, descricao, carreta, conjunto, observacao, quantidadeSolicitada);
        }
    }
});

function enviarDadosParaBackend(codigo, descricao, carreta, conjunto, observacao, quantidadeSolicitada) {
    // Faça uma solicitação para enviar os dados para o backend
    $("#loading-overlay").show();
    fetch("/solicitar-peca", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            codigo: codigo,
            descricao: descricao,
            carreta: carreta,
            conjunto: conjunto,
            observacao: observacao,
            quantidadeSolicitada: quantidadeSolicitada,
        }),
    })
        .then(response => response.json())
        .then(data => {
            $("#loading-overlay").hide();
            // Lide com a resposta do backend, se necessário
            console.log("Resposta do backend:", data);
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
