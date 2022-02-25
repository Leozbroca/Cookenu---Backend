import { Request, Response } from "express";
import followBussiness from "../bussiness/followBussiness";
import { BaseDatabase } from "../data/connection";

class FollowController {
  async followUser(req: Request, res: Response): Promise<void> {
    try {
      const token = req.headers.authorization as string;
      const { userToFollowId } = req.body;

      const message = await followBussiness.followUser(token, userToFollowId);

      res.status(200).send({ message });
    } catch (error: any) {
      res.status(400).send({
        message: error.message,
      });
    } finally {
      await BaseDatabase.destroyConnection();
    }
  }

  async unfollowUser(req: Request, res: Response): Promise<void> {
    try {
      const token = req.headers.authorization as string;
      const { userToUnfollowId } = req.body;

      const message = await followBussiness.unfollowUser(token, userToUnfollowId);

      res.status(200).send({ message });
    } catch (error: any) {
      res.status(400).send({
        message: error.message,
      });
    } finally {
      await BaseDatabase.destroyConnection();
    }
  }
}

export default new FollowController();
