import { BinaryExpr, Identifier } from "../../analysis/ats.ts";
import Env from "../env.ts";
import { evaluate } from "../interpreter.ts";
import { NumberVal, RuntimeVal, MK_NULL } from "../value.ts";

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
    try {
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
    } catch (error: any) {
        console.error(error.message)
    }
}

export function env_identifier(source: Identifier, env: Env) {
    const val = env.lookupVar(source.symbol);
    return val
}