import { Request, Response } from "express";
import { connection } from "../data/connection";
import authenticator from "../services/authenticator";

export default async function deleteRecipe(
   req: Request,
   res: Response
): Promise<void> {
   try {
    const token = req.headers.authorization as string;
    if(!token){
        res.statusCode = 401
        res.statusMessage = "token invalido ou nao passado no headers"
        throw new Error("Invalid Token")
    }

    const authenticationData = authenticator.getTokenData(token);

    const recipe_id = req.params.id
    
    const [recipe] = await connection('cookenu_recipes').where({ id: recipe_id })

    if(!recipe){
        throw new Error("Recipe not found")
    }

    if(authenticationData.role !== "ADMIN"){
        if(recipe.creator_id !== authenticationData.id){
            throw new Error("You can't delete this recipe")
        }
    }

    await connection('cookenu_recipes').where({ id: recipe_id }).del()

    res.status(200).send({ message: "Recipe deleted successfully!"});
    
   } catch (error:any) {
        res.status(400).send({
        message: error.message,
      });
   }
}