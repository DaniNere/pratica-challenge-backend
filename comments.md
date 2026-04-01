
## 🚀 Progresso e Checklist

### Fase 1: Setup, Infraestrutura e Segurança
- [x] Estrutura inicial de pastas e configuração do compilador TypeScript.
- [x] Configuração do ambiente local com SQL Server via Docker.
- [x] Instalação e inicialização do Prisma ORM (Diferencial).
- [x] Implementação de criptografia de senhas com **Bcrypt** para o Admin (Extra).
- [x] Configuração de autenticação via **JWT (Token)** para proteção das rotas (Extra).

### Fase 2: Modelagem e CRUD Principal
- [x] Definição do schema Prisma e execução das migrations.
- [x] Script de Seed para criação automática do usuário administrador.
- [x] Implementação das rotas RESTful para `Technician` (CRUD completo).
- [x] Desenvolvimento de Controllers e Services para isolamento de lógica.

### Fase 3: Validação, Robustez e Confiabilidade
- [x] Validação rigorosa de campos obrigatórios via DTOs com `class-validator`.
- [x] Implementação de Soft Delete e filtragem automática de registros ativos.
- [x] Tratamento de erros específicos do banco (ex: E-mail duplicado P2002).

----
### Fase 4: Qualidade e Testes
- [x] Criação de suíte de testes automatizados com **Jest** e **Supertest** (Diferencial).
- [x] Cobertura de testes para rotas e serviços principais.
- [x] Documentação técnica completa (README e Comments).

---

## 🏗️ Decisões Arquiteturais

### 1. Confiabilidade e Validação (Critério de Avaliação)
Para garantir a **fidelidade ao protótipo** e a integridade dos dados, utilizei DTOs (*Data Transfer Objects*) com a biblioteca `class-validator`. Isso garante que campos como e-mail, telefone e UF (2 dígitos) sigam exatamente o formato exigido antes de serem processados.

----
### 2. Persistência com Soft Delete
Implementei a lógica de "Exclusão Lógica" (`isDeleted`). Ao deletar um técnico, ele apenas deixa de ser exibido na lista, mas permanece no banco para fins de auditoria, atendendo aos requisitos de segurança e histórico.

### 3. Qualidade de Código e ORM
O uso do **Prisma ORM** foi uma escolha estratégica para garantir um código tipado de ponta a ponta. A arquitetura segue a separação de responsabilidades (Routes -> Controllers -> Services), facilitando a manutenção e a legibilidade.

### 4. Segurança e Extras
Embora não solicitados no escopo inicial, implementei **JWT** e **Bcrypt**. Além disso, todas as rotas de técnicos são protegidas por um **Middleware de Autenticação (AuthGuard)**, que intercepta as requisições e valida o token antes de permitir o acesso aos dados. Essa abordagem garante que a lógica de segurança esteja isolada e seja aplicada de forma consistente em todo o módulo.

---

## 🐳 Infraestrutura: SQL Server
A aplicação foi configurada para rodar localmente via Docker, simplificando a avaliação.

**Pontos técnicos relevantes:**
- Configuração interna do Prisma tratada para permitir migrações de desenvolvimento em bancos locais sem interferir nos dados existentes.

---

## 🚀 Melhorias Futuras (Caso houvesse mais tempo)
1. **Documentação com Swagger**: Implementaria o OpenApi para que os endpoints pudessem ser testados diretamente pelo navegador.
2. **Logs de Auditoria**: Além do `isDeleted`, criaria uma tabela de logs para registrar qual admin alterou qual técnico e em que horário.
3. **Containerização Completa**: Criaria um `docker-compose.yml` para subir a API e o Banco de Dados.
4. **Refresh Tokens**: Evoluiria o sistema de autenticação para incluir refresh tokens, melhorando a experiência do usuário administrador.
5. **CI/CD Pipeline**: Configuração de GitHub Actions para rodar os testes automaticamente a cada push.
