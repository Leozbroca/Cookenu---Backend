import authenticator from "../services/authenticator";
import { recipe } from "../types";
import recipeDatabase from "../data/recipeData";
import userDatabase from "../data/userData";
import { MissingFields } from "../error/missingFields";
import { MissingToken } from "../error/missingToken";
import { RecipeNotFound, RecipesNotFound } from "../error/notFound";
import { RecipeExists, Editing, Deleting } from "../error/generalError";

class RecipeBussiness {
  async createRecipe(token: string, title: string, description: string, recipe_img: string) {
    if (!token) {
      throw new MissingToken()
    }

    const authenticationData = authenticator.getTokenData(token);
    const creator_id = authenticationData.id;

    if (!title || !description || !recipe_img) {
      throw new MissingFields()
    }

    const [recipe] = await recipeDatabase.searchRecipeBytitle(title);
    if (recipe) {
      throw new RecipeExists()
    }

    const data: Date = new Date();
 
    const creation_date = data.getFullYear() + "-" + (data.getMonth() + 1) + "-" + data.getDate();

    const newRecipe: recipe = {
      title,
      description,
      creation_date,
      creator_id,
      recipe_img
    };

    recipeDatabase.createRecipe(newRecipe);

    return "Recipe created successfully!";
  }

  async getRecipe(token: string, recipe_id: string) {
    if (!token) {
      throw new MissingToken()
    }

    authenticator.getTokenData(token);

    const [recipe] = await recipeDatabase.searchRecipeById(recipe_id);
    if (!recipe) {
      throw new RecipeNotFound()
    }

    const data = recipe.creation_date;
    const creation_date = data.getDate() + "/" + (data.getMonth() + 1) + "/" + data.getFullYear();

    const [user] = await userDatabase.searchProfileById(recipe.creator_id);

    const newRecipe = {
      id: recipe.id,
      recipe_img: recipe.recipe_img,
      title: recipe.title,
      description: recipe.description,
      creation_date: creation_date,
      creator_name: user.name,
    };
 
    return newRecipe;
  }

  async getAllRecipes(token: string) {
    if (!token) {
      throw new MissingToken()
    }

    authenticator.getTokenData(token);

    const recipes = await recipeDatabase.getAllRecipes();
    if (!recipes) {
      throw new RecipesNotFound()
    }
 
    return recipes;
  }

  async editRecipe(
    token: string,
    recipe_id: string,
    title: string,
    description: string,
    recipe_img: string
  ) {
    if (!token) {
      throw new MissingToken()
    }

    const authenticationData = authenticator.getTokenData(token);

    const [recipe] = await recipeDatabase.searchRecipeById(recipe_id);
    if (!recipe) {
      throw new RecipeNotFound()
    }

    if (authenticationData.role !== "ADMIN") {
      if (recipe.creator_id !== authenticationData.id) {
        throw new Editing()
      }
    }

    if (!title || !description || !recipe_img) {
      throw new MissingFields()
    }

    await recipeDatabase.editRecipe(recipe_id, title, description, recipe_img);
    return "Recipe edited successfully!";
  }

  async deleteRecipe(token: string, recipe_id: string) {
    if (!token) {
      throw new MissingToken()
    }

    const authenticationData = authenticator.getTokenData(token);

    const [recipe] = await recipeDatabase.searchRecipeById(recipe_id);
    if (!recipe) {
      throw new RecipeNotFound()
    }

    if (authenticationData.role !== "ADMIN") {
      if (recipe.creator_id !== authenticationData.id) {
        throw new Deleting()
      }
    }

    await recipeDatabase.deleteRecipe(recipe_id);

    return "Recipe deleted successfully!";
  }
}

export default new RecipeBussiness();
