# The Lost — rede social

Projeto inicial de uma rede social com conceito inspirado em feed de vídeos + plataforma de publicações.

## Incluído nesta versão
- Página inicial com feed de vídeos/publicações
- Cadastro e login (estrutura de demonstração)
- Perfis de usuário
- Publicações com texto, imagem e vídeo
- Curtidas, comentários e compartilhamento
- Área de mensagens
- Busca
- Configurações
- Área administrativa
- Página de Termos de Uso
- Página de Privacidade
- Central de segurança/moderação
- Design responsivo para celular e computador

## Importante
Esta entrega é um protótipo funcional de interface. Para colocar o The Lost na internet com contas reais, chat em tempo real, armazenamento de fotos/vídeos e autenticação segura, é necessário conectar um backend, banco de dados, armazenamento de mídia e serviços de e-mail/antispam.

## Como testar
Abra `index.html` no navegador.

Para produção, recomenda-se:
- HTTPS obrigatório
- Senhas com Argon2id ou bcrypt
- Cookies Secure + HttpOnly + SameSite
- CSRF protection
- Rate limiting
- Validação de uploads por MIME/extensão/tamanho
- Antivírus/scan de arquivos
- Banco de dados PostgreSQL
- Armazenamento de mídia em objeto (S3-compatible)
- CDN
- Logs de segurança e auditoria
- Sistema de denúncia/bloqueio
- Backup e recuperação

## Compatibilidade com Android/Termux
A versão 2.1 não usa `better-sqlite3` nem outros módulos nativos. O armazenamento local de demonstração usa JSON, o que facilita executar o The Lost no Termux. Para produção, substitua esse armazenamento por PostgreSQL ou outro banco de dados de servidor.
