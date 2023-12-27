// Filtro para tabela inicial
const dateRangeFilter = document.getElementById('inputDate1');
let tabelaLevantamentoPeca = document.getElementById('tabela-levantamento-peca');
var carretas_utilizadas = document.getElementById('carretas_utilizadas');
var base_carretas = document.getElementById('base_carretas');
let carretaLabel = document.getElementById('carreta');
let peca = document.getElementById('peca');
let processo = document.getElementById('processo');
let conjunto = document.getElementById('conjunto');
let descricao = document.getElementById('descricao');
let exibirTabela = document.getElementById('exibirTabela');
let resultado = document.getElementById('resultado');
let filtroProcesso = document.getElementById('filtroProcesso');
let filtroCarreta = document.getElementById('filtroCarreta');
// Função para formatar o intervalo de datas
function parseDateRange(dateRange) {
    const dateRangeParts = dateRange.split(" - ");

    // Verifique se o formato é válido
    if (dateRangeParts.length !== 2) {
        console.error("Formato de data inválido:", dateRange);
        return { startDate: null, endDate: null };
    }

    const [startDateString, endDateString] = dateRangeParts;
    const startDate = formatarDataLevantamento(startDateString);
    const endDate = formatarDataLevantamento(endDateString);

    return { startDate, endDate };
}

// Função para formatar a data de yyyy-MM-dd para dd/MM/yyyy
function formatarDataLevantamento(dateString) {
    const parts = dateString.split("/");
    if (parts.length === 3) {
        return new Date(parts[2], parts[1] - 1, parts[0]);
    }
    return null;
}

let filterTimer;

// Função para filtrar a tabela com base no intervalo de datas
function filtrarTabela() {
    // Limpe o temporizador existente, se houver
    clearTimeout(filterTimer);

    // Configure um novo temporizador para aguardar 500 milissegundos (ou ajuste conforme necessário)
    filterTimer = setTimeout(() => {
        const dateRange = dateRangeFilter.value;
        const { startDate, endDate } = parseDateRange(dateRange);
        const rows = document.querySelectorAll('.responsive-table1 tbody tr');

        // Inicialize um conjunto para armazenar carretas únicas
        const carretasArray = new Array();
        const quantCellArray = [];

        // Converta as linhas em um array para facilitar a ordenação
        const rowsArray = Array.from(rows);

        // Ordenar as linhas com base nas datas
        rowsArray.sort((a, b) => {
            const dateA = formatarDataLevantamento(a.cells[0].textContent);
            const dateB = formatarDataLevantamento(b.cells[0].textContent);

            // Verifique se ambas as datas são válidas antes de comparar
            if (dateA && dateB) {
                // Comparação de datas como objetos Date
                return dateA.getTime() - dateB.getTime();
            } else {
                // Se uma das datas for inválida, não altere a ordem
                return 0;
            }
        });

        // Aplicar o filtro agora nas linhas ordenadas
        rowsArray.forEach(row => {
            const dateCell = row.cells[0];
            const rowDate = formatarDataLevantamento(dateCell.textContent);

            // Verifique se a data da linha está dentro do intervalo selecionado
            const dateMatch = (rowDate >= startDate && rowDate <= endDate) || (startDate === "" && endDate === "");

            if (dateMatch) {
                // Adicione a carreta ao conjunto
                carretasArray.push(row.cells[1].textContent);
                quantCellArray.push(row.cells[2].textContent);
                row.style.display = 'table-row';
            } else {
                row.style.display = 'none';
            }
        });
        
        // Atualize o conteúdo do select com as carretas filtradas
        enviarCarretasParaBackend(carretasArray, quantCellArray);
    }); // Ajuste o tempo de espera conforme necessário
}

function enviarCarretasParaBackend(carretas,quantidade) {
    $('#loading-overlay').show()
    const carretasArray = Array.from(carretas);
    const quantCellArray = Array.from(quantidade);
    var inputDate1 = document.getElementById('inputDate1');
    var col = document.getElementById('coluna_data');
    var data_inicial = document.getElementById('data_inicial');
    var btnFiltrar = document.getElementById('btnFiltrar');
    var filtroPeca = document.getElementById('filtroPeca');
    var filtroProcesso = document.getElementById('filtroProcesso');
    var filtroConjunto = document.getElementById('filtroConjunto');
    var btnFiltrarLevantamento = document.getElementById('levantamentoButton');
    var limparLevantamento = document.getElementById('limparLevantamento');
    var inserirBase = document.getElementById('inserir_base');
    var exibirTabela = document.getElementById('exibirTabela');
    var tabelaSolicitarPeca = document.getElementById('tabela-solicitar-peca');
    var tabelaLevantamentoPeca = document.getElementById('tabela-levantamento-peca');
    var pecaLabel = document.getElementById('peca');
    var processoLabel = document.getElementById('processo');
    var descricao = document.getElementById('descricao');
    var carretaLabel = document.getElementById('carreta');
    var conjuntoLabel = document.getElementById('conjunto');
    var resultado = document.getElementById('resultado');
    var levant = document.getElementById('levant');
    var carretas_utilizadas = document.getElementById('carretas_utilizadas');
    var base_carretas = document.getElementById('base_carretas');

    if(carretasArray == '' || carretasArray.length == 0){
        alert("Erro ao encontrar carreta para essas datas")
        inputDate1.value = ''; // Limpa o valor do campo de data
        filtroPeca.value = ''; // Limpa a seleção de peça
        filtroProcesso.value = ''; // Limpa a seleção de processo
        filtroConjunto.value = ''; // Limpa a seleção de conjunto
        filtroProcesso.style.display = 'none';
        pecaLabel.style.display = 'none';
        descricao.style.display = 'none';
        processoLabel.style.display = 'none';
        carretaLabel.style.display = 'none';
        conjuntoLabel.style.display = 'none';
        col.style.display = 'block';
        exibirTabela.style.display = 'none';
        inputDate1.style.display = 'block';
        data_inicial.style.display = 'block';
        btnFiltrarLevantamento.style.display = 'block';
        btnFiltrar.style.display = 'none';
        limparLevantamento.style.display = 'none';
        levant.style.display = 'flex';
        inserirBase.style.display = 'none';
        tabelaSolicitarPeca.style.display = 'none';
        tabelaLevantamentoPeca.style.display = 'none';
        carretas_utilizadas.style.display = 'none';
        base_carretas.style.display = 'none';
        resultado.style.display = 'none';
        $('#loading-overlay').hide()
        return 
    } 
    
    const dataToSend = carretasArray.map((carreta, index) => ({
        carreta: carreta,
        quantidade_carretas: quantCellArray[index]
    }));
    // Realize uma requisição fetch para a rota /get_base_carretas
    fetch('/get_base_carretas', {
        method: 'POST', // Use o método POST para enviar dados
        headers: {
            'Content-Type': 'application/json' // Indique que você está enviando dados no formato JSON
        },
        body: JSON.stringify({ data: dataToSend })  // Converta o conjunto de carretas para um array e envie como JSON
    })
    .then(response => response.json())
    .then(data => {

        document.getElementById('resultado').innerHTML = data.df_combinado_html;

        // Adicionar data-label e remover espaços em branco
        const table = document.getElementById('responsive');

        if (table) {
            const headerRow = table.getElementsByTagName('thead')[0].getElementsByTagName('tr')[0];
            const cells = headerRow.getElementsByTagName('th');
            
            for (let j = 0; j < cells.length; j++) {
                const cell = cells[j];
                const labelText = cell.textContent.trim();

                // Atribuir o valor ao atributo data-label
                const rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
                for (let i = 0; i < rows.length; i++) {
                    const dataCell = rows[i].getElementsByTagName('td')[j];
                    dataCell.setAttribute('data-label', labelText);
                }
            }
        }
        
        setTimeout(function () {
            $("#loading-overlay").hide();
        },5000)
    })
    .catch(error => {
        setTimeout(function () {
            $("#loading-overlay").hide();
        },5000)
        console.error('Erro ao enviar carretas para o backend:', error);
        
        // Exiba um alerta informando que ocorreu um erro
    });
}

// Adicione um evento de entrada ao campo de intervalo de datas para chamar a função de filtro
dateRangeFilter.addEventListener('input', filtrarTabela);
const btnFiltrar = document.getElementById('levantamentoButton');
let limparFiltro = document.getElementById('limparLevantamento');
var inserirBase = document.getElementById('inserir_base');
var ocultButton = document.getElementById('ocultButton')

btnFiltrar.addEventListener('click', function(){
    filtrarTabela();
    tabelaLevantamentoPeca.style.display='none';
    carretas_utilizadas.style.display = 'none';
    base_carretas.style.display = 'block';
    carretaLabel.style.display='none';
    limparFiltro.style.display='block';
    inserirBase.style.display = 'block';
    filtroProcesso.style.display = 'none';
    filtroCarreta.style.display = 'none';
    peca.style.display='block';
    processo.style.display='none';
    conjunto.style.display='block';
    exibirTabela.style.display='block';
    resultado.style.display='block';
    descricao.style.display='block';
    ocultButton.style.display='block';
});

$(document).ready(function () {
    $('#filtroPeca').select2({
        width: '100%',
        dropdownParent: $('#modal_pesquisa_peca')
    });
});

$(document).ready(function () {
    $('#filtroDescricao').select2({
        width: '100%',
        dropdownParent: $('#modal_pesquisa_peca')
    });
});

$(document).ready(function () {
    $('#filtroConjunto').select2({
        width: '100%',
        dropdownParent: $('#modal_pesquisa_peca')
    });
});

$(document).ready(function() {
    $('#resultado').on('click', function() {
        $(this).focus();
    });
});