/* STATE AND VARIABLES */

const nodeListaProdutos = document.querySelector("#lista-produtos")
const nodeListaCesto = document.querySelector("#lista-cesto")
const nodeTotal = document.querySelector("#total")

// Load saved products or start with an empty array
const produtosSelecionados = JSON.parse(localStorage.getItem("produtos-selecionados")) || []


/* UTILITY FUNCTIONS */

function criarProduto(produto) {

    const nodeArticle = document.createElement("article")

    const nodeImagem = document.createElement("img")
    nodeImagem.src = produto.image
    nodeImagem.alt = produto.title

    const nodeTitulo = document.createElement("h3")
    nodeTitulo.textContent = produto.title

    const nodeCategoria = document.createElement("p")
    nodeCategoria.textContent = produto.category

    const nodePreco = document.createElement("p")
    nodePreco.textContent = produto.price.toFixed(2) + " €"
    nodePreco.classList.add("preco")

    const nodeButton = document.createElement("button")
    nodeButton.textContent = "Adicionar ao cesto"

    nodeButton.addEventListener("click", function() {

        produtosSelecionados.push(produto.id)

        // Save the updated basket
        localStorage.setItem("produtos-selecionados", JSON.stringify(produtosSelecionados))

        atualizaCesto()
    })

    nodeArticle.append(nodeImagem)
    nodeArticle.append(nodeTitulo)
    nodeArticle.append(nodeCategoria)
    nodeArticle.append(nodePreco)
    nodeArticle.append(nodeButton)

    return nodeArticle
}


function criarProdutoCesto(produto, posicao) {

    const nodeArticle = document.createElement("article")

    const nodeImagem = document.createElement("img")
    nodeImagem.src = produto.image
    nodeImagem.alt = produto.title

    const nodeTitulo = document.createElement("h3")
    nodeTitulo.textContent = produto.title

    const nodePreco = document.createElement("p")
    nodePreco.textContent = produto.price.toFixed(2) + " €"
    nodePreco.classList.add("preco")

    const nodeButton = document.createElement("button")
    nodeButton.textContent = "Remover"

    nodeButton.addEventListener("click", function() {

        // Remove one product from the basket
        produtosSelecionados.splice(posicao, 1)

        localStorage.setItem("produtos-selecionados", JSON.stringify(produtosSelecionados))

        atualizaCesto()
    })

    nodeArticle.append(nodeImagem)
    nodeArticle.append(nodeTitulo)
    nodeArticle.append(nodePreco)
    nodeArticle.append(nodeButton)

    return nodeArticle
}


/* EVENT HANDLERS */

function renderizarProdutos(produtos) {

    nodeListaProdutos.innerHTML = ""

    // Create an article for each product
    produtos.forEach(function(produto) {

        const nodeArticle = criarProduto(produto)

        nodeListaProdutos.append(nodeArticle)
    })
}


function atualizaCesto() {

    nodeListaCesto.innerHTML = ""

    let total = 0

    produtosSelecionados.forEach(function(id, posicao) {

        // Find the product using its ID
        const produto = produtos.find(function(p) {
            return p.id === id
        })

        if (produto) {

            const nodeArticle = criarProdutoCesto(produto, posicao)

            nodeListaCesto.append(nodeArticle)

            total = total + produto.price
        }
    })

    nodeTotal.textContent = total.toFixed(2) + " €"

    if (produtosSelecionados.length === 0) {

        const nodeMensagem = document.createElement("p")
        nodeMensagem.textContent = "O teu cesto está vazio!"

        nodeListaCesto.append(nodeMensagem)
    }
}


/* EVENT LISTENERS */
// Button click events are defined inside the product functions


/* INITIALISATION */

renderizarProdutos(produtos)
atualizaCesto()
