import { Lexer } from './lexer.js';
import { Parser } from './parser.js';
import { Interpreter } from './interpreter.js';

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function testExpression(expression, expected) {
  const lexer = new Lexer(expression);
  const parser = new Parser(lexer);
  const interpreter = new Interpreter();
  
  const result = interpreter.interpret(parser.parse());
  assert(result === expected, `Expected ${expression} to be ${expected}, but got ${result}`);
  console.log(`✓ ${expression} = ${result}`);
}

// Run tests
console.log('Running tests...\n');

testExpression('2 + 3', 5);
testExpression('5 - 2', 3);
testExpression('3 * 4', 12);
testExpression('10 / 2', 5);
testExpression('2 + 3 * 4', 14);
testExpression('(2 + 3) * 4', 20);
testExpression('10 - 2 * 3', 4);

console.log('\nAll tests passed!');