$('#filtroDataSolicitPeca, #filtroOrigemSolicitPeca, #filtroMateriaPrima').change(function() {
    let selectedDate = $('#filtroDataSolicitPeca').val();
    const selectedOrigem = $('#filtroOrigemSolicitPeca').val();
    const selectedMateriaPrima = $('#filtroMateriaPrima').val();

    if (selectedDate.includes(' - Invalid date')) {
        selectedDate = '';
    }

    filtrarTabelaSolicitadas(selectedDate, selectedOrigem, selectedMateriaPrima);
});

function filtrarTabelaSolicitadas(selectedDate, selectedOrigem, selectedMateriaPrima) {
    const rows = $('#modal_visualizar_peca_solicitada .responsive-table tbody tr');
    let tableIsEmpty = true; // Alterado para 'let'

    rows.each(function() {
        const linhaDataElement = $(this).find('td[data-label="Data da Carreta"]');
        const rowOrigem = $(this).find('td[data-label="Origem"]').text();
        const rowMateriaPrima = $(this).find('td[data-label="Matéria Prima"]').text();
        const linhaData = linhaDataElement.text();

        // Verifica se a data, origem e matéria prima correspondem aos critérios de filtro
        const dateMatches = selectedDate === '' || linhaData === selectedDate;
        const origemMatches = selectedOrigem === '' || rowOrigem === selectedOrigem;
        const materiaPrimaMatches = selectedMateriaPrima === '' || rowMateriaPrima === selectedMateriaPrima;

        if (dateMatches && origemMatches && materiaPrimaMatches) {
            // Atualize o conteúdo da célula com a data formatada
            linhaDataElement.text(linhaData);
            $(this).show();
            tableIsEmpty = false; // A tabela não está vazia
        } else {
            $(this).hide();
        }
    });
}

function preencherFiltroMateriaPrima() {
    $('#filtroMateriaPrima').empty();

    $('#filtroMateriaPrima').append($('<option>', {
        value: '',
        text: 'Sem Filtro'
    }));
    
    const uniqueOptions = []; // Array para armazenar opções únicas
    
    $('#modal_visualizar_peca_solicitada .responsive-table tbody tr').each(function() {
        // Encontre a célula correspondente à Matéria Prima
        const materiaPrima = $(this).find('td[data-label="Matéria Prima"]').text();
    
        // Verifique se a opção já está na lista
        if (!uniqueOptions.includes(materiaPrima)) {
            // Adicione a opção à lista única
            uniqueOptions.push(materiaPrima);
    
            // Adicione a opção ao filtro de Matéria Prima
            $('#filtroMateriaPrima').append($('<option>', {
                value: materiaPrima,
                text: materiaPrima
            }));
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