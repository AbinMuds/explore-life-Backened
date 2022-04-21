const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");

let USERS = [
  {
    id: "u1",
    name: "Abinash Mudbhari",
    email: "abinmuds@gmail.com",
    password: "testPassword",
  },
];

const getUsers = (req, res, next) => {
  res.json({ users: USERS });
};

const signUp = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed, please check your data.", 422);
  }
  const { name, email, password } = req.body;

  const hasUsers = USERS.find((u) => u.email === email);

  if (hasUsers) {
    throw new HttpError("Could not create user, email already exists", 422);
  }
  const createdUser = {
    id: uuidv4(),
    name,
    email,
    password,
  };

  USERS.push(createdUser);

  res.status(201).json({ user: createdUser });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  const identifiedUser = USERS.find((u) => u.email === email);

  if (!identifiedUser || identifiedUser.password !== password) {
    throw new HttpError(
      "Could not identify user, credentials seem to be wrong",
      401
    );
  }

  res.json({ message: "Logged In" });
};

exports.getUsers = getUsers;
exports.signUp = signUp;
exports.login = login;
