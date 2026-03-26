# Comentários técnicos – Backend

## Progresso do desafio (Backend)

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
    - `password={desafio2026!}`
  - Exemplo final de `DATABASE_URL`:
    - `sqlserver://desafio-pratica.database.windows.net:1433;initial catalog=desafio-pratica;user=pratica;password={desafio2026!};encrypt=true;trustServerCertificate=false;`

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

## Próximos passos (Backend)

- [ ] Criar estrutura de rotas para `Technician`:
  - `POST /technicians`
  - `GET /technicians`
  - `GET /technicians/:id`
  - `PUT /technicians/:id`
  - `DELETE /technicians/:id` (soft delete).
- [ ] Implementar controllers usando `prisma.technician`.
- [ ] Garantir que listagens sempre filtrem `isDeleted = false`.
- [ ] Tratar erro de e-mail duplicado (código `P2002` do Prisma).
- [ ] Testar endpoints com Postman/Insomnia antes de integrar com o frontend.