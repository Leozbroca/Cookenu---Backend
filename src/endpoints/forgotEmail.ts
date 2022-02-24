import { Request, Response } from "express";
import { connection } from "../data/connection";
import transporter from "../services/transporter";
import dotenv from 'dotenv';
import hashManager from '../services/hashManager';

dotenv.config()

export const forgotEmail = async(req: Request, res: Response) => {
    try{
        const {email} = req.body
        let newPass:string = ""
        if(!email){
            throw new Error("Você não informou seu email")
        }
        console.log(process.env.NODEMAILER_USER)
        const [user] = await connection('cookenu_users').where({ email: email })

        if(!user){
            throw new Error("Você não possui uma conta!")
        } else {
            newPass = gerarPassword()
            await transporter.sendMail({
                from:`<${process.env.NODEMAILER_USER}>`,
                to: email,
                subject:"Requisição de nova senha - Cookenu",
                text:`Parece que você solicitou uma nova senha para sua conta no Cookenu!
                    Sua nova senha é: ${newPass}`,
                html: `<p>Parece que você solicitou uma nova senha para sua conta no Cookenu!
                    Sua nova senha é: <strong>${newPass}</strong><p>`
            })
        }

        const cypherPassword: string = hashManager.createHash(newPass)
 
        await connection('cookenu_users').where({ email: email }).update({password: cypherPassword})
        res.status(201).send({ message: "Uma nova senha foi enviada para o email informado!"})
    }
    catch (error:any){
        console.log("deu erro")
        res.status(400).send({
            message: error.message,
      });
    }
}

function gerarPassword() {
    return Math.random().toString(36).slice(-10);
}