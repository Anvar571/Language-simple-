// deno-lint-ignore-file no-explicit-any
import {
  AssignmentExpr,
  BinaryExpr,
  CallExpr,
  Expr,
  FunctionDeclaration,
  Identifier,
  MemberExpr,
  NumericLiteral,
  ObjectLitieral,
  Program,
  Property,
  Stmt,
  VarDeclaration,
} from "./ats.ts";

import { Token, tokenize, TokenType } from "./lexer.ts";

/**
 * Frontend for producing a valid AST from sourcode
 */
export default class Parser {
  private tokens: Token[] = [];

  /*
   * Determines if the parsing is complete and the END OF FILE Is reached.
   */
  private not_eof(): boolean {
    return this.tokens[0].type != TokenType.EOF;
  }

  /**
   * Returns the currently available token
   */
  private at() {
    return this.tokens[0] as Token;
  }

  /**
   * Returns the previous token and then advances the tokens array to the next value.
   */
  private eat() {
    const prev = this.tokens.shift() as Token;
    return prev;
  }

  /**
   * Returns the previous token and then advances the tokens array to the next value.
   *  Also checks the type of expected token and throws if the values dnot match.
   */

  private expect(type: TokenType, err: any) {
    const prev = this.tokens.shift() as Token;
    if (!prev || prev.type != type) {
      console.error("Parser Error:\n", err, prev, " - Expecting: ", type);
      Deno.exit(1);
    }

    return prev;
  }

  public produceAST(sourceCode: string): Program {
    this.tokens = tokenize(sourceCode);
    
    const program: Program = {
      kind: "Program",
      body: [],
    };

    // Parse until end of file
    while (this.not_eof()) {
      program.body.push(this.parse_stmt());
    }

    console.log(program);

    return program;
  }

  // Handle complex statement types
  private parse_stmt(): Stmt {
    // skip to parse_expr
    switch (this.at().type) {
      case TokenType.Let:
      case TokenType.Const:
        return this.parse_var_declaration();
      case TokenType.Fn:
        return this.parse_fn_declaration();
      default:
        return this.parse_expr();
    }
  }

  private parse_fn_declaration(): Stmt {
    this.eat();
    const name = this.expect(TokenType.Identifier, "Expected function name following fn keyword").value;

    const args = this.parce_args();
    const params: string[] = [];
    for (const arg of args) {
      if (arg.kind !== "Identifier") {
        console.log(arg);
        throw `Inside function declaration expected parameters to be of string`
      }

      params.push((arg as Identifier).symbol);
    }

    this.expect(TokenType.openBracet, "Expected function body following declaration");

    const body: Stmt[] = [];

    while(
      this.at().type !== TokenType.EOF &&
      this.at().type !== TokenType.closeBracet
    ){
      body.push(this.parse_stmt());
    }

    this.expect(TokenType.closeBracet, "Closing brace expected inside function declaration ");

    const fn = {
      body,
      parameters: params,
      name,
      kind: "FunctionDeclaration"
    } as FunctionDeclaration;

    return fn
  }

  private parse_var_declaration(): Stmt {
    const isConstand = this.eat().type == TokenType.Const;
    const identifier = this.expect(TokenType.Identifier, "Expected identifier name following let | const keywords").value

    if (this.at().type == TokenType.Samicolon) {
      this.eat()
      if (isConstand) {
        throw "Must assign value to constant expression no value provided.";
      }
      return {
        kind: "VarDeclaration",
        identifier,
        constant: false
      } as VarDeclaration;
    }

    this.expect(TokenType.Equals, "Expacted equals token following identifier in var declaration.");

    const declaration = {
      kind: "VarDeclaration",
      value: this.parse_expr(),
      identifier,
      constant: isConstand,
    } as VarDeclaration;

    this.expect(TokenType.Samicolon, "Varible declaration statment must end with semicolon.")
    return declaration
  }

  // Handle expressions
  private parse_expr(): Expr {
    return this.parse_assignment_expr();
  }

  private parse_assignment_expr(): Expr {
    const left = this.parse_object_expr();

    if (this.at().type == TokenType.Equals) {
      this.eat();
      const value = this.parse_assignment_expr();
      return { value, assigne: left, kind: "AssignmentExpr" } as AssignmentExpr;
    }

    return left;
  }

  private parse_object_expr(): Expr {

    if (this.at().type !== TokenType.openBracet) {
      return this.parse_additive_expr();
    }

    this.eat();
    const properties = new Array<Property>();

    while (this.not_eof() && this.at().type != TokenType.closeBracet) {
      const key = this.expect(TokenType.Identifier, "Object literal key exprected").value;

      if (this.at().type == TokenType.Comma) {
        this.eat();
        properties.push({ key, kind: "Property" } as Property);
        continue;
      } else if (this.at().type == TokenType.closeBracet) {
        properties.push({ key, kind: "Property" } as Property);
        continue;
      }

      this.expect(TokenType.Colon, "Messing colon following identier in objextExpr")

      const value = this.parse_expr();

      properties.push({
        kind: "Property",
        value,
        key
      });

      if (this.at().type != TokenType.closeBracet) {
        this.expect(TokenType.Comma, "Expected comma or closing bracket following property")
      }
    }

    this.expect(TokenType.closeBracet, "Object literal missing closing brace");
    return { kind: "ObjectLitieral", properties } as ObjectLitieral;
  }


  // Handle Addition & Subtraction Operations
  private parse_additive_expr(): Expr {
    let left = this.parse_multiplicitave_expr();

    while (this.at().value == "+" || this.at().value == "-") {
      const operator = this.eat().value;
      const right = this.parse_multiplicitave_expr();
      left = {
        kind: "BinaryExpr",
        left,
        right,
        operator,
      } as BinaryExpr;
    }

    return left;
  }

  // Handle Multiplication, Division & Modulo Operations
  private parse_multiplicitave_expr(): Expr {
    let left = this.parce_call_member_expr();

    while (
      this.at().value == "/" || this.at().value == "*" || this.at().value == "%"
    ) {
      const operator = this.eat().value;
      const right = this.parce_call_member_expr();
      left = {
        kind: "BinaryExpr",
        left,
        right,
        operator,
      } as BinaryExpr;
    }

    return left;
  }

  private parce_call_member_expr(): Expr {
    const member = this.parce_mumer_expr();

    if (this.at().type == TokenType.OpenParen) {
      return this.parce_call_expr(member);
    }

    return member
  }

  private parce_call_expr(caller: Expr): Expr {
    let call_expr: Expr = {
      kind: "CallExpr",
      caller,
      args: this.parce_args()
    } as unknown as CallExpr;

    if (this.at().type == TokenType.OpenParen) {
      call_expr = this.parce_call_expr(call_expr);
    }

    return call_expr
  }

  private parce_args(): Expr[] {
    this.expect(TokenType.OpenParen, "Expected open paranthesis.")
    const args = this.at().type == TokenType.CloseParen
      ? [] : this.parce_arg_list();

    this.expect(TokenType.CloseParen, "Missing closing paranthesis inside agruments list");
    return args;
  }
  private parce_arg_list(): Expr[] {
    const args = [this.parse_assignment_expr()];

    while (this.at().type == TokenType.Comma && this.eat()) {
      args.push(this.parse_assignment_expr());
    }

    return args
  }

  private parce_mumer_expr(): Expr {
    let object = this.parse_primary_expr()

    while (this.at().type == TokenType.Dot || this.at().type == TokenType.openBracket) {
      const operator = this.eat();
      let property: Expr;
      let computed: boolean;

      if (operator.type == TokenType.Dot) {
        computed = false;
        property = this.parse_primary_expr();
        if (property.kind != "Identifier") {
          throw `Cannot use dot operator without rigth  hand side being a indentifier`
        } else {
          computed = true
          property = this.parse_expr()
          this.expect(TokenType.closeBracket, "Missing closing bracket in computed value.")
        }

        object = {
          kind: "MemberExpr",
          object,
          property,
          computed
        } as MemberExpr
      }
    }

    return object
  }

  // Parse Literal Values & Grouping Expressions
  private parse_primary_expr(): Expr {
    const tk = this.at().type;

    // Determine which token we are currently at and return literal value
    switch (tk) {
      // User defined values.
      case TokenType.Identifier:
        return { kind: "Identifier", symbol: this.eat().value } as Identifier;


      // Constants and Numeric Constants
      case TokenType.Number:
        return {
          kind: "NumericLiteral",
          value: parseFloat(this.eat().value),
        } as NumericLiteral;

      // Grouping Expressions
      case TokenType.OpenParen: {
        this.eat(); // eat the opening paren
        const value = this.parse_expr();
        this.expect(
          TokenType.CloseParen,
          "Unexpected token found inside parenthesised expression. Expected closing parenthesis.",
        ); // closing paren
        return value;
      }

      // Unidentified Tokens and Invalid Code Reached
      default:
        console.error("Unexpected token found during parsing!", this.at());
        Deno.exit(1);
    }
  }
}


// odamzod bo'lmasa!  bu dunyodan ma'no yuq