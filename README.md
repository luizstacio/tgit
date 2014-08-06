#Tgit

Tgit é um utilitário para integrar o gerenciador de tarefas [Trello](https://trello.com/) com qualquer repositório git. Ele lhe possibilita associar um commit com uma ou mais tarefas e ou move-las.

###Instalando
Para instalar basta executar o comando
```
  npm install -g tgit
```

###Autenticando e selecionando projeto
Autentique pelo navegador selecione o projeto e clique em salvar.
```
  tgit auth
```

###Utilizando
Você pode executar todos os comandos já utilizados com git, porém ao executar o comando push o utilitário listara as tarefas presentes no dashboard configurado.
```
  tgit push origin master
```