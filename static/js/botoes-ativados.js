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
    var inputDate2 = document.getElementById('inputDate2');
    var col = document.getElementById('coluna_data');
    var data_inicial = document.getElementById('data_inicial');
    var data_final = document.getElementById('data_final');

    btnPesquisa.addEventListener('click', function () {
        btnPesquisa.classList.add('active');
        btnLevantamento.classList.remove('active');
        col.style.display='none';
        inputDate1.style.display = 'none';
        data_inicial.style.display='none';
        inputDate2.style.display = 'none';
        data_final.style.display='none';
    });

    btnLevantamento.addEventListener('click', function () {
        btnLevantamento.classList.add('active');
        btnPesquisa.classList.remove('active');
        col.style.display='block';
        inputDate1.style.display = 'block';
        data_inicial.style.display='block';
        inputDate2.style.display = 'block';
        data_final.style.display='block';
    });
}); 

$(function() {
    const dataAtual = new Date();
    const opcoesFormatacao = { day: 'numeric', month: '2-digit', year: 'numeric' };
    const dataFormatada = dataAtual.toLocaleDateString('pt-BR', opcoesFormatacao);
   
    var dataInicial = dataFormatada.split(" - ")[0];
    var dataFinal = dataFormatada.split(" - ")[1];

    $('input[name="datetimes"]').daterangepicker({
    timePicker: true,
    timePicker24Hour: true,
    startDate: moment(dataInicial, 'DD/MM/YYYY HH:mm'),
    endDate: moment(dataFinal, 'DD/MM/YYYY HH:mm'),
    locale: {
        format: 'DD/MM/YYYY HH:mm'
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

