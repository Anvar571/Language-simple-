import { RuntimeVal, NumberVal, MK_NULL } from "./value.ts";

import { BinaryExpr, Identifier, NumericLiteral, Program, Stmt, VarDeclaration } from "../analysis/ats.ts"
import Env from "./env.ts";
import { eval_binary_expr, env_identifier } from "./eval/exprassions.ts";
import { eval_program, eval_var_declar } from "./eval/statment.ts";


export function evaluate(atsNode: Stmt, env: Env): RuntimeVal {
    switch (atsNode.kind) {
        case "NumericLiteral":
            return {
                value: ((atsNode as NumericLiteral)).value,
                type: "number",
            } as NumberVal;
        case "BinaryExpr":
            return eval_binary_expr(atsNode as BinaryExpr, env)
        case "Program":
            return eval_program(atsNode as Program, env)
        case "VarDeclaration":
            return eval_var_declar(atsNode as VarDeclaration, env)
        case "Identifier":
            return env_identifier(atsNode as Identifier, env)


        default:
            console.error("This ATS Node has not yet been setup for interpretation", atsNode);
            Deno.exit(0)
    }
}