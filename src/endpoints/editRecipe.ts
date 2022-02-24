import { Request, Response } from "express";
import { connection } from "../data/connection";
import authenticator from "../services/authenticator";

export default async function editRecipe(
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
            throw new Error("You can't edit this recipe")
        }
    }

    const{title, description} = req.body

    if(!title && !description){
        throw new Error("Need at least one input: 'title' or 'description'")
    } else {
        if(!title){
            await connection('cookenu_recipes').where({ id: recipe_id }).update({description: description})
        }
        if(!description){
            await connection('cookenu_recipes').where({ id: recipe_id }).update({title: title})
        }
    }

    await connection('cookenu_recipes').where({ id: recipe_id }).update({title: title, description: description})

    res.status(200).send({ message: "Recipe edited successfully!"});
    
   } catch (error:any) {
        res.status(400).send({
        message: error.message,
      });
   }
}