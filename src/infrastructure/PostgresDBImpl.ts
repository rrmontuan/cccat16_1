import pgPromise from "pg-promise";
import { IDB } from "./IDB";
import { IClient } from "pg-promise/typescript/pg-subset";

export default class PostgresDBImpl implements IDB {
  private static instance: PostgresDBImpl;
  private connection: pgPromise.IDatabase<{}, IClient>

  private constructor() {
    const config = {
      host: 'localhost',
      port: 5432,
      database: 'app',
      user: 'postgres',
      password: 'postgres',
      allowExitOnIdle: true
    };

    this.connection = pgPromise()(config);
  }

  public async query<T = any[]>(sql: string, params: (string | number | boolean)[]): Promise<T> {
    return await this.connection.query(sql, params)
  }

  public static getInstance(): PostgresDBImpl {
    if (!PostgresDBImpl.instance) {
      PostgresDBImpl.instance = new PostgresDBImpl();
    }

    return PostgresDBImpl.instance;
  }
}
