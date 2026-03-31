📌 Progresso do Desafio
[x] Setup Inicial: Repositório configurado com Vite + React + TypeScript.
[x] Estrutura de Pastas: Organização modular estabelecida (api, components, pages, contexts, hooks).
[x] Desenvolvimento da Tela de Login: Layout Split Screen fiel ao Adobe XD.
[x] Autenticação & Estado:
[x] Integração com API via Axios.
[x] Implementação de Context API (AuthContext) para gestão global de token.
[x] Persistência de login via localStorage.


##🛠️ Decisões Técnicas
* Arquitetura de Rotas: Implementação de BrowserRouter com PrivateRoute utilizando o componente <Outlet /> do React Router v6. Essa estratégia permite centralizar a lógica de proteção em um único "wrapper", facilitando a escalabilidade caso novas rotas privadas sejam adicionadas.
* Segurança de Dados: Integração com backend utilizando bcrypt para validação de hash de senhas. Isso garante que as credenciais nunca sejam comparadas em texto puro, elevando o padrão de segurança do sistema.
* Injeção de Contexto (Context API): Configuração do AuthProvider no root da aplicação (main.tsx). Essa decisão garante que o estado de autenticação (signed, loading) e o método signIn estejam acessíveis em todos os nós da árvore de componentes via custom hook.
* Refatoração UI & Clean Code: Centralização de componentes de entrada de dados (TextInput, PasswordInput) para reaproveitamento sistemático. Os componentes foram desacoplados da lógica de negócio da página de Login, permitindo sua reutilização direta nos formulários de técnicos (CRUD).
* Gerenciamento de Instâncias: Utilização do Axios para criar uma instância base da API, permitindo a configuração de interceptors ou headers globais (como o Authorization: Bearer token) de forma simplificada após o login.


###🎨 Detalhes de Implementação (UI/UX)
Fidelidade ao Design: Painéis rigorosamente alinhados com as medidas do Adobe XD (660px / 746px).
Tratamento de Erros: Feedback visual de "Credenciais Inválidas" integrado ao catch das requisições Axios.
Responsividade: Layout adaptável para dispositivos móveis com ocultação inteligente do painel de fachada.

###🚀 Próximos Passos
[x] Criar Rotas Privadas para proteger a listagem de técnicos.
[x] CRUD de Técnicos: Implementar as funcionalidades de Criar, Editar e Excluir.





🚀 O que eu melhoraria ou adicionaria (Frontend)
Se houvesse mais tempo para o desenvolvimento, estas seriam as implementações prioritárias para elevar a qualidade do projeto:

Validação de Formulários Robusta:

Implementação da biblioteca React Hook Form em conjunto com Zod ou Yup para validações de esquema mais complexas e tratamento de erros em tempo real campos a campo.
Feedback de Carregamento (Skeleton Text):

Substituir o texto "Carregando técnicos…" por Skeletons (elementos que imitam o formato do conteúdo enquanto os dados não chegam), proporcionando uma percepção de velocidade e UX superior.
Testes Automatizados:

Criação de Testes de Unidade com Jest para as funções de máscara (CEP, Telefone) e Testes de Componente com React Testing Library para os fluxos de abertura e fechamento de modais.
Gerenciamento de Estado de Dados:

Utilização de TanStack Query (React Query) para o consumo da API. Isso permitiria cache automático dos dados, sincronização em segundo plano e tratamento nativo de estados de loading e error.
Internacionalização (i18n):

Embora o código esteja em inglês, a interface poderia suportar múltiplos idiomas (PT-BR/EN) de forma dinâmica através do react-i18next.
Acessibilidade (a11y):

Auditoria completa com Aria-labels, navegação via teclado aprimorada nos modais (Trap Focus) e garantia de contraste de cores para usuários com deficiência visual.
Animações de Layout:

Uso de Framer Motion para animar a entrada e saída das linhas da tabela e a abertura suave dos modais, tornando a interface mais orgânica.

