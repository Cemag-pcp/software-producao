// Filtro para tabela inicial
const dateRangeFilter = document.getElementById('inputDate1');
let tabelaLevantamentoPeca = document.getElementById('tabela-levantamento-peca');
let carretaLabel = document.getElementById('carreta');
let peca = document.getElementById('peca');
let processo = document.getElementById('processo');
let conjunto = document.getElementById('conjunto');
let exibirTabela = document.getElementById('exibirTabela');

// Função para formatar o intervalo de datas
function parseDateRange(dateRange) {
    const dateRangeParts = dateRange.split(" - ");

    // Log para verificar o valor de dateRange e dateRangeParts
    console.log("Valor de dateRange:", dateRange);
    console.log("Valor de dateRangeParts:", dateRangeParts);

    // Verifique se o formato é válido
    if (dateRangeParts.length !== 2) {
        console.error("Formato de data inválido:", dateRange);
        return { startDate: null, endDate: null };
    }

    const [startDateString, endDateString] = dateRangeParts;
    const startDate = formatDate(startDateString);
    const endDate = formatDate(endDateString);

    return { startDate, endDate };
}

// Função para formatar a data de yyyy-MM-dd para dd/MM/yyyy
function formatDate(dateString) {
    const parts = dateString.split("/");
    if (parts.length === 3) {
        return new Date(parts[2], parts[1] - 1, parts[0]);
    }
    return null;
}

let filterTimer;

// Função para filtrar a tabela com base no intervalo de datas
function filterTable() {
    // Limpe o temporizador existente, se houver
    clearTimeout(filterTimer);

    // Configure um novo temporizador para aguardar 500 milissegundos (ou ajuste conforme necessário)
    filterTimer = setTimeout(() => {
        const dateRange = dateRangeFilter.value;
        const { startDate, endDate } = parseDateRange(dateRange);
        const rows = document.querySelectorAll('.responsive-table1 tbody tr');
        const carretaSelect = document.getElementById('filtroCarreta');

        // Inicialize um conjunto para armazenar carretas únicas
        const carretasArray = new Set();
        const quantCellArray = [];

        // Converta as linhas em um array para facilitar a ordenação
        const rowsArray = Array.from(rows);

        // Ordenar as linhas com base nas datas
        rowsArray.sort((a, b) => {
            const dateA = formatDate(a.cells[0].textContent);
            const dateB = formatDate(b.cells[0].textContent);

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
            const rowDate = formatDate(dateCell.textContent);

            // Verifique se a data da linha está dentro do intervalo selecionado
            const dateMatch = (rowDate >= startDate && rowDate <= endDate) || (startDate === "" && endDate === "");

            if (dateMatch) {
                // Adicione a carreta ao conjunto
                carretasArray.add(row.cells[1].textContent);
                console.log(carretasArray)
                quantCellArray.push(row.cells[2].textContent);
                row.style.display = 'table-row';
            } else {
                row.style.display = 'none';
            }
        });
        
        // Atualize o conteúdo do select com as carretas filtradas
        carretaSelect.innerHTML = '<option></option>' + Array.from(carretasArray).map(carreta => `<option>${carreta}</option>`).join('');
        enviarCarretasParaBackend(carretasArray, quantCellArray);
    }, 500); // Ajuste o tempo de espera conforme necessário
}

function enviarCarretasParaBackend(carretas,quantidade) {
    $("#loading-overlay").show();
    const carretasArray = Array.from(carretas);
    const quantCellArray = Array.from(quantidade);
    
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
        // Faça algo com a resposta do servidor, se necessário
        $("#loading-overlay").hide();
        console.log('Resposta do servidor:', data);

        // Exiba o HTML na sua página
        document.getElementById('resultado').innerHTML = data.df_combinado_html;
    })
    .catch(error => {
        $("#loading-overlay").hide();
        console.error('Erro ao enviar carretas para o backend:', error);
        
        // Exiba um alerta informando que ocorreu um erro
        alert('Erro ao processar as carretas. Verifique se há carretas para a data selecionada.');
    });
}

// Adicione um evento de entrada ao campo de intervalo de datas para chamar a função de filtro
dateRangeFilter.addEventListener('input', filterTable);
const btnFiltrar = document.getElementById('levantamentoButton');
btnFiltrar.addEventListener('click', function(){
    filterTable();
    tabelaLevantamentoPeca.style.display='none';
    carretaLabel.style.display='block';
    peca.style.display='block';
    processo.style.display='block';
    conjunto.style.display='block';
    exibirTabela.style.display='block';
});

document.getElementById('filtroCarreta').addEventListener('change', function() {
    var filtroCarreta = this.value.toLowerCase(); // Obtém o valor selecionado e converte para minúsculas
    var tabela = document.getElementById('tabela-levantamento-peca');
    var linhas = tabela.getElementsByTagName('tr');

    for (var i = 1; i < linhas.length; i++) { // Começa do índice 1 para ignorar o cabeçalho
        var colunaCarreta = linhas[i].getElementsByTagName('td')[1]; // Obtém a célula "Carreta" na linha atual

        if (colunaCarreta) {
            var valorCarreta = colunaCarreta.textContent || colunaCarreta.innerText;

            // Converte o valor da célula para minúsculas e verifica se corresponde ao filtro
            if (valorCarreta.toLowerCase().indexOf(filtroCarreta) > -1) {
                linhas[i].style.display = ''; // Exibe a linha se houver correspondência
            } else {
                linhas[i].style.display = 'none'; // Oculta a linha se não houver correspondência
            }
        }
    }
});