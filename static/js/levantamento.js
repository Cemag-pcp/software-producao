// const url = "/get_base_carretas";

// fetch(url)
//   .then(response => response.json())
//   .then(data => {
//     // Aqui, 'data' conterá os dados obtidos do servidor
//     console.log(data);
//     // Agora você pode manipular os dados como necessário
//   })
//   .catch(error => console.error("Erro ao obter dados:", error));

function toggleTabela() {
    // Obtém a referência da tabela e do botão
    var tabela = document.getElementById('tabela-levantamento-peca');
    var botao = document.getElementById('exibirTabela');

    // Verifica o estado atual da tabela (se está visível ou não)
    var tabelaVisivel = tabela.style.display !== 'none';

    // Altera o estado da tabela e o texto do botão com base no estado atual
    if (tabelaVisivel) {
        tabela.style.display = 'none';
        botao.innerText = '+';
    } else {
        tabela.style.display = 'block';
        botao.innerText = '-';
    }
}