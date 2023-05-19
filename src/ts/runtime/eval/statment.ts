import { Program, VarDeclaration } from "../../analysis/ats.ts";
import Env from "../env.ts";
import { evaluate } from "../interpreter.ts";
import { RuntimeVal, MK_NULL } from "../value.ts";


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
