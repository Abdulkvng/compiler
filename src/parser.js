export class AST {}

export class Program extends AST {
  constructor(statements) {
    super();
    this.statements = statements;
  }
}

export class Block extends AST {
  constructor(statements) {
    super();
    this.statements = statements;
  }
}

export class VarDecl extends AST {
  constructor(name, initialValue) {
    super();
    this.name = name;
    this.initialValue = initialValue;
  }
}

export class Assign extends AST {
  constructor(name, value) {
    super();
    this.name = name;
    this.value = value;
  }
}

export class Var extends AST {
  constructor(token) {
    super();
    this.token = token;
    this.value = token.value;
  }
}

export class BinOp extends AST {
  constructor(left, op, right) {
    super();
    this.left = left;
    this.token = this.op = op;
    this.right = right;
  }
}

export class UnaryOp extends AST {
  constructor(op, expr) {
    super();
    this.token = this.op = op;
    this.expr = expr;
  }
}

export class Num extends AST {
  constructor(token) {
    super();
    this.token = token;
    this.value = token.value;
  }
}

export class Str extends AST {
  constructor(token) {
    super();
    this.token = token;
    this.value = token.value;
  }
}

export class If extends AST {
  constructor(condition, thenStmt, elseStmt) {
    super();
    this.condition = condition;
    this.thenStmt = thenStmt;
    this.elseStmt = elseStmt;
  }
}

export class While extends AST {
  constructor(condition, body) {
    super();
    this.condition = condition;
    this.body = body;
  }
}

export class Print extends AST {
  constructor(expr) {
    super();
    this.expr = expr;
  }
}

export class Parser {
  constructor(lexer) {
    this.lexer = lexer;
    this.currentToken = this.lexer.getNextToken();
  }

  error() {
    throw new Error('Invalid syntax');
  }

  eat(tokenType) {
    if (this.currentToken.type === tokenType) {
      this.currentToken = this.lexer.getNextToken();
    } else {
      this.error();
    }
  }

  program() {
    const statements = [];
    while (this.currentToken.type !== 'EOF') {
      statements.push(this.statement());
    }
    return new Program(statements);
  }

  statement() {
    switch (this.currentToken.type) {
      case 'LBRACE':
        return this.block();
      case 'IF':
        return this.ifStatement();
      case 'WHILE':
        return this.whileStatement();
      case 'LET':
        return this.varDeclaration();
      case 'PRINT':
        return this.printStatement();
      case 'IDENTIFIER':
        return this.assignmentStatement();
      default:
        return this.expr();
    }
  }

  block() {
    this.eat('LBRACE');
    const statements = [];
    while (this.currentToken.type !== 'RBRACE') {
      statements.push(this.statement());
    }
    this.eat('RBRACE');
    return new Block(statements);
  }

  ifStatement() {
    this.eat('IF');
    this.eat('LPAREN');
    const condition = this.expr();
    this.eat('RPAREN');
    const thenStmt = this.statement();
    let elseStmt = null;
    if (this.currentToken.type === 'ELSE') {
      this.eat('ELSE');
      elseStmt = this.statement();
    }
    return new If(condition, thenStmt, elseStmt);
  }

  whileStatement() {
    this.eat('WHILE');
    this.eat('LPAREN');
    const condition = this.expr();
    this.eat('RPAREN');
    const body = this.statement();
    return new While(condition, body);
  }

  varDeclaration() {
    this.eat('LET');
    const name = this.currentToken.value;
    this.eat('IDENTIFIER');
    this.eat('ASSIGN');
    const initialValue = this.expr();
    return new VarDecl(name, initialValue);
  }

  printStatement() {
    this.eat('PRINT');
    const expr = this.expr();
    return new Print(expr);
  }

  assignmentStatement() {
    const name = this.currentToken.value;
    this.eat('IDENTIFIER');
    this.eat('ASSIGN');
    const value = this.expr();
    return new Assign(name, value);
  }

  expr() {
    let node = this.term();

    while (['PLUS', 'MINUS', 'EQUALS', 'NOT_EQUALS', 'LESS', 'GREATER', 'LESS_EQUALS', 'GREATER_EQUALS'].includes(this.currentToken.type)) {
      const token = this.currentToken;
      if (token.type === 'PLUS') {
        this.eat('PLUS');
      } else if (token.type === 'MINUS') {
        this.eat('MINUS');
      } else if (token.type === 'EQUALS') {
        this.eat('EQUALS');
      } else if (token.type === 'NOT_EQUALS') {
        this.eat('NOT_EQUALS');
      } else if (token.type === 'LESS') {
        this.eat('LESS');
      } else if (token.type === 'GREATER') {
        this.eat('GREATER');
      } else if (token.type === 'LESS_EQUALS') {
        this.eat('LESS_EQUALS');
      } else if (token.type === 'GREATER_EQUALS') {
        this.eat('GREATER_EQUALS');
      }
      node = new BinOp(node, token, this.term());
    }

    return node;
  }

  term() {
    let node = this.factor();

    while (['MULTIPLY', 'DIVIDE'].includes(this.currentToken.type)) {
      const token = this.currentToken;
      if (token.type === 'MULTIPLY') {
        this.eat('MULTIPLY');
      } else if (token.type === 'DIVIDE') {
        this.eat('DIVIDE');
      }
      node = new BinOp(node, token, this.factor());
    }

    return node;
  }

  factor() {
    const token = this.currentToken;
    if (token.type === 'PLUS') {
      this.eat('PLUS');
      return new UnaryOp(token, this.factor());
    }
    if (token.type === 'MINUS') {
      this.eat('MINUS');
      return new UnaryOp(token, this.factor());
    }
    if (token.type === 'NUMBER') {
      this.eat('NUMBER');
      return new Num(token);
    }
    if (token.type === 'STRING') {
      this.eat('STRING');
      return new Str(token);
    }
    if (token.type === 'IDENTIFIER') {
      this.eat('IDENTIFIER');
      return new Var(token);
    }
    if (token.type === 'LPAREN') {
      this.eat('LPAREN');
      const node = this.expr();
      this.eat('RPAREN');
      return node;
    }
    this.error();
  }

  parse() {
    const node = this.program();
    if (this.currentToken.type !== 'EOF') {
      this.error();
    }
    return node;
  }
}