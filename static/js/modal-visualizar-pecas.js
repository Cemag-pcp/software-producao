$(document).ready(function() {
    // Quando o modal é mostrado
    $('#modal_visualizar_peca_solicitada').on('shown.bs.modal', function (e) {
        // Faça uma solicitação AJAX para buscar os dados do backend
        $.ajax({
            url: '/visualizar-pecas-solicitadas', // Substitua '/sua_rota_no_backend' pela URL correta
            type: 'GET',
            success: function(data) {
                // Manipule os dados recebidos e preencha a tabela
                const tableBody = $('#modal_visualizar_peca_solicitada .responsive-table tbody');
                tableBody.empty(); // Limpe a tabela antes de preencher os novos dados

                data.forEach(function(item) {
                    const row = $('<tr>');
                    
                    row.html(`
                        <td>${item[0]}</td>
                        <td>${item[1]}</td>
                        <td>${item[2]}</td>
                        <td>${item[3]}</td>
                        <td>${item[6]}</td>
                        <td>${item[7]}</td>
                        <td>${item[4]}</td>
                        <td>${item[8]}</td>
                        <td><button class="status">Feito</button></td>
                    `);
                    tableBody.append(row);
                });

                // Manipulador de eventos para os botões "status"
                tableBody.find("button.status").click(function() {
                    const row = $(this).closest("tr");
                    const chave = row.find("td:first-child").text();
                    
                    // Agora você tem os dados que deseja enviar para o backend
                    pecaConcluida(chave);
                });
            },
            error: function(error) {
                console.error('Erro na solicitação ao backend:', error);
            }
        });
    });
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
            // Lide com a resposta do backend, se necessário
            console.log("Resposta do backend:", data);
            
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
                            <td>${item[2]}</td>
                            <td>${item[3]}</td>
                            <td>${item[6]}</td>
                            <td>${item[7]}</td>
                            <td>${item[4]}</td>
                            <td>${item[8]}</td>
                            <td><button class="status">Feito</button></td>
                        `);
                        tableBody.append(row);
                    });
                    // Manipulador de eventos para os botões "status"
                    tableBody.find("button.status").click(function() {
                        const row = $(this).closest("tr");
                        const chave = row.find("td:first-child").text();
                        
                        // Agora você tem os dados que deseja enviar para o backend
                        pecaConcluida(chave);
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


document.addEventListener('DOMContentLoaded', function () {
    var btnSolicitada = document.getElementById('modal_visualizar_peca_solicitada');
    var btnFeita = document.getElementById('modal_visualizar_peca_feita');
  
    btnSolicitada.addEventListener('click', function () {
      btnSolicitada.classList.add('active');
      btnFeita.classList.remove('active');
    });
  
    btnFeita.addEventListener('click', function () {
      btnFeita.classList.add('active');
      btnSolicitada.classList.remove('active');
    });
  });
  