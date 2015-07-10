//--------------------------Окружение-------------------------------------------
var parse = require('../parser/parse');
var topEnv = Object.create(null);

topEnv["true"] = true;
topEnv["false"] = false;

["+", "-", "*", "/", "==", "<", ">"].forEach(function(op) {
  topEnv[op] = new Function("a, b", "return a " + op + " b;");
});

topEnv["print"] = function(value) {
  console.log(value);
  return value;
};

topEnv["array"] = function() {
  return Array.prototype.slice.call(arguments, 0);
};

topEnv["length"] = function(array) {
  return array.length;
};

topEnv["element"] = function(array, i) {
  return array[i];
};

module.exports = topEnv;