# Desafio: TODO list

## Visão Geral

Este é um aplicativo simples de Lista de Tarefas construído usando HTML, CSS e JavaScript. O aplicativo permite que os usuários adicionem, editem, removam e filtrem tarefas. As tarefas são armazenadas no armazenamento local do navegador, para que persistam mesmo após a página ser atualizada.

## Funcionalidades

- Adicionar novas tarefas à lista.
- Marcar tarefas como concluídas.
- Editar tarefas existentes.
- Remover tarefas da lista.
- Filtrar tarefas para mostrar todas, pendentes ou concluídas.
- Arrastar e soltar para reordenar tarefas.
- As tarefas são salvas no armazenamento local.

## Tecnologias Utilizadas

- HTML para a estrutura do aplicativo.
- CSS para estilização e layout.
- JavaScript para interatividade e funcionalidade.


## Um pouco sobre o JavaScript do projeto (script.js)

- **Funções Principais**:
  - `getTasks` e `saveTasks`: Lidam com a recuperação e o armazenamento de tarefas no armazenamento local.
  - `addTask`: Adiciona uma nova tarefa à lista e atualiza o armazenamento local.
  - `setActiveFilter`: Atualiza a lista de tarefas com base no filtro selecionado (todas, pendentes, concluídas).
  - `renderTasks`: Renderiza as tarefas na página de acordo com o filtro atual.
  - `saveTasksOrder`: Salva a ordem das tarefas após serem reordenadas via arrastar e soltar.
- **Event Listeners**: 
  - Para cliques em botões para adicionar tarefas e aplicar filtros.
  - Para o campo de entrada adicionar tarefas quando a tecla "Enter" é pressionada.
  - Para funcionalidade de arrastar e soltar para reordenar tarefas.

Este projeto de Lista de Tarefas demonstra o uso de tecnologias web básicas para criar um aplicativo funcional e interativo. Ele fornece uma boa base para entender como construir aplicativos web com armazenamento de dados persistente.


# Falando sobre mim e o Desafio

- Meu nome é Nicolas Rosa, sou graduando de Computação na Unicamp
- Fui Presidente da Atlética da Computação Unicamp (AAACEC) 
- Sou estagiário de Software Engineer na empresa John Deere
- Trabalho numa equipe de TI com SAP na parte de SD (Sales & Distribution), onde implementamos projetos em ABAP (Linguagem de desenvolvimento do SAP) e damos suporte a qualquer erro que ocorre no sistema da empresa.
- Admito que não tive muito desenvolvimento em HTML, CSS e JS na empresa (Principalmente React e Node), onde a mais de 1 ano trabalho com o SAP.
- Tive alguns bloqueios por conta de limitações ao usar o computador da empresa onde eu não tenho Docker instalado e recebi alguns bloqueios para configuração do backend e do banco de dados, por isso não implementei (Não vou mentir, não tinha tanto conhecimento neles, mas estou apto a aprender e me desenvolver no que for necessário).
- No fim a Lista de Tarefas foi implemetada da maneira mais simples possível, sei que isso impacta a análise nesse processo seletivo, mas estou entregando ele pois no momento não posso mais continuar trabalhando nele, não me certifiquei de saber que eram 24h de desenvolvimento antes de aceitar participar do processo seletivo, mas independente do resultado muito obrigado pela oportunidade!!!
