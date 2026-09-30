const express=require('express');
const path=require('path');
const fs=require('fs');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const helmet=require('helmet');
const rateLimit=require('express-rate-limit');
const multer=require('multer');
const {Server}=require('socket.io');
const http=require('http');

const app=express();
const server=http.createServer(app);
const io=new Server(server);
const PORT=process.env.PORT||3005;
const JWT_SECRET=process.env.JWT_SECRET||'CHANGE_ME_IN_PRODUCTION';
const DATA=path.join(__dirname,'data');
const UP=path.join(__dirname,'uploads');
const DB_FILE=path.join(DATA,'the-lost.json');
fs.mkdirSync(DATA,{recursive:true}); fs.mkdirSync(UP,{recursive:true});

const initial={users:[],posts:[],likes:[],comments:[],follows:[],messages:[],reports:[],next:{user:1,post:1,comment:1,message:1,report:1}};
let db;
try{db=fs.existsSync(DB_FILE)?JSON.parse(fs.readFileSync(DB_FILE,'utf8')):structuredClone(initial)}catch{db=structuredClone(initial)}
for(const k of Object.keys(initial)) if(!(k in db)) db[k]=structuredClone(initial[k]);
if(!db.next) db.next=structuredClone(initial.next);
function save(){fs.writeFileSync(DB_FILE,JSON.stringify(db,null,2),'utf8')}
function token(u){return jwt.sign({id:u.id,role:u.role},JWT_SECRET,{expiresIn:'7d'});}
function safeUser(u){if(!u)return null; return {id:u.id,username:u.username,email:u.email,bio:u.bio||'',avatar:u.avatar||'',role:u.role,created_at:u.created_at}}
function auth(req,res,next){const h=req.headers.authorization||''; if(!h.startsWith('Bearer '))return res.status(401).json({error:'Autenticação necessária'});try{req.user=jwt.verify(h.slice(7),JWT_SECRET);next()}catch{return res.status(401).json({error:'Sessão inválida ou expirada'})}}
function admin(req,res,next){if(req.user.role!=='admin')return res.status(403).json({error:'Acesso restrito'});next()}
function now(){return new Date().toISOString()}

app.use(helmet({crossOriginResourcePolicy:false}));
app.use(express.json({limit:'1mb'}));
app.use(express.urlencoded({extended:true}));
app.use('/uploads',express.static(UP,{index:false}));
app.use(express.static(path.join(__dirname,'public')));
const authLimiter=rateLimit({windowMs:15*60*1000,max:60,standardHeaders:true,legacyHeaders:false});
const upload=multer({dest:UP,limits:{fileSize:100*1024*1024},fileFilter:(req,file,cb)=>{const ok=/^(image|video)\//.test(file.mimetype);cb(ok?null:new Error('Apenas imagem ou vídeo'),ok)}});

app.post('/api/auth/register',authLimiter,(req,res)=>{
 const {username,email,password}=req.body||{};
 if(!/^[a-zA-Z0-9_.-]{3,30}$/.test(username||''))return res.status(400).json({error:'Usuário inválido'});
 if(!/^\S+@\S+\.\S+$/.test(email||''))return res.status(400).json({error:'E-mail inválido'});
 if((password||'').length<8)return res.status(400).json({error:'A senha precisa ter pelo menos 8 caracteres'});
 const em=email.toLowerCase();
 if(db.users.some(u=>u.username.toLowerCase()===username.toLowerCase()||u.email===em))return res.status(409).json({error:'Usuário ou e-mail já cadastrado'});
 const u={id:db.next.user++,username,email:em,password_hash:bcrypt.hashSync(password,12),bio:'',avatar:'',role:db.users.length===0?'admin':'user',created_at:now()};
 db.users.push(u);save();res.status(201).json({token:token(u),user:safeUser(u)});
});
app.post('/api/auth/login',authLimiter,(req,res)=>{const {email,password}=req.body||{};const u=db.users.find(x=>x.email===(email||'').toLowerCase());if(!u||!bcrypt.compareSync(password||'',u.password_hash))return res.status(401).json({error:'Credenciais inválidas'});res.json({token:token(u),user:safeUser(u)})});
app.get('/api/me',auth,(req,res)=>res.json(safeUser(db.users.find(u=>u.id===req.user.id))));

function postView(p){const u=db.users.find(x=>x.id===p.user_id)||{};return {...p,username:u.username||'usuário',avatar:u.avatar||'',likes:db.likes.filter(x=>x.post_id===p.id).length,comments:db.comments.filter(x=>x.post_id===p.id).length}}
app.get('/api/posts',(req,res)=>res.json(db.posts.slice().sort((a,b)=>b.id-a.id).slice(0,50).map(postView)));
app.post('/api/posts',auth,upload.single('media'),(req,res)=>{const p={id:db.next.post++,user_id:req.user.id,caption:String(req.body.caption||'').slice(0,2000),media_url:'',media_type:'',created_at:now()};if(req.file){p.media_url='/uploads/'+req.file.filename;p.media_type=req.file.mimetype}db.posts.push(p);save();res.status(201).json(postView(p))});
app.post('/api/posts/:id/like',auth,(req,res)=>{const id=Number(req.params.id);const i=db.likes.findIndex(x=>x.user_id===req.user.id&&x.post_id===id);if(i>=0)db.likes.splice(i,1);else db.likes.push({user_id:req.user.id,post_id:id});save();res.json({liked:i<0,likes:db.likes.filter(x=>x.post_id===id).length})});
app.post('/api/posts/:id/comments',auth,(req,res)=>{const body=String(req.body.body||'').trim().slice(0,500);if(!body)return res.status(400).json({error:'Comentário vazio'});const c={id:db.next.comment++,user_id:req.user.id,post_id:Number(req.params.id),body,created_at:now()};db.comments.push(c);save();res.status(201).json({...c,username:db.users.find(u=>u.id===req.user.id)?.username})});
app.post('/api/users/:id/follow',auth,(req,res)=>{const target=Number(req.params.id);if(target===req.user.id)return res.status(400).json({error:'Ação inválida'});const i=db.follows.findIndex(x=>x.follower_id===req.user.id&&x.following_id===target);if(i>=0)db.follows.splice(i,1);else db.follows.push({follower_id:req.user.id,following_id:target});save();res.json({following:i<0})});
app.get('/api/users/:username',(req,res)=>{const u=db.users.find(x=>x.username===req.params.username);if(!u)return res.status(404).json({error:'Usuário não encontrado'});res.json({...safeUser(u),email:undefined,followers:db.follows.filter(x=>x.following_id===u.id).length,following:db.follows.filter(x=>x.follower_id===u.id).length,posts:db.posts.filter(x=>x.user_id===u.id).length})});
app.post('/api/reports',auth,(req,res)=>{const {post_id,reason}=req.body||{};if(!reason)return res.status(400).json({error:'Informe o motivo'});db.reports.push({id:db.next.report++,reporter_id:req.user.id,post_id:post_id?Number(post_id):null,reason:String(reason).slice(0,500),status:'open',created_at:now()});save();res.status(201).json({ok:true})});
app.get('/api/admin/reports',auth,admin,(req,res)=>res.json(db.reports.slice().reverse().slice(0,100).map(r=>({...r,reporter:db.users.find(u=>u.id===r.reporter_id)?.username||'desconhecido'}))));
app.get('/api/admin/stats',auth,admin,(req,res)=>res.json({users:db.users.length,posts:db.posts.length,reports:db.reports.filter(r=>r.status==='open').length}));

io.use((socket,next)=>{try{socket.user=jwt.verify(socket.handshake.auth?.token,JWT_SECRET);next()}catch{next(new Error('Não autenticado'))}});
io.on('connection',socket=>{socket.join('user:'+socket.user.id);socket.on('private_message',data=>{const to=Number(data.to);const body=String(data.body||'').trim().slice(0,2000);if(!to||!body)return;const m={id:db.next.message++,sender_id:socket.user.id,receiver_id:to,body,created_at:now()};db.messages.push(m);save();io.to('user:'+to).emit('private_message',{from:socket.user.id,body,created_at:m.created_at});socket.emit('private_message',{from:socket.user.id,body,created_at:m.created_at})})});

app.use((err,req,res,next)=>res.status(400).json({error:err.message||'Erro'}));
server.listen(PORT,()=>console.log(`The Lost rodando em http://localhost:${PORT}`));
