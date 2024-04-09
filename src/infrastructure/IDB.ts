export interface IDB {
  query<T = any[]>(sql: string, params: (string | number | boolean)[]): Promise<T>
}
