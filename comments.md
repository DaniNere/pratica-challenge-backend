# Comentários técnicos – Backend

## Progresso do desafio (Backend) 26-03

- [x] Criar repositório e estruturar pastas (`backend`, `frontend`).
- [x] Configurar projeto Node + TypeScript no backend.
- [x] Subir servidor Express minimalista.
- [x] Configurar Prisma no projeto.
- [x] Conectar backend ao banco SQL Server (Azure SQL).
- [x] Definir o model `Technician` no Prisma.
- [x] Configurar `DATABASE_URL` para Azure SQL.
- [x] Criar e configurar banco shadow para o Prisma (`shadowDatabaseUrl`).
- [x] Rodar a primeira migration (`init`) criando a tabela `Technician`.

---

## Decisões técnicas (Backend)

- **Express** escolhido como framework HTTP por ser leve, simples e suficiente para o escopo do desafio (CRUD de técnicos).
- **Prisma** escolhido como ORM para:
  - Ter schema tipado (`schema.prisma`).
  - Gerenciar migrations de forma organizada.
  - Facilitar integração com TypeScript.
- **SQL Server (Azure SQL)** escolhido para simular um ambiente de banco em nuvem mais próximo de produção.
- **Soft delete em Technician**:
  - Campo `isDeleted` no model.
  - Não apaga registros fisicamente, apenas marca como deletados.
  - Consultas futuras vão filtrar `isDeleted = false`.

---

## Modelagem atual – Technician

Model definido no Prisma:

```prisma
model Technician {
  id        Int      @id @default(autoincrement())
  fullName  String
  phone     String
  email     String   @unique
  zipCode   String
  state     String   @db.Char(2)
  city      String
  isDeleted Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

Pontos importantes da modelagem:

- `email` é único (`@unique`) para evitar duplicidade de cadastro.
- `state` é `Char(2)`, garantindo sigla de estado (ex.: "SP", "RJ").
- `isDeleted` controla soft delete.
- `createdAt` e `updatedAt` são gerenciados automaticamente pelo Prisma.

---

## Conexão com Azure SQL + Prisma

### Connection strings


> Observação: ver arquivo .env.exemple.

### Configuração do datasource no Prisma

```prisma
datasource db {
  provider          = "sqlserver"
  url               = env("DATABASE_URL")
  shadowDatabaseUrl = env("SHADOW_DATABASE_URL")
}
```

- `url` aponta para o banco principal (`desafio-pratica`).
- `shadowDatabaseUrl` aponta para o banco shadow (`desafio-pratica-shadow`), obrigatório na Azure para o `migrate dev`.

---

## Problemas encontrados e soluções

### 1. Erro P1013 – Connection string inválida

- **Sintoma**:  
  `P1013: The provided database string is invalid. Error parsing connection string...`
- **Causa**:
  - Connection string em formato não compatível com Prisma.
  - Caracteres especiais na senha (`@`, `!`, etc.) sem escape.
- **Solução**:
  - Ajustar a URL para o formato SQL Server recomendado pelo Prisma, com parâmetros separados por `;`.
  - Escapar a senha entre `{}`:
    - `password={seupassword}`
  - Exemplo final de `DATABASE_URL`:
    - `sqlserver://desafio-pratica.database.windows.net:1433;initial catalog=seubucket-pratica;user=pratica;password={seupassword};encrypt=true;trustServerCertificate=false;`

---

### 2. Acesso negado – Firewall / Rede Azure

- **Sintoma**:  
  Erro durante conexão:  
  `Connection was denied because Deny Public Network Access is set to Yes.`
- **Causa**:
  - Servidor SQL no Azure com `Deny public network access = Yes`.
  - IP da máquina local não estava liberado nas regras de firewall.
- **Solução**:
  - Alterar para `Deny public network access = No`.
  - Adicionar o IP público do ambiente de desenvolvimento (ex.: `170.231.186.145`) nas regras de firewall em "Redes selecionadas".

---

### 3. Erro P3020 – Shadow database obrigatório na Azure

- **Sintoma**:  
  `P3020: The automatic creation of shadow databases is disabled on Azure SQL...`
- **Causa**:
  - Azure SQL não permite criação automática do shadow database pelo Prisma.
- **Solução**:
  - Criar manualmente um banco `desafio-pratica-shadow` no mesmo servidor.
  - Configurar `SHADOW_DATABASE_URL` no `.env`.
  - Adicionar `shadowDatabaseUrl = env("SHADOW_DATABASE_URL")` no `datasource db` do `schema.prisma`.
  - Após isso, `npx prisma migrate dev --name init` passou a funcionar.

---

## Próximos passos (Backend) 27-03

- [x] Criar estrutura de rotas para `Technician`:
  - `POST /technicians`
  - `GET /technicians`
  - `GET /technicians/:id`
  - `PUT /technicians/:id`
  - `DELETE /technicians/:id` (soft delete).
- [x] Implementar controllers usando `prisma.technician`.
- [x] Garantir que listagens sempre filtrem `isDeleted = false`.
- [x] Tratar erro de e-mail duplicado (código `P2002` do Prisma).
- [x] Testar endpoints com Postman/Insomnia antes de integrar com o frontend.

---

## Autenticação e Autorização (Admin + JWT)

### Modelagem – Admin

Para evitar guardar senha em texto puro (ou hash) em variáveis de ambiente, optei por modelar um `Admin` no banco de dados:

```prisma
model Admin {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String   
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

Isso permite:

- Persistir credenciais de admin de forma segura (somente hash no banco).
- Evoluir no futuro para múltiplos admins, se necessário.
- Desacoplar completamente a autenticação de `.env`.

### Seed de Admin 

Para criar o admin inicial (`de@praticabr*****` / `password=********`), foi criado um **script de seed** que roda localmente e escreve o hash diretamente no banco, sem deixar a senha exposta no código-fonte ou no repositório:

```js
import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = "de@praticabr****";
  const plainPassword = "********";

  const existing = await prisma.admin.findUnique({ where: { email } });

  if (existing) {
    console.log("Admin já existe, não será recriado.");
    return;
  }

  const passwordHash = await bcrypt.hash(plainPassword, 10);

  await prisma.admin.create({
    data: {
      email,
      password: passwordHash,
    },
  });

  console.log("Admin criado com sucesso:", email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

> **Importante:** no repositório público, a senha não aparece em texto claro na documentação. Aqui está mascarada (`********`) apenas para explicar o fluxo. No ambiente local, o valor real é configurado pelo desenvolvedor, e apenas o **hash** vai para o banco.

### Fluxo de login

Endpoint implementado:

- `POST /api/auth/login`

Fluxo:

1. Recebe `email` e `password` em texto puro.
2. Busca um `Admin` com esse `email` usando Prisma.
3. Compara `password` com o hash salvo via `bcrypt.compare`.
4. Em caso de sucesso, gera um **token JWT** com:

   ```json
   {
     "sub": 1,
     "role": "admin",
     "email": "de@praticabr.com",
     "iat": 1234567890,
     "exp": 1234569999
   }
   ```

5. Retorna `{ "token": "<jwt>" }` no corpo da resposta.

A chave de assinatura do JWT é configurada via variável de ambiente:

```env
JWT_SECRET=**************
```

(Na documentação pública, o valor é sempre mascarado.)

### Middleware de autorização (authGuard)

Um middleware `authGuard` foi implementado para proteger as rotas de técnicos:

- Lê o header `Authorization: Bearer <token>`.
- Valida o JWT com a `JWT_SECRET`.
- Verifica se `role === "admin"`.
- Em caso de sucesso, anexa o payload em `req.user` e segue para a rota.
- Em caso de falha, responde com:
  - `401` – token ausente ou inválido
  - `403` – role diferente de `admin` (se for necessário no futuro)

Todas as rotas de `Technician` usam esse middleware, garantindo que **somente admins autenticados** conseguem criar/listar/atualizar/excluir técnicos.