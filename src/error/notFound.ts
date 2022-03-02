import { BaseError } from "./baseError";

export class UserNotFound extends BaseError {
    constructor(){
        super("User not found" , 404);
    }
}

export class EmailNotFound extends BaseError{
    constructor(){
        super("Email not Found" , 404);
    }
}

export class RecipeNotFound extends BaseError{
    constructor(){
        super("Recipe not Found" , 404);
    }
}

export class RecipesNotFound extends BaseError{
    constructor(){
        super("Recipes not Found" , 404);
    }
}