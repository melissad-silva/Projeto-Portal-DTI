// script.js

// Simple tab handling (accessible)
document.addEventListener('DOMContentLoaded', () => {
  const btnEntrada = document.getElementById('tab-btn-entrada');
  const btnSaida = document.getElementById('tab-btn-saida');
  const panelEntrada = document.getElementById('tab-entrada');
  const panelSaida = document.getElementById('tab-saida');

  function showPanel(which) {
    if (which === 'entrada') {
      btnEntrada.setAttribute('aria-selected','true');
      btnSaida.setAttribute('aria-selected','false');
      panelEntrada.classList.remove('hidden');
      panelSaida.classList.add('hidden');
      btnEntrada.focus();
    } else {
      btnEntrada.setAttribute('aria-selected','false');
      btnSaida.setAttribute('aria-selected','true');
      panelEntrada.classList.add('hidden');
      panelSaida.classList.remove('hidden');
      btnSaida.focus();
    }
  }

  btnEntrada.addEventListener('click', () => showPanel('entrada'));
  btnSaida.addEventListener('click', () => showPanel('saida'));
  // keyboard support
  [btnEntrada, btnSaida].forEach(btn => {
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        if (btn === btnEntrada) showPanel('saida'); else showPanel('entrada');
      }
    });
  });

  // Storage keys
  const KEY_ENTRADA = 'portal_processos_entrada_v1';
  const KEY_SAIDA = 'portal_processos_saida_v1';

  // Helpers to manage table rows
  /*function renderTable(key, tableBody) {
    const raw = localStorage.getItem(key);
    const items = raw ? JSON.parse(raw) : [];
    tableBody.innerHTML = '';
    items.forEach((it, idx) => {
      const tr = document.createElement('tr');
      const tdNum = document.createElement('td');
      tdNum.textContent = it.numero || '';
      const tdA = document.createElement('td');
      tdA.textContent = it.assunto || (it.destino || '');
      const tdB = document.createElement('td');
      // choose order based on type
      if (key === KEY_ENTRADA) {
        tdB.textContent = it.origem || '';
      } else {
        tdB.textContent = it.assunto || '';
      }
      const tdData = document.createElement('td');
      tdData.textContent = it.data || '';
      const tdActions = document.createElement('td');

      const del = document.createElement('button');
      del.className = 'action-btn';
      del.type = 'button';
      del.textContent = 'Excluir';
      del.title = 'Excluir registro';
      del.addEventListener('click', () => {
        if (!confirm('Confirma exclusão deste registro?')) return;
        items.splice(idx,1);
        localStorage.setItem(key, JSON.stringify(items));
        renderTable(key, tableBody);
      });

      tdActions.appendChild(del);
      tr.appendChild(tdNum);
      tr.appendChild(tdA);
      tr.appendChild(tdB);
      tr.appendChild(tdData);
      tr.appendChild(tdActions);
      tableBody.appendChild(tr);
    });
  }*/

// render atualizado inverti a logica para o campo destino aparecer corretamente
function renderTable(key, tableBody) {
  const raw = localStorage.getItem(key);
  const items = raw ? JSON.parse(raw) : [];
  tableBody.innerHTML = '';

  items.forEach((it, idx) => {
    const tr = document.createElement('tr');

    // Coluna: número do processo
    const tdNum = document.createElement('td');
    tdNum.textContent = it.numero || '';

    // Colunas variáveis conforme tipo
    const tdA = document.createElement('td');
    const tdB = document.createElement('td');

    if (key === KEY_ENTRADA) {
      // Para entrada: assunto e origem
      tdA.textContent = it.assunto || '';
      tdB.textContent = it.origem || '';
    } else {
      // Para saída: destino e assunto
      tdA.textContent = it.destino || '';
      tdB.textContent = it.assunto || '';
    }

    // Coluna: data
    const tdData = document.createElement('td');
    tdData.textContent = it.data || '';

    // Coluna: ações (excluir)
    const tdActions = document.createElement('td');
    const del = document.createElement('button');
    del.className = 'action-btn';
    del.type = 'button';
    del.textContent = 'Excluir';
    del.title = 'Excluir registro';

    del.addEventListener('click', () => {
      if (!confirm('Confirma exclusão deste registro?')) return;
      items.splice(idx, 1);
      localStorage.setItem(key, JSON.stringify(items));
      renderTable(key, tableBody);
    });

    tdActions.appendChild(del);

    // Monta a linha
    tr.appendChild(tdNum);
    tr.appendChild(tdA);
    tr.appendChild(tdB);
    tr.appendChild(tdData);
    tr.appendChild(tdActions);

    tableBody.appendChild(tr);
  });
}


  // Initialize render
  renderTable(KEY_ENTRADA, document.querySelector('#table-entrada tbody'));
  renderTable(KEY_SAIDA, document.querySelector('#table-saida tbody'));

  // Forms
  const formEntrada = document.getElementById('form-entrada');
  formEntrada.addEventListener('submit', (e) => {
    e.preventDefault();
    const numero = document.getElementById('entrada-numero').value.trim();
    const assunto = document.getElementById('entrada-assunto').value.trim();
    const origem = document.getElementById('entrada-origem').value.trim();
    const data = document.getElementById('entrada-data').value;
    if (!numero || !assunto || !data) {
      alert('Preencha os campos obrigatórios.');
      return;
    }
    const raw = localStorage.getItem(KEY_ENTRADA);
    const items = raw ? JSON.parse(raw) : [];
    items.unshift({ numero, assunto, origem, data, createdAt: new Date().toISOString() });
    localStorage.setItem(KEY_ENTRADA, JSON.stringify(items));
    formEntrada.reset();
    renderTable(KEY_ENTRADA, document.querySelector('#table-entrada tbody'));
  });

  const formSaida = document.getElementById('form-saida');
  formSaida.addEventListener('submit', (e) => {
    e.preventDefault();
    const numero = document.getElementById('saida-numero').value.trim();
    const destino = document.getElementById('saida-destino').value.trim();
    const assunto = document.getElementById('saida-assunto').value.trim();
    const data = document.getElementById('saida-data').value;
    if (!numero || !destino || !data) {
      alert('Preencha os campos obrigatórios.');
      return;
    }
    const raw = localStorage.getItem(KEY_SAIDA);
    const items = raw ? JSON.parse(raw) : [];
    items.unshift({ numero, destino, assunto, data, createdAt: new Date().toISOString() });
    localStorage.setItem(KEY_SAIDA, JSON.stringify(items));
    formSaida.reset();
    renderTable(KEY_SAIDA, document.querySelector('#table-saida tbody'));
  });


  /*pesquisa processo*/

  document.getElementById("btnPesquisar").addEventListener("click", function() {
  const numero = document.getElementById("numeroPesquisa").value.trim().toLowerCase();
  const ano = document.getElementById("anoPesquisa").value.trim();

  const tabela = document.querySelector("table");
  if (!tabela) return;

  const linhas = tabela.querySelectorAll("tbody tr");

  linhas.forEach(linha => {
    const textoLinha = linha.textContent.toLowerCase();
    if (textoLinha.includes(numero) && textoLinha.includes(ano)) {
      linha.style.display = "";
    } else {
      linha.style.display = "none";
    }
  });
});


});