let usuarioLogado = null; 
let dadosPerfil = { nome: "", username: "", bio: "Buscando conexões no The Lost. 🚀" };

window.onload = function() {
  verificarLogin();
};

function verificarLogin() {
  if (!usuarioLogado) {
    document.getElementById('appHeader').style.display = 'none';
    document.getElementById('appNav').style.display = 'none';
    showAuthPage('login');
  } else {
    document.getElementById('appHeader').style.display = 'flex';
    document.getElementById('appNav').style.display = 'flex';
    document.getElementById('userAvatarTop').innerText = usuarioLogado.name.charAt(0).toUpperCase();
    show('home');
  }
}

function showAuthPage(type) {
  const content = document.getElementById('content');
  if (type === 'login') {
    content.innerHTML = `
      <div class="auth-container">
        <h2 style="color:#b92b8d; margin-bottom:20px;">Entrar no The Lost</h2>
        <input type="email" id="authEmail" class="auth-input" placeholder="Seu E-mail">
        <input type="password" id="authPassword" class="auth-input" placeholder="Sua Senha">
        <button class="auth-btn" onclick="realizarLogin()">Entrar</button>
        <div class="auth-toggle" onclick="showAuthPage('forgot')">Esqueceu sua senha?</div>
        <div class="auth-toggle" onclick="showAuthPage('register')" style="margin-top:10px;">Não tem conta? Cadastre-se</div>
      </div>
    `;
  } else if (type === 'register') {
    content.innerHTML = `
      <div class="auth-container">
        <h2 style="color:#b92b8d; margin-bottom:20px;">Criar Conta</h2>
        <input type="text" id="regName" class="auth-input" placeholder="Nome Completo">
        <input type="text" id="regUsername" class="auth-input" placeholder="Nome de Usuário (@)">
        <input type="email" id="regEmail" class="auth-input" placeholder="Seu E-mail">
        <input type="password" id="regPassword" class="auth-input" placeholder="Crie uma Senha">
        <button class="auth-btn" onclick="realizarCadastro()">Cadastrar</button>
        <div class="auth-toggle" onclick="showAuthPage('login')">Já tem uma conta? Conecte-se</div>
      </div>
    `;
  } else if (type === 'forgot') {
    content.innerHTML = `
      <div class="auth-container">
        <h2 style="color:#b92b8d; margin-bottom:20px;">Recuperar Conta</h2>
        <p style="font-size:13px; color:#aaa; margin-bottom:15px;">Insira seu e-mail cadastrado para receber o código de acesso por 6 dígitos.</p>
        <input type="email" id="forgotEmail" class="auth-input" placeholder="Seu E-mail Cadastrado">
        <button class="auth-btn" onclick="solicitarCodigo()">Enviar Código</button>
        <div class="auth-toggle" onclick="showAuthPage('login')">Voltar para o Login</div>
      </div>
    `;
  } else if (type === 'reset') {
    content.innerHTML = `
      <div class="auth-container">
        <h2 style="color:#b92b8d; margin-bottom:20px;">Verificar Código</h2>
        <p style="font-size:13px; color:#aaa; margin-bottom:15px;">Digite o código de 6 números enviado e crie sua nova senha.</p>
        <input type="email" id="resetEmail" class="auth-input" placeholder="Confirme seu E-mail">
        <input type="text" id="resetCode" class="auth-input" placeholder="Código de 6 dígitos" maxlength="6">
        <input type="password" id="resetNewPassword" class="auth-input" placeholder="Nova Senha">
        <button class="auth-btn" onclick="redefinirSenha()">Alterar Senha</button>
      </div>
    `;
  }
}

// Envia o e-mail e gera o token temporário
async function solicitarCodigo() {
  const email = document.getElementById('forgotEmail').value;
  if(!email) return alert("Insira o seu e-mail!");

  const res = await fetch('/api/forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  const data = await res.json();
  
  if(data.success) {
    alert("Código de verificação gerado! Olhe o console do seu terminal Termux para copiar o código.");
    showAuthPage('reset');
    document.getElementById('resetEmail').value = email;
  } else {
    alert(data.message);
  }
}

// Valida o token e altera a senha
async function redefinirSenha() {
  const email = document.getElementById('resetEmail').value;
  const code = document.getElementById('resetCode').value;
  const newPassword = document.getElementById('resetNewPassword').value;

  if(!email || !code || !newPassword) return alert("Preencha todos os campos!");

  const res = await fetch('/api/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code, newPassword })
  });
  const data = await res.json();

  if(data.success) {
    alert("Senha alterada com sucesso! Faça login com a nova credencial.");
    showAuthPage('login');
  } else {
    alert(data.message);
  }
}

async function realizarCadastro() {
  const name = document.getElementById('regName').value;
  const username = document.getElementById('regUsername').value;
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;

  if(!name || !username || !email || !password) return alert("Preencha todos os campos!");

  const res = await fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, username, email, password })
  });
  const data = await res.json();
  
  if(data.success) {
    alert("Conta criada com sucesso! Faça seu login.");
    showAuthPage('login');
  } else {
    alert(data.message);
  }
}

async function realizarLogin() {
  const email = document.getElementById('authEmail').value;
  const password = document.getElementById('authPassword').value;

  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();

  if(data.success) {
    usuarioLogado = data.user;
    dadosPerfil.nome = data.user.name;
    dadosPerfil.username = data.user.username;
    verificarLogin();
  } else {
    alert(data.message);
  }
}

async function show(page) {
  const content = document.getElementById('content');
  if (!usuarioLogado || !content) return;

  document.querySelectorAll('.nav').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.querySelector(`.nav[onclick="show('${page}')"]`);
  if (activeBtn) activeBtn.classList.add('active');

  if (page === 'home') {
    content.innerHTML = `<div class="feed"><h3 style="color:#aaa;">Feed de Publicações</h3><div id="postsContainer">Carregando feed...</div></div>`;
    carregarPosts();
  } else if (page === 'create') {
    content.innerHTML = `
      <div style="padding: 20px;">
        <h2 style="margin-bottom:20px;">Nova Publicação</h2>
        <div class="create-post-card">
          <textarea id="postText" placeholder="O que você deseja compartilhar, ${usuarioLogado.name}?"></textarea>
          <div class="post-actions">
            <button class="publish-btn" onclick="submitPost()">Publicar</button>
          </div>
        </div>
      </div>
    `;
  } else if (page === 'profile') {
    const primeiraLetra = dadosPerfil.nome.charAt(0).toUpperCase();
    content.innerHTML = `
      <div style="padding: 20px;">
        <div style="display: flex; flex-direction: column; align-items: center; text-align: center; border-bottom: 1px solid #333; padding-bottom: 20px; margin-bottom: 20px;">
          <div class="avatar" style="background:#b92b8d; width:80px; height:80px; font-size:32px; font-weight:bold; margin-bottom:12px;">${primeiraLetra}</div>
          <h2>${dadosPerfil.nome}</h2>
          <p style="color:#b92b8d; margin:4px 0;">@${dadosPerfil.username}</p>
          <p style="color:#aaa; font-size:14px;">${dadosPerfil.bio}</p>
        </div>
        <button class="auth-btn" style="background:#2a2a2a; border:1px solid #333" onclick="usuarioLogado=null; verificarLogin();">Sair da Conta</button>
      </div>
    `;
  } else {
    content.innerHTML = `<div style="padding:20px;"><h2>Página ${page} em desenvolvimento</h2></div>`;
  }
}

async function submitPost() {
  const text = document.getElementById('postText').value;
  if (!text.trim()) return alert('Digite um texto para publicar!');

  const res = await fetch('/api/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: usuarioLogado.id, text })
  });
  const data = await res.json();
  if(data.success) {
    document.getElementById('postText').value = '';
    show('home');
  }
}

async function carregarPosts() {
  const res = await fetch('/api/posts');
  const data = await res.json();
  const container = document.getElementById('postsContainer');
  if(!container) return;

  if(data.success && data.posts.length > 0) {
    container.innerHTML = data.posts.map(post => `
      <div class="card" style="margin-bottom:15px;">
        <div class="card-header">
          <div class="avatar">${post.name.charAt(0).toUpperCase()}</div>
          <div><h3>${post.name}</h3><p>@${post.username}</p></div>
        </div>
        <div class="card-body"><p>${post.text}</p></div>
      </div>
    `).join('');
  } else {
    container.innerHTML = `<p style="color:#666; text-align:center;">Nenhuma publicação no momento.</p>`;
  }
}
