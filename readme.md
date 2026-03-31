# Prática Challenge – Backend (Technician Management API)

Este projeto é o backend da aplicação de gerenciamento de técnicos, desenvolvido para o desafio técnico da Prática. Ele fornece uma API robusta para o cadastro, listagem, edição e exclusão de técnicos parceiros, além de autenticação para administradores.

---

## 🚀 Como começar (Passo a passo)

Siga as instruções abaixo para configurar e rodar a aplicação em seu ambiente local.

### 1. Clonar o Repositório
Abra o terminal na pasta onde deseja salvar o projeto e execute:
```bash
git clone https://github.com/seu-usuario/nome-do-repositorio.git
cd nome-do-repositorio
```

### 2. Configurar o Banco de Dados (SQL Server)
A aplicação utiliza o **SQL Server**. Você pode utilizá-lo de duas formas:

#### Opção A: Usando Docker (Recomendado)
Se você tem o Docker instalado, pode subir uma instância do SQL Server rapidamente com o comando:
```bash
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=YourStrong!Passw0rd" \
   -p 1433:1433 --name sqlserver_pratica \
   -d mcr.microsoft.com/mssql/server:2022-latest
```

#### Opção B: Instalação Local
Certifique-se de que o serviço do SQL Server está rodando e que você tem as credenciais de acesso (usuário e senha) em mãos.

---

### 3. Instalar Dependências
Dentro da pasta raiz do projeto, instale os pacotes necessários:
```bash
npm install
```

### 4. Configurar Variáveis de Ambiente
Crie um arquivo chamado `.env` na raiz do projeto (use o arquivo `.env.example` como referência) e preencha com as suas credenciais:

```env
# Exemplo de configuração (ajuste conforme seu banco)
DATABASE_URL="sqlserver://localhost:1433;database=pratica_db;user=sa;password=YourStrong!Passw0rd;encrypt=true;trustServerCertificate=true;"
SHADOW_DATABASE_URL="sqlserver://localhost:1433;database=pratica_shadow;user=sa;password=YourStrong!Passw0rd;encrypt=true;trustServerCertificate=true;"

JWT_SECRET="sua_chave_secreta_aqui"
```
*Nota: A `SHADOW_DATABASE_URL` é exigida pelo Prisma para realizar as migrações no SQL Server.*

---

### 5. Preparar o Banco de Dados
Agora, vamos criar as tabelas e popular o usuário administrador inicial:

1. **Rodar as Migrations:** (Cria a estrutura das tabelas)
   ```bash
   npx prisma migrate dev
   ```

2. **Executar o Seed:** (Cria o usuário `de@praticabr.com` no banco)
   ```bash
   npx prisma db seed
   ```

---

### 6. Executar a Aplicação
Com tudo configurado, inicie o servidor:
```bash
npm run dev
```
A API estará disponível em: `http://localhost:3000` (ou na porta configurada).

---

## 🧪 Testes
Para garantir que tudo está funcionando corretamente, você pode rodar os testes automatizados:
```bash
npm test
```

---

## 🛠️ Detalhes Técnicos

### Tecnologias principais

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
   - excluir técnicos (**Soft Delete**: o registro não é removido do banco, apenas marcado como excluído para auditoria).

Todas as rotas de técnicos são protegidas por um middleware de autenticação (`authGuard`), que:
- valida o token JWT;
- garante que apenas usuários com a regra (`role`) de **admin** tenham acesso.

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
  - ao "excluir" um técnico, o sistema altera o status para `isDeleted = true`;
  - listagens consideram apenas `isDeleted = false`.
- `createdAt` e `updatedAt` são atualizados automaticamente pelo Prisma.

### Admin (Administrador)

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
