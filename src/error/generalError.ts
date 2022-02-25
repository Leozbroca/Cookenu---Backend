import { BaseError } from "./baseError";

export class EmailExists extends BaseError {
    constructor(){
        super("This email already have an account registered" , 400);
    }
}

export class RecipeExists extends BaseError {
    constructor(){
        super("This recipe has already been created" , 400);
    }
}

export class Editing extends BaseError {
    constructor(){
        super("You can't edit this recipe" , 401);
    }
}

export class Deleting extends BaseError {
    constructor(){
        super("You can't delete this recipe" , 401);
    }
}

export class FollowYourself extends BaseError {
    constructor(){
        super("You can't follow yourself" , 400);
    }
}

export class FollowExists extends BaseError {
    constructor(){
        super("You already follow this user" , 400);
    }
}

export class Unfollowing extends BaseError {
    constructor(){
        super("You can't unfollow yourself" , 400);
    }
}

export class NotFollowing extends BaseError {
    constructor(){
        super("You don't follow this user or this user doesn't exist" , 400);
    }
}

export class TryFollow extends BaseError {
    constructor(){
        super("The user you are trying to follow doesn't exist" , 400);
    }
}







