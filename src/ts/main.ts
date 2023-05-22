import Parser from "./analysis/parser.ts";
import Env, { createEnv } from "./runtime/env.ts";
import { evaluate } from "./runtime/interpreter.ts";

repl("./uzbek.uzb");

async function repl(filename: string) {
  const parser = new Parser();
  const env = createEnv();

  const input = await Deno.readTextFile(filename)

  const program = parser.produceAST(input);

  const result = evaluate(program, env);

  // console.log(result)
}

