function uploadFile() {
    $('#loading-overlay').show()
    var fileInput = document.getElementById('fileSelect');
    var file = fileInput.files[0];

    var formData = new FormData();
    formData.append('file', file);

    $.ajax({
        url: '/receber-upload',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function(data) {
            console.log(data);
            if (data !== 'success') {
                alert(data);  // Exibir alerta em caso de erro
            } else {
                location.reload();
            }
            $('#loading-overlay').hide();
        },
        error: function(error) {
            console.error('Error:', error);
            $('#loading-overlay').hide();
        }
    });
  }
