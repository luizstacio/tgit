#Tgit

Tgit is an utility to integrate [Trello](https://trello.com/) task manager with any git repository. It enables to associate a commit with one or more tasks and/or move them.

###Installing
To install it, just execute the following command.
```
  npm install -g tgit
```

###Authenticating and selecting the project.
Authenticate through the browser, select the project, then click in save.
```
  tgit auth
```

###Using
You can execute all of commands yet used with git, however, when execute push command the utility will list all of tasks present in the configurated dashboard.
```
  tgit push origin master
```