import { AssignmentExpr, BinaryExpr, CallExpr, Identifier, ObjectLitieral } from "../../analysis/ats.ts";
import Env from "../env.ts";
import { evaluate } from "../interpreter.ts";
import { NumberVal, RuntimeVal, MK_NULL, ObjectVal, NativeFnVal } from "../value.ts";

function eval_numeriv_binary_expr(
    left: NumberVal,
    right: NumberVal,
    operator: string
): NumberVal {
    let result: number;
    if (operator == "+") {
        result = left.value + right.value
    } else if (operator == "-") {
        result = left.value - right.value
    } else if (operator == "*") {
        result = left.value * right.value
    } else if (operator == "/") {
        result = left.value / right.value
    } else {
        result = left.value % right.value
    }

    return { value: result, type: "number" }
}

export function eval_binary_expr(biop: BinaryExpr, env: Env): RuntimeVal {
    // try {
        const left = evaluate(biop.left, env);
        const right = evaluate(biop.right, env);

        if (left.type == "number" && right.type == "number") {
            return eval_numeriv_binary_expr(
                left as NumberVal,
                right as NumberVal,
                biop.operator,
            )
        }

        return MK_NULL()
    // } catch (error: any) {
    //     console.error(error.message)
    // }
}

export function env_identifier(source: Identifier, env: Env) {
    const val = env.lookupVar(source.symbol);
    return val
}

export function eval_assignment(node: AssignmentExpr, env: Env) {
    if (node.assigne.kind !== "Identifier")
        throw `Invalid LHS inaide assignment expr ${JSON.stringify(node.assigne)}`

    const varname = (node.assigne as Identifier).symbol;
    return env.assignVar(varname, evaluate(node.value, env));
}

export function eval_object_expr(
    obj: ObjectLitieral, env: Env
): RuntimeVal {
    const object = { type: "object", properties: new Map() } as ObjectVal

    for (const {key, value} of obj.properties){
        const rimeTimeVal = (value==undefined) ? env.lookupVar(key): evaluate(value, env)

        object.properties.set(key, rimeTimeVal)
    }

    return object
}

export function eval_call_expr(
    expr: CallExpr, 
    env: Env
): RuntimeVal {
    const args = expr.args.map((arg) => evaluate(arg, env));
    const fn = evaluate(expr.caller, env);

    if (fn.type !== "native_fn"){
        throw `Cannot call value that is not a function ${JSON.stringify(fn)}`; 
    }
    
    const result = (fn as NativeFnVal).call(args, env)
    return result
}