import { USER_ROLES, user, userBasic, feed, authenticationData } from "../types";
import authenticator from "../services/authenticator";
import hashManager from "../services/hashManager";
import dotenv from "dotenv";
import generatorId from "../services/generatorId";
import userDatabase from "../data/userData";
import recipesDataBase from "../data/recipeData";
import followDataBase from "../data/followData";
import transporter from "../services/transporter";

dotenv.config();

class UserBussiness {
  async signup(name: string, email: string, password: string, role: USER_ROLES) {
    if (!name) {
      // res.statusCode = 422;
      throw new Error(
        "Input missing: 'name'"
      );
    }
    if (!email) {
      // res.statusCode = 422;
      throw new Error(
        "Input missing: 'email'"
      );
    }
    if (!password) {
      // res.statusCode = 422;
      throw new Error(
        "Input missing: 'password'"
      );
    }
    if (!role) {
      // res.statusCode = 422;
      throw new Error(
        "Input missing: 'role'"
      );
    }


    const user = await userDatabase.searchProfileByEmail(email);
    if (user[0]) {
      // res.statusCode = 409;
      throw new Error("This email already have an account registered");
    }

    const id: string = generatorId.generatedId();

    const cypherPassword: string = hashManager.createHash(password);

    const newUser: user = {
      id,
      name,
      email,
      password: cypherPassword,
      role,
    };

    await userDatabase.signup(newUser);

    const token = authenticator.generateToken({ id, role });

    return token;
  }

  async login(email: string, password: string) {
    if (!email) {
      // res.statusCode = 422;
      throw new Error("Input missing:'email'");
    }

    if (!password) {
      // res.statusCode = 422;
      throw new Error("Input missing: 'password'");
    }
    console.log(0)
    const [user] = await userDatabase.login(email);
    console.log(user)
    console.log(user.password)
    const passwordIsCorrect: boolean =
      user && hashManager.compareHash(password, user.password);

    if (!user || !passwordIsCorrect) {
      // res.statusCode = 401;
      // res.statusMessage = "Credenciais invalidas";
      throw new Error("Credenciais inválidas");
    }

    const token = authenticator.generateToken({
      id: user.id,
      role: user.role,
    });

    return token;
  }

  async getProfile(token: string) {
    if (!token) {
      // res.statusCode = 401;
      // res.statusMessage = "token invalido ou nao passado no headers";
      throw new Error("token invalido ou nao passado no headers");
    }

    const authenticationData = authenticator.getTokenData(token);

    const user: userBasic = await userDatabase.getProfile(
      authenticationData.id
    );
    if(!user){
      throw new Error("User not found")
    }

    return user;
  }

  async getOtherProfile(token: string, user_id: string) {
    if (!token) {
      // res.statusCode = 401;
      // res.statusMessage = "token invalido ou nao passado no headers";
      throw new Error("token invalido ou nao passado no headers");
    }

    const authenticationData = authenticator.getTokenData(token);

    const [user] = await userDatabase.getProfile(user_id);
    if(!user){
      throw new Error("User not found")
    }
    return user;
  }

  async deleteUser(token: string, user_id: string) {
    if (!token) {
      // res.statusCode = 401;
      // res.statusMessage = "token invalido ou nao passado no headers";
      throw new Error("Invalid Token");
    }

    const authenticationData = authenticator.getTokenData(token);
    if (authenticationData.role !== "ADMIN") {
      throw new Error("Only a admin user can access this funcionality");
    }

    const [user] = await userDatabase.searchProfileById(user_id);
    if (!user) {
      throw new Error("User not found");
    }
    await recipesDataBase.deletingAllRecipes(user_id)
    await followDataBase.deletingAllFollows(user_id)
    await userDatabase.deleteUser(user_id);

    return "User deleted successfully!";
  }

  async getFeed(token: string) {
    if (!token) {
      // res.statusCode = 401;
      // res.statusMessage = "token invalido ou nao passado no headers";
      throw new Error("Invalid Token");
    }

    const authenticationData = authenticator.getTokenData(token);
    const userFeed = authenticationData.id;

    const follows = await followDataBase.searchAllFollows(userFeed);

    const recipes: Array<feed> = [];

    for (let obj of follows) {
      const recipeX = await recipesDataBase.searchRecipeByCreator(obj.following);
      const [userX] = await userDatabase.getProfile(obj.following);
      console.log(recipeX)
      for (let obj of recipeX) {
        const data = obj.creation_date;
        const creation_date = data.getDate() + "/" + (data.getMonth() + 1) + "/" + data.getFullYear();
        
        recipes.push({
          id: obj.id,
          title: obj.title,
          description: obj.description,
          createdAt: creation_date,
          creator_id: userX.id,
          creator_name: userX.name,
        });
      }
    }

    return recipes;
  }

  async forgotPassword(email: string) {
    let newPass: string = "";
    if (!email) {
      throw new Error("Você não informou seu email");
    }

    const [user] = await userDatabase.searchProfileByEmail(email);
    if (!user) {
      throw new Error("Você não possui uma conta!");
    } else {
      newPass = Math.random().toString(36).slice(-10);
      await transporter.sendMail({
        from: `<${process.env.NODEMAILER_USER}>`,
        to: email,
        subject: "Requisição de nova senha - Cookenu",
        text: `Parece que você solicitou uma nova senha para sua conta no Cookenu!
                      Sua nova senha é: ${newPass}`,
        html: `<p>Parece que você solicitou uma nova senha para sua conta no Cookenu!
                      Sua nova senha é: <strong>${newPass}</strong><p>`,
      });
    }

    const cypherPassword: string = hashManager.createHash(newPass);

    await userDatabase.changePassword(cypherPassword, user.id);

    return "Uma nova senha foi enviada para o email informado!";
  }
}

export default new UserBussiness();
