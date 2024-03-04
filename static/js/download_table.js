function downloadTable() {
    const rows = $('#tabela-visualizar-peca tbody tr:visible');
    const data = [];
    const header = [];

    // Obter cabeçalho
    $('#tabela-visualizar-peca th:not(.botao-column)').each(function () {
        header.push($(this).text());
    });
    data.push(header);

    // Obter dados das linhas filtradas, excluindo a última coluna
    rows.each(function () {
        const rowData = [];
        $(this).find('td:not(.botao-column)').each(function () {
            rowData.push($(this).text());
        });
        data.push(rowData);
    });

    // Criar workbook e worksheet
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Criar e baixar arquivo XLSX
    XLSX.writeFile(wb, 'levantamento.xlsx');
}
