import express from 'express';
import cors from 'cors';
import { Lexer } from '../lexer.js';
import { Parser } from '../parser.js';
import { Interpreter } from '../interpreter.js';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/evaluate', (req, res) => {
  try {
    const { expression } = req.body;
    const lexer = new Lexer(expression);
    const parser = new Parser(lexer);
    const interpreter = new Interpreter();
    
    const tree = parser.parse();
    const result = interpreter.interpret(tree);
    
    res.json({ result, error: null });
  } catch (error) {
    res.json({ result: null, error: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});