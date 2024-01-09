function toggleTabela() {
    // Obtém a referência da tabela e do botão
    var tabela = document.getElementById('tabela-levantamento-peca');
    var carretas_utilizadas = document.getElementById('carretas_utilizadas');
    var botao = document.getElementById('exibirTabela');

    // Verifica o estado atual da tabela (se está visível ou não)
    var tabelaVisivel = tabela.style.display !== 'none';

    // Altera o estado da tabela e o texto do botão com base no estado atual
    if (tabelaVisivel) {
        tabela.style.display = 'none';
        carretas_utilizadas.style.display = 'none';
        botao.innerText = '+';
    } else {
        tabela.style.display = 'block';
        carretas_utilizadas.style.display = 'block';
        botao.innerText = '-';
    }
}

$(document).ready(function() {
    $('#filtroCarret').select2({
        placeholder: '',
        allowClear: true,
        width: '100%',
        });
});

document.getElementById('filtroProcesso').addEventListener('change', function() {
    var filtroCarreta = this.value.toLowerCase(); // Obtém o valor selecionado e converte para minúsculas
    var tabela = document.getElementById('resultado');
    var linhas = tabela.getElementsByTagName('tr');

    for (var i = 1; i < linhas.length; i++) { // Começa do índice 1 para ignorar o cabeçalho
        var colunaCarreta = linhas[i].getElementsByTagName('td')[0]; // Obtém a célula "Carreta" na linha atual

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

document.getElementById('filtroConjunto').addEventListener('change', function() {
    var filtroCarreta = this.value.toLowerCase(); // Obtém o valor selecionado e converte para minúsculas
    var tabela = document.getElementById('resultado');
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

document.getElementById('filtroPeca').addEventListener('change', function() {
    var filtroCarreta = this.value.toLowerCase(); // Obtém o valor selecionado e converte para minúsculas
    var tabela = document.getElementById('resultado');
    var linhas = tabela.getElementsByTagName('tr');

    for (var i = 1; i < linhas.length; i++) { // Começa do índice 1 para ignorar o cabeçalho
        var colunaCarreta = linhas[i].getElementsByTagName('td')[2]; // Obtém a célula "Carreta" na linha atual

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

document.getElementById('filtroMateria').addEventListener('change', function() {
    var filtroCarreta = this.value.toLowerCase(); // Obtém o valor selecionado e converte para minúsculas
    var tabela = document.getElementById('resultado');
    var linhas = tabela.getElementsByTagName('tr');

    for (var i = 1; i < linhas.length; i++) { // Começa do índice 1 para ignorar o cabeçalho
        var colunaCarreta = linhas[i].getElementsByTagName('td')[4]; // Obtém a célula "Carreta" na linha atual

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

document.getElementById('filtroDescricao').addEventListener('change', function() {
    var filtroCarreta = this.value.toLowerCase(); // Obtém o valor selecionado e converte para minúsculas
    var tabela = document.getElementById('resultado');
    var linhas = tabela.getElementsByTagName('tr');

    for (var i = 1; i < linhas.length; i++) { // Começa do índice 1 para ignorar o cabeçalho
        var colunaCarreta = linhas[i].getElementsByTagName('td')[3]; // Obtém a célula "Carreta" na linha atual

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




// // Wait for the DOM to be ready
// $(document).ready(function() {
//     // Function to populate select options from table data
//     function populateSelectOptions(tableId, selectId) {
//       // Get unique values from the specified column in the table
//       function getUniqueColumnValues(columnIndex) {
//         var uniqueValues = [];
//         $(tableId + " tbody tr").each(function() {
//           var cellValue = $(this).find("td:eq(" + columnIndex + ")").text().trim();
//           if (uniqueValues.indexOf(cellValue) === -1 && cellValue !== "") {
//             uniqueValues.push(cellValue);
//           }
//         });
//         return uniqueValues;
//       }

//       // Get the index of the column you want to populate the select with
//       var columnIndex;
//       if (selectId === "filtroPeca") {
//         columnIndex = 2; // Change this index according to your table structure
//       } else if (selectId === "filtroProcesso") {
//         columnIndex = 0; // Change this index according to your table structure
//       } else if (selectId === "filtroCarreta") {
//         columnIndex = 3; // Change this index according to your table structure
//       } else if (selectId === "filtroConjunto") {
//         columnIndex = 1; // Change this index according to your table structure
//       }

//       // Populate select options
//       var uniqueValues = getUniqueColumnValues(columnIndex);
//       var selectElement = $(selectId);
//       $.each(uniqueValues, function(index, value) {
//         selectElement.append("<option value='" + value + "'>" + value + "</option>");
//       });
//     }

//     // Populate select options on page load
//     populateSelectOptions("#responsive", "#filtroPeca");
//     populateSelectOptions("#responsive", "#filtroProcesso");
//     populateSelectOptions("#responsive", "#filtroCarreta");
//     populateSelectOptions("#responsive", "#filtroConjunto");
//   });