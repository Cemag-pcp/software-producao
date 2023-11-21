document.addEventListener('DOMContentLoaded', function () {
    // Função para preencher as opções de um <select> com base nas colunas da tabela "resultado"
    function preencherOpcoesSelect(colunaIndex, selectId) {
      // Limpar as opções existentes no <select>
      limparSelect(selectId);
  
      var select = document.getElementById(selectId);
  
      // Adiciona uma opção vazia
      var optionVazia = document.createElement('option');
      optionVazia.value = '';
      optionVazia.text = '';
      select.add(optionVazia);
  
      var opcoes = [];
  
      // Percorre as linhas da tabela "resultado" e coleta as opções únicas da coluna especificada
      var tabelaResultado = document.getElementById('responsive');
      for (var i = 1; i < tabelaResultado.rows.length; i++) {
        var celula = tabelaResultado.rows[i].cells[colunaIndex].textContent;
        if (opcoes.indexOf(celula) === -1) {
          opcoes.push(celula);
        }
      }
  
      // Adiciona as opções ao elemento <select>
      for (var j = 0; j < opcoes.length; j++) {
        var option = document.createElement('option');
        option.value = opcoes[j];
        option.text = opcoes[j];
        select.add(option);
      }
    }
  
    // Função para limpar as opções de um <select>
    function limparSelect(selectId) {
      var select = document.getElementById(selectId);
      while (select.options.length > 0) {
        select.remove(0);
      }
    }
  
    // Adiciona um evento de clique ao botão "levantamentoButton"
    document.getElementById('levantamentoButton').addEventListener('click', function () {
      // Adiciona um atraso de 5 segundos antes de chamar a função para preencher as opções
      $("#loading-overlay").show();
      setTimeout(function () {
         try {
        preencherOpcoesSelect(0, 'filtroProcesso');
        preencherOpcoesSelect(1, 'filtroConjunto');
        preencherOpcoesSelect(2, 'filtroPeca');
        preencherOpcoesSelect(3, 'filtroDescricao');
        preencherOpcoesSelect(4, 'filtroCarreta');
        } catch (error) {
        // Exibe um alerta se ocorrer um erro
        alert('Não possui carretas para essa data');
        limparSelect('filtroProcesso');
        limparSelect('filtroConjunto');
        limparSelect('filtroPeca');
        limparSelect('filtroCarreta');
        limparSelect('filtroDescricao');
        }}, 3000); // 3000 milissegundos = 3 segundos
    });
});
  