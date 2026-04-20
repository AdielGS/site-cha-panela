const API_URL = 'https://backend-cha-panela.onrender.com/api'; // Link do Render
let numeroSelecionado = null;

const listaPresentes = { 1: "Jogo de assadeiras de alumínio (3 tamanhos)", 2: "Assadeira de vidro com tampa", /* ... adicione todos os 56 aqui ... */ 56: "3 Porta detergente" };

async function carregarNumeros() {
    const grid = document.getElementById('numeros-grid');
    grid.innerHTML = "<p>Carregando...</p>";
    try {
        const response = await fetch(`${API_URL}/admin/lista`);
        const convidados = await response.json();
        const escolhidosMap = {};
        convidados.forEach(c => { escolhidosMap[c.numeroEscolhido] = c.nome; });

        grid.innerHTML = "";
        for (let i = 1; i <= 56; i++) {
            const btn = document.createElement('div');
            if (escolhidosMap[i]) {
                btn.className = 'num-btn indisponivel';
                const primeiroNome = escolhidosMap[i].split(' ')[0];
                btn.innerHTML = `<span>${i}</span><span class="nome-escolhido">${primeiroNome}</span>`;
                btn.onclick = () => alert(`🎁 Presente Nº ${i}: ${listaPresentes[i]}\nEscolhido por: ${escolhidosMap[i]}`);
            } else {
                btn.className = 'num-btn';
                btn.innerText = i;
                btn.onclick = () => selecionarNumero(btn, i);
            }
            grid.appendChild(btn);
        }
    } catch (e) { grid.innerHTML = "<p>Erro ao ligar ao servidor.</p>"; }
}

function selecionarNumero(btn, num) {
    document.querySelectorAll('.num-btn:not(.indisponivel)').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    numeroSelecionado = num;
    const caixa = document.getElementById('presente-escolhido');
    caixa.classList.add('hidden');
    setTimeout(() => {
        caixa.innerHTML = `<span>PRESENTE Nº ${num}</span> ${listaPresentes[num]}`;
        caixa.classList.remove('hidden');
    }, 50);
}

async function enviarConfirmacao() {
    const nome = document.getElementById('nome').value.trim();
    if (!nome || !numeroSelecionado) return alert('Preencha o nome e escolha um número!');
    try {
        const res = await fetch(`${API_URL}/confirmar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, numeroEscolhido: numeroSelecionado })
        });
        if (res.ok) { alert('Sucesso!'); window.location.reload(); }
        else { alert('Número já escolhido!'); }
    } catch (e) { alert('Erro no servidor.'); }
}
carregarNumeros();