const {TokenType} = require("./lexar");

class Parser {
    #tokens = []; 
    #cursor = 0;

    #at() {
        return this.#tokens[this.#cursor];
    }

    #peek (n=1){
        return this.#tokens[this.#cursor + n];
    }

    #eatToken(tokenType) {
        if (tokenType == this.#at().type) 
            this.#cursor++
        else 
            throw new Error(`Expected a token to be of type: ${tokenType} instaed recieved ${this.#at().type}`)
    }

    constructor(tokens){
        this.#tokens = tokens;
    }

    parse () {
        return this.#parse_exp();
    }

    #parse_exp() {
        let leftHandSide = this.#parse_term();

        while (this.#at().type == TokenType.PLUS || this.#at().type == TokenType.MINUS){
            const operator = this.#at().value;

            const typeT = (this.#at().type == TokenType.PLUS) ? TokenType.PLUS : TokenType.MINUS;
            this.#eatToken(typeT)
            let res = this.#parse_term();

            leftHandSide = {type: "BinaryOperator", operator, leftHandSide, rightHandSide: res}
        }

        return leftHandSide;
    }

    #parse_term () {
        let leftHandSide = this.#parse_factor();

        while (this.#at().type == TokenType.MULTIPLY || this.#at().type == TokenType.DIVIDE){
            const operator = this.#at().value;

            const typeT = (this.#at().type == TokenType.DIVIDE) ? TokenType.DIVIDE : TokenType.MULTIPLY;
            this.#eatToken(typeT)
            let res = this.#parse_factor();

            leftHandSide = {type: "BinaryOperator", operator, leftHandSide, rightHandSide: res}
        }

        return leftHandSide;
    }

    #parse_factor(){

        if (this.#at().type == TokenType.INTEGER){
            let literal=  {type: "NumericLiteral", value: this.#at().value};
            this.#eatToken(TokenType.INTEGER);
            return literal;
        }

        if (this.#at().type == TokenType.L_PARENT){
            this.#eatToken(TokenType.L_PARENT);
            let expr = this.#parse_exp();
            this.#eatToken(TokenType.R_PARENT);

            return expr;
        }
        
        throw Error("Expected a error")
    }
}


module.exports = {Parser}