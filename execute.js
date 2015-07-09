var parse = require('./lib/parser/parse');


//---------------Структура синтаксического дерева-------------------------------
// принимающую строку на вход и возвращающую объект, содержащий структуру данных 
// для выражения с начала строки, вместе с частью строки, оставшейся после парсинга.
// function parseExpression(program) {
//   program = skipSpace(program);
//   var match, expr;
//   if (match = /^"([^"]*)"/.exec(program))
//     expr = {type: "value", value: match[1]};
//   else if (match = /^\d+\b/.exec(program))
//     expr = {type: "value", value: Number(match[0])};
//   else if (match = /^[^\s(),"]+/.exec(program))
//     expr = {type: "word", name: match[0]};
//   else
//     throw new SyntaxError("Unexpected syntax: " + program);

//   return parseApply(expr, program.slice(match[0].length));
// }

////////////////////////////////////////////////////////////////////////////////
// function skipSpace(string) {
//   var skippable = string.match(/^(\s|#.*)*/);
//   return string.slice(skippable[0].length);
// }

////////////////////////////////////////////////////////////////////////////////
//parseApply, определяющая, не является ли выражение приложением. 
//Если так и есть, он парсит список аргументов в скобках.

// function parseApply(expr, program) {
//   program = skipSpace(program);
//   if (program[0] != "(")
//     return {expr: expr, rest: program};

//   program = skipSpace(program.slice(1));
//   expr = {type: "apply", operator: expr, args: []};
//   while (program[0] != ")") {
//     var arg = parseExpression(program);
//     expr.args.push(arg.expr);
//     program = skipSpace(arg.rest);
//     if (program[0] == ",")
//       program = skipSpace(program.slice(1));
//     else if (program[0] != ")")
//       throw new SyntaxError("Expected ',' or ')'");
//   }
//   return parseApply(expr, program.slice(1));
// }
////////////////////////////////////////////////////////////////////////////////
/* 
* функцию parse, проверяющую, что она дошла до конца строки после разбора 
* выражения (программа Egg – это одно выражение), и это даст нам структуру 
* данных программы.
*/
// function parse(program) {
//   var result = parseExpression(program);
//   if (skipSpace(result.rest).length > 0)
//     throw new SyntaxError("Unexpected text after program");
//   return result.expr;
// }
////////////////////////////////////////////////////////////////////////////////
//console.log(parse("+(a, 10)"));
////////////////////////////////////////////////////////////////////////////////

//--------------------------------Интерпретатор---------------------------------
function evaluate(expr, env) {
  switch(expr.type) {
    case "value":
      return expr.value;

    case "word":
      if (expr.name in env)
        return env[expr.name];
      else
        throw new ReferenceError("Undefined variable: " +
                                 expr.name);
    case "apply":
      if (expr.operator.type == "word" &&
          expr.operator.name in specialForms)
        return specialForms[expr.operator.name](expr.args,
                                                env);
      var op = evaluate(expr.operator, env);
      if (typeof op != "function")
        throw new TypeError("Applying a non-function.");
      return op.apply(null, expr.args.map(function(arg) {
        return evaluate(arg, env);
      }));
  }
}

var specialForms = Object.create(null);


//----------------------------Специальные формы----------------------------------
////////////////////////////////////////////////////////////////////////////////
//Объект specialForms используется для определения особого синтаксиса Egg. 
//Он сопоставляет слова с функциями, интерпретирующими эти специальные формы.
specialForms["if"] = function(args, env) {
  if (args.length != 3)
    throw new SyntaxError("Bad number of args to if");

  if (evaluate(args[0], env) !== false)
    return evaluate(args[1], env);
  else
    return evaluate(args[2], env);
};
//Конструкция if языка Egg ждёт три аргумента.

////////////////////////////////////////////////////////////////////////////////
//Форма для while
specialForms["while"] = function(args, env) {
  if (args.length != 2)
    throw new SyntaxError("Bad number of args to while");

  while (evaluate(args[0], env) !== false)
    evaluate(args[1], env);

  // Since undefined does not exist in Egg, we return false,
  // for lack of a meaningful result.
  return false;
};

////////////////////////////////////////////////////////////////////////////////
//Ещё одна основная часть языка – do
specialForms["do"] = function(args, env) {
  var value = false;
  args.forEach(function(arg) {
    value = evaluate(arg, env);
  });
  return value;
};

////////////////////////////////////////////////////////////////////////////////
//Чтобы создавать переменные и давать им значения, мы создаём форму define. 
//Она ожидает word в качестве первого аргумента, и выражение, производящее 
//значение, которое надо присвоить этому слову в качестве второго.
specialForms["define"] = function(args, env) {
  if (args.length != 2 || args[0].type != "word")
    throw new SyntaxError("Bad use of define");
  var value = evaluate(args[1], env);
  env[args[0].name] = value;
  return value;
};

//******************************************************************************
specialForms["set"] = function(args, env) {
  if (args.length != 2 || args[0].type != "word")
    throw new SyntaxError("Bad use of set");
  var varName = args[0].name;
  var value = evaluate(args[1], env);

  for (var scope = env; scope; scope = Object.getPrototypeOf(scope)) {
    if (Object.prototype.hasOwnProperty.call(scope, varName)) {
      scope[varName] = value;
      return value;
    }
  }
  throw new ReferenceError("Setting undefined variable " + varName);
};
//******************************************************************************

//--------------------------Окружение-------------------------------------------
////////////////////////////////////////////////////////////////////////////////
//Для использования конструкции if мы должны создать булевские значения.
var topEnv = Object.create(null);

topEnv["true"] = true;
topEnv["false"] = false;

////////////////////////////////////////////////////////////////////////////////
var prog = parse("if(true, false, true)"); 
// console.log(evaluate(prog, topEnv)); // → false
////////////////////////////////////////////////////////////////////////////////

//Для поддержки простых арифметических операторов и сравнения мы 
//добавим несколько функций в окружение.
["+", "-", "*", "/", "==", "<", ">"].forEach(function(op) {
  topEnv[op] = new Function("a, b", "return a " + op + " b;");
});

////////////////////////////////////////////////////////////////////////////////
//Также пригодится способ вывода значений, так что мы обернём console.log 
//в функцию и назовём её print.
topEnv["print"] = function(value) {
  console.log(value);
  return value;
};

//******************************************************************************
topEnv["array"] = function() {
  return Array.prototype.slice.call(arguments, 0);
};

//******************************************************************************
topEnv["length"] = function(array) {
  return array.length;
};

//******************************************************************************
topEnv["element"] = function(array, i) {
  return array[i];
};

////////////////////////////////////////////////////////////////////////////////
//функция run даёт удобный способ записи и запуска. Она создаёт свежее 
//окружение, парсит и разбирает строчки, которые мы ей передаём, так, как будто 
//они являются одной программой.
function run() {
  var env = Object.create(topEnv);
  var program = Array.prototype.slice
    .call(arguments, 0).join("\n");
  return evaluate(parse(program), env);
}
//Array.prototype.slice.call – уловка для превращения объекта, похожего на 
//массив, такого как аргументы, в настоящий массив,

////////////////////////////////////////////////////////////////////////////////
// run("do(define(total, 0),",
//     "   define(count, 1),",
//     "   while(<(count, 11),",
//     "         do(define(total, +(total, count)),",
//     "            define(count, +(count, 1)))),",
//     "   print(total))");
// → 55
////////////////////////////////////////////////////////////////////////////////

//--------------------------------Функции---------------------------------------
////////////////////////////////////////////////////////////////////////////////
//конструкцию fun, которая расценивает последний аргумент как тело функции, 
//а все предыдущие – имена аргументов функции.
specialForms["fun"] = function(args, env) {
  if (!args.length)
    throw new SyntaxError("Functions need a body");
  function name(expr) {
    if (expr.type != "word")
      throw new SyntaxError("Arg names must be words");
    return expr.name;
  }
  var argNames = args.slice(0, args.length - 1).map(name);
  var body = args[args.length - 1];

  return function() {
    if (arguments.length != argNames.length)
      throw new TypeError("Wrong number of arguments");
    var localEnv = Object.create(env);
    for (var i = 0; i < arguments.length; i++)
      localEnv[argNames[i]] = arguments[i];
    return evaluate(body, localEnv);
  };
};

////////////////////////////////////////////////////////////////////////////////
run("do(define(plusOne, fun(a, +(a, 1))),",
    "   print(plusOne(10)))");
// → 11

run("do(define(pow, fun(base, exp,",
    "     if(==(exp, 0),",
    "        1,",
    "        *(base, pow(base, -(exp, 1)))))),",
    "   print(pow(2, 10)))");
// → 1024

run("do(define(sum, fun(array,",
    "     do(define(i, 0),",
    "        define(sum, 0),",
    "        while(<(i, length(array)),",
    "          do(define(sum, +(sum, element(array, i))),",
    "             define(i, +(i, 1)))),",
    "        sum))),",
    "   print(sum(array(1, 2, 3))))");
// → 6

console.log(parse("# hello\nx"));
// → {type: "word", name: "x"}

console.log(parse("a # one\n   # two\n()"));
// → {type: "apply",
//    operator: {type: "word", name: "x"},
//    args: []}

run("do(define(x, 4),",
    "   define(setx, fun(val, set(x, val))),",
    "   setx(50),",
    "   print(x))");
// → 50
// run("set(quux, true)");
// → Some kind of ReferenceError

////////////////////////////////////////////////////////////////////////////////
