const API_URL = "http://127.0.0.1:8000/api";
let scanInterval = null;

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    fetchClients();
    setupDragAndDrop();
});

// Toast Notifications
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.style.borderLeft = `4px solid ${type === 'error' ? 'var(--danger-color)' : 'var(--success-color)'}`;
    toast.classList.remove('hidden');
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.classList.add('hidden'), 300);
    }, 3000);
}

// Drag & Drop File Upload
function setupDragAndDrop() {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-upload');

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        if (e.dataTransfer.files.length) {
            handleFileUpload(e.dataTransfer.files[0]);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
            handleFileUpload(e.target.files[0]);
        }
    });
}

async function handleFileUpload(file) {
    if (!file.name.endsWith('.xlsx')) {
        showToast("Por favor, envie apenas arquivos .xlsx", "error");
        return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
        const res = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            body: formData
        });
        const data = await res.json();
        
        if (res.ok) {
            showToast("Planilha enviada com sucesso!");
            fetchClients();
        } else {
            showToast(data.detail || "Erro ao enviar planilha", "error");
        }
    } catch (e) {
        showToast("Erro de conexão com o servidor", "error");
    }
}

// Fetch and Render Clients
async function fetchClients() {
    try {
        const res = await fetch(`${API_URL}/clientes`);
        const data = await res.json();
        renderTable(data.clientes);
    } catch (e) {
        console.error("Erro ao buscar clientes:", e);
    }
}

function renderTable(clientes) {
    const tbody = document.getElementById('table-body');
    tbody.innerHTML = '';
    
    if (!clientes || clientes.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--text-secondary);">Nenhum cliente encontrado. Faça upload da planilha.</td></tr>';
        return;
    }

    clientes.forEach(c => {
        const tr = document.createElement('tr');
        
        // Estilização do Badge de Status/Triagem
        let badgeClass = 'status-neutral';
        if (c.triagem.includes("VERMELHO") || c.triagem.includes("REQUER")) badgeClass = 'status-danger';
        else if (c.triagem.includes("NORMAL") || c.triagem.includes("LIMPO")) badgeClass = 'status-success';
        else if (c.triagem.includes("IGNORADO")) badgeClass = 'status-warning';

        const triagemHtml = c.triagem ? `<span class="badge-status ${badgeClass}">${c.triagem}</span>` : '-';
        
        tr.innerHTML = `
            <td><strong>${c.cpf}</strong></td>
            <td>${c.processo || '<span style="color:var(--text-secondary)">Sem processo (Modo Descoberta)</span>'}</td>
            <td>${c.status || '-'}</td>
            <td>${c.classe || '-'}</td>
            <td>${triagemHtml}</td>
        `;
        tbody.appendChild(tr);
    });
}

// Adicionar Novo Cliente
async function addClient(e) {
    e.preventDefault();
    
    const cpfInput = document.getElementById('new-cpf');
    const processInput = document.getElementById('new-process');
    
    const payload = {
        cpf: cpfInput.value.trim(),
        processo: processInput.value.trim()
    };
    
    try {
        const res = await fetch(`${API_URL}/clientes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        if (res.ok) {
            showToast("Cliente adicionado!");
            cpfInput.value = '';
            processInput.value = '';
            fetchClients();
        } else {
            const data = await res.json();
            showToast(data.detail, "error");
        }
    } catch (e) {
        showToast("Erro ao adicionar cliente", "error");
    }
}

// Controle do Robô (Scan)
async function startScan() {
    const btn = document.getElementById('btn-scan');
    const btnText = btn.querySelector('.btn-text');
    const loader = document.getElementById('scan-loader');
    
    btn.disabled = true;
    
    try {
        const res = await fetch(`${API_URL}/scan`, { method: 'POST' });
        if (res.ok) {
            showToast("Robô iniciando varredura...");
            checkScanStatus();
            scanInterval = setInterval(checkScanStatus, 3000);
        }
    } catch (e) {
        showToast("Erro ao iniciar robô", "error");
        btn.disabled = false;
    }
}

async function checkScanStatus() {
    try {
        const res = await fetch(`${API_URL}/status`);
        const data = await res.json();
        
        const btn = document.getElementById('btn-scan');
        const btnText = btn.querySelector('.btn-text');
        const loader = document.getElementById('scan-loader');
        const statusText = document.getElementById('scan-status-text');
        
        statusText.textContent = data.message;
        
        if (data.is_running) {
            btn.disabled = true;
            btnText.textContent = "Varredura em andamento...";
            loader.classList.remove('hidden');
            statusText.style.color = "var(--warning-color)";
        } else {
            btn.disabled = false;
            btnText.textContent = "🔍 Iniciar Varredura";
            loader.classList.add('hidden');
            statusText.style.color = "var(--success-color)";
            clearInterval(scanInterval);
            
            // Recarrega a tabela para mostrar os novos resultados
            fetchClients();
            
            if (data.message.includes("sucesso")) {
                showToast("Varredura concluída!");
            }
        }
    } catch (e) {
        console.error("Erro ao checar status");
    }
}
