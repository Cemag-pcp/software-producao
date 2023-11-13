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

    const [startDate, endDate] = dateRangeParts;
    return { startDate, endDate };
}

// Função para formatar a data de yyyy-MM-dd para dd/MM/yyyy
function formatDate(dateString) {
    const parts = dateString.split("-");
    if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return "";
}

// Função para filtrar a tabela com base no intervalo de datas
function filterTable() {
    const dateRange = dateRangeFilter.value;
    const { startDate, endDate } = parseDateRange(dateRange);
    const rows = document.querySelectorAll('.responsive-table1 tbody tr');

    rows.forEach(row => {
        const dateCell = row.cells[0];
        const rowDate = formatDate(dateCell.textContent);
        const dateMatch = (rowDate >= startDate && rowDate <= endDate) || (startDate === "" && endDate === "");

        if (dateMatch) {
            row.style.display = 'table-row';
        } else {
            row.style.display = 'none';
        }
    });
}

// Adicione um evento de entrada ao campo de intervalo de datas para chamar a função de filtro
dateRangeFilter.addEventListener('input', filterTable);

// Chame a função de filtro quando a página carregar
filterTable();
