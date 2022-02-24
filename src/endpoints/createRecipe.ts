import { Request, Response } from "express";
import { connection } from "../data/connection";
import authenticator from "../services/authenticator";
import { recipe } from "../types";

export default async function createRecipe(
   req: Request,
   res: Response
): Promise<void> {
   try {
    const token = req.headers.authorization as string;
    if(!token){
        res.statusCode = 401
        res.statusMessage = "token invalido ou nao passado no headers"
        throw new Error("token invalido ou nao passado no headers")
    }

    const authenticationData = authenticator.getTokenData(token);
    const creator_id = authenticationData.id

    const { title, description } = req.body

    if (!title || !description) {
        res.statusCode = 422
        throw new Error("Preencha os campos 'title', 'description'")
    }

    const [recipe] = await connection('cookenu_recipes')
        .where({ title })

    if (recipe) {
        res.statusCode = 409
        throw new Error('Receita já cadastrada')
    }
 
    const data: Date = new Date()
    const creation_date = data.getFullYear() + "-" + (data.getMonth() + 1) + "-" + data.getDate()

    const newRecipe: recipe = { 
        title,
        description,
        creation_date,
        creator_id
    }

    await connection('cookenu_recipes')
    .insert(newRecipe)

    res.status(201).send({ message: "Recipe created successfully!"})

   } catch (error:any) {
      if (res.statusCode === 200) {
         console.log(error)
         res.status(500).send({ message: "Internal server error" })
      } else {
         res.send({ message: error.sqlMessage || error.message })
      }
   }
}