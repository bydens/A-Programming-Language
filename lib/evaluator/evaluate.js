//--------------------------------Интерпретатор---------------------------------
//Вы даёте ему синтаксическое дерево и объект окружения, 
//который связывает имена со значениями, а он интерпретирует выражение, 
//представляемое деревом, и возвращает результат.
var SpecialForms = require('./SpecialForms');

function evaluate(expr, env) {
console.log(env);
  switch(expr.type) {
    case "value":
      return expr.value;

    case "word":
      if (expr.name in env)
        return env[expr.name];
      else
        throw new ReferenceError("Undefined variable: " + expr.name);
    case "apply":
      if (expr.operator.type == "word" &&
          expr.operator.name in SpecialForms)
        return SpecialForms[expr.operator.name](expr.args, env);
      var op = evaluate(expr.operator, env);
      if (typeof op != "function")
        throw new TypeError("Applying a non-function.");
      return op.apply(null, expr.args.map(function(arg) {
        return evaluate(arg, env);
      }));
  }
}

module.exports = evaluate;