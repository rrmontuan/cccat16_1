import { Account } from "../../domain/account";
import { IDB } from "../../../../infrastructure/IDB";

export interface IAccountRepository {
  save: (account: Account) => Promise<void>;
  findByEmail: (email: string) => Promise<Account | null>;
}

type AccountRepositoryResult = {
  account_id: string
  name: string
  email: string
  cpf: string
  car_plate: string
  is_passenger: boolean
  is_driver: boolean
}

export class AccountRepository implements IAccountRepository {
  constructor(private readonly connection: IDB) { }

  async save(account: Account) {
    await this.connection.query("insert into cccat16.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)",
      [
        account.getId(),
        account.getName(),
        account.getEmail(),
        account.getCPF(),
        account.getCarPlate(),
        account.isPassenger(),
        account.isDriver()
      ]
    );
  };

  async findByEmail(email: string) {
    const [accountResult] = await this.connection.query<AccountRepositoryResult[]>("select * from cccat16.account where email = $1", [
      email
    ]);

    if (!accountResult) return null;

    const account = Account.create({
      id: accountResult.account_id,
      name: accountResult.name,
      cpf: accountResult.cpf,
      carPlate: accountResult.car_plate,
      email: accountResult.email,
      isPassenger: accountResult.is_passenger,
      isDriver: accountResult.is_driver
    });

    return account.isRight() ? account.value : null;
  };
}
