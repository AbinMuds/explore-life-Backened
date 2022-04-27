const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const User = require("../models/user");

let USERS = [
  {
    id: "u1",
    name: "Abinash Mudbhari",
    email: "abinmuds@gmail.com",
    password: "testPassword",
  },
];

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = User.find({}, "-password");
  } catch (err) {
    const error = new HttpError(
      "Fetching users failed, please try again later."
    );
    return next(error);
  }
  res.json({
    users: (await users).map((user) => user.toObject({ getters: true })),
  });
};

const signUp = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError(
      "Invalid inputs passed, please check your data.",
      422
    );
    return next(error);
  }
  const { name, email, password, places } = req.body;

  // const hasUsers = USERS.find((u) => u.email === email);
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Signing Up Failed, Please try again later.");
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "Could not create user, email already exists",
      422
    );
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    image: "https://cdn.mos.cms.futurecdn.net/nfZYT7SrLCY5EaaPVSScLG.png",
    password,
    places,
  });

  // USERS.push(createdUser);
  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("SingUp failed, Please try again.", 500);
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  // const identifiedUser = USERS.find((u) => u.email === email);

  // if (!identifiedUser || identifiedUser.password !== password) {
  //   throw new HttpError(
  //     "Could not identify user, credentials seem to be wrong",
  //     401
  //   );
  // }

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Logging in failed, Please try again later.");
    return next(error);
  }

  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      401
    );
    return next(error);
  }

  res.json({ message: "Logged In" });
};

exports.getUsers = getUsers;
exports.signUp = signUp;
exports.login = login;
