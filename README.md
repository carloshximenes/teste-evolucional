# Teste Evolucional

Esta aplicação tem como intuito apresentar um modelo de gerenciamento de alunos e professores da Evolucional.

### Features Gerenciamento de Alunos
 - [x] Criar combo de filtro para série e classe;
 - [x] Popular a tela com as informações do estudante e suas relações;
 - [x] Criar opção de editar nome e classe do estudante;
 - [x] Criar botão para gerar 300 novos estudantes alocados em suas respectivas séries e classes de forma aleatória;
 - [x] Criar gráfico apresentando a quantidade de estudantes por série.

 ### Features Gerenciamento de Professores
 - [x] Criar combo de filtro para série e classe;
 - [x] Popular a tela com as informações do professor e suas relações;
 - [x] Criar botão para permitir listar os alunos matriculados na respectiva série;
 - [x] Criar formulário para permiti a criação de um novo relacionamento entre Professor x Matéria x Série x Classe.

## Execução

Executar o comando `ng serve` no console para iniciar a aplicação. A URL de acesso é `http://localhost:4200/`.

## Observações

Como não foi utilizando nenhum back-end para o desenvolvimento desta aplicação, todas as informações adicionais aos JSONs informados foram armazenadas no `localStorage` e, na tela inicio desta aplicação, existe uma opção de resetar as informações para os valores originais.

## Angular

Versão utilizada: 10.2.3