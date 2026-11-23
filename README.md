# HelpDesk TI — Organização de Chamados

**Aluno:** Igor Teodoro Franzon

**Aplicação publicada:** https://chamados-ti-n66s.onrender.com

**Repositório:** https://github.com/SandeHuginn/chamados-ti

## Credenciais de teste

| Perfil | E-mail |
|---|---|
| Usuário comum (`user`) | user.teste@gmail.com |
| Técnico (`tecnico`) | tecnico.teste@gmail.com |
| Administrador (`admin`) | admin.teste@gmail.com |

Sistema web para abertura, acompanhamento e organização de chamados de TI, construído no padrão **MVC** com **Node.js, Express, EJS, CSS e Sequelize (SQLite)**, integrado ao **Firebase Authentication e Firestore** para autenticação e gerenciamento de perfis de acesso.

## Como rodar

```bash
npm install
node app.js        # http://localhost:3000
```

- `npm run dev` — reinicia automaticamente ao salvar arquivos (`node --watch`).
- `npm run seed` — executa a inserção dos dados de exemplo. Atenção: pode recriar os dados do banco.

Na primeira execução, o arquivo `database.sqlite` é criado e populado automaticamente, caso esteja vazio.

Para executar o projeto localmente, configure as variáveis de ambiente necessárias para a integração com o Firebase. O arquivo de credenciais do Firebase Admin deve permanecer fora do repositório.

## Funcionalidades

- **Autenticação:** cadastro e login com e-mail e senha, além de autenticação com Google por meio do Firebase Authentication.
- **Controle de acesso (RBAC):** três perfis de usuário (`user`, `tecnico` e `admin`), com permissões específicas.
- **Gestão de usuários:** visualização dos usuários cadastrados e alteração de seus perfis, exclusiva para administradores.
- **Dashboard**: indicadores, fila prioritária, chamados por prioridade/status, carga da equipe, distribuição por categoria e tempo médio de resolução.
- **Chamados**: CRUD, busca (título, solicitante, protocolo `CH-00001`) e filtros por status, prioridade, categoria e técnico.
- **Restrição de chamados:** usuários comuns visualizam apenas os próprios chamados.
- **Ações rápidas**: alteração de status, prioridade e responsável, conforme as permissões do perfil, com registro automático no histórico.
- **Atendimento técnico:** técnicos e administradores podem realizar operações de atendimento e atualização de status.
- **Exclusão de chamados:** operação restrita aos administradores.
- **Comentários** e linha do tempo por chamado.
- **Técnicos** e **Categorias**: cadastro, edição e remoção.

## Estrutura (MVC)

```text
app.js                 # inicialização do Express e do banco
config/                # conexão Sequelize e configuração do Firebase
models/                # Category, Technician, Ticket, Comment + associações
controllers/           # regras de cada recurso
routes/                # mapeamento de URLs -> controllers
middlewares/           # autenticação, autorização e variáveis globais para as views
views/                 # templates EJS (partials, tickets, technicians, categories e users)
public/                # CSS e JS estáticos
seeders/               # dados de exemplo
utils/                 # helpers (datas, ícones, erros de validação)
```

## Deploy

A aplicação está publicada no Render:

https://chamados-ti-n66s.onrender.com

A autenticação Firebase está configurada para permitir o acesso pelo domínio da aplicação.