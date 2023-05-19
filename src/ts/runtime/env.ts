import { RuntimeVal } from "./value.ts";

export default class Env {
    private parent?: Env;
    private variable: Map<string, RuntimeVal>;
    private constant: Set<string>;

    constructor(parentEnv?: Env) {
        this.parent = parentEnv;
        this.constant = new Set();
        this.variable = new Map();
    }

    public declareVar(
        varname: string, 
        value: RuntimeVal, 
        constant: boolean
    ): RuntimeVal {
        try {
            if (this.variable.has(varname)) {
                throw "Cannot declare variable ${varname}. As it already is defined";
            }
            this.variable.set(varname, value);
            if (constant){
                this.constant.add(varname);
            }
            return value
        } catch (error: any) {
            console.error(error.message);
        }
    }

    public lookupVar(varname: string): RuntimeVal {
        try {
            const env = this.resolve(varname);
            return env.variable.get(varname) as RuntimeVal;
        } catch (error: any) {
            console.error(error.message);

        }
    }

    public assignVar(varname: string, value: RuntimeVal): RuntimeVal {
        try {
            const env = this.resolve(varname);
            if (env.constant.has(varname)) {
                throw `Cannot ressign to variable ${varname} as id was declared constant.`
            }
            
            env.variable.set(varname, value);
            return value
        } catch (error: any) {
            console.error(error.message);
        }
    }

    public resolve(varname: string): Env {
        try {
            if (this.variable.has(varname)) return this;

            if (this.parent == undefined) {
                throw `Cannot resolve ${varname} as it does not exist`;
            }

            return this.parent.resolve(varname)
        } catch (error: any) {
            console.error(error.message);

        }
    }
}

// bugungu kun mening kunim faqat bugun uchun bazi ishlarda shukur qilish va bugungi kundan foydalanib qolish
