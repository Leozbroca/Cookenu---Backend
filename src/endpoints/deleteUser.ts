import { Request, Response } from "express";
import { connection } from "../data/connection";
import authenticator from "../services/authenticator";

export default async function deleteUser(
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

    if(authenticationData.role !== "ADMIN"){
        throw new Error("Only a admin user can access this funcionality");
    }

    const user_id = req.params.id
    
    const [user] = await connection('cookenu_users').where({ id: user_id })

    if(!user){
        throw new Error("User not found")
    }

    await connection('cookenu_users').where({ id: user_id }).del()

    res.status(200).send({ message: "User deleted successfully!"});
    
   } catch (error:any) {
        res.status(400).send({
        message: error.message,
      });
   }
}