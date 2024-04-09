Este conteúdo é parte do curso Clean Code e Clean Architecture da Branas.io

Para mais informações acesse:

https://branas.io

====================================================================================

Esse exercício tem como objetivo refatorar o código contido em `src/api.ts`.

Instale as dependências:

`yarn` or `npm install`

Para executar os testes:

`npx jest`

Para executar a API:

`npx ts-node src/server.ts`

Para cadastrar uma conta na API execute uma requisição usando o [curl](https://curl.se/):

```
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"name": "Bar Foo", "email": "bar.foo@gmail.com", "cpf": "87748248800"}' \
  http://localhost:3000/signup
```
