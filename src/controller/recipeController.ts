import { Request, Response } from "express";
import recipeBussiness from "../bussiness/recipeBussiness";
import { BaseDatabase } from "../data/connection";

class RecipeController {
  async createRecipe(req: Request, res: Response): Promise<void> {
    try {
      const token = req.headers.authorization as string;
      const { title, description, recipe_img } = req.body;

      const message = await recipeBussiness.createRecipe(
        token,
        title,
        description,
        recipe_img
      );

      res.status(201).send({ message });
    } catch (error: any) {
      res.status(400).send({
        message: error.message,
      });
    } finally {
      await BaseDatabase.destroyConnection();
    }
  }

  async getRecipe(req: Request, res: Response): Promise<void> {
    try {
      const token = req.headers.authorization as string;
      const recipe_id: string = req.params.id;

      const result = await recipeBussiness.getRecipe(token, recipe_id);
      
      res.status(200).send({ recipe: result });
    } catch (error: any) {
      res.status(400).send({
        message: error.message,
      });
    } finally {
      await BaseDatabase.destroyConnection();
    }
  }

  async editRecipe(req: Request, res: Response): Promise<void> {
    try {
      const token = req.headers.authorization as string;
      const recipe_id = req.params.id;
      const { title, description, recipe_img } = req.body;

      const message = await recipeBussiness.editRecipe(
        token,
        recipe_id,
        title,
        description,
        recipe_img
      );

      res.status(200).send({ message });
    } catch (error: any) {
      res.status(400).send({
        message: error.message,
      });
    } finally {
      await BaseDatabase.destroyConnection();
    }
  }

  async deleteRecipe(req: Request, res: Response): Promise<void> {
    try {
      const token = req.headers.authorization as string;
      const recipe_id = req.params.id;

      const message = await recipeBussiness.deleteRecipe(token, recipe_id);

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

export default new RecipeController()
