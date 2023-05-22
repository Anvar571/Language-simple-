import { Stmt } from "../analysis/ats.ts";
import Env from "./env.ts";

/**
 * o'zgaruvchilar oladigan typelar
 */
export type ValueType = "null" | "number"| "boolean" | "object" | "native_fn" | "string" | "function";

export interface RuntimeVal {
    type: ValueType
}

export interface NullVal extends RuntimeVal {
    type: "null",
    value: null
}

export interface NumberVal extends RuntimeVal {
    type: "number"
    value: number
}

export interface BooleanVal extends RuntimeVal {
    type: "boolean"
    value: boolean
}

export interface ObjectVal extends RuntimeVal {
    type: "object",
    properties: Map<string, RuntimeVal>
}

export type FunctionCall = (args: RuntimeVal[], env: Env) => RuntimeVal;

export interface NativeFnVal extends RuntimeVal {
    type: "native_fn",
    call: FunctionCall
}

export interface FunctionVal extends RuntimeVal {
    type: "function",
    parameters: string[],
    body: Stmt[],
    declarationEnv: Env
} 

export function MK_NATIVE_FN(call: FunctionCall){
    return {type: "native_fn", call} as NativeFnVal
}

export function MK_NULL(){
    return {type: "null", value: null} as NullVal
}

export function MK_NUMBER(n=0){
    return {type: "number", value: n} as NumberVal
}

export function MK_BOOL(value = true){
    return {type: "boolean", value: value} as BooleanVal
}