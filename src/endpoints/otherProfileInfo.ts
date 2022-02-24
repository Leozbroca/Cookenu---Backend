import { Request, Response } from "express";
import { connection } from "../data/connection";
import authenticator from "../services/authenticator";

export default async function getOtherProfile(
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
    const user_id = req.params.id
    if (authenticationData.role !== "ADMIN") {
      throw new Error("Only a admin user can access this funcionality");
    }

    const user = await getUserById(user_id);

    res.status(200).send({
      id: user.id,
      name: user.name,
      email: user.email
    });
    
   } catch (error:any) {
    console.log("problema aqui")
        res.status(400).send({
        message: error.message,
      });
   }
}

async function getUserById(id:string): Promise<any>{
    const [user] = await connection('cookenu_users')
    .where({ id })

    return user;
}