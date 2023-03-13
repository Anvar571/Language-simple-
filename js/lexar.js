const TokenType = {
    PLUS: "PLUS",
    MINUS: "MINUS",
    MULTIPLY: "MULTIPLY",
    DIVIDE: "DIVIDE",
    L_PARENT: "L_PARENT",
    R_PARENT: "R_PARENT",
    INTEGER:"INTEGER",
    EOF:"EOF"
}

class Lexar {

    #stream = "";
    #cursor = 0;

    #at (){
        return this.#stream[this.#cursor]
    }

    
    tokenize (input = "") {
        this.#stream = input;
        this.#cursor = 0;

        const tokens = [];

        while (this.#cursor < this.#stream.length) {
            switch (this.#at()) {
                case " ":
                case "\n":
                case "\t":
                    break;
                case "+":
                    tokens.push({type: TokenType.PLUS, value: "+"})
                    break
                case "-":
                    tokens.push({type: TokenType.MINUS, value: "-"})
                    break
                case "*":
                    tokens.push({type: TokenType.MULTIPLY, value: "*"})
                    break
                case "/":
                    tokens.push({type: TokenType.DIVIDE, value: "/"})
                    break
                case "(":
                    tokens.push({type: TokenType.L_PARENT, value: "("})
                    break
                case ")":
                    tokens.push({type: TokenType.R_PARENT, value: ")"})
                    break
                

                default:
                    if (isNumiric(this.#at())){
                        let strNumber = "";

                        while (this.#cursor < this.#stream.length && isNumiric(this.#at())) {
                            strNumber += this.#at();
                            this.#cursor++;
                        }

                        tokens.push({type: TokenType.INTEGER, value: parseInt(strNumber)})
                        this.#cursor--;
                    }else {
                        throw new Error(`Expected a valid token at postion ${this.#cursor} insted recieved ${this.#at()}`)
                    }
                    break;
            }
            this.#cursor++;
        }
        tokens.push({type: TokenType.EOF, value: "EOF"});
        return tokens;
    }
}

function isNumiric(char= "") {
    return (char.charCodeAt(0) >= 48 && char.charCodeAt(0) <= 57) 
}

module.exports = {
    Lexar, TokenType
}