var textoRevelado = document.getElementById('pdf-content');
var palavrasReveladas = document.getElementById('palavrasReveladas');
var palavras = [];
var indice = 0;

var botaoEnviar = document.getElementById('botaoEnviar');
var pdfInput = document.getElementById("pdf-input"); 

const toggle = document.getElementById("toggle");
const theme = window.localStorage.getItem("theme");

// Verificar se o tema está definido no armazenamento local
if (theme === "dark") {
    document.body.classList.add("dark");
} else {
    // Caso o tema não estiver definido, este é o padrão
    window.localStorage.setItem("theme", "dark");
}

toggle.addEventListener("click", () => {
    // Alternar entre os temas
    document.body.classList.toggle("dark");

    // Atualiza o valor do tema no armazenamento local
    if (document.body.classList.contains("dark")) {
        window.localStorage.setItem("theme", "dark");
    } else {
        window.localStorage.setItem("theme", "light");
    }
});

// botão 'To reveal'

botaoEnviar.addEventListener('click', function () {
    if (botaoEnviar) {
        mostrarMaisPalavras();
    }
});

// Recarregar a página
const reloadButton = document.getElementById('reloadButton');

reloadButton.addEventListener('click', function () {
    location.reload();
});

document.addEventListener("DOMContentLoaded", function () {
    // Clicar na tela e exibir novas palavras
    document.documentElement.addEventListener('click', function () {
        mostrarMaisPalavras();
    });
    
    const fileInput = document.getElementById('pdf-input');

    fileInput.addEventListener('change', function (event) {
        const selectedFile = event.target.files[0];

        if (selectedFile && selectedFile.type === 'application/pdf') {
            // O arquivo selecionado é um PDF.
            readAndDisplayPdf(selectedFile);
        } else {
            // O arquivo selecionado não é um PDF, exibir mensagem de erro
            alert("Isso não é um PDF, por favor carregar arquivo PDF");
        }
    });
    
    // Lidar com o evento de seleção de arquivo PDF
    pdfInput.addEventListener("change", function () {
        const selectedFile = pdfInput.files[0];
        if (selectedFile) {
            readAndDisplayPdf(selectedFile);
        }
    });

    let pdfDoc = null;

    // Função para ler e exibir o conteúdo do PDF
    function readAndDisplayPdf(file) {
        const reader = new FileReader();

        reader.onload = function () {
            const pdfData = new Uint8Array(reader.result);

            pdfjsLib.getDocument({ data: pdfData }).promise.then(function (pdfDoc_) {
                pdfDoc = pdfDoc_;
                const numPages = pdfDoc.numPages;
                let pdfText = "";

                // Ler todas as páginas do PDF e extrair o texto
                function readPage(pageNum) {
                    if (pageNum > numPages) {
                        
                        palavras = pdfText.split(/(\s+|\n)/); // Atualiza as palavras após a extração do PDF
                        return;
                    }

                    pdfDoc.getPage(pageNum).then(function (page) {
                        
                        page.getTextContent().then(function (textContent) {
                            let lastY = -1;
                            textContent.items.forEach(function (textItem) {
                                // Verificar se houve uma mudança na coordenada y
                                if (lastY != textItem.transform[5]) {
                                    pdfText += "\n";
                                    lastY = textItem.transform[5];
                                }
                                pdfText += textItem.str + "";
                            });
                            

                            // Continua lendo as páginas subsequentes
                            readPage(pageNum + 1);
                        });
                    });
                }

                // Começa a ler a partir da primeira página
                readPage(1);
            });
        };

        reader.readAsArrayBuffer(file);
    }
});

// Variável para controlar se a tecla 'z' está pressionada
let zKeyPressed = false;

document.addEventListener('keydown', function (event) {
    if (event.key === 'z' && !zKeyPressed) {
        mostrarMaisPalavras();
    }
});

document.addEventListener('keyup', function (event) {
    if (event.key === 'z') {
        mostrarMaisPalavras();
    }
});

// Função para mostrar mais palavras
function mostrarMaisPalavras() {
    if (indice < palavras.length) {
        // Adicionar uma quebra de linha ao final de cada parágrafo
        if (palavras[indice] === "\n") {
            palavrasReveladas.textContent += "\n";
        } else {
            palavrasReveladas.textContent += '' + palavras[indice];
        }
        indice++;
    } else {
        textoRevelado.style.display = 'none';
    }
}
