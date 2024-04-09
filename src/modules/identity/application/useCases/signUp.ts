import { Either, Left, Right } from "../../../../core/logic/Either";
import { Account, AccountError } from "../../domain/account";
import { AccountRepository } from "../repositories/AccountRepository";

type SuccessfulResponse = {
  accountId: string
}

type FailedResponse = {
  code: number
}

export type SignUpDTO = {
  name: string
  email: string
  cpf: string
  carPlate?: string
  isPassenger?: boolean
  isDriver?: boolean
}

export class SignUp {
  constructor(private readonly accountRepository: AccountRepository) { }

  async execute({ name, email, carPlate, cpf, isPassenger, isDriver }: SignUpDTO): Promise<Either<FailedResponse, SuccessfulResponse>> {
    const newAccount = Account.create({
      name,
      email,
      cpf,
      carPlate: carPlate || '',
      isPassenger: isPassenger || true,
      isDriver: !!isDriver
    });

    if (newAccount.isLeft()) return Left.create({ code: newAccount.error });

    const account = await this.accountRepository.findByEmail(email);
    if (!!account) return Left.create({ code: AccountError.EmailAlreadyExists });

    await this.accountRepository.save(newAccount.value);

    return Right.create({ accountId: newAccount.value.getId() });
  }
}
