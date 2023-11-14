document.addEventListener('DOMContentLoaded', function () {
    var btnSolicitada = document.getElementById('modal_visualizar_peca_solicitada_input');
    var btnFeita = document.getElementById('modal_visualizar_peca_feita_input');
  
    btnSolicitada.addEventListener('click', function () {
      btnSolicitada.classList.add('active');
      btnFeita.classList.remove('active');
    });
  
    btnFeita.addEventListener('click', function () {
      btnFeita.classList.add('active');
      btnSolicitada.classList.remove('active');
    });
  });

  document.addEventListener('DOMContentLoaded', function () {
    var btnPesquisa = document.getElementById('modal_pesquisa_peca_label');
    var btnLevantamento = document.getElementById('modal_levantamento_peca_label');
    var inputDate1 = document.getElementById('inputDate1');
    var col = document.getElementById('coluna_data');
    var data_inicial = document.getElementById('data_inicial');
    var btnFiltrar = document.getElementById('btnFiltrar');
    var filtroPeca = document.getElementById('filtroPeca');
    var filtroProcesso = document.getElementById('filtroProcesso');
    var filtroCarreta = document.getElementById('filtroCarreta');
    var filtroConjunto = document.getElementById('filtroConjunto');
    var btnFiltrarLevantamento = document.getElementById('levantamentoButton');
    var tabelaSolicitarPeca = document.getElementById('tabela-solicitar-peca');
    var tabelaLevantamentoPeca = document.getElementById('tabela-levantamento-peca');
    var table_levantamento = document.getElementById('table-levantamento');
    var pecaLabel = document.getElementById('peca')
    var processoLabel = document.getElementById('processo')
    var carretaLabel = document.getElementById('carreta')
    var conjuntoLabel = document.getElementById('conjunto')

    btnPesquisa.addEventListener('click', function () {
        btnPesquisa.classList.add('active');
        btnLevantamento.classList.remove('active');
        inputDate1.value = ''; // Limpa o valor do campo de data
        filtroPeca.value = ''; // Limpa a seleção de peça
        filtroProcesso.value = ''; // Limpa a seleção de processo
        filtroCarreta.value = ''; // Limpa a seleção de carreta
        filtroConjunto.value = ''; // Limpa a seleção de conjunto
        pecaLabel.style.display = 'block';
        processoLabel.style.display = 'block';
        carretaLabel.style.display = 'block';
        conjuntoLabel.style.display = 'block';
        col.style.display='none';
        inputDate1.style.display = 'none';
        data_inicial.style.display='none';
        btnFiltrarLevantamento.style.display = 'none';
        btnFiltrar.style.display = 'block';
        tabelaSolicitarPeca.style.display= 'block';
        table_levantamento.style.display='none'
    });

    btnLevantamento.addEventListener('click', function () {
        btnLevantamento.classList.add('active');
        btnPesquisa.classList.remove('active');
        inputDate1.value = ''; // Limpa o valor do campo de data
        filtroPeca.value = ''; // Limpa a seleção de peça
        filtroProcesso.value = ''; // Limpa a seleção de processo
        filtroConjunto.value = ''; // Limpa a seleção de conjunto
        pecaLabel.style.display = 'none';
        processoLabel.style.display = 'none';
        carretaLabel.style.display = 'none';
        conjuntoLabel.style.display = 'none';
        col.style.display='block';
        inputDate1.style.display = 'block';
        data_inicial.style.display='block';
        btnFiltrarLevantamento.style.display = 'block';
        btnFiltrar.style.display = 'none';
        tabelaSolicitarPeca.style.display='none';
        table_levantamento.style.display='block'
    });
}); 


// Input de Data do Levantamento
$(function() {
    const dataAtual = new Date();
    const opcoesFormatacao = { day: 'numeric', month: '2-digit', year: 'numeric' };
    const dataFormatada = dataAtual.toLocaleDateString('pt-BR', opcoesFormatacao);
   
    var dataInicial = dataFormatada.split(" - ")[0];
    var dataFinal = dataFormatada.split(" - ")[1];

    $('input[name="datetimes"]').daterangepicker({
    timePicker: true,
    timePicker24Hour: true,
    startDate: moment(dataInicial, 'DD/MM/YYYY'),
    endDate: moment(dataFinal, 'DD/MM/YYYY'),
    locale: {
        format: 'DD/MM/YYYY'
    }
    });

    $('input[name="datetimes"]').on('apply.daterangepicker', function(ev, picker) {
    var startDate = picker.startDate;
    var endDate = picker.endDate;

    if (endDate.isBefore(startDate)) {
        alert("A data final não pode ser menor que a data inicial");
        picker.setEndDate(startDate);
    }
    });
});

$(document).ready(function() {
  // Função para ajustar o valor do botão com base na largura da tela
  function ajustarValorBotao(botao, valorPadrao, valorMenor800px) {
      const larguraTela = $(window).width();
      const novoValor = larguraTela <= 800 ? valorMenor800px : valorPadrao;
      botao.val(novoValor);
  }

  // Chamar a função para ambos os botões quando a página for carregada
  ajustarValorBotao($('#modal_pesquisa_peca_label'), 'Peças solicitadas', 'Solicitadas');
  ajustarValorBotao($('#modal_levantamento_peca_label'), 'Levantamento de Peças', 'Levantamento');
  ajustarValorBotao($('#modal_visualizar_peca_solicitada_input'), 'Peças solicitadas', 'Solicitadas');
  ajustarValorBotao($('#modal_visualizar_peca_feita_input'), 'Peças Feitas', 'Feitas');

  // Chamar a função sempre que a largura da tela for alterada
  $(window).resize(function() {
      ajustarValorBotao($('#modal_pesquisa_peca_label'), 'Peças solicitadas', 'Solicitadas');
      ajustarValorBotao($('#modal_levantamento_peca_label'), 'Levantamento de Peças', 'Levantamento');
      ajustarValorBotao($('#modal_visualizar_peca_solicitada_input'), 'Peças solicitadas', 'Solicitadas');
      ajustarValorBotao($('#modal_visualizar_peca_feita_input'), 'Peças Feitas', 'Feitas');
  });
});

