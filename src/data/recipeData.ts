import { collapseTextChangeRangesAcrossMultipleVersions } from "typescript";
import { recipe } from "../types";
import { BaseDatabase } from "./connection";

class RecipeDatabase extends BaseDatabase {
  private static TABLE_NAME = "cookenu_recipes";

  public async createRecipe(newRecipe: recipe): Promise<void> {
    try {
      await this.getConnection()
        .insert({
          title: newRecipe.title,
          description: newRecipe.description,
          creation_date: newRecipe.creation_date,
          creator_id: newRecipe.creator_id,
          recipe_img: newRecipe.recipe_img
        })
        .into(RecipeDatabase.TABLE_NAME);
    } catch (error: any) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async getRecipe(id: string): Promise<any> {
    try {
      const result = await this.getConnection()
        .select()
        .from(RecipeDatabase.TABLE_NAME)
        .where({ id });

      return result;
    } catch (error: any) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async getAllRecipes(): Promise<any> {
    try {
      const result = await this.getConnection()
        .select()
        .from(RecipeDatabase.TABLE_NAME)
      console.log(result)
      return result;
    } catch (error: any) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async editRecipe(
    id: string,
    title: string,
    description: string,
    recipe_img: string
  ): Promise<void> {
    try {
      await this.getConnection()
        .update({
          title: title,
          description: description,
          recipe_img: recipe_img
        })
        .from(RecipeDatabase.TABLE_NAME)
        .where({ id });
    } catch (error: any) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async deleteRecipe(id: string): Promise<void> {
    try {
      await this.getConnection()
        .del()
        .from(RecipeDatabase.TABLE_NAME)
        .where({ id });
    } catch (error: any) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async searchRecipeById(id: string): Promise<any> {
    try {
      const result = await this.getConnection()
        .select()
        .from(RecipeDatabase.TABLE_NAME)
        .where({ id });

      return result;
    } catch (error: any) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async searchRecipeBytitle(title: string): Promise<any> {
    try {
      const result = await this.getConnection()
        .select()
        .from(RecipeDatabase.TABLE_NAME)
        .where({ title });

      return result;
    } catch (error: any) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async searchRecipeByCreator(creator_id: string): Promise<any> {
    try {
      const result = await this.getConnection()
        .select()
        .from(RecipeDatabase.TABLE_NAME)
        .where({ creator_id });

      return result;
    } catch (error: any) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async deletingAllRecipes(id: string): Promise<void> {
    try {
      await this.getConnection()
        .del()
        .from(RecipeDatabase.TABLE_NAME)
        .where({ creator_id: id });
    } catch (error: any) {
      throw new Error(error.sqlMessage || error.message);
    }
  }
}

export default new RecipeDatabase();
