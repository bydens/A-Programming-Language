var parse = require('./parser/parse');
var evaluate = require('./evaluator/evaluate');
var TopEnv = require('./environment/TopEnv');//

////////////////////////////////////////////////////////////////////////////////
//функция run даёт удобный способ записи и запуска. Она создаёт свежее 
//окружение, парсит и разбирает строчки, которые мы ей передаём, так, как будто 
//они являются одной программой.
function run() {
  var env = Object.create(TopEnv);
  var program = Array.prototype.slice
    .call(arguments, 0).join("\n");
  return evaluate(parse(program), env);
}
//Array.prototype.slice.call – уловка для превращения объекта, похожего на 
//массив, такого как аргументы, в настоящий массив,
module.exports = run;