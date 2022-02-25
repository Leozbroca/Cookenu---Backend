import { BaseError } from "./baseError";

export class MissingFields extends BaseError {
    constructor(){
        super("Missing fields to complete", 400)
    }
}