import Parser from "./analysis/parser.ts";
import Env from "./runtime/env.ts";
import { evaluate } from "./runtime/interpreter.ts";
import { MK_NULL, MK_BOOL, MK_NUMBER } from "./runtime/value.ts";

repl();

function repl() {
  const parser = new Parser();
  const env = new Env();
  env.declareVar("x", MK_NUMBER(200));
  env.declareVar("true", MK_BOOL(true));
  env.declareVar("null", MK_NULL());
  env.declareVar("false", MK_BOOL(false));

  console.log("\nRepl v0.1");

  // Continue Repl Until User Stops Or Types `exit`
  while (true) {
    const input = prompt("> ");
    input?.toString()
    // Check for no user input or exit keyword.

    if (!input || input.includes("exit")) {
      Deno.exit(1);
    } else if (!input || input.includes("clear")) {
      console.clear();
      continue
    }
    
    // Produce AST From sourc-code
    const program = parser.produceAST(input);
    
    const result = evaluate(program, env);
    console.log(result);
  }
}

