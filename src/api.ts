import express, { Request } from "express";
import PostgresDBImpl from "./infrastructure/PostgresDBImpl";
import { IDB } from "./infrastructure/IDB";
import { AccountRepository } from "./modules/identity/application/repositories/AccountRepository";
import { SignUp, SignUpDTO } from "./modules/identity/application/useCases/signUp";
const app = express();
app.use(express.json());

app.post("/signup", async function (req: Request<{}, {}, SignUpDTO>, res) {
  const dbConnection: IDB = PostgresDBImpl.getInstance();
  const accountRepository = new AccountRepository(dbConnection);
  const signUp = new SignUp(accountRepository);
  const result = await signUp.execute(req.body)

  if (result.isLeft()) return res.status(422).send(result.error.code + "");

  return res.json(result.value)
});

export default app
