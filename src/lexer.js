export class Token {
  constructor(type, value) {
    this.type = type;
    this.value = value;
  }
}

export class Lexer {
  constructor(input) {
    this.input = input;
    this.position = 0;
    this.currentChar = this.input[0];
    this.keywords = {
      'if': 'IF',
      'else': 'ELSE',
      'while': 'WHILE',
      'for': 'FOR',
      'let': 'LET',
      'print': 'PRINT',
      'return': 'RETURN'
    };
  }

  advance() {
    this.position++;
    this.currentChar = this.position < this.input.length ? this.input[this.position] : null;
  }

  skipWhitespace() {
    while (this.currentChar && /\s/.test(this.currentChar)) {
      this.advance();
    }
  }

  peek() {
    const peekPos = this.position + 1;
    return peekPos < this.input.length ? this.input[peekPos] : null;
  }

  identifier() {
    let result = '';
    while (this.currentChar && /[a-zA-Z_0-9]/.test(this.currentChar)) {
      result += this.currentChar;
      this.advance();
    }
    return this.keywords[result] ? new Token(this.keywords[result], result) : new Token('IDENTIFIER', result);
  }

  number() {
    let result = '';
    while (this.currentChar && /\d/.test(this.currentChar)) {
      result += this.currentChar;
      this.advance();
    }
    if (this.currentChar === '.') {
      result += this.currentChar;
      this.advance();
      while (this.currentChar && /\d/.test(this.currentChar)) {
        result += this.currentChar;
        this.advance();
      }
      return new Token('NUMBER', parseFloat(result));
    }
    return new Token('NUMBER', parseInt(result));
  }

  string() {
    let result = '';
    this.advance(); // Skip opening quote
    while (this.currentChar && this.currentChar !== '"') {
      result += this.currentChar;
      this.advance();
    }
    this.advance(); // Skip closing quote
    return new Token('STRING', result);
  }

  getNextToken() {
    while (this.currentChar) {
      if (/\s/.test(this.currentChar)) {
        this.skipWhitespace();
        continue;
      }

      if (/[a-zA-Z_]/.test(this.currentChar)) {
        return this.identifier();
      }

      if (/\d/.test(this.currentChar)) {
        return this.number();
      }

      if (this.currentChar === '"') {
        return this.string();
      }

      if (this.currentChar === '=' && this.peek() === '=') {
        this.advance();
        this.advance();
        return new Token('EQUALS', '==');
      }

      if (this.currentChar === '!' && this.peek() === '=') {
        this.advance();
        this.advance();
        return new Token('NOT_EQUALS', '!=');
      }

      if (this.currentChar === '<' && this.peek() === '=') {
        this.advance();
        this.advance();
        return new Token('LESS_EQUALS', '<=');
      }

      if (this.currentChar === '>' && this.peek() === '=') {
        this.advance();
        this.advance();
        return new Token('GREATER_EQUALS', '>=');
      }

      if (this.currentChar === '=') {
        this.advance();
        return new Token('ASSIGN', '=');
      }

      const symbolMap = {
        '+': 'PLUS',
        '-': 'MINUS',
        '*': 'MULTIPLY',
        '/': 'DIVIDE',
        '(': 'LPAREN',
        ')': 'RPAREN',
        '{': 'LBRACE',
        '}': 'RBRACE',
        ';': 'SEMICOLON',
        '<': 'LESS',
        '>': 'GREATER',
        ',': 'COMMA'
      };

      if (symbolMap[this.currentChar]) {
        const token = new Token(symbolMap[this.currentChar], this.currentChar);
        this.advance();
        return token;
      }

      throw new Error(`Invalid character: ${this.currentChar}`);
    }

    return new Token('EOF', null);
  }
}