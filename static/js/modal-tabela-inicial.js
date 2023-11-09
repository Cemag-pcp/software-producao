// Arquivo com scripts referente ao modal da tela inicial

// Recupere os botões do modal
const modalButtons = document.querySelectorAll(".modal-button");
const modal = document.getElementById("modal_programacao");
const closeModal = document.getElementById("closeModal");
const modalContent = document.querySelector(".modal-content");
const modalChave = document.getElementById("modalChave");
const spanCarreta = document.getElementById("spanCarreta");
const conjuntosContainer = document.querySelector(".conjuntos");
const setorLogadoInput = document.getElementById("setor_logado");
const username = document.getElementById("setor_logado");
// const botaoSolicitarPeca = document.getElementById("solicitar_peca");       

// Quando um botão do modal for clicado, exiba o modal com a chave associada

modalButtons.forEach(button => {
    button.addEventListener("click", function () {
        const chave = this.getAttribute("data-chave").replace("/", "");
        const carreta = this.getAttribute("data-carreta");
        modalChave.textContent = chave;
        spanCarreta.textContent = carreta;
        
        modal.style.display = "block";

        // Limpe os checkboxes anteriores
        conjuntosContainer.innerHTML = '';

        // Adicione checkboxes para conjuntos e setores
        fetch(`/resgatar-checkbox/${chave}`)
            .then(response => response.json())
            .then(data => {
                conjuntosContainer.innerHTML += `
                <section class="table__body2">
                <table class='responsive-table'>
                    <tr>
                        <th class="cabecalho">Conjuntos</th>
                        <th class="cabecalho">Solda</th>
                        <th class="cabecalho">Montagem</th>
                        <th class="cabecalho">Pintura</th>
                    </tr>
                    <tr>
                        <td>Caçamba / Plataforma</td>
                        <td><input type="checkbox" id="cacplat_solda" ${setorLogadoInput.value === "Solda" ? '' : 'disabled'}></td>
                        <td><input type="checkbox" id="cacplat_montagem" ${setorLogadoInput.value === "Montagem" ? '' : 'disabled'}></td>
                        <td><input type="checkbox" id="cacplat_pintura" ${setorLogadoInput.value === "Pintura" ? '' : 'disabled'}></td>
                    </tr>
                    <tr>
                        <td>Dianteira</td>
                        <td><input type="checkbox" id="diant_solda" ${setorLogadoInput.value === "Solda" ? '' : 'disabled'}></td>
                        <td><input type="checkbox" id="diant_montagem" ${setorLogadoInput.value === "Montagem" ? '' : 'disabled'}></td>
                        <td><input type="checkbox" id="diant_pintura" ${setorLogadoInput.value === "Pintura" ? '' : 'disabled'}></td>
                    </tr>
                    <tr>
                        <td>Lateral</td>
                        <td><input type="checkbox" id="lat_solda" ${setorLogadoInput.value === "Solda" ? '' : 'disabled'}></td>
                        <td><input type="checkbox" id="lat_montagem" ${setorLogadoInput.value === "Montagem" ? '' : 'disabled'}></td>
                        <td><input type="checkbox" id="lat_pintura" ${setorLogadoInput.value === "Pintura" ? '' : 'disabled'}></td>
                    </tr>
                    <tr>
                        <td>Traseira</td>
                        <td><input type="checkbox" id="tras_solda" ${setorLogadoInput.value === "Solda" ? '' : 'disabled'}></td>
                        <td><input type="checkbox" id="tras_montagem" ${setorLogadoInput.value === "Montagem" ? '' : 'disabled'}></td>
                        <td><input type="checkbox" id="tras_pintura" ${setorLogadoInput.value === "Pintura" ? '' : 'disabled'}></td>
                    </tr>
                    <tr>
                        <td>Chassi</td>
                        <td><input type="checkbox" id="chass_solda" ${setorLogadoInput.value === "Solda" ? '' : 'disabled'}></td>
                        <td><input type="checkbox" id="chass_montagem" ${setorLogadoInput.value === "Montagem" ? '' : 'disabled'}></td>
                        <td><input type="checkbox" id="chass_pintura" ${setorLogadoInput.value === "Pintura" ? '' : 'disabled'}></td>
                    </tr>
                    <tr>
                        <td>Içamento</td>
                        <td><input type="checkbox" id="icam_solda" ${setorLogadoInput.value === "Solda" ? '' : 'disabled'}></td>
                        <td><input type="checkbox" id="icam_montagem" ${setorLogadoInput.value === "Montagem" ? '' : 'disabled'}></td>
                        <td><input type="checkbox" id="icam_pintura" ${setorLogadoInput.value === "Pintura" ? '' : 'disabled'}></td>
                    </tr>
                    <tr>
                        <td>Eixo</td>
                        <td><input type="checkbox" id="eixo_solda" ${setorLogadoInput.value === "Solda" ? '' : 'disabled'}></td>
                        <td><input type="checkbox" id="eixo_montagem" ${setorLogadoInput.value === "Montagem" ? '' : 'disabled'}></td>
                        <td><input type="checkbox" id="eixo_pintura" ${setorLogadoInput.value === "Pintura" ? '' : 'disabled'}></td>
                    </tr>
                    <tr>
                        <td>SupE</td>
                        <td><input type="checkbox" id="supe_solda" ${setorLogadoInput.value === "Solda" ? '' : 'disabled'}></td>
                        <td><input type="checkbox" id="supe_montagem" ${setorLogadoInput.value === "Montagem" ? '' : 'disabled'}></td>
                        <td><input type="checkbox" id="supe_pintura" ${setorLogadoInput.value === "Pintura" ? '' : 'disabled'}></td>
                    </tr>
                    <tr>
                        <td>5R</td>
                        <td><input type="checkbox" id="5r_solda" ${setorLogadoInput.value === "Solda" ? '' : 'disabled'}></td>
                        <td><input type="checkbox" id="5r_montagem" ${setorLogadoInput.value === "Montagem" ? '' : 'disabled'}></td>
                        <td><input type="checkbox" id="5r_pintura" ${setorLogadoInput.value === "Pintura" ? '' : 'disabled'}></td>
                    </tr>
                    <tr>
                        <td>Cilindro</td>
                        <td><input type="checkbox" id="cilindro_solda" ${setorLogadoInput.value === "Solda" ? '' : 'disabled'}></td>
                        <td><input type="checkbox" id="cilindro_montagem" ${setorLogadoInput.value === "Montagem" ? '' : 'disabled'}></td>
                        <td><input type="checkbox" id="cilindro_pintura" ${setorLogadoInput.value === "Pintura" ? '' : 'disabled'}></td>
                    </tr>
                    <tr>
                        <td>Fx Molas</td>
                        <td><input type="checkbox" id="fx_solda" ${setorLogadoInput.value === "Solda" ? '' : 'disabled'}></td>
                        <td><input type="checkbox" id="fx_montagem" ${setorLogadoInput.value === "Montagem" ? '' : 'disabled'}></td>
                        <td><input type="checkbox" id="fx_pintura" ${setorLogadoInput.value === "Pintura" ? '' : 'disabled'}></td>
                    </tr>
                </table>   
                </section>
                `;

                // Marque os checkboxes com base nos dados recebidos
                data.forEach(tuple => {
                    const conjunto = tuple[0];
                    const value = tuple[1] === 'true';
                  
                    const checkbox = document.getElementById(conjunto);
                  
                    if (checkbox) {
                      checkbox.checked = value;
                    }
                });
            })
            // Erro ao buscar chave do item, caso a chave seja vazia.
            .catch(error => {
                console.error("Erro ao buscar dados dos checkboxes.", error);
                modal.style.display = "none";
                alert("Item sem número de série");
            });
    });
});

// Quando o botão "Fechar" é clicado, esconda o modal
closeModal.addEventListener("click", function () {
    modal.style.display = "none";
});

// Quando o usuário clica fora do modal, esconda-o
window.addEventListener("click", function (event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

// Quando o botão "Enviar" é clicado, colete os dados dos checkboxes
enviarButton.addEventListener("click", function () {
    $('#loading-overlay').show();
    const chave = modalChave.textContent;
    console.log(chave);
    const setorSelecionado = setorLogadoInput.value; // Obtenha o conjunto selecionado dinamicamente
    const conjuntosSelecionados = [];
    const checkboxData = [];

    conjuntosContainer.querySelectorAll("input[type='checkbox']").forEach(checkbox => {
        if (!checkbox.disabled) {
            let state; // Declare a variable outside of the if/else block
            if (checkbox.checked) {
                state = 'true'; // Assign the value 'true'
            } else {
                state = 'false'; // Assign the value 'false'
            }
    
            const setor = checkbox.id.replace(setorSelecionado + "_", "");
            conjuntosSelecionados.push(setor);
            checkboxData.push(state);
        }
    });

    // Crie um objeto com os dados a serem enviados
    const data = {
        chave: chave,
        setor: setorSelecionado,
        conjunto: conjuntosSelecionados,
        state: checkboxData
    };

    // Realize a solicitação POST
    fetch("/receber-checkbox", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            $('#loading-overlay').hide();
            // Lida com a resposta bem-sucedida
            console.log("Dados enviados com sucesso!");
            modal.style.display = "none";
        } else {
            $('#loading-overlay').hide();
            // Lida com erros na resposta
            console.error("Erro ao enviar dados.");
        }
    }).catch(error => {
        $('#loading-overlay').hide();
        // Lida com erros na solicitação
        console.error("Erro na solicitação:", error);
    });
});


// Script para verificar se usuario logado for Erica, Estamparia ou Corte
// e mostrar o botão de "Solicitar peças" ou "Visualizar peças solicitadas"
document.addEventListener("DOMContentLoaded", function() {
    const solicitarPecasButton = document.getElementById("solicitarPecasButton");
    const setorLogadoInput = document.getElementById("setor_logado");

    if (setorLogadoInput.value === "Erica") {
        // Tornar o botão visível se o usuário for "Erica"
        solicitarPecasButton.style.display = "block";
    }

    const visualizarPecasSolicitadas = document.getElementById("visualizarPecasSolicitadas");

    if (setorLogadoInput.value === "Estamparia" || setorLogadoInput.value === "Corte" || setorLogadoInput.value === "Erica") {
        // Tornar o botão visível se o usuário for "Erica"
        visualizarPecasSolicitadas.style.display = "block";
    }

});

// Script para verificar se usuario logado for Corte ou Estamparia
// e mostrar o botão de "Verificar peças solicitadas"
document.addEventListener("DOMContentLoaded", function() {
    const selectMudarSetorEstamparia = document.getElementById("mudarSetorEstamparia");
    const setorLogadoInput = document.getElementById("setor_logado");

    if (setorLogadoInput.value === "Estamparia" || setorLogadoInput.value === "Corte") {
        // Tornar o botão visível se o usuário for "Erica"
        selectMudarSetorEstamparia.style.display = "block";
    }

    const selectMudarSetorSolda = document.getElementById("mudarSetorSolda");

    if (setorLogadoInput.value === "Solda" || setorLogadoInput.value === "Montagem") {
        // Tornar o botão visível se o usuário for "Erica"
        selectMudarSetorSolda.style.display = "block";
    }

    const botaoSolicitarPeca = document.getElementById("solicitar_peca");

    if (setorLogadoInput.value === "Solda" || setorLogadoInput.value === "Montagem") {
        botaoSolicitarPeca.style.display = "block"; // Torna o botão visível
    } else {
        botaoSolicitarPeca.style.display = "none"; // Oculta o botão (caso deseje)
    }

});


document.addEventListener("DOMContentLoaded", function() {
    const mudarSetorSoldaSelect = document.getElementById("mudarSetorSolda");

    mudarSetorSoldaSelect.addEventListener("change", function() {
        const selectedValue = mudarSetorSoldaSelect.value;

        // Armazene o valor selecionado em localStorage
        localStorage.setItem("selectedSetor", selectedValue);

        // Redirecionar com base na seleção
        if (selectedValue === "Solda") {
            window.location.href = "/Solda";
        } else if (selectedValue === "Montagem") {
            window.location.href = "/Montagem";
        }
    });

});


document.addEventListener("DOMContentLoaded", function() {
    const mudarSetorEstamparia = document.getElementById("mudarSetorEstamparia");

    mudarSetorEstamparia.addEventListener("change", function() {
        const selectedValue = mudarSetorEstamparia.value;

        // Armazene o valor selecionado em localStorage
        localStorage.setItem("selectedSetor", selectedValue);

        // Redirecionar com base na seleção
        if (selectedValue === "Estamparia") {
            window.location.href = "/Estamparia";
        } else if (selectedValue === "Corte") {
            window.location.href = "/Corte";
        }
    });


});


