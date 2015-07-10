function skipSpace(string) {
  var skippable = string.match(/^(\s|#.*)*/);
  return string.slice(skippable[0].length);
}

module.exports = skipSpace;