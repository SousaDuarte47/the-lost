const posts=[
 {id:1,user:"Luna",initial:"L",type:"Vídeo",title:"Meu primeiro vídeo no The Lost",text:"Começando uma nova jornada por aqui! 🚀",likes:124,comments:18},
 {id:2,user:"Dener",initial:"D",type:"Foto",title:"Fim de tarde",text:"Alguns momentos simplesmente merecem ser compartilhados. ✨",likes:87,comments:9},
 {id:3,user:"Juju",initial:"J",type:"Vídeo",title:"Descobertas da semana",text:"O que vocês acharam desse lugar?",likes:56,comments:7},
 {id:4,user:"Bia",initial:"B",type:"Foto",title:"Novo começo",text:"Bem-vindos ao The Lost!",likes:92,comments:31}
];

const pages={
 home:home,
 discover:discover,
 create:create,
 messages:messages,
 profile:profile,
 settings:settings,
 admin:admin,
 terms:terms,
 privacy:privacy
};

function show(page){
    document.querySelectorAll(".nav").forEach(x=>x.classList.toggle("active",x.dataset.page===page));
    const fn=pages[page]||home;
    const contentDiv=document.getElementById("content");
    if(contentDiv){
        contentDiv.innerHTML=fn();
    }
    window.scrollTo({top:0,behavior:"smooth"});
}

function searchPosts(value){
    toast("Pesquisando por: "+value);
}

function toast(msg){
    const t=document.getElementById("toast");
    if(t){
        t.textContent=msg;
        t.classList.add("show");
        setTimeout(()=>t.classList.remove("show"),3000);
    }
}

function home(){
    return '<div class="hero"><div class="eyebrow">Bem-vindo ao The Lost</div><h1>Seu espaço para descobrir e compartilhar.</h1><p>Vídeos, fotos, publicações e conversas — tudo em um só lugar.</p></div><div class="feed">' + 
    posts.map(p => '<article class="card"><div class="card-header"><span class="avatar">' + p.initial + '</span><div><h3>' + p.user + '</h3><p>' + p.type + '</p></div></div><div class="card-body"><h2>' + p.title + '</h2><p>' + p.text + '</p></div><div class="card-footer"><button onclick="toast(\'Curtido!\')">❤️ ' + p.likes + '</button><button onclick="toast(\'Comentários em breve!\')">💬 ' + p.comments + '</button></div></article>').join('') + 
    '</div>';
}

function discover(){return '<div class="hero"><div class="eyebrow">Explorar</div><h1>Descubra pessoas e assuntos.</h1><p>Uma área preparada para recomendações, hashtags e tendências da comunidade.</p></div>';}
function create(){return '<div class="hero"><div class="eyebrow">Criar</div><h1>Compartilhe algo novo.</h1><p>Publique fotos, vídeos ou pensamentos.</p></div><div class="card"><form onsubmit="event.preventDefault();toast(\'Publicado!\')"><textarea placeholder="O que você está pensando?"></textarea><button type="submit" style="background:#5c6bc0;color:#fff;padding:10px 20px;border:none;border-radius:5px;margin-top:10px;cursor:pointer;">Publicar</button></form></div>';}
function messages(){return '<div class="hero"><div class="eyebrow">Mensagens</div><h1>Converse com sua comunidade.</h1><p>Seus chats e mensagens diretas com outros usuários.</p></div><div class="card"><p style="color:#888;">Nenhuma conversa activa no momento.</p></div>';}
function profile(){return '<div class="hero"><div class="profile-head" style="display:flex;align-items:center;gap:15px;margin-bottom:20px;"><div class="big-avatar" style="background:#5c6bc0;color:#fff;width:60px;height:60px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:bold;">M</div><div><h1 style="margin:0;">Meu Perfil</h1><p style="margin:0;color:#888;">@meu_perfil</p></div></div><p>Gerencie suas publicações, fotos, vídeos e preferências.</p></div>';}
function settings(){return '<div class="hero"><div class="eyebrow">Configurações</div><h1>Sua conta sob controle.</h1><p>Altere suas preferências de privacidade e segurança.</p></div>';}
function admin(){return '<div class="hero"><div class="eyebrow">Painel administrativo</div><h1>Área reservada para administrar o sistema.</h1></div>';}
function terms(){return '<div class="hero"><div class="eyebrow">Legal</div><h1>Termos de Uso</h1><p>Ao utilizar o The Lost, você concorda com nossas diretrizes de comunidade e privacidade.</p></div>';}
function privacy(){return '<div class="hero"><div class="eyebrow">Legal</div><h1>Política de Privacidade</h1><p>Seus dados estão protegidos em nosso sistema.</p></div>';}
