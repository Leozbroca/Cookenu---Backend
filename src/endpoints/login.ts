import { Request, Response } from "express"
import { connection } from "../data/connection";
import authenticator from "../services/authenticator";
// import { Authenticator } from "../services/Authenticator";
import hashManager from "../services/hashManager";

export default async function login(
    req: Request,
    res: Response
): Promise<void> {
    try {
        const { email, password } = req.body;

        if (!email) {
            res.statusCode = 422
            throw new Error("Input missing:'email'")
        }

        if (!password) {
            res.statusCode = 422
            throw new Error("Input missing: 'password'")
        }

        // select * from to_do_list_users where email = email
        const [user] = await connection("cookenu_users").where({ email })

        const passwordIsCorrect: boolean = user && hashManager.compareHash(password, user.password)

        if (!user || !passwordIsCorrect) {
            res.statusCode = 401
            res.statusMessage = "Credenciais invalidas"
            throw new Error("Credenciais inválidas")
        }

        const token = authenticator.generateToken({ id: user.id, role: user.role })

        res.status(200).send({ token })

    } catch (error:any) {
        if (res.statusCode === 200) {
            res.status(500).send({ message: "Internal server error" })
        } else {
            res.send({ message: error.sqlMessage || error.message })
        }
    }
}