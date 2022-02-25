import authenticator from "../services/authenticator";
import { recipe } from "../types";
import recipeDatabase from "../data/recipeData";
import userDatabase from "../data/userData";

class RecipeBussiness {
  async createRecipe(token: string, title: string, description: string) {
    if (!token) {
      // res.statusCode = 401;
      // res.statusMessage = "token invalido ou nao passado no headers";
      throw new Error("token invalido ou nao passado no headers");
    }

    const authenticationData = authenticator.getTokenData(token);
    const creator_id = authenticationData.id;

    if (!title) {
      // res.statusCode = 422;
      throw new Error("Preencha o campo 'title'");
    }

    if (!description) {
      // res.statusCode = 422;
      throw new Error("Preencha o campo 'description'");
    }

    const [recipe] = await recipeDatabase.searchRecipeBytitle(title);
    if (recipe) {
      // res.statusCode = 409;
      throw new Error("Receita já cadastrada");
    }

    const data: Date = new Date();
 
    const creation_date = data.getFullYear() + "-" + (data.getMonth() + 1) + "-" + data.getDate();

    const newRecipe: recipe = {
      title,
      description,
      creation_date,
      creator_id,
    };

    recipeDatabase.createRecipe(newRecipe);

    return "Recipe created successfully!";
  }

  async getRecipe(token: string, recipe_id: string) {
    if (!token) {
      // res.statusCode = 401;
      // res.statusMessage = "token invalido ou nao passado no headers";
      throw new Error("Invalid Token");
    }

    authenticator.getTokenData(token);

    const [recipe] = await recipeDatabase.searchRecipeById(recipe_id);
    if (!recipe) {
      throw new Error("Recipe not found!");
    }

    const data = recipe.creation_date;
    const creation_date = data.getDate() + "/" + (data.getMonth() + 1) + "/" + data.getFullYear();

    const [user] = await userDatabase.searchProfileById(recipe.creator_id);

    const newRecipe = {
      id: recipe.id,
      title: recipe.title,
      description: recipe.description,
      creation_date: creation_date,
      creator_name: user.name,
    };
 
    return newRecipe;
  }

  async editRecipe(
    token: string,
    recipe_id: string,
    title: string,
    description: string
  ) {
    if (!token) {
      // res.statusCode = 401;
      // res.statusMessage = "token invalido ou nao passado no headers";
      throw new Error("Invalid Token");
    }

    const authenticationData = authenticator.getTokenData(token);

    const [recipe] = await recipeDatabase.searchRecipeById(recipe_id);
    if (!recipe) {
      throw new Error("Recipe not found");
    }

    if (authenticationData.role !== "ADMIN") {
      if (recipe.creator_id !== authenticationData.id) {
        throw new Error("You can't edit this recipe");
      }
    }

    if (!title || !description) {
      throw new Error("Empty inputs: 'title' or 'description'");
    }

    await recipeDatabase.editRecipe(recipe_id, title, description);
    return "Recipe edited successfully!";
  }

  async deleteRecipe(token: string, recipe_id: string) {
    if (!token) {
      // res.statusCode = 401;
      // res.statusMessage = "token invalido ou nao passado no headers";
      throw new Error("Invalid Token");
    }

    const authenticationData = authenticator.getTokenData(token);

    const [recipe] = await recipeDatabase.searchRecipeById(recipe_id);
    if (!recipe) {
      throw new Error("Recipe not found");
    }

    if (authenticationData.role !== "ADMIN") {
      if (recipe.creator_id !== authenticationData.id) {
        throw new Error("You can't delete this recipe");
      }
    }

    await recipeDatabase.deleteRecipe(recipe_id);

    return "Recipe deleted successfully!";
  }
}

export default new RecipeBussiness();
