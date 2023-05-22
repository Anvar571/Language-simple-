
// processdagi jarayonlar qaysi jarayon bo'layabdi va qaysilari bor nimalar qila oladi 
// shularning typelari
export type NodeType =
  | "Program"
  | "VarDeclaration"
  | "NumericLiteral"
  | "AssignmentExpr"
  | "MemberExpr"
  | "CallExpr"
  | "Identifier"
  | "Property"
  | "ObjectLitieral"
  | "BinaryExpr";

/**
 * Statements do not result in a value at runtime.
 They contain one or more expressions internally 
*/
// daraxt
export interface Stmt {
  kind: NodeType;
}

/**
 * Defines a block which contains many statements.
 * -  Only one program will be contained in a file.
 */
// har bir type uchun alohida interface bir biriga zarar bermaslik va kengaytirish uchun
export interface Program extends Stmt {
  kind: "Program";
  body: Stmt[];
}


export interface VarDeclaration extends Stmt {
  kind: "VarDeclaration";
  constant: boolean,
  identifier: string,
  value?: Expr
}

/**  Expressions will result in a value at runtime unlike Statements */
export interface Expr extends Stmt {}

export interface AssignmentExpr extends Expr{
  kind: "AssignmentExpr",
  assigne: Expr,
  value: Expr
}

/**
 * A operation with two sides seperated by a operator.
 * Both sides can be ANY Complex Expression.
 * - Supported Operators -> + | - | / | * | %
 */
export interface BinaryExpr extends Expr {
  kind: "BinaryExpr";
  left: Expr;
  right: Expr;
  operator: string; // needs to be of type BinaryOperator
}

export interface MemberExpr extends Expr {
  kind: "MemberExpr";
  object: Expr;
  property: Expr;
  computed: boolean; // needs to be of type BinaryOperator
}

export interface CallExpr extends Expr {
  kind: "CallExpr";
  args: Expr[];
  caller: Expr;
}


// LITERAL / PRIMARY EXPRESSION TYPES
/**
 * Represents a user-defined variable or symbol in source.
 */
export interface Identifier extends Expr {
  kind: "Identifier";
  symbol: string;
}

/**
 * Represents a numeric constant inside the soure code.
 */
export interface NumericLiteral extends Expr {
  kind: "NumericLiteral";
  value: number;
}

export interface Property extends Expr{
  kind: "Property",
  key: string,
  value?: Expr
}

export interface ObjectLitieral extends Expr {
  kind: "ObjectLitieral",
  properties: Property[]
}