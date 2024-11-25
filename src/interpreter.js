export class NodeVisitor {
  visit(node) {
    const methodName = `visit_${node.constructor.name}`;
    const visitor = this[methodName] || this.genericVisit;
    return visitor.call(this, node);
  }

  genericVisit(node) {
    throw new Error(`No visit_${node.constructor.name} method`);
  }
}

export class Interpreter extends NodeVisitor {
  constructor() {
    super();
    this.globalScope = {};
  }

  visit_Program(node) {
    let result;
    for (const statement of node.statements) {
      result = this.visit(statement);
    }
    return result;
  }

  visit_Block(node) {
    let result;
    for (const statement of node.statements) {
      result = this.visit(statement);
    }
    return result;
  }

  visit_VarDecl(node) {
    this.globalScope[node.name] = this.visit(node.initialValue);
  }

  visit_Assign(node) {
    if (!(node.name in this.globalScope)) {
      throw new Error(`Variable '${node.name}' is not defined`);
    }
    this.globalScope[node.name] = this.visit(node.value);
  }

  visit_Var(node) {
    const name = node.value;
    if (!(name in this.globalScope)) {
      throw new Error(`Variable '${name}' is not defined`);
    }
    return this.globalScope[name];
  }

  visit_BinOp(node) {
    const left = this.visit(node.left);
    const right = this.visit(node.right);

    switch (node.op.type) {
      case 'PLUS':
        return left + right;
      case 'MINUS':
        return left - right;
      case 'MULTIPLY':
        return left * right;
      case 'DIVIDE':
        return left / right;
      case 'EQUALS':
        return left === right;
      case 'NOT_EQUALS':
        return left !== right;
      case 'LESS':
        return left < right;
      case 'GREATER':
        return left > right;
      case 'LESS_EQUALS':
        return left <= right;
      case 'GREATER_EQUALS':
        return left >= right;
    }
  }

  visit_UnaryOp(node) {
    const op = node.op.type;
    if (op === 'PLUS') {
      return +this.visit(node.expr);
    }
    if (op === 'MINUS') {
      return -this.visit(node.expr);
    }
  }

  visit_Num(node) {
    return node.value;
  }

  visit_Str(node) {
    return node.value;
  }

  visit_If(node) {
    if (this.visit(node.condition)) {
      return this.visit(node.thenStmt);
    } else if (node.elseStmt) {
      return this.visit(node.elseStmt);
    }
  }

  visit_While(node) {
    let result;
    while (this.visit(node.condition)) {
      result = this.visit(node.body);
    }
    return result;
  }

  visit_Print(node) {
    const value = this.visit(node.expr);
    console.log(value);
    return value;
  }

  interpret(tree) {
    return this.visit(tree);
  }
}