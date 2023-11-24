new MultiSelectTag('ordemproducao', {
    rounded: true,    // default true
    shadow: true,      // default false
    placeholder: 'Pesquisar...',  // default Search...
    onChange: function (values) {
        console.log(values)
    }
})

new MultiSelectTag('filtroSelect', {
    rounded: true,    // default true
    shadow: true,      // default false
    placeholder: 'Pesquisar...',  // default Search...
    onChange: function (values) {
        console.log(values)
    }
})

document.addEventListener("DOMContentLoaded", function() {
    const filtrarButton = document.getElementById("filtrarOrdem");
    filtrarButton.addEventListener("click", function() {
        const select = document.getElementById("ordemproducao");
        const selectedValues = Array.from(select.selectedOptions).map(option => option.value.trim());

        // Seleciona a tabela com o título "Ordem de Produção"
        const tabelaOrdemProducao = document.querySelector(".responsive-table"); // A segunda tabela

        // Seleciona apenas as linhas da tabela "Ordem de Produção"
        const tableRows = tabelaOrdemProducao.querySelectorAll(".table__body tbody tr");
        tableRows.forEach(row => {
            const codigo = row.querySelector("td:nth-of-type(2)").textContent;
            if (selectedValues.length === 0 || selectedValues.includes(codigo)) {
                row.style.display = "table-row";
            } else {
                row.style.display = "none";
            }
        });
    });
});
