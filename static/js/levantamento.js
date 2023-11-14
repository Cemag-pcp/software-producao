const url = "/get_base_carretas";

fetch(url)
  .then(response => response.json())
  .then(data => {
    // Aqui, 'data' conterá os dados obtidos do servidor
    console.log(data);
    // Agora você pode manipular os dados como necessário
  })
  .catch(error => console.error("Erro ao obter dados:", error));