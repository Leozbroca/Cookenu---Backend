import { Request, Response } from "express";
import { connection } from "../data/connection";
import authenticator from "../services/authenticator";
import { follow } from "../types";

export default async function followUser(
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

    const{userToFollowId} =  req.body
    const follower_id = authenticationData.id

    if(!userToFollowId){
        throw new Error("Preencha o campo 'userToFollowId'")
    }

    if(follower_id === userToFollowId){
        throw new Error("You can't follow yourself")
    }

    const [verify] = await connection('cookenu_follow')
    .where({ follower: follower_id, following: userToFollowId })

    if(verify){
        throw new Error("You already follow this user")
    }

    const newFollow: follow = { 
        follower: follower_id,
        following: userToFollowId
    }

    await connection('cookenu_follow')
    .insert(newFollow)

    res.status(200).send({ message: "Followed successfully!"});
    
   } catch (error:any) {
        res.status(400).send({
        message: error.message,
      });
   }
}