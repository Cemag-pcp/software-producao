$(document).ready(function () {
    $('#levantamentoButton').on('click', function () {
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
            fillSelect('filtroConjunto', getColumnValues(tableData, 1));
            fillSelect('filtroPeca', getColumnValues(tableData, 0));
            fillSelect('filtroDescricao', getColumnValues(tableData, 2));
            fillSelect('filtroMateria', getColumnValues(tableData, 3));
            
            // Mostra a tabela
            $('#tableContainer').show();
        }, 6000); // 3000 milissegundos = 3 segundos
    });

    // Manipuladores de eventos para os selects
    $('#filtroConjunto').change(updateFilters);
    $('#filtroPeca').change(updateFilters);
    $('#filtroDescricao').change(updateFilters);
    $('#filtroMateria').change(updateFilters);

});


// Função para preencher um select com opções
function fillSelect(selectId, options, selectedValue) {
    var select = $('#' + selectId);
    select.empty(); // Limpa as opções existentes
    select.append('<option value="" hidden></option>'); // Adiciona a opção "Limpar filtro"
    select.append('<option value="" hidden>Limpar filtro</option>'); // Adiciona a opção "Limpar filtro"

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

    select.change(function() {
        var selectedText = $(this).find('option:selected').text();
        console.log(selectedText)
        
        if (selectedText === "Limpar filtro" || selectedText === "Sem filtro") {
            // Limpa o valor do filtro
            $(this).text("");
            // Faça qualquer outra ação necessária aqui
        }
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
    var filtroConjuntoValue = $('#filtroConjunto').val().toLowerCase();
    var filtroPecaValue = $('#filtroPeca').val().toLowerCase();
    var filtroDescricaoValue = $('#filtroDescricao').val().toLowerCase();
    var filtroMateriaValue = $('#filtroMateria').val().toLowerCase();

    // Obtém as linhas da tabela
    var table = $('#responsive');
    var rows = table.find('tbody tr');

    if(!table){
        alert("Tabela não encontrada")
    }

    var filteredData = [];

    // Itera pelas linhas da tabela
    rows.each(function () {
        var row = $(this);
        var conjuntoValue = row.find('td:eq(1)').text().toLowerCase();
        var pecaValue = row.find('td:eq(0)').text().toLowerCase();
        var descricaoValue = row.find('td:eq(2)').text().toLowerCase();
        var materiaValue = row.find('td:eq(3)').text().toLowerCase();

        // Verifica se a linha corresponde aos filtros
        var shouldDisplay =
            conjuntoValue.includes(filtroConjuntoValue) &&
            pecaValue.includes(filtroPecaValue) &&
            descricaoValue.includes(filtroDescricaoValue) &&
            materiaValue.includes(filtroMateriaValue)

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
    fillSelect('filtroConjunto', getColumnValues(filteredData, 1), filtroConjuntoValue);
    fillSelect('filtroPeca', getColumnValues(filteredData, 0), filtroPecaValue);
    fillSelect('filtroDescricao', getColumnValues(filteredData, 2), filtroDescricaoValue);
    fillSelect('filtroMateria', getColumnValues(filteredData, 3), filtroMateriaValue);

    return filteredData;
}
