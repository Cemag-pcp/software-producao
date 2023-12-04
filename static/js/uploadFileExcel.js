function uploadFile() {
    $('#loading-overlay').show()
    var fileInput = document.getElementById('fileSelect');
   
    var file = fileInput.files[0];
    
    if(!file){
        alert("Não possui arquivos para armazenamento na base")
        $('#loading-overlay').hide();
        return
    }

    var formData = new FormData();
    formData.append('file', file);

    $.ajax({
        url: '/receber-upload',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function(data) {
            if (data !== 'success') {
                alert(data);  // Exibir alerta em caso de erro
            } else {
                location.reload();
            }
            $('#loading-overlay').hide();
        },
        error: function(error) {
            console.error('Error:', error);
            alert('Insira o arquivo')
            $('#loading-overlay').hide();
        }
    });
  }

function displayFileName() {
    // Obtém o elemento de input de arquivo
    var fileInput = document.getElementById('fileSelect');

    // Obtém o elemento de label
    var label = document.querySelector('label[for="fileSelect"]');

    // Exibe o nome do arquivo ao lado do label
    if (fileInput.files.length > 0) {
        label.innerHTML = fileInput.files[0].name;
    } else {
        label.innerHTML = 'Enviar arquivo';
    }
}