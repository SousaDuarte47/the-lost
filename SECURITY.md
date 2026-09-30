# Segurança e privacidade — The Lost

## Regras de arquitetura recomendadas para produção

1. HTTPS obrigatório em todo o serviço.
2. Senhas armazenadas somente com Argon2id ou bcrypt; nunca em texto puro.
3. Sessões com cookies Secure, HttpOnly e SameSite.
4. MFA opcional para usuários e obrigatório para administradores.
5. Rate limiting em login, cadastro, recuperação de senha, mensagens e uploads.
6. Validação de tipo, extensão, tamanho e conteúdo dos arquivos enviados.
7. Armazenar uploads fora do diretório executável e usar URLs assinadas quando apropriado.
8. Scan antimalware para arquivos enviados.
9. Proteção CSRF e validação rigorosa no backend.
10. Sanitização de HTML e prevenção contra XSS, SQL injection e SSRF.
11. Controle de permissões por função (usuário, moderador, administrador).
12. Logs de auditoria para ações administrativas, sem armazenar senhas ou conteúdo desnecessário.
13. Backup criptografado e teste periódico de restauração.
14. Política de retenção e exclusão de dados documentada.
15. Ferramentas de bloquear, silenciar e denunciar usuários/conteúdo.
16. Sistema de recurso para decisões de moderação.
17. Proteções contra spam, bots e abuso no chat.
18. Segredos e chaves somente em variáveis de ambiente/secret manager.
19. Dependências atualizadas e verificadas.
20. Revisão jurídica da política de privacidade e termos antes do lançamento.

## Privacidade

O produto deve seguir princípios de minimização, finalidade, transparência, segurança e controle pelo usuário. Como o público previsto inclui o Brasil, a implementação deve ser avaliada à luz da LGPD e de outras leis aplicáveis, conforme o público e a operação do serviço.

Este arquivo é orientação técnica, não aconselhamento jurídico.
