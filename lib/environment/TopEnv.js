//--------------------------Окружение-------------------------------------------
var TopEnv = Object.create(null);

TopEnv["true"] = true;
TopEnv["false"] = false;

["+", "-", "*", "/", "==", "<", ">"].forEach(function(op) {
  TopEnv[op] = new Function("a, b", "return a " + op + " b;");
});

TopEnv["print"] = function(value) {
  console.log(value);
  return value;
};

TopEnv["array"] = function() {
  return Array.prototype.slice.call(arguments, 0);
};

TopEnv["length"] = function(array) {
  return array.length;
};

TopEnv["element"] = function(array, i) {
  return array[i];
};

module.exports = TopEnv;