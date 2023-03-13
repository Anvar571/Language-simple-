const util = require("util");
const  {Lexar} = require('./lexar.js');
const {Parser} = require("./parser");

const lexar = new Lexar();
const tokens = lexar.tokenize("12 * (4+2 - 2*2)");

const par_ser = new Parser(tokens);
const ats = par_ser.parse(tokens);
let result = eval(ats);
console.log(result);
console.log(util.inspect(ats, {showHidden: false, depth: null, colors: true}));