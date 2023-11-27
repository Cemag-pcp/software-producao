function uploadFile() {
    
    var grupoSelecionado = $('#selectGrupos').val();
    var codigo_maquina = window.codigo_maquina;

    var fileInput = document.getElementById('fileSelect');
    var file = fileInput.files[0];

    var formData = new FormData();
    formData.append('file', file);
    formData.append('grupoSelecionado', grupoSelecionado);
    formData.append('codigo_maquina', codigo_maquina);

    $.ajax({
        url: '/receber-upload',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function(data) {
            console.log(data);
        },
        error: function(error) {
            console.error('Error:', error);
        }
    });
  }
