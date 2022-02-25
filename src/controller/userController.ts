import { Request, Response } from "express";
import { BaseDatabase } from "../data/connection";
import userBussiness from "../bussiness/userBussiness";

class UserController {
  async signup(req: Request, res: Response): Promise<void> {
    try {
      const { name , email, password, role } = req.body;

      const token:any = await userBussiness.signup(name, email, password, role);

      res.status(201).send({ message: "User created successfully!", token });
    } catch (error: any) {
      res.status(400).send({
        message: error.message,
      });
    } finally {
      await BaseDatabase.destroyConnection();
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      const token = await userBussiness.login(email, password);

      res.status(200).send({ token });
    } catch (error: any) {
      res.status(400).send({
        message: error.message,
      });
    } finally {
      await BaseDatabase.destroyConnection();
    }
  }

  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const token = req.headers.authorization as string;

      const user = await userBussiness.getProfile(token);

      res.status(200).send({ user });
    } catch (error: any) {
      res.status(400).send({
        message: error.message,
      });
    } finally {
      await BaseDatabase.destroyConnection();
    }
  }

  async getOtherProfile(req: Request, res: Response): Promise<void> {
    try {
      const token = req.headers.authorization as string;

      const user_id = req.params.id;

      const user = await userBussiness.getOtherProfile(token, user_id);

      res.status(200).send({ user });
    } catch (error: any) {
      res.status(400).send({
        message: error.message,
      });
    } finally {
      await BaseDatabase.destroyConnection();
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const token = req.headers.authorization as string;

      const user_id = req.params.id;

      const message = await userBussiness.deleteUser(token, user_id);

      res.status(200).send({ message });
    } catch (error: any) {
      res.status(400).send({
        message: error.message,
      });
    } finally {
      await BaseDatabase.destroyConnection();
    }
  }

  async getFeed(req: Request, res: Response): Promise<void> {
    try {
      const token = req.headers.authorization as string;

      const recipes = await userBussiness.getFeed(token);

      res.status(200).send({ recipes });
    } catch (error: any) {
      res.status(400).send({
        message: error.message,
      });
    } finally {
      await BaseDatabase.destroyConnection();
    }
  }

  async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      const message = await userBussiness.forgotPassword(email);

      res.status(201).send({ message });
    } catch (error: any) {
      res.status(400).send({
        message: error.message,
      });
    } finally {
      await BaseDatabase.destroyConnection();
    }
  }
}

export default new UserController()
