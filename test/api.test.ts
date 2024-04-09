let mockRandomUUID = jest.fn()
jest.mock('crypto', () => {
  const crypto = jest.requireActual('crypto')
  return {
    ...crypto,
    randomUUID: jest.fn(mockRandomUUID)
  }
});

const mockQueryResult = jest.fn()
jest.mock('pg-promise', () => {
  return {
    __esModule: true,
    default: jest.fn(
      () => jest.fn((config) => {
        return {
          query: jest.fn(mockQueryResult)
        }
      })
    ),
  }
});

import app from "../src/api";
import request from "supertest";

const passengerAccount = {
  name: "John Doe",
  email: `john.doe${Math.random()}@gmail.com`,
  cpf: "87748248800",
  isPassenger: true
}

const driverAccount = {
  name: "John Doe",
  email: `john.doe${Math.random()}@gmail.com`,
  cpf: "87748248800",
  isDriver: true,
  carPlate: 'ABC1234'
}

describe('/signup', () => {
  beforeEach(() => {
    mockQueryResult.mockClear()
    mockQueryResult.mockReset()
  })

  describe('Quando os dados são inválidos', () => {
    test("Retorna -3 quando o nome é inválido", async function () {
      mockQueryResult
        .mockResolvedValueOnce([undefined])

      const input = {
        ...passengerAccount,
        name: ''
      };

      await request(app).post('/signup').send(input)
        .expect(422)
        .expect(response => {
          expect(response.text).toBe("-3")
        })
    })

    test("Retorna -2 quando o email é inválido", async function () {
      mockQueryResult
        .mockResolvedValueOnce([undefined])

      const input = {
        ...passengerAccount,
        email: 'INVALID_EMAIL'
      };

      await request(app).post('/signup').send(input)
        .expect(422)
        .expect(response => {
          expect(response.text).toBe("-2")
        })
    })

    test("Retorna -1 quando o CPF é inválido", async function () {
      mockQueryResult
        .mockResolvedValueOnce([undefined])

      const input = {
        ...passengerAccount,
        cpf: 'INVALID_CPF'
      };

      await request(app).post('/signup').send(input)
        .expect(422)
        .expect(response => {
          expect(response.text).toBe("-1")
        })
    })

    test("Retorna -4 quando o email já existe", async function () {
      const existingEmail = 'john.do.exists@gmail.com'
      const existingAccount = {
        account_id: 'b19bd7de-7725-4889-aaad-cd3bdc66adc2',
        name: passengerAccount.name,
        cpf: passengerAccount.cpf,
        car_plate: '',
        email: existingEmail,
        is_passenger: true,
        is_driver: false
      }

      const input = {
        name: existingAccount.name,
        email: existingAccount.email,
        cpf: existingAccount.cpf
      };

      mockQueryResult
        .mockResolvedValueOnce([
          existingAccount
        ])

      await request(app).post('/signup').send(input)
        .expect(422)
        .expect(response => {
          expect(response.text).toBe("-4")
        })
    })

    test("Retorna -5 quando se trata de uma conta de motorista e a placa informada é inválida", async function () {
      mockQueryResult
        .mockResolvedValueOnce([undefined])

      const input = {
        ...driverAccount,
        carPlate: 'INVALID_CAR_PLATE'
      };

      await request(app).post('/signup').send(input)
        .expect(422)
        .expect(response => {
          expect(response.text).toBe("-5")
        })
    })
  })

  describe('Quando os dados são válidos', () => {
    test("Deve criar uma conta para o passageiro", async function () {
      mockQueryResult
        .mockResolvedValueOnce([undefined])
        .mockResolvedValueOnce([])

      const MOCKED_UUID = '57a58c84-629e-4585-9c23-adedd6cacfda'

      mockRandomUUID
        .mockReturnValueOnce(MOCKED_UUID)

      await request(app).post('/signup').send(passengerAccount)
        .expect(200)
        .expect(response => {
          expect(response.body).toEqual({ accountId: MOCKED_UUID })
        })
    });

    test("Deve criar uma conta para o motorista", async function () {
      mockQueryResult
        .mockResolvedValueOnce([undefined])
        .mockResolvedValueOnce([])

      const MOCKED_UUID = '91a64100-7cfc-4352-b655-9250df4624a1'

      mockRandomUUID
        .mockReturnValueOnce(MOCKED_UUID)

      await request(app).post('/signup').send(driverAccount)
        .expect(200)
        .expect(response => {
          expect(response.body).toEqual({ accountId: MOCKED_UUID })
        })
    });
  })
})

