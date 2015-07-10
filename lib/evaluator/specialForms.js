var specialForms = Object.create(null);

//----------------------------Special forms----------------------------------
specialForms["if"] = function(args, env) {
  if (args.length != 3)
    throw new SyntaxError("Bad number of args to if");

  var evaluate = require('./evaluate');
  if (evaluate(args[0], env) !== false)
    return evaluate(args[1], env);
  else
    return evaluate(args[2], env);
};

specialForms["while"] = function(args, env) {
  if (args.length != 2)
    throw new SyntaxError("Bad number of args to while");

  var evaluate = require('./evaluate');
  while (evaluate(args[0], env) !== false)
    evaluate(args[1], env);

  return false;
};

specialForms["do"] = function(args, env) {
  var value = false;
  args.forEach(function(arg) {
    var evaluate = require('./evaluate');
    value = evaluate(arg, env);
  });
  return value;
};

specialForms["define"] = function(args, env) {
  if (args.length != 2 || args[0].type != "word")
    throw new SyntaxError("Bad use of define");
  var evaluate = require('./evaluate');
  var value = evaluate(args[1], env);
  env[args[0].name] = value;
  return value;
};

specialForms["set"] = function(args, env) {
  if (args.length != 2 || args[0].type != "word")
    throw new SyntaxError("Bad use of set");
  var varName = args[0].name;
  var evaluate = require('./evaluate');
  var value = evaluate(args[1], env);

  for (var scope = env; scope; scope = Object.getPrototypeOf(scope)) {
    if (Object.prototype.hasOwnProperty.call(scope, varName)) {
      scope[varName] = value;
      return value;
    }
  }
  throw new ReferenceError("Setting undefined variable " + varName);
};

//--------------------------------Functions-------------------------------------
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
    var evaluate = require('./evaluate');
    return evaluate(body, localEnv);
  };
};


module.exports = specialForms;