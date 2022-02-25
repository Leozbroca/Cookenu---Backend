import { USER_ROLES, user, userBasic, feed, authenticationData } from "../types";
import authenticator from "../services/authenticator";
import hashManager from "../services/hashManager";
import dotenv from "dotenv";
import generatorId from "../services/generatorId";
import userDatabase from "../data/userData";
import recipesDataBase from "../data/recipeData";
import followDataBase from "../data/followData";
import { MissingToken } from "../error/missingToken";
import { MissingFields } from "../error/missingFields";
import { UnauthorizedAcess } from "../error/unauthorizedAcess";
import { InvalidCredentials } from "../error/invalidCredentials";
import { UserNotFound, EmailNotFound } from "../error/notFound";
import { EmailExists } from "../error/generalError";
import transporter from "../services/transporter";

dotenv.config();

class UserBussiness {
  async signup(name: string, email: string, password: string, role: USER_ROLES) {
    if (!name || !email || !password || !role) {
      throw new MissingFields()
    }

    const user = await userDatabase.searchProfileByEmail(email);
    if (user[0]) {
      throw new EmailExists()
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
    if (!email || !password) {
      throw new MissingFields()
    }

    const [user] = await userDatabase.login(email);

    const passwordIsCorrect: boolean =
      user && hashManager.compareHash(password, user.password);

    if (!user || !passwordIsCorrect) {
      throw new InvalidCredentials()
    }

    const token = authenticator.generateToken({
      id: user.id,
      role: user.role,
    });

    return token;
  }

  async getProfile(token: string) {
    if (!token) {
      throw new MissingToken()
    }

    const authenticationData = authenticator.getTokenData(token);

    const user: userBasic = await userDatabase.getProfile(
      authenticationData.id
    );
    if(!user){
      throw new UserNotFound()
    }

    return user;
  }

  async getOtherProfile(token: string, user_id: string) {
    if (!token) {
      throw new MissingToken()
    }

    const authenticationData = authenticator.getTokenData(token);

    const [user] = await userDatabase.getProfile(user_id);
    if(!user){
      throw new UserNotFound()
    }
    return user;
  }

  async deleteUser(token: string, user_id: string) {
    if (!token) {
      throw new MissingToken()
    }

    const authenticationData = authenticator.getTokenData(token);
    if (authenticationData.role !== "ADMIN") {
      throw new UnauthorizedAcess();
    }

    const [user] = await userDatabase.searchProfileById(user_id);
    if (!user) {
      throw new UserNotFound()
    }
    await recipesDataBase.deletingAllRecipes(user_id)
    await followDataBase.deletingAllFollows(user_id)
    await userDatabase.deleteUser(user_id);

    return "User deleted successfully!";
  }

  async getFeed(token: string) {
    if (!token) {
      throw new MissingToken()
    }

    const authenticationData = authenticator.getTokenData(token);
    const userFeed = authenticationData.id;

    const follows = await followDataBase.searchAllFollows(userFeed);

    const recipes: Array<feed> = [];

    for (let obj of follows) {
      const recipeX = await recipesDataBase.searchRecipeByCreator(obj.following);
      const [userX] = await userDatabase.getProfile(obj.following);
   
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
      throw new MissingFields()
    }

    const [user] = await userDatabase.searchProfileByEmail(email);
    if (!user) {
      throw new EmailNotFound()
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
