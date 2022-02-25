import { BaseError } from "./baseError";

export class UnauthorizedAcess extends BaseError {
    constructor(){
        super("Only a admin user can access this funcionality" , 401);
    }
}