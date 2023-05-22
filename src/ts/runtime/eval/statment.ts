import { FunctionDeclaration, Program, VarDeclaration } from "../../analysis/ats.ts";
import Env from "../env.ts";
import { evaluate } from "../interpreter.ts";
import { RuntimeVal, MK_NULL, FunctionVal } from "../value.ts";


export function eval_program(program: Program, env: Env) {
    let lastEvaluated: RuntimeVal = MK_NULL();

    for (const statment of program.body) {
        lastEvaluated = evaluate(statment, env);
    }

    return lastEvaluated
}

export function eval_var_declar(
    declaration: VarDeclaration, 
    env: Env
): RuntimeVal {
    const value = declaration.value ? evaluate(declaration.value, env) : MK_NULL()
    return env.declareVar(declaration.identifier, value, declaration.constant);
}

export function eval_funcion_declar(
    declaration: FunctionDeclaration,
    env: Env
): RuntimeVal {
    const fn = {
        type: "function",
        name: declaration.name,
        body: declaration.body,
        parameters: declaration.parameters,
        declarationEnv: env
    } as FunctionVal


    return env.declareVar(declaration.name, fn, true);
}