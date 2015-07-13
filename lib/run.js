var parse = require('./parser/parse');
var evaluate = require('./evaluator/evaluate');
var TopEnv = require('./environment/TopEnv');

function run() {
  var env = Object.create(TopEnv);
  var program = Array.prototype.slice
    .call(arguments, 0).join("\n");
  return evaluate(parse(program), env);
}

module.exports = run;

// TopEnv["print"]('test');
// console.log(parse("print(23, 34)"));
console.log(parse("length(23, 34)"));
// evaluate(parse("print(23)"), TopEnv);
// run("do(define(x, 3),", " print(x))");