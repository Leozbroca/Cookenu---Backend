import { Request, Response } from "express";
import { connection } from "../data/connection";
import authenticator from "../services/authenticator";

export default async function getFeed(
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
    const userFeed = authenticationData.id

    const follows = await connection('cookenu_follow').where({follower: userFeed})

    const recipes:Array<object> = []
    for(let obj of follows){
        const recipe = await connection('cookenu_recipes').where({ creator_id: obj.following }).select("*")
        const [user] = await connection('cookenu_users').where({ id: obj.following }).select("id", "name")
            for(let obj of recipe){
                const data = obj.creation_date
                const creation_date = data.getDate() + "/" + (data.getMonth() + 1) + "/" + data.getFullYear()
                recipes.push({
                    id:obj.id,
                    title:obj.title,
                    description:obj.description,
                    createdAt: creation_date,
                    creator_id:user.id,
                    creator_name:user.name
                })
            }
    }

    res.status(200).send({
      recipes: recipes
    });
    
   } catch (error:any) {
        res.status(400).send({
        message: error.message,
      });
   }
}