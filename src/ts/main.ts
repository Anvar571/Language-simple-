import Parser from "./analysis/parser.ts";
import { evaluate } from "./runtime/interpreter.ts";

repl();

function repl() {
  const parser = new Parser();
  console.log("\nRepl v0.1");

  // Continue Repl Until User Stops Or Types `exit`
  while (true) {
    const input = prompt("> ");
    input?.toString()
    // Check for no user input or exit keyword.

    if (!input || input.includes("exit")) {
      Deno.exit(1);
    }
    
    // Produce AST From sourc-code
    const program = parser.produceAST(input);
    
    console.log(program);
    
    // const result = evaluate(program);
    // console.log(result);
  }
}

