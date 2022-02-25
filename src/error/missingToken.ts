import { BaseError } from "./baseError";

export class MissingToken extends BaseError {
    constructor(){
        super("Missing Token", 404)
    }
}

export class InvalidToken extends BaseError {
    constructor(){
        super("Invalid Token", 401)
    }
}