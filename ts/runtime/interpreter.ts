import { RuntimeVal, NumberVal, NullVal } from "./value.ts";

import { BinaryExpr, NumericLiteral, Program, Stmt } from "../analysis/ats.ts"

function eval_program(program: Program) {
    let lastEvaluated: RuntimeVal = { type: "null", value: "null" } as NullVal;

    for (const statment of program.body) {
        lastEvaluated = evaluate(statment);
    }

    return lastEvaluated
}

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
    }else {
        result = left.value % right.value
    }

    return {value: result, type: "number"}
}

function eval_binary_expr(biop: BinaryExpr): RuntimeVal {
    const left = evaluate(biop.left);
    const right = evaluate(biop.right);

    if (left.type == "number" && right.type == "number") {
        return eval_numeriv_binary_expr(
            left as NumberVal,
            right as NumberVal,
            biop.operator,
        )
    }

    return { type: "null", value: "null" } as NullVal
}

export function evaluate(atsNode: Stmt): RuntimeVal {
    switch (atsNode.kind) {
        case "NumericLiteral":
            return {
                value: ((atsNode as NumericLiteral)).value,
                type: "number",
            } as NumberVal;
        case "BinaryExpr":
            return eval_binary_expr(atsNode as BinaryExpr)
        case "Program":
            return eval_program(atsNode as Program)
        case "NullLiteral":
            return { value: "null", type: "null" } as NullVal;


        default:
            console.error("This ATS Node has not yet been setup for interpretation", atsNode);
            Deno.exit(0)
    }
}