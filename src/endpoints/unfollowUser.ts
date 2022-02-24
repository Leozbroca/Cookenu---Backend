import { Request, Response } from "express";
import { connection } from "../data/connection";
import authenticator from "../services/authenticator";

export default async function unfollowUser(
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

    const{userToUnfollowId} =  req.body
    if(!userToUnfollowId){
        throw new Error("Preencha o campo 'userToUnfollowId'")
    }

    const follower_id = authenticationData.id

    if(follower_id === userToUnfollowId){
        throw new Error("You can't unfollow yourself")
    }

    const [verify] = await connection('cookenu_follow')
    .where({ follower: follower_id, following: userToUnfollowId })

    if(!verify){
        throw new Error("You don't follow this user")
    }

    console.log(verify)

    await connection('cookenu_follow')
    .where({follower: follower_id, following: userToUnfollowId})
    .del()


    res.status(200).send({ message: "Unfollowed successfully!"});
    
   } catch (error:any) {
        res.status(400).send({
        message: error.message,
      });
   }
}