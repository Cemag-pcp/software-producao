// Filtro para tabela inicial
const dateRangeFilter = document.getElementById('inputDate1');

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
        const carretasSet = new Set();

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
                carretasSet.add(row.cells[1].textContent);
                row.style.display = 'table-row';
            } else {
                row.style.display = 'none';
            }
        });
        
        // Atualize o conteúdo do select com as carretas filtradas
        carretaSelect.innerHTML = '<option></option>' + Array.from(carretasSet).map(carreta => `<option>${carreta}</option>`).join('');
    }, 500); // Ajuste o tempo de espera conforme necessário
}
// Adicione um evento de entrada ao campo de intervalo de datas para chamar a função de filtro
dateRangeFilter.addEventListener('input', filterTable);
var tabelaLevantamentoPeca = document.getElementById('tabela-levantamento-peca');
var carretaLabel = document.getElementById('carreta')
const btnFiltrar = document.getElementById('levantamentoButton');
btnFiltrar.addEventListener('click', function(){
    filterTable();
    tabelaLevantamentoPeca.style.display='block';
    carretaLabel.style.display='block';
});