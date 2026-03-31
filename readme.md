# Prática Challenge – Backend (Technician Management API)

Backend da aplicação do desafio da Prática, responsável pelo cadastro e gerenciamento de técnicos parceiros.

Este serviço expõe uma API em **Node.js + Express**, usa **SQL Server** com **Prisma** como ORM e implementa autenticação via **JWT**. Também conta com **testes automatizados** usando **Jest + TypeScript**.

---

## Tecnologias principais

- **Node.js** + **Express**
- **TypeScript**
- **SQL Server** (banco de dados)
- **Prisma ORM**
- **JWT** (JSON Web Token) para autenticação
- **Bcrypt** para hash de senha de admin
- **Jest** + **Supertest** para testes automatizados

---

## Arquitetura e visão geral

### Fluxo principal

1. **Admin autentica** na aplicação com:
   - e-mail: `de@praticabr.com`
   - senha: configurada via script de seed (hash armazenado no banco)
2. O backend retorna um **token JWT**.
3. Com esse token, o frontend pode:
   - cadastrar novos técnicos;
   - listar técnicos;
   - editar técnicos;
   - excluir técnicos (soft delete: marca como excluído, não remove fisicamente).

Todas as rotas de técnicos são protegidas por um middleware de autenticação (`authGuard`), que:
- valida o token JWT;
- garante que o usuário é um admin válido.

---

## Modelagem do banco (Prisma)

### Technician

Model utilizado para o cadastro de técnicos:

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

Decisões de modelagem:

- `email` é único para evitar cadastro duplicado.
- `state` usa `Char(2)`, garantindo siglas como `"SP"`, `"RJ"`.
- `isDeleted` implementa **soft delete**:
  - ao “excluir” um técnico, apenas marca `isDeleted = true`;
  - listagens consideram apenas `isDeleted = false`.
- `createdAt` e `updatedAt` são atualizados automaticamente pelo Prisma.

### Admin

Model para autenticação do usuário administrador:

```prisma
model Admin {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

- Guarda apenas o **hash da senha**, nunca a senha em texto puro.
- Permite evoluir futuramente para múltiplos administradores.

---

## Configuração do Prisma e SQL Server

### Datasource (schema.prisma)

```prisma
datasource db {
  provider          = "sqlserver"
  url               = env("DATABASE_URL")
  shadowDatabaseUrl = env("SHADOW_DATABASE_URL")
}
```

- `DATABASE_URL` aponta para o banco principal.
- `SHADOW_DATABASE_URL` aponta para o banco shadow, necessário para `prisma migrate dev` com SQL Server.

### Exemplo de `.env` para desenvolvimento local (Docker SQL Server)

```env
# Banco principal
DATABASE_URL="sqlserver://localhost:1433;database=pratica_test;user=sa;password=YourStrong!Passw0rd;encrypt=true;trustServerCertificate=true;"

# Banco shadow para Prisma
SHADOW_DATABASE_URL="sqlserver://localhost:1433;database=pratica_test_shadow;user=sa;password=YourStrong!Passw0rd;encrypt=true;trustServerCertificate=true;"

# JWT
JWT_SECRET=changeme-in-local-env
```

> Em produção / Azure SQL, a string de conexão muda (host, usuário, senha, etc.), mas mantém o formato `sqlserver://...;database=...;encrypt=true;trustServerCertificate=...`.

### Migrations

Para aplicar as migrations:

```bash
npx prisma migrate dev --name init
```

Isso cria as tabelas `Admin` e `Technician` de acordo com o schema.

---

## Seed de admin (usuário administrador)

Para criar o admin inicial, existe um script de seed que:

- verifica se já existe um admin com o e-mail de desafio (`de@praticabr.com`);
- se não existir, cria um novo com a senha definida no código/variável local, armazenando apenas o **hash** com `bcrypt`.

Exemplo simplificado:

```ts
import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = "de@********.com";
  const plainPassword = "********";
  const existing = await prisma.admin.findUnique({ where: { email } });

  if (existing) {
    console.log("Admin already exists, skipping seed.");
    return;
  }

  const passwordHash = await bcrypt.hash(plainPassword, 10);

  await prisma.admin.create({
    data: {
      email,
      password: passwordHash,
    },
  });

  console.log("Admin created:", email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async

