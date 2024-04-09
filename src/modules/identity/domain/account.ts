import crypto from "crypto";
import { validate } from "../../../validateCpf";
import { Either, Left, Right } from "../../../core/logic/Either";

export type AccountProps = {
  id?: string
  name: string
  email: string
  cpf: string
  carPlate: string
  isPassenger: boolean
  isDriver: boolean
}

export enum AccountError {
  InvalidCarPlate = -5,
  EmailAlreadyExists,
  InvalidName,
  InvalidEmail,
  InvalidCPF,
}

export class AccountValidator {
  private props: AccountProps;

  public constructor(props: AccountProps) {
    this.props = props;
  }

  public isCPFValid(): boolean {
    return validate(this.props.cpf);
  }

  public isNameValid(): boolean {
    return this.props.name.match(/[a-zA-Z] [a-zA-Z]+/) !== null;
  }

  public isCarPlateValid(): boolean {
    if (!this.props.isDriver) return true;

    return this.props.carPlate.match(/[A-Z]{3}[0-9]{4}/) !== null;
  }

  public isEmailValid(): boolean {
    return this.props.email.match(/^(.+)@(.+)$/) !== null;
  }
}


export class Account {
  private props: Required<AccountProps>;

  private constructor(props: AccountProps) {
    const id = props.id ?? this.generateID();

    this.props = {
      ...props,
      id
    };
  }

  public isDriver(): boolean {
    return this.props.isDriver === true
  }

  public isPassenger(): boolean {
    return this.props.isPassenger === true
  }

  public getName(): string {
    return this.props.name;
  }

  public getCarPlate(): string {
    return this.props.carPlate;
  }

  public getEmail(): string {
    return this.props.email;
  }

  public getCPF(): string {
    return this.props.cpf;
  }

  public getId(): string {
    return this.props.id;
  }

  private generateID(): string {
    return crypto.randomUUID();
  }

  public static create(props: AccountProps): Either<AccountError, Account> {
    const accountValidator = new AccountValidator(props);

    if (!accountValidator.isCPFValid()) return Left.create(AccountError.InvalidCPF);
    if (!accountValidator.isCarPlateValid()) return Left.create(AccountError.InvalidCarPlate);
    if (!accountValidator.isEmailValid()) return Left.create(AccountError.InvalidEmail);
    if (!accountValidator.isNameValid()) return Left.create(AccountError.InvalidName);

    const account = new Account(props);
    return Right.create(account);
  }
}
