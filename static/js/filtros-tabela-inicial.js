// Arquivo contento scripts redireciondos para tabelas

//////////////////////////////////////////////////////////////////////// 

// Filtro para tabela inicial

const dataFilter = document.getElementById('dataFilter');
const carretasSelect = document.getElementById('carretasSelect');

// Função para formatar a data de yyyy-MM-dd para dd/MM/yyyy
function dataFormatada(dateString) {
    const parts = dateString.split("-");
    if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return "";
}

// Função para preencher o <select> com as carretas da data selecionada
function populateCarretasSelect(selectedDate) {
    const carretas = [...document.querySelectorAll('table tr')]
        .filter((row, index) => index !== 0)
        .filter(row => row.cells[0].textContent === dataFormatada(selectedDate))
        .map(row => row.cells[1].textContent);

    const uniqueCarretas = [...new Set(carretas)];

    carretasSelect.innerHTML = '<option>Todos</option>';
    uniqueCarretas.forEach(carreta => {
        const option = document.createElement('option');
        option.textContent = carreta;
        carretasSelect.appendChild(option);
    });
}

// Função para filtrar a tabela com base na data e no nome da carreta
function filtrarTabelaInicial() {
    const selectedDate = dataFilter.value;
    const selectedCarreta = carretasSelect.value;
    const rows = document.querySelectorAll('.table-3 tr');

    rows.forEach((row, index) => {
        if (index === 0) return; // Ignora o cabeçalho da tabela

        const dateCell = row.cells[0];
        const carretaCell = row.cells[1];

        const dateMatch = dateCell.textContent === dataFormatada(selectedDate) || selectedDate === "";
        const carretaMatch = carretaCell.textContent === selectedCarreta || selectedCarreta === "Todos";

        if (dateMatch && carretaMatch) {
            row.style.display = 'table-row';
        } else {
            row.style.display = 'none';
        }
    });

    populateCarretasSelect(selectedDate); // Preencher o <select> com base na data filtrada

    // Configurar o valor do <select> para o valor selecionado
    carretasSelect.value = selectedCarreta;
}

// Adicione um evento de alteração ao <select> para chamar a função de filtro
carretasSelect.addEventListener('change', filtrarTabelaInicial);

// Adicione um evento de entrada ao campo de data para chamar a função de filtro
dataFilter.addEventListener('input', filtrarTabelaInicial);

// Chame a função para preencher o <select> quando a página carregar
populateCarretasSelect(dataFilter.value);