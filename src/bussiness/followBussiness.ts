import followerDatabase from "../data/followData";
import authenticator from "../services/authenticator";
import { follow } from "../types";
import userDatabase from "../data/userData"

class FollowBussiness {
  async followUser(token: string, userToFollowId: string) {
    try {
      if (!token) {
        // res.statusCode = 401;
        // res.statusMessage = "token invalido ou nao passado no headers";
        throw new Error("token invalido ou nao passado no headers");
      }

      const authenticationData = authenticator.getTokenData(token);
      const follower_id = authenticationData.id;

      if (!userToFollowId) {
        throw new Error("Preencha o campo 'userToFollowId'");
      }

      if (follower_id === userToFollowId) {
        throw new Error("You can't follow yourself");
      }

      const [userVerify] = await userDatabase.searchProfileById(userToFollowId);
      if(!userVerify){
        throw new Error("This user doesn't exist")
      }
      const [verify] = await followerDatabase.searchFollow(
        follower_id,
        userToFollowId
      );
      if (verify) {
        throw new Error("You already follow this user");
      }

      const newFollow: follow = {
        follower: follower_id,
        following: userToFollowId,
      };

      followerDatabase.followUser(newFollow);
      return "Followed successfully!";
    } catch (error: any) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  async unfollowUser(token: string, userToUnfollowId: string) {
    try {
      if (!token) {
        // res.statusCode = 401;
        // res.statusMessage = "token invalido ou nao passado no headers";
        throw new Error("token invalido ou nao passado no headers");
      }

      const authenticationData = authenticator.getTokenData(token);
      const follower_id = authenticationData.id;

      if (!userToUnfollowId) {
        throw new Error("Preencha o campo 'userToUnfollowId'");
      }

      if (follower_id === userToUnfollowId) {
        throw new Error("You can't unfollow yourself");
      }

      const [verify] = await followerDatabase.searchFollow(
        follower_id,
        userToUnfollowId
      );
      if (!verify) {
        throw new Error(
          "You don't follow this user or this user doesn't exist"
        );
      }

      followerDatabase.unfollowUser(follower_id, userToUnfollowId);
      return "Unfollowed successfully!";
    } catch (error: any) {
      throw new Error(error.sqlMessage || error.message);
    }
  }
}

export default new FollowBussiness();
