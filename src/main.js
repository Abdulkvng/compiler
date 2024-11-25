import { Lexer } from './lexer.js';
import { Parser } from './parser.js';
import { Interpreter } from './interpreter.js';

function evaluate(expression) {
  const lexer = new Lexer(expression);
  const parser = new Parser(lexer);
  const interpreter = new Interpreter();
  
  const tree = parser.parse();
  return interpreter.interpret(tree);
}

// Example usage
const expressions = [
  '2 + 3',
  '5 - 2',
  '3 * 4',
  '10 / 2',
  '2 + 3 * 4',
  '(2 + 3) * 4',
  '10 - 2 * 3'
];

expressions.forEach(expr => {
  console.log(`${expr} = ${evaluate(expr)}`);
});