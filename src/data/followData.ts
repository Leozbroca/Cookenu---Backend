import { BaseDatabase } from "./connection";
import { follow } from "../types";

class FollowDatabase extends BaseDatabase {
  private static TABLE_NAME = "cookenu_follow";

  public async followUser(newFollow: follow): Promise<void> {
    try {
      await this.getConnection()
        .insert({
          follower: newFollow.follower,
          following: newFollow.following
        })
        .into(FollowDatabase.TABLE_NAME);
    } catch (error: any) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async unfollowUser(
    follower_id: string,
    following_id: string
  ): Promise<void> {
    try {
      await this.getConnection()
        .del()
        .from(FollowDatabase.TABLE_NAME)
        .where({ follower: follower_id, following: following_id });
    } catch (error: any) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async searchFollow(
    follower_id: string,
    following_id: string
  ): Promise<any> {
    try {
      const result = await this.getConnection()
        .select()
        .from(FollowDatabase.TABLE_NAME)
        .where({
          follower: follower_id,
          following: following_id,
        });

      return result;
    } catch (error: any) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async searchAllFollows(
    follower_id: string,
  ): Promise<any> {
    try {
      const result = await this.getConnection()
        .select()
        .from(FollowDatabase.TABLE_NAME)
        .where({
          follower: follower_id,
        });
      
      return result;
    } catch (error: any) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async deletingAllFollows(id: string): Promise<void> {
    try {
      await this.getConnection()
        .del()
        .from(FollowDatabase.TABLE_NAME)
        .where({
          follower: id
        });
      await this.getConnection()
        .del()
        .from(FollowDatabase.TABLE_NAME)
        .where({
          following: id
        });

    } catch (error: any) {
      throw new Error(error.sqlMessage || error.message);
    }
  }
}

export default new FollowDatabase();
