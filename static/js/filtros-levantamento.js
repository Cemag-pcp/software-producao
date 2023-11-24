$(document).ready(function () {
    $('#levantamentoButton').click(function () {
        // Simular um delay de 3 segundos
        setTimeout(function () {
            // Obtém os dados da tabela
            var tableData = [];
            $('#responsive tbody tr').each(function () {
                var rowData = [];
                $(this).find('td').each(function () {
                    rowData.push($(this).text());
                });
                tableData.push(rowData);
            });

            // Preenche os selects com os dados da tabela
            fillSelect('filtroProcesso', getColumnValues(tableData, 0));
            fillSelect('filtroConjunto', getColumnValues(tableData, 1));
            fillSelect('filtroPeca', getColumnValues(tableData, 2));
            fillSelect('filtroDescricao', getColumnValues(tableData, 3));
            fillSelect('filtroCarreta', getColumnValues(tableData, 4));

            // Inicializa o Select2 para #filtroDescricao
            $('#filtroDescricao').select2({
                width: '100%',
            });

            // Mostra a tabela
            $('#tableContainer').show();
        }, 3000); // 3000 milissegundos = 3 segundos
    });

    // Manipulador de eventos para o botão de limpar filtros
    $('#limparLevantamento').click(function () {
        // Limpa os valores dos selects
        $('#filtroProcesso, #filtroConjunto, #filtroPeca, #filtroDescricao, #filtroCarreta').val('');

        // Chama a função updateFilters para reexibir todas as linhas na tabela
        updateFilters();
    });

    // Manipuladores de eventos para os selects
    $('#filtroProcesso').change(updateFilters);
    $('#filtroConjunto').change(updateFilters);
    $('#filtroPeca').change(updateFilters);
    $('#filtroDescricao').change(updateFilters);
    $('#filtroCarreta').change(updateFilters);

    // Função para preencher um select com opções
    function fillSelect(selectId, options, selectedValue) {
        var select = $('#' + selectId);
        select.empty(); // Limpa as opções existentes
        select.append('<option></option>'); // Adiciona uma opção em branco
        $.each(options, function (index, value) {
            var option = $('<option>', {
                value: value,
                text: value
            });

            if (value.toLowerCase() === selectedValue) {
                option.prop('selected', true);
            }

            select.append(option);
        });
    }

    // Função para obter os valores de uma coluna
    function getColumnValues(data, columnIndex) {
        var values = [];
        $.each(data, function (index, rowData) {
            if (rowData[columnIndex] && values.indexOf(rowData[columnIndex]) === -1) {
                values.push(rowData[columnIndex]);
            }
        });
        return values;
    }

    // Função para atualizar os filtros com base nos selects
    function updateFilters() {
        // Obtém os valores dos filtros
        var filtroProcessoValue = $('#filtroProcesso').val().toLowerCase();
        var filtroConjuntoValue = $('#filtroConjunto').val().toLowerCase();
        var filtroPecaValue = $('#filtroPeca').val().toLowerCase();
        var filtroDescricaoValue = $('#filtroDescricao').val().toLowerCase();
        var filtroCarretaValue = $('#filtroCarreta').val().toLowerCase();

        // Obtém as linhas da tabela
        var table = $('#responsive');
        var rows = table.find('tbody tr');

        var filteredData = [];

        // Itera pelas linhas da tabela
        rows.each(function () {
            var row = $(this);
            var processoValue = row.find('td:eq(0)').text().toLowerCase();
            var conjuntoValue = row.find('td:eq(1)').text().toLowerCase();
            var pecaValue = row.find('td:eq(2)').text().toLowerCase();
            var descricaoValue = row.find('td:eq(3)').text().toLowerCase();
            var carretaValue = row.find('td:eq(4)').text().toLowerCase();

            // Verifica se a linha corresponde aos filtros
            var shouldDisplay =
                processoValue.includes(filtroProcessoValue) &&
                conjuntoValue.includes(filtroConjuntoValue) &&
                pecaValue.includes(filtroPecaValue) &&
                descricaoValue.includes(filtroDescricaoValue) &&
                carretaValue.includes(filtroCarretaValue);

            // Se a linha corresponder aos filtros, adiciona os valores ao array de dados filtrados
            if (shouldDisplay) {
                var rowData = [];
                row.find('td').each(function () {
                    rowData.push($(this).text());
                });
                filteredData.push(rowData);
            }

            // Atualiza a exibição da linha conforme necessário
            row.css('display', shouldDisplay ? '' : 'none');
        });

        // Atualiza os selects com base nos dados filtrados
        fillSelect('filtroProcesso', getColumnValues(filteredData, 0), filtroProcessoValue);
        fillSelect('filtroConjunto', getColumnValues(filteredData, 1), filtroConjuntoValue);
        fillSelect('filtroPeca', getColumnValues(filteredData, 2), filtroPecaValue);
        fillSelect('filtroDescricao', getColumnValues(filteredData, 3), filtroDescricaoValue);
        fillSelect('filtroCarreta', getColumnValues(filteredData, 4), filtroCarretaValue);

        return filteredData;
    }
});
