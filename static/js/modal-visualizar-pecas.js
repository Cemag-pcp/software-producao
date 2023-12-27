$(document).ready(function() {
    // Quando o modal é mostrado
    $('#modal_visualizar_peca_solicitada').on('shown.bs.modal', function (e) {
        // Simular o clique no botão ao abrir o modal
        $('#modal_visualizar_peca_solicitada_input').trigger('click');
    });

    // Quando o botão "Visualizar Peças Solicitadas" é clicado
    $('#modal_visualizar_peca_solicitada_input').click(function() {
        $('#tabela-visualizar-peca th.botao-column').show();
        $('#tabela-visualizar-peca td.botao-column').show();
        $("#loading-overlay").show();
        // Faça uma solicitação AJAX para buscar os dados do backend
        $.ajax({
            url: '/visualizar-pecas-solicitadas', // Substitua '/sua_rota_no_backend' pela URL correta
            type: 'GET',
            success: function(data) {
                // Manipule os dados recebidos e preencha a tabela
                $("#loading-overlay").hide();
                const tableBody = $('#modal_visualizar_peca_solicitada .responsive-table tbody');
                tableBody.empty(); // Limpe a tabela antes de preencher os novos dados

                data.forEach(function(item) {
                    const row = $('<tr>');
                    
                    row.html(`
                        <td data-label="Data">${item[1]}</td>
                        <td data-label="Data da Carreta">${item[11]}</td>
                        <td data-label="Código">${item[3]}</td>
                        <td data-label="Descrição">${item[6]}</td>
                        <td data-label="Conjunto">${item[7]}</td>
                        <td data-label="Quantidade">${item[4]}</td>
                        <td data-label="Observação">${item[8]}</td>
                        <td data-label="Origem">${item[9]}</td>
                        <td><button class="status">Feito</button></td>
                    `);
                    tableBody.append(row);
                });
            },
            error: function(error) {
                console.error('Erro na solicitação ao backend:', error);
            }
        });
    });
});

$('#modal_visualizar_peca_feita_input').click(function() {
    // Quando o modal é mostrado
        // Faça uma solicitação AJAX para buscar os dados do backend
        $("#loading-overlay").show();
        $('#tabela-visualizar-peca th.botao-column').hide();
        $('#tabela-visualizar-peca td.botao-column').hide();
        $.ajax({
            url: '/visualizacao-peca-concluida', // Substitua '/sua_rota_no_backend' pela URL correta
            type: 'GET',
            success: function(data) {
                $("#loading-overlay").hide();
                // Manipule os dados recebidos e preencha a tabela
                const tableBody = $('#modal_visualizar_peca_solicitada .responsive-table tbody');
                tableBody.empty(); // Limpe a tabela antes de preencher os novos dados

                data.forEach(function(item) {
                    const row = $('<tr>');
                    
                    row.html(`
                    <td data-label="Data">${item[1]}</td>
                    <td data-label="Data da Carga">${item[11]}</td>
                    <td data-label="Carreta">${item[2]}</td>
                    <td data-label="Código">${item[3]}</td>
                    <td data-label="Descrição">${item[6]}</td>
                    <td data-label="Conjunto">${item[7]}</td>
                    <td data-label="Quantidade">${item[4]}</td>
                    <td data-label="Observação">${item[8]}</td>
                    <td data-label="Origem">${item[9]}</td>
                    `);
                    tableBody.append(row);
                });

                // Manipulador de eventos para os botões "status"
                tableBody.find("button.status").click(function() {
                    const row = $(this).closest("tr");
                    const chave = row.find("td:first-child").text();
                    
                    // Agora você tem os dados que deseja enviar para o backend
                });
            },
            error: function(error) {
                console.error('Erro na solicitação ao backend:', error);
            }
        });
});

// Função para manipular eventos de clique nos botões "status"
function handleStatusButtonClick() {
    const row = $(this).closest("tr");
    const chave = row.find("td:first-child").text();

    // Agora você tem os dados que deseja enviar para o backend
    pecaConcluida(chave);
}

 // Quando o modal é mostrado
 $('#modal_visualizar_peca_solicitada').on('shown.bs.modal', function (e) {
    // Adicionar manipulador de eventos para os botões "status"
    $('#modal_visualizar_peca_solicitada .responsive-table tbody').on("click", "button.status", handleStatusButtonClick);
});

// Quando o modal é mostrado
$('#modal_visualizar_peca_feita').on('shown.bs.modal', function (e) {
    // Adicionar manipulador de eventos para os botões "status"
    $('#modal_visualizar_peca_feita .responsive-table tbody').on("click", "button.status", handleStatusButtonClick);
});

function pecaConcluida(chave) {
    $("#loading-overlay").show();
    // Faça uma solicitação para enviar os dados para o backend
    fetch("/peca-concluida", {
        method: "POST",
        headers: {
            "Content-Type": "application/json", // Defina o Content-Type para application/json
        },
        body: JSON.stringify({
            chave: chave,
        }),
    })
        .then(response => response.json())
        .then(data => {
            // Após o sucesso, faça uma nova solicitação para buscar os dados atualizados
            $.ajax({
                url: '/visualizar-pecas-solicitadas', // Substitua '/sua_rota_no_backend' pela URL correta
                type: 'GET',
                success: function(newData) {
                    $("#loading-overlay").hide();
                    // Manipule os dados recebidos e atualize a tabela no modal
                    const tableBody = $('#modal_visualizar_peca_solicitada .responsive-table tbody');
                    tableBody.empty(); // Limpe a tabela antes de preencher os novos dados

                    newData.forEach(function(item) {
                        const row = $('<tr>');
                        row.html(`
                            <td>${item[0]}</td>
                            <td>${item[1]}</td>
                            <td>${item[11]}</td>
                            <td>${item[2]}</td>
                            <td>${item[3]}</td>
                            <td>${item[6]}</td>
                            <td>${item[7]}</td>
                            <td>${item[4]}</td>
                            <td>${item[8]}</td>
                            <td>${item[9]}</td>
                            <td><button class="status">Feito</button></td>
                        `);
                        tableBody.append(row);
                    });
                    // Manipulador de eventos para os botões "status"
                    tableBody.find("button.status").click(function() {
                        const row = $(this).closest("tr");
                        const chave = row.find("td:first-child").text();
                        
                        // Agora você tem os dados que deseja enviar para o backend
                    });
                },
                error: function(error) {
                    $("#loading-overlay").hide();
                    console.error('Erro na solicitação ao backend:', error);
                }
            });
        })
        .catch(error => {
            $("#loading-overlay").hide();
            console.error("Erro ao enviar os dados para o backend.", error);
        });
}


