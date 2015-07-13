var parse = require('./lib/parser/parse'),
    evaluate = require('./lib/evaluator/evaluate'),
    TopEnv = require('./lib/environment/TopEnv'),
    SpecialForms = require('./lib/evaluator/SpecialForms'),
    expect = require('expect.js');

describe('A Programming Language', function() {
  describe('#parse(str)', function() {

    it('Input in parser only string', function() {
      expect(parse("str")).to.be.ok();
      expect(function(){
        parse(function(){});
      }).to.throwException(/Parse get only 'string'/);
      expect(function(){
        parse(1);
      }).to.throwException(/Parse get only 'string'/);
      expect(function(){
        parse(true);
      }).to.throwException(/Parse get only 'string'/);
      expect(function(){
        parse(null);
      }).to.throwException(/Parse get only 'string'/);
      expect(function(){
        parse({});
      }).to.throwException(/Parse get only 'string'/);
      expect(function(){
        parse([]);
      }).to.throwException(/Parse get only 'string'/);
      });

      it('Input in parser "x" return { type: "word", name: "x" }', function() {
        expect(parse("x")).to.eql({ type: 'word', name: 'x' });
      });

      it('Required must be property "type"', function() {
        expect(parse("# hello\nx")).to.have.property('type');
        expect(parse("+(a, 10)")).to.have.property('type');
        expect(parse("a # one\n   # two\n()")).to.have.property('type');
      });

      it('Expressions "string" must be property "name"', function() {
        expect(parse("string")).to.have.property('name');
      });

      it('Expressions "number" must be property "value"', function() {
        expect(parse("1")).to.have.property('value');
      });
  });

  describe('#TopEnv()', function() {
    it('TopEnv is object', function() {
      expect(TopEnv).to.be.an('object');
    });

    it('TopEnv must be have property "print"', function() {
      expect(TopEnv).to.have.property("print");
    });

    it('TopEnv must be have property "true"', function() {
      expect(TopEnv).to.have.property("true");
    });

    it('TopEnv must be have property "false"', function() {
      expect(TopEnv).to.have.property("false");
    });

    it('TopEnv must be have property "array"', function() {
      expect(TopEnv).to.have.property("array");
    });

    it('TopEnv must be have property "length"', function() {
      expect(TopEnv).to.have.property("length");
    });

    it('TopEnv must be have property "element"', function() {
      expect(TopEnv).to.have.property("element");
    });

    it('TopEnv["length"](value). Value not be null', function() {
      expect(function(){
        TopEnv["length"](null);
      }).to.throwException();
    });

    it('TopEnv["element"](value). Value not be null', function() {
      expect(function(){
        TopEnv["element"](null);
      }).to.throwException();
    });
  });

  describe('#SpecialForms()', function() {
    it('SpecialForms is object', function() {
      expect(SpecialForms).to.be.an('object');
    });

    it('SpecialForms must be have property "do"', function() {
      expect(SpecialForms).to.have.property("do");
    });

    it('SpecialForms must be have property "if"', function() {
      expect(SpecialForms).to.have.property("if");
    });

    // it('Correct work "if" from SpecialForms', function() {
    //   expect(SpecialForms["if"]("1, 2, 3", TopEnv)).to.be.ok;
    // });

    it('SpecialForms must be have property "while"', function() {
      expect(SpecialForms).to.have.property("while");
    });

    it('SpecialForms must be have property "define"', function() {
      expect(SpecialForms).to.have.property("define");
    });

    it('SpecialForms must be have property "set"', function() {
      expect(SpecialForms).to.have.property("set");
    });

    it('SpecialForms must be have property "fun"', function() {
      expect(SpecialForms).to.have.property("fun");
    });

  });

  describe('#evaluate()', function() {

    it('Correct work of operator "if" in "evaluate"', function() {
      expect(evaluate(parse("if(1, 2, 3)"), TopEnv)).to.be.ok;
    });

    // it('Correct work of operator "while" in "evaluate"', function() {
    //   expect(evaluate(parse("while(1, 2, 3)"), TopEnv)).to.be.ok;
    // });
    
    it('Correct work of operator "do" in "evaluate"', function() {
      expect(evaluate(parse("do()"), TopEnv)).to.be.ok;
    });

    it('Correct work of operator "define" in "evaluate"', function() {
      expect(evaluate(parse("define(x, 3)"), TopEnv)).to.be.ok;
    });

    it('Correct work of operator "set" in "evaluate"', function() {
      expect(evaluate(parse("set(x, 3)"), TopEnv)).to.be.ok;
    });

    it('Correct work of operator "fun" in "evaluate"', function() {
      expect(evaluate(parse("fun(x)"), TopEnv)).to.be.ok;
    });

    it('Correct work of operator "true" in "evaluate"', function() {
      expect(evaluate(parse("true"), TopEnv)).to.be.ok;
    });

    it('Correct work of operator "false" in "evaluate"', function() {
      expect(evaluate(parse("false"), TopEnv)).to.be.ok;
    });

    it('Correct work of operator "+" in "evaluate"', function() {
      expect(evaluate(parse("+"), TopEnv)).to.be.ok;
    });

    it('Correct work of operator "-" in "evaluate"', function() {
      expect(evaluate(parse("-"), TopEnv)).to.be.ok;
    });

    it('Correct work of operator "/" in "evaluate"', function() {
      expect(evaluate(parse("/"), TopEnv)).to.be.ok;
    });

    it('Correct work of operator "*" in "evaluate"', function() {
      expect(evaluate(parse("*"), TopEnv)).to.be.ok;
    });

    it('Correct work of operator "==" in "evaluate"', function() {
      expect(evaluate(parse("=="), TopEnv)).to.be.ok;
    });

    it('Correct work of operator "<" in "evaluate"', function() {
      expect(evaluate(parse("<"), TopEnv)).to.be.ok;
    });

    it('Correct work of operator ">" in "evaluate"', function() {
      expect(evaluate(parse(">"), TopEnv)).to.be.ok;
    });

    it('Correct work of operator "print" in "evaluate"', function() {
      expect(evaluate(parse("print()"), TopEnv)).to.be.ok;
    });

    it('Correct work of operator "array" in "evaluate"', function() {
      expect(evaluate(parse("array(1, 2, 3)"), TopEnv)).to.be.ok;
    });

    it('Correct work of operator "length" in "evaluate"', function() {
      expect(evaluate(parse("length"), TopEnv)).to.be.ok;
    });

  });

});