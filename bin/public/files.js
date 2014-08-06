var jade = require('jade');

var indexPage = (
  'doctype html\n'+
  'html(lang="en")\n'+
  '  head\n'+
  '    title= "Config trello-git"\n'+
  '    link(rel="stylesheet", href="style.css")\n'+
  '  body\n'+
  '    h1 Settings TGit\n'+
  '    form(action="saveConfig")\n'+
  '      label(for="board")\n'+
  '        | Select board:\n'+
  '      select(id="board", name="board")\n'+
  '        each board in boards\n'+
  '          option(value=board.id)=board.name\n'+
  '      input(type="submit")'
);

var successPage = (
  'doctype html\n'+
  'html(lang="en")\n'+
  '  head\n'+
  '    title= "Config trello-git"\n'+
  '  body(id="success")\n'+
  '    h1 Success!'
);

var stylePage = ('*,body{margin:0;padding:0}*{font-family:Helvetica}h1{margin:30px auto 40px;width:500px}label{font-size:16px;width:500px;margin:0 auto 5px;display:block}select{display:block;height:40px;width:500px;background:#FFF;border:1px solid silver;font-size:18px;border-radius:5px;margin:0 auto}[type=submit]{width:500px;height:40px;background:#3f8cee;font-size:18px;border:none;color:#FFF;border-radius:5px;font-weight:lighter;margin:30px auto 0;display:block;cursor:pointer}');

function index (data) {
  return jade.render(indexPage, data || {});
}

function success (data) {
  return jade.render(successPage, data || {});
}

function styles () {
  return stylePage;
}

module.exports = {
  index: index,
  success: success,
  styles: styles
}