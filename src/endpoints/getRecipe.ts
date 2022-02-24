import { Request, Response } from "express";
import { connection } from "../data/connection";
import authenticator from "../services/authenticator";

export default async function getRecipe(
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

    authenticator.getTokenData(token);

    const recipe_id = req.params.id
    const [recipe] = await connection('cookenu_recipes').where({ id: recipe_id })

    if(!recipe) {
        throw new Error("Recipe not found!")
    }
    const data = recipe.creation_date
    const creation_date = data.getDate() + "/" + (data.getMonth() + 1) + "/" + data.getFullYear()

    const [user] = await connection('cookenu_users').where({ id:recipe.creator_id })

    res.status(200).send({
      id: recipe.id,
      title: recipe.title,
      description: recipe.description,
      creation_date: creation_date,
      creator_name: user.name
    });
    
   } catch (error:any) {
        res.status(400).send({
        message: error.message,
      });
   }
}