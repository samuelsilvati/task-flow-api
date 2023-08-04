
# API de Tarefas com Fastify, TypeScript, Prisma, JWT, Bcrypt e CORS

Esta é uma API RESTful que permite realizar operações CRUD (Criar, Ler, Atualizar, Excluir) em tarefas relacionadas a um usuário. Cada tarefa pertence a uma categoria e uma categoria pode ter várias tarefas. A API fornece endpoints para gerenciar as tarefas, as categorias e os usuários.

O sistema de cadastro de usuários permite a recuperaçao da senha usando o serviço de envio de e-mails SendGrid. Para utilizar esse serviço é nessessário ter cadastro na plataforma: https://sendgrid.com


## Funcionalidades

- Registro de novos usuários
- Autenticação de usuários com JWT (JSON Web Token)
- Recuperaçao de senha por e-mail usando o serviço SendGrid
- Criar, Ler, Atualizar, e Excluir tarefas

## Requisitos

Certifique-se de ter as seguintes ferramentas instaladas em seu ambiente de desenvolvimento:
- Node.js (versão 12 ou superior)
- npm (gerenciador de pacotes do Node.js)
- Banco de dados PostgreSQL (ou outro banco de dados suportado pelo Prisma)

## Configuração

1. Clone este repositório em sua máquina local:

```bash
  git clone https://github.com/samuelsilvati/task-flow-api
```
2. Navegue até o diretório do projeto:

```bash
  cd task-flow-api
```
3. Instale as dependências do projeto:

```bash
  npm install
```
4. Configure as variáveis de ambiente:

- Renomeie o arquivo .env.example para .env.
- Abra o arquivo .env e configure as variáveis de ambiente, como a URL do banco de dados e a chave secreta para JWT.

Obs. O Prisma está configurado com o SQLite. Não é necessário instalar ou configurar outros bancos de dados para rodar em localhost.

5. Execute as migrações do bando de dados:

```bash
  npx prisma migrate dev
```

    
## Executando o Projeto
Execute o seguinte comando para iniciar o servidor:
```bash
  npm run dev
```
O servidor será iniciado e estará disponível em http://localhost:3333.
## Rotas
### Usuários
A API oferece as seguintes rotas:
- POST /signup : Registra um novo usuário.
- POST /auth : Autentica um usuário e retorna um token JWT.
- POST /forgot-password : Envia um email para recuperação de senha.
- POST /reset-password : Cria nova senha para o usuário.
- GET /users : Retorna todos os usuários cadastrados.
- PUT /edit-user : Atualiza um usuário específico com base no ID.
- DELETE /delete : Exclui um usuário específico com base no ID.


Certifique-se de incluir o token JWT no cabeçalho de autorização (Bearer token) para acessar as rotas protegidas.

### Categorias
- GET /categories: Retorna todas as categorias do usuário e as tarefas associadas de cada uma.
- POST /new-category: Cria uma nova categoria.
- PUT /category/:id : Atualiza uma categoria existente pelo seu ID.
- DELETE /category/:id : Exclui uma categoria existente pelo seu ID.

### Tarefas
- GET /tasks: Retorna todas as tarefas do usuário.
- GET /task/:id Retorna uma tarefa específica pelo seu ID.
- POST /new-task: Cria uma nova tarefa.
- PUT /task/:id : Atualiza uma tarefa existente pelo seu ID.
- DELETE /tasks/:id : Exclui uma tarefa existente pelo seu ID.

## Modelos de dados

## Usuário
```json
{
  "name": "Nome do usuário",
  "email": "E-mail do usuário",
  "password": "Senha do usuário",
}
```
### Recuperaçao de senha do usuário
- POST /forgot-password : 
```json
{
  "email": "E-mail do usuário",
}
```
### Mudaça de senha do usuário
- POST /forgot-password : 
```json
{
  "id": "id do usuário",
  "token": "token do usuário",
  "senha": "Nova senha do usuário",
}
```

## Categorias
```json
{
  "name": "Nome da categoria",
}
```

## Tarefas
```json
{
  "name": "Nome da tarefa",
  "description": "Descrição da tarefa",
  "createdAt": "Data inicial da tarefa no formato = 2023-07-01T00:00:00.000Z",
  "updatedAt": "Data final da tarefa no formato = 2023-07-01T00:00:00.000Z",
  "categoryId": 1
}
```
## Contribuição

Se você quiser contribuir para este projeto, sinta-se à vontade para abrir uma "Issue" (problema) ou enviar um "Pull Request" (solicitação de envio de código). Será um prazer receber feedbacks e melhorias para tornar este projeto ainda melhor.
## Licença

Este projeto está licenciado sob a Licença MIT. Consulte o arquivo [LICENSE](/LICENSE) para obter mais informações.

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
