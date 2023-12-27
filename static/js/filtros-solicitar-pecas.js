$('#filtroDataSolicitPeca, #filtroOrigemSolicitPeca').change(function() {
    const selectedDate = $('#filtroDataSolicitPeca').val();
    const selectedOrigem = $('#filtroOrigemSolicitPeca').val();

    if (selectedDate.includes(' - Invalid date')) {
        selectedDate = '';
    }
    
    filtrarTabelaSolicitadas(selectedDate, selectedOrigem);
});

function filtrarTabelaSolicitadas(selectedDate, selectedOrigem) {
    const rows = $('#modal_visualizar_peca_solicitada .responsive-table tbody tr');
    let tableIsEmpty = true;

    rows.each(function() {
        const linhaDataElement = $(this).find('td[data-label="Data da Carreta"]');
        const rowOrigem = $(this).find('td[data-label="Origem"]').text();
        const linhaData = linhaDataElement.text();

        console.log(selectedDate)

        // Verifica se a data e a origem correspondem aos critérios de filtro
        const dateMatches = selectedDate === '' || linhaData === selectedDate;
        const origemMatches = selectedOrigem === '' || rowOrigem === selectedOrigem;

        if (dateMatches && origemMatches) {
            // Atualize o conteúdo da célula com a data formatada
            linhaDataElement.text(linhaData);
            $(this).show();
            tableIsEmpty = false; // A tabela não está vazia
        } else {
            $(this).hide();
        }
    });
}

function formatDate(dateString) {
    if (!dateString) {
        return ''; // Retorna uma string vazia se a data for undefined
    }

    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
}

$(document).ready(function() {
    // Evento de alteração para todos os selects
    $('#filtroDataSolicitPeca').on('change', function() {
        // Exibir o overlay de loading
        $('#loading-overlay').show();
  
        // Ocultar o overlay de loading após 1 segundo
        setTimeout(function() {
            $('#loading-overlay').hide();
        }, 1000);
  
    });
});