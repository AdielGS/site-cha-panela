// URL da sua API Spring Boot (Lembre-se de mudar quando hospedar o backend)
const API_URL = 'http://localhost:8080/api'; 
let numeroSelecionado = null;

async function carregarNumeros() {
    try {
        const response = await fetch(`${API_URL}/numeros-disponiveis`);
        
        if (!response.ok) throw new Error('Erro na comunicação com a API');
        
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
        alert("Aguardando conexão com o servidor de presentes...");
        
        // Código temporário APENAS PARA VOCÊ TESTAR O VISUAL enquanto o backend está desligado:
        // Remova esse bloco 'else' quando o Spring Boot estiver rodando!
        const grid = document.getElementById('numeros-grid');
        for(let i = 1; i <= 56; i++) {
            const btn = document.createElement('div');
            btn.className = 'num-btn';
            btn.innerText = i;
            btn.onclick = () => selecionarNumero(btn, i);
            grid.appendChild(btn);
        }
    }
}

function selecionarNumero(btnElement, num) {
    document.querySelectorAll('.num-btn').forEach(b => b.classList.remove('selected'));
    btnElement.classList.add('selected');
    numeroSelecionado = num;
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
            alert(`Obrigado, ${nome}! Número ${numeroSelecionado} confirmado!`);
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