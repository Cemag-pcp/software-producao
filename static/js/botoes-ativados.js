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
    var btnSolicitada = document.getElementById('modal_visualizar_peca_solicitada_input');
    var btnFeita = document.getElementById('modal_visualizar_peca_feita_input');
    var btnPesquisa = document.getElementById('modal_pesquisa_peca_label');
    var btnLevantamento = document.getElementById('modal_levantamento_peca_label');
    var inputDate1 = document.getElementById('inputDate1');
    var col = document.getElementById('coluna_data');
    var data_inicial = document.getElementById('data_inicial');
    var btnFiltrar = document.getElementById('btnFiltrar');
    var filtroPeca = document.getElementById('filtroPeca');
    var filtroProcesso = document.getElementById('filtroProcesso');
    var filtroMateria = document.getElementById('filtroMateria');
    var filtroConjunto = document.getElementById('filtroConjunto');
    var btnFiltrarLevantamento = document.getElementById('levantamentoButton');
    // var limparLevantamento = document.getElementById('limparLevantamento');
    var inserirBase = document.getElementById('inserir_base');
    var exibirTabela = document.getElementById('exibirTabela');
    var tabelaSolicitarPeca = document.getElementById('tabela-solicitar-peca');
    var tabelaLevantamentoPeca = document.getElementById('tabela-levantamento-peca');
    var pecaLabel = document.getElementById('peca');
    var processoLabel = document.getElementById('processo');
    var descricao = document.getElementById('descricao');
    var carretaLabel = document.getElementById('carreta');
    var conjuntoLabel = document.getElementById('conjunto');
    var resultado = document.getElementById('resultado');
    var close = document.getElementById('fechar_levantamento');
    var excel_model = document.getElementById('excel_model');
    var filtroDataSolicitPeca = document.getElementById('dataSolicitPeca')
    var filtroOrigemSolicitPeca = document.getElementById('carretaSolicitPeca')
    var filtroMateriaPrima = document.getElementById('materiaPrima')
    var levant = document.getElementById('levant');
    var solicitarPecasButton = document.getElementById('solicitarPecasButton');
    var carretas_utilizadas = document.getElementById('carretas_utilizadas');
    var base_carretas = document.getElementById('base_carretas');

    solicitarPecasButton.addEventListener('click', function () {
      resetarCampos()
    })

    btnPesquisa.addEventListener('click', function () {
        btnPesquisa.classList.add('active');
        btnLevantamento.classList.remove('active');
        inputDate1.value = ''; // Limpa o valor do campo de data
        filtroPeca.value = ''; // Limpa a seleção de peça
        filtroProcesso.value = ''; // Limpa a seleção de processo
        filtroMateria.value = ''; // Limpa a seleção de carreta
        filtroConjunto.value = ''; // Limpa a seleção de conjunto
        pecaLabel.style.display = 'block';
        processoLabel.style.display = 'block';
        carretaLabel.style.display = 'block';
        descricao.style.display='none';
        conjuntoLabel.style.display = 'block';
        col.style.display='none';
        levant.style.display='none';
        inputDate1.style.display = 'none';
        // limparLevantamento.style.display = 'none';
        inserirBase.style.display = 'none';
        data_inicial.style.display='none';
        btnFiltrarLevantamento.style.display = 'none';
        exibirTabela.style.display='none';
        btnFiltrar.style.display = 'block';
        tabelaSolicitarPeca.style.display= 'none';
        tabelaLevantamentoPeca.style.display='none';
        carretas_utilizadas.style.display = 'none';
        base_carretas.style.display = 'none';
        resultado.style.display = 'none';
        excel_model.style.display = 'none';
    });

    function resetarCampos() {
      btnLevantamento.classList.add('active');
      btnPesquisa.classList.remove('active');
      inputDate1.value = ''; // Limpa o valor do campo de data
      filtroPeca.value = ''; // Limpa a seleção de peça
      filtroMateria.value = '';
      filtroProcesso.value = ''; // Limpa a seleção de processo
      filtroConjunto.value = ''; // Limpa a seleção de conjunto
      filtroProcesso.style.display = 'none';
      pecaLabel.style.display = 'none';
      descricao.style.display = 'none';
      processoLabel.style.display = 'none';
      carretaLabel.style.display = 'none';
      conjuntoLabel.style.display = 'none';
      col.style.display = 'block';
      exibirTabela.style.display = 'none';
      inputDate1.style.display = 'block';
      data_inicial.style.display = 'block';
      btnFiltrarLevantamento.style.display = 'block';
      btnFiltrar.style.display = 'none';
      // limparLevantamento.style.display = 'none';
      levant.style.display = 'flex';
      inserirBase.style.display = 'none';
      tabelaSolicitarPeca.style.display = 'none';
      tabelaLevantamentoPeca.style.display = 'none';
      carretas_utilizadas.style.display = 'none';
      base_carretas.style.display = 'none';
      resultado.style.display = 'none';
    }
    
    // Associar ao evento de clique no botão de fechar
    close.addEventListener('click', resetarCampos);
    
    // Associar ao evento de ocultar o modal
    // Substitua 'modal_pesquisa_peca' pelo ID real do seu modal
    $('#modal_pesquisa_peca').on('hidden.bs.modal', function () {
      resetarCampos();
    });

    btnFiltrar.addEventListener('click',function(){
      tabelaSolicitarPeca.style.display='block';
    })

    btnLevantamento.addEventListener('click', function () {
        btnLevantamento.classList.add('active');
        btnPesquisa.classList.remove('active');
        inputDate1.value = ''; // Limpa o valor do campo de data
        filtroPeca.value = ''; // Limpa a seleção de peça
        filtroProcesso.value = ''; // Limpa a seleção de processo
        filtroMateria.value = '';
        filtroConjunto.value = ''; // Limpa a seleção de conjunto
        pecaLabel.style.display = 'none';
        descricao.style.display='none';
        processoLabel.style.display = 'none';
        carretaLabel.style.display = 'none';
        conjuntoLabel.style.display = 'none';
        col.style.display='block';
        exibirTabela.style.display='none';
        inputDate1.style.display = 'block';
        data_inicial.style.display='block';
        btnFiltrarLevantamento.style.display = 'block';
        btnFiltrar.style.display = 'none';
        // limparLevantamento.style.display = 'none';
        inserirBase.style.display = 'none';
        tabelaSolicitarPeca.style.display='none';
        tabelaLevantamentoPeca.style.display='none';
        carretas_utilizadas.style.display = 'none';
        base_carretas.style.display = 'none';
        resultado.style.display = 'none';
        excel_model.style.display = 'flex';
        levant.style.display = 'flex';
    });

    btnSolicitada.addEventListener('click', function () {
      filtroDataSolicitPeca.style.display = 'block'
      filtroOrigemSolicitPeca.style.display = 'block'
      filtroMateriaPrima.style.display = 'block'
    });

    btnFeita.addEventListener('click', function () {
      filtroDataSolicitPeca.style.display = 'none'
      filtroOrigemSolicitPeca.style.display = 'none'
      filtroMateriaPrima.style.display = 'none'
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
  ajustarValorBotao($('#modal_pesquisa_peca_label'), 'Solicitar Peças', 'Solicitadas');
  ajustarValorBotao($('#modal_levantamento_peca_label'), 'Levantamento de Peças', 'Levantamento');
  ajustarValorBotao($('#modal_visualizar_peca_solicitada_input'), 'Solicitar Peças', 'Solicitadas');
  ajustarValorBotao($('#modal_visualizar_peca_feita_input'), 'Peças Feitas', 'Feitas');

  // Chamar a função sempre que a largura da tela for alterada
  $(window).resize(function() {
      ajustarValorBotao($('#modal_pesquisa_peca_label'), 'Solicitar Peças', 'Solicitadas');
      ajustarValorBotao($('#modal_levantamento_peca_label'), 'Levantamento de Peças', 'Levantamento');
      ajustarValorBotao($('#modal_visualizar_peca_solicitada_input'), 'Solicitar Peças', 'Solicitadas');
      ajustarValorBotao($('#modal_visualizar_peca_feita_input'), 'Peças Feitas', 'Feitas');
  });
});

$(document).ready(function() {
  // Evento de alteração para todos os selects
  $('select').on('change', function() {
      // Exibir o overlay de loading
      $('#loading-overlay').show();

      // Ocultar o overlay de loading após 1 segundo
      setTimeout(function() {
          $('#loading-overlay').hide();
      }, 1000);

  });
});

function toggleFiltros() {
  var filtros = document.getElementById('filtros');
  var icon = document.getElementById('icon');

  if (filtros.style.display === 'none') {
      filtros.style.display = 'block';
      icon.classList.remove('fa-maximize');
      icon.classList.add('fa-minimize');
  } else {
      filtros.style.display = 'none';
      icon.classList.remove('fa-minimize');
      icon.classList.add('fa-maximize');
  }
}