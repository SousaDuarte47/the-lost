# Deploy do The Lost

## Local
1. Instale Node.js 20+.
2. Copie `.env.example` para `.env` e defina um `JWT_SECRET` forte.
3. Execute `npm install`.
4. Execute `npm start`.
5. Abra `http://localhost:3000`.

## Produção
- Use HTTPS.
- Não use o JWT_SECRET de exemplo.
- Coloque o banco e uploads em armazenamento persistente.
- Use CDN/object storage para vídeos grandes.
- Configure backups e observabilidade.
- Faça revisão jurídica da LGPD/termos antes do lançamento.
- Para escala maior, migre o SQLite para PostgreSQL e o armazenamento local para S3-compatible.
