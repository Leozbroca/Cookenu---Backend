import followerDatabase from "../data/followData";
import authenticator from "../services/authenticator";
import { follow } from "../types";
import userDatabase from "../data/userData"
import { MissingToken } from "../error/missingToken";
import { MissingFields } from "../error/missingFields";
import { FollowYourself, FollowExists, Unfollowing, NotFollowing, TryFollow } from "../error/generalError"

class FollowBussiness {
  async followUser(token: string, userToFollowId: string) {
    if (!token) {
      throw new MissingToken();
    }

    const authenticationData = authenticator.getTokenData(token);
    const follower_id = authenticationData.id;

    if (!userToFollowId) {
      throw new MissingFields();
    }

    if (follower_id === userToFollowId) {
      throw new FollowYourself();
    }

    const [userVerify] = await userDatabase.searchProfileById(userToFollowId);
    if (!userVerify) {
      throw new TryFollow()
    }
    const [verify] = await followerDatabase.searchFollow(
      follower_id,
      userToFollowId
    );
    if (verify) {
      throw new FollowExists()
    }

    const newFollow: follow = {
      follower: follower_id,
      following: userToFollowId,
    };

    followerDatabase.followUser(newFollow);
    return "Followed successfully!";
  }

  async unfollowUser(token: string, userToUnfollowId: string) {
    if (!token) {
      throw new MissingToken()
    }

    const authenticationData = authenticator.getTokenData(token);
    const follower_id = authenticationData.id;

    if (!userToUnfollowId) {
      throw new MissingFields()
    }

    if (follower_id === userToUnfollowId) {
      throw new Unfollowing()
    }

    const [verify] = await followerDatabase.searchFollow(
      follower_id,
      userToUnfollowId
    );
    if (!verify) {
      throw new NotFollowing()
    }

    followerDatabase.unfollowUser(follower_id, userToUnfollowId);
    return "Unfollowed successfully!";
  }
}

export default new FollowBussiness();
