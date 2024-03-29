const token = {
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInJvbGUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AYWRtaW4uY29tIiwiaWF0IjoxNzA2NjY0NzI4LCJleHAiOjE3MDcyNjk1Mjh9.5-jAnVmwyxIjePkikTh-aBRIZV2lvwZcYG9QNbI1DLo"
}

const invalidToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';
const invalidTypeToken = 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';

const responseToken = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInJvbGUiOiJ1c2VyIiwiZW1haWwiOiJhZG1pbkBhZG1pbi5jb20iLCJpYXQiOjE3MDY2NjE0ODAsImV4cCI6MTcwNzI2NjI4MH0.uh6BKaIat1mz1BWiSYnCCxMQwDOvdFmIGqq4p6gA3KA"

const user = {
  id: 1,
  username: 'Admin',
  role: 'admin',
  email: 'admin@admin.com',
  password: "$2a$08$xi.Hxk1czAO0nZR..B393u10aED0RQ1N3PAEXQ7HxtLjKPEZBu.PW"
}

const simpleUser = {
  email: 'admin@admin.com',
  password: "secret_admin"
}

const noEmailUser = {
  password: "secret_admin"
}

const noPasswordUser = {
  email: 'admin@admin.com',
}

const invalidEmailUser = {
  email: '@teste.com',
  password: "secret_admin"
}

const invalidPasswordUser = {
  email: 'teste@teste.com',
  password: "11111111111"
}

const shortPasswordUser = {
  email: 'teste@teste.com',
  password: "a"
}

const noExistingMessageError = { message: 'All fields must be filled' };

const invalidEmailMessageError = { message: 'Invalid email or password' };

export {
  user,
  token,
  simpleUser,
  noEmailUser,
  invalidToken,
  responseToken,
  noPasswordUser,
  invalidTypeToken,
  invalidEmailUser,
  shortPasswordUser,
  invalidPasswordUser,
  noExistingMessageError,
  invalidEmailMessageError,
};