import { BaseDatabase } from "./connection";
import { user } from "../types";

class UserDatabase extends BaseDatabase {
  private static TABLE_NAME = "cookenu_users";

  public async signup(newUser: user): Promise<void> {
    try {
      await this.getConnection()
        .insert({
          id:newUser.id,
          name:newUser.name,
          email:newUser.email,
          password:newUser.password,
          role:newUser.role,
        })
        .into(UserDatabase.TABLE_NAME);
    } catch (error: any) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async login(email: string): Promise<any> {
    try {
      const user = await this.getConnection()
        .select()
        .from(UserDatabase.TABLE_NAME)
        .where({ email });
   
      return user;
    } catch (error: any) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async getProfile(id: string): Promise<any> {
    try {
      const user = await this.getConnection()
        .select("id", "name", "email")
        .from(UserDatabase.TABLE_NAME)
        .where({ id });
        
      return user;
    } catch (error: any) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async deleteUser(id: string): Promise<void> {
    try {
      await this.getConnection()
        .del()
        .from(UserDatabase.TABLE_NAME)
        .where({ id });
    } catch (error: any) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async changePassword(newPassword: string, id: string): Promise<void> {
    try {
      await this.getConnection()
        .update({ password: newPassword })
        .where({ id: id })
        .from(UserDatabase.TABLE_NAME);
    } catch (error: any) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async searchProfileById(id: string): Promise<any> {
    try {
      const result = await this.getConnection()
        .select()
        .from(UserDatabase.TABLE_NAME)
        .where({ id });

      return result;
    } catch (error: any) {
      throw new Error(error.sqlMessage || error.message);
    }
  }

  public async searchProfileByEmail(email: string): Promise<any> {
    try {
      const result = await this.getConnection()
        .select()
        .from(UserDatabase.TABLE_NAME)
        .where({ email });

      return result;
    } catch (error: any) {
      throw new Error(error.sqlMessage || error.message);
    }
  }
  public async getAllUsers(): Promise<any> {
    try {
      const result = await this.getConnection()
        .select()
        .from(UserDatabase.TABLE_NAME)
        .orderBy("name")

      return result;
    } catch (error: any) {
      throw new Error(error.sqlMessage || error.message);
    }
  }
}

export default new UserDatabase();
