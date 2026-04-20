const API_URL = 'https://backend-cha-panela.onrender.com'; 
let numeroSelecionado = null;

// Lista completa dos presentes
const listaPresentes = {
    1: "Jogo de assadeiras de alumínio (3 tamanhos)",
    2: "Assadeira de vidro com tampa (tipo Marinex)",
    3: "Conjunto de potes herméticos de vidro",
    4: "Escorredor de louças em inox",
    5: "Organizador de talheres para gaveta",
    6: "Peneiras de aço inox (kit com 3 tamanhos)",
    7: "Ralador de queijo com reservatório",
    8: "Amassador de batatas e legumes (inox)",
    9: "Funil de inox ou silicone",
    10: "Descanso de colher de fogão",
    11: "Tábua de madeira (para corte ou servir)",
    12: "Conjunto de panos de prato de boa absorção",
    13: "Bacias de inox ou polietileno",
    14: "Abridor de latas e garrafas reforçado",
    15: "Espremedor de limão manual (inox)",
    16: "Jogo de facas de cozinha (Chef, legumes e pão)",
    17: "Afiador de facas manual",
    18: "Espátula de silicone (tipo 'pão duro')",
    19: "Batedor de claras (fouet) em inox",
    20: "Cortador de pizza",
    21: "Moedor de pimenta e sal grosso",
    22: "Luva térmica de silicone ou tecido grosso",
    23: "Kit de utensílios (escumadeira, concha e espátula)",
    24: "Jogo de medidores (xícaras e colheres)",
    25: "Espremedor de alho em inox",
    26: "Porta-condimentos/Temperos (organizador)",
    27: "Jogo de pratos rasos (6 peças)",
    28: "Jogo de pratos fundos (6 peças)",
    29: "Conjunto de bowls (tigelas)",
    30: "Jogo de talheres completo em inox (24 peças)",
    31: "Conjunto de copos de vidro",
    32: "Jarra de vidro de 1,5L ou 2L",
    33: "Travessa de cerâmica grande para servir",
    34: "Manteigueira",
    35: "Açucareiro",
    36: "Toalha de mesa de tecido",
    37: "Cesto de frutas (fruteira de mesa)",
    38: "Jogo de xícaras de café com pires (6 peças)",
    39: "Jogo de xícaras de chá com pires (6 peças)",
    40: "Conjunto de porta-copos (6 peças)",
    41: "Galheteiro (porta azeite e vinagre)",
    42: "Jogo de tigela para sobremesa (6 peças)",
    43: "Baldes de plástico (tamanhos variados)",
    44: "Lixeira de inox com pedal (para cozinha)",
    45: "Lixeira de inox com pedal (para banheiro)",
    46: "Kit de acessórios para bancada",
    47: "Tapete de banheiro antiderrapante",
    48: "Escova sanitária com suporte",
    49: "Manta decorativa para sofá",
    50: "Relógio de parede moderno",
    51: "Toalha de rosto",
    52: "Toalha de banho",
    53: "A Pá",
    54: "Vassoura",
    55: "Rodo",
    56: "3 Porta detergente"
};

async function carregarNumeros() {
    try {
        const response = await fetch(`${API_URL}/numeros-disponiveis`);
        if (!response.ok) throw new Error('Erro na comunicação');
        
        const disponiveis = await response.json();
        const grid = document.getElementById('numeros-grid');
        const formArea = document.getElementById('form-area');
        const pixArea = document.getElementById('pix-area');
        
        if (disponiveis.length === 0) {
            formArea.classList.add('hidden');
            pixArea.classList.remove('hidden');
            return;
        }

        disponiveis.forEach(num => {
            const btn = document.createElement('div');
            btn.className = 'num-btn';
            btn.innerText = num;
            btn.onclick = () => selecionarNumero(btn, num);
            grid.appendChild(btn);
        });
    } catch (error) {
        console.error("Erro:", error);
    }
}

function selecionarNumero(btnElement, num) {
    document.querySelectorAll('.num-btn').forEach(b => b.classList.remove('selected'));
    btnElement.classList.add('selected');
    numeroSelecionado = num;

    // Exibe o nome do presente na tela
    const caixaPresente = document.getElementById('presente-escolhido');
    caixaPresente.innerHTML = `<span>PRESENTE Nº ${num}</span> ${listaPresentes[num]}`;
    caixaPresente.classList.remove('hidden');
}

async function enviarConfirmacao() {
    const nome = document.getElementById('nome').value.trim();
    
    if (!nome) return alert('Por favor, digite seu nome completo.');
    if (!numeroSelecionado) return alert('Por favor, escolha um número na cartela.');

    const btnConfirmar = document.querySelector('.btn-confirmar');
    btnConfirmar.innerText = "PROCESSANDO...";
    btnConfirmar.disabled = true;

    try {
        const response = await fetch(`${API_URL}/confirmar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome: nome, numeroEscolhido: numeroSelecionado })
        });

        if (response.ok) {
            alert(`Obrigado, ${nome}! O presente "${listaPresentes[numeroSelecionado]}" foi confirmado!`);
            window.location.reload(); 
        } else {
            alert('Ops! Alguém acabou de escolher esse número. Escolha outro.');
            window.location.reload();
        }
    } catch (error) {
        alert('Erro ao salvar. Verifique se o servidor backend está rodando.');
        btnConfirmar.innerText = "CONFIRMAR PRESENÇA E PRESENTE";
        btnConfirmar.disabled = false;
    }
}

carregarNumeros();