import { BaseError } from "./baseError";

export class InvalidCredentials extends BaseError {
    constructor(){
        super("Invalid Credentials", 401)
    }
}