var parse = require('./lib/parser/parse'),
    expect = require('expect.js');
describe('A Programming Language', function() {
    describe('#parse(str)', function() {
    it('first test', function() {
      expect(parse("# hello\nx")).to.eql({ type: 'word', name: 'x' });
    });
    it('return object', function() {
      expect(parse("# hello\nx")).to.be.an('object');
    });
    it('empty', function() {
      expect({}).to.be.empty();
    });
  });
});