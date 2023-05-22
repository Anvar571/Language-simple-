import {
    RuntimeVal,
    NumberVal,
    MK_NULL
} from "./value.ts";

import {
    AssignmentExpr,
    BinaryExpr,
    CallExpr,
    FunctionDeclaration,
    Identifier,
    NumericLiteral,
    ObjectLitieral,
    Program,
    Stmt,
    VarDeclaration
} from "../analysis/ats.ts"

import Env from "./env.ts";
import {
    eval_binary_expr,
    env_identifier,
    eval_assignment,
    eval_object_expr,
    eval_call_expr,
} from "./eval/exprassions.ts";

import {
    eval_program,
    eval_var_declar,
    eval_funcion_declar
} from "./eval/statment.ts";


/**
 * 
 * @param atsNode 
 * @param env 
 * @returns 
 * Hisob kitoblarni bajarib beradi
 * hodisalarga qarab
 */

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
        case "AssignmentExpr":
            return eval_assignment(atsNode as AssignmentExpr, env)
        case "CallExpr":
            return eval_call_expr(atsNode as CallExpr, env)
        case "ObjectLitieral":
            return eval_object_expr(atsNode as ObjectLitieral, env);
        case "VarDeclaration":
            return eval_var_declar(atsNode as VarDeclaration, env)
        case "FunctionDeclaration":
            return eval_funcion_declar(atsNode as FunctionDeclaration, env);
        case "Identifier":
            return env_identifier(atsNode as Identifier, env)

        default:
            console.error("This ATS Node has not yet been setup for interpretation", atsNode);
            Deno.exit(0)
    }
}