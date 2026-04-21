const API_URL = 'https://backend-cha-panela.onrender.com/api';
let numeroSelecionado = null;

const listaPresentes = {
    1: "Jogo de assadeiras de alumínio (3 tamanhos)", 2: "Assadeira de vidro com tampa (tipo Marinex)",
    3: "Conjunto de potes herméticos de vidro", 4: "Escorredor de louças em inox",
    5: "Organizador de talheres para gaveta", 6: "Peneiras de aço inox (kit com 3 tamanhos)",
    7: "Ralador de queijo com reservatório", 8: "Amassador de batatas e legumes (inox)",
    9: "Funil de inox ou silicone", 10: "Descanso de colher de fogão",
    11: "Tábua de madeira (para corte ou servir)", 12: "Conjunto de panos de prato de boa absorção",
    13: "Bacias de inox ou polietileno", 14: "Abridor de latas e garrafas reforçado",
    15: "Espremedor de limão manual (inox)", 16: "Jogo de facas de cozinha (Chef, legumes e pão)",
    17: "Afiador de facas manual", 18: "Espátula de silicone (tipo 'pão duro')",
    19: "Batedor de claras (fouet) em inox", 20: "Cortador de pizza",
    21: "Moedor de pimenta e sal grosso", 22: "Luva térmica de silicone ou tecido grosso",
    23: "Kit de utensílios (escumadeira, concha e espátula)", 24: "Jogo de medidores (xícaras e colheres)",
    25: "Espremedor de alho em inox", 26: "Porta-condimentos/Temperos (organizador)",
    27: "Jogo de pratos rasos (6 peças)", 28: "Jogo de pratos fundos (6 peças)",
    29: "Conjunto de bowls (tigelas)", 30: "Jogo de talheres completo em inox (24 peças)",
    31: "Conjunto de copos de vidro", 32: "Jarra de vidro de 1,5L ou 2L",
    33: "Travessa de cerâmica grande para servir", 34: "Manteigueira",
    35: "Açucareiro", 36: "Toalha de mesa de tecido",
    37: "Cesto de frutas (fruteira de mesa)", 38: "Jogo de xícaras de café com pires (6 peças)",
    39: "Jogo de xícaras de chá com pires (6 peças)", 40: "Conjunto de porta-copos (6 peças)",
    41: "Galheteiro (porta azeite e vinagre)", 42: "Jogo de tigela para sobremesa (6 peças)",
    43: "Baldes de plástico (tamanhos variados)", 44: "Lixeira de inox com pedal (para cozinha)",
    45: "Lixeira de inox com pedal (para banheiro)", 46: "Kit de acessórios para bancada",
    47: "Tapete de banheiro antiderrapante", 48: "Escova sanitária com suporte",
    49: "Manta decorativa para sofá", 50: "Relógio de parede moderno",
    51: "Toalha de rosto", 52: "Toalha de banho",
    53: "A Pá", 54: "Vassoura",
    55: "Rodo", 56: "3 Porta detergente",
    57: "Forma de silicone para gelo ou bombons", 58: "Centrifuga de salada",
    59: "Descascador de legumes manual", 60: "Pincel de silicone",
    61: "Tesoura de cozinha", 62: "Porta-rolo de papel toalha",
    63: "Rolo de macarrão", 64: "Termômetro culinário",
    65: "Cesto de cozimento a vapor (inox)", 66: "Ganchos adesivos (tipo Command)",
    67: "Organizador de xícaras", 68: "Cestos organizadores plásticos",
    69: "Etiquetadora manual ou adesivos de lousa", 70: "Protetor de prateleira (emborrachado)",
    71: "Lugar americano (conjunto)", 72: "Sousplat",
    73: "Argolas para guardanapos", 74: "Queijeira",
    75: "Petisqueira", 76: "Bandeja de café da manhã",
    77: "Suporte para bolos/tortas", 78: "MOP (Esfregão)",
    79: "Sacos para lavar roupas delicadas", 80: "Pregadores de roupa de qualidade",
    81: "Varal de chão ou de parede", 82: "Cesto de roupas limpas",
    83: "Velas perfumadas ou difusores", 84: "Almofadas decorativas",
    85: "Tapete de porta (Capacho)", 86: "Vaso para flores",
    87: "Prensa francesa", 88: "Conjunto de ramequins",
    89: "Aparelho de fondue"
};

async function carregarNumeros() {
    const grid = document.getElementById('numeros-grid');
    grid.innerHTML = "<p style='grid-column: 1 / -1; text-align: center;'>Carregando cartela...</p>";

    try {
        const response = await fetch(`${API_URL}/admin/lista`);
        if (!response.ok) throw new Error('Erro ao carregar');
        
        const convidados = await response.json();
        const escolhidosMap = {};
        convidados.forEach(c => { escolhidosMap[c.numeroEscolhido] = c.nome; });

        grid.innerHTML = ""; 

        for (let i = 1; i <= 89; i++) {
            const btn = document.createElement('div');
            
            if (escolhidosMap[i]) {
                btn.className = 'num-btn indisponivel';
                const primeiroNome = escolhidosMap[i].split(' ')[0];
                btn.innerHTML = `<span>${i}</span><span class="nome-escolhido">${primeiroNome}</span>`;
                
                btn.onclick = () => abrirModal(i, listaPresentes[i], escolhidosMap[i]);
                
            } else {
                btn.className = 'num-btn';
                btn.innerText = i;
                btn.onclick = () => selecionarNumero(btn, i);
            }
            grid.appendChild(btn);
        }

        if (convidados.length >= 89) {
            document.querySelector('.numbers-section p').innerText = "TODOS OS PRESENTES FORAM ESCOLHIDOS!";
            document.getElementById('form-area').style.display = 'none';
        }

    } catch (error) {
        console.error(error);
        grid.innerHTML = "<p style='grid-column: 1 / -1; color: red;'>Erro ao conectar. Tente atualizar a página.</p>";
    }
}

function selecionarNumero(btnElement, num) {
    if (btnElement.classList.contains('indisponivel')) return;

    document.querySelectorAll('.num-btn:not(.indisponivel)').forEach(b => b.classList.remove('selected'));
    btnElement.classList.add('selected');
    numeroSelecionado = num;

    document.getElementById('modal-titulo').innerText = `🎁 Presente Nº ${num}`;
    document.getElementById('modal-desc').innerText = listaPresentes[num];
    document.getElementById('modal-nome').innerHTML = `<br><strong style="color: #8ba888;">Ótima escolha!</strong><br><span style="font-size: 0.9rem;">Feche este aviso e clique em "Confirmar" lá embaixo para salvar.</span>`;
    document.getElementById('modal-presente').classList.remove('hidden');
}

async function enviarConfirmacao() {
    const nome = document.getElementById('nome').value.trim();
    
    const apenasLetras = /^[a-zA-ZÀ-ÿ\s]+$/.test(nome);
    const palavras = nome.split(/\s+/); 

    if (!nome) {
        return alert('Por favor, digite seu nome completo.');
    }
    if (!apenasLetras) {
        return alert('Por favor, use apenas letras no seu nome (não use números ou símbolos).');
    }
    if (palavras.length < 2 || palavras[0].length < 2) {
        return alert('Por favor, digite o seu nome e sobrenome corretamente.');
    }

    if (!numeroSelecionado) return alert('Escolha um número ou faça um PIX (neste caso, não precisa confirmar aqui).');

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
            mostrarSucesso(`Muito obrigado, ${nome}! Seu presente foi confirmado com sucesso.`);
        } else {
            alert('Este número acabou de ser escolhido. Por favor, selecione outro.');
            window.location.reload();
        }
    } catch (error) {
        alert('Erro ao confirmar. Tente novamente mais tarde.');
        btnConfirmar.innerText = "CONFIRMAR PRESENÇA E PRESENTE";
        btnConfirmar.disabled = false;
    }
}

function abrirModal(num, presente, nome) {
    document.getElementById('modal-titulo').innerText = `🎁 Presente Nº ${num}`;
    document.getElementById('modal-desc').innerText = presente;
    document.getElementById('modal-nome').innerHTML = `Escolhido por: <strong>${nome}</strong>`;
    document.getElementById('modal-presente').classList.remove('hidden');
}

function fecharModal() {
    document.getElementById('modal-presente').classList.add('hidden');
}

carregarNumeros();

async function confirmarPix() {
    const nome = document.getElementById('nome').value.trim();
    
    const apenasLetras = /^[a-zA-ZÀ-ÿ\s]+$/.test(nome);
    const palavras = nome.split(/\s+/); 

    if (!nome) return alert('Por favor, digite seu nome completo lá no campo de cima primeiro.');
    if (!apenasLetras) return alert('Por favor, use apenas letras no seu nome.');
    if (palavras.length < 2 || palavras[0].length < 2) return alert('Por favor, digite o seu nome e sobrenome corretamente.');

    const numeroFantasmaPix = Math.floor(Math.random() * 9000) + 1000;

    try {
        const response = await fetch(`${API_URL}/confirmar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome: nome + " (PIX)", numeroEscolhido: numeroFantasmaPix })
        });

        if (response.ok) {
            mostrarSucesso(`Muito obrigado, ${nome}! Sua presença via PIX foi confirmada.`);
        } else {
            alert('Erro ao confirmar. Tente novamente.');
        }
    } catch (error) {
        alert('Erro ao conectar com o servidor.');
    }
} // <- AGORA A CHAVE DE FECHAMENTO DO PIX ESTÁ NO LUGAR CERTO!

// Funções da Tela de Sucesso (Agora livres e acessíveis por todos!)
function mostrarSucesso(mensagem) {
    document.getElementById('mensagem-sucesso').innerText = mensagem;
    document.getElementById('modal-sucesso').classList.remove('hidden');
}

function fecharSucesso() {
    document.getElementById('modal-sucesso').classList.add('hidden');
    window.location.reload(); 
}