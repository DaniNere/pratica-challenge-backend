# 📝 Comentários Técnicos – Frontend

## 📌 Progresso do Desafio (Frontend) 28-03 e 29-03
- [x] Setup Inicial: Projeto estruturado com Vite + React + TypeScript para máxima performance.
- [x] Estrutura de Pastas: Organização modular (assets, components, hooks, pages, styles, types).
- [x] Tela de Login: Layout Split Screen rigorosamente fiel ao Adobe XD (1366x768).
- [x] Gestão de Autenticação:
  - [x] Criação do AuthContext para gerenciamento global do estado de login.
  - [x] Persistência do Token JWT via localStorage.
  - [x] Implementação de PrivateRoute com <Outlet /> (React Router v6).
- [X] Tela de Login (UI/UX)  
- [x] Gestão de Técnicos (UI/UX):
- [x] Tela de listagem com Sidebar e Header funcional.
- [x] Tabela de técnicos com ações de Editar e Excluir.
- [x] TechnicianModal: Formulário completo para Criação/Edição com máscaras de CEP e Telefone.
- [x] ConfirmationModal: Fluxos de segurança para excluir técnico e cancelar edição.
- [x] Sistema de Toast: Feedback visual de sucesso (3s) em conformidade com o layout.

## 🛠️ Decisões Técnicas
- Styled Components: Escolhido para garantir o encapsulamento do CSS e permitir o uso de props dinâmicas (ex: efeito de Blur no container quando modais estão abertos). Mantendo a fidelidade ao designer.
- Context API & Custom Hooks: Centralização da lógica de autenticação no useAuth, permitindo que qualquer componente acesse o estado de login de forma limpa.
- Atomic Design Adaptado: Componentização de elementos base (Button, Inputs, Modais, Toast) para reaproveitamento total entre as telas de Login e Técnicos.
- Fidelidade de Design:
  - Uso de medidas exatas do protótipo.
  - Implementação de estados de hover e active nos botões e itens de menu.
  - Tratamento de fechamento de modais com stopPropagation para evitar comportamentos indesejados no overlay.

## 🎨 Detalhes de Implementação (UI/UX)
- Máscaras de Input: Implementadas funções de tratamento de string em tempo real para: CEP: 00000-000 Telefone: (00) 00000-0000
- Feedback de Sucesso (Toast): Componente posicionado no topo da tela, com fundo verde (#28A745) e fechamento automático após 3000ms.
- Segurança Visual: Modais de confirmação impedem ações acidentais em processos destrutivos (Excluir).
- Blur Dinâmico: Aplicação de filtro blur(5px) no conteúdo principal sempre que um modal ou toast de confirmação é exibido.
## 🚀 Próximos Passos (Integração) 30-03
- [x] Consumo de API: Substituir os dados mockados (techniciansData) por chamadas reais via Axios.
- [X] Integração CRUD:
   - Conectar o handleSave do modal ao POST e PUT do backend.
   - Conectar o confirmDelete ao DELETE (soft delete) da API.
- [X] Interceptors Axios: Configurar o envio automático do Authorization: Bearer <token> em todas as requisições para as rotas protegidas.
- [X] Tratamento de Erros da API: Exibir Toasts de erro caso a conexão com o banco Azure SQL falhe ou o e-mail já exista.
- Ficou excelente a estrutura! Esse documento ajuda muito a provar a senioridade do seu código no desafio. Algo mais que queira incluir antes de fecharmos essa parte?