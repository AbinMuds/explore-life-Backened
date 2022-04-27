const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const getCoordsForAddress = require("../util/location");
const Place = require("../models/place");
const place = require("../models/place");

// let DUMMY_PLACES = [
//   {
//     id: "p1",
//     title: "Empire State Building",
//     description: "One of the most famous sky scrapers in the world",
//     address: "20 W 34th St, New York, NY 10001",
//     location: {
//       lat: 40.748817,
//       lng: -73.985428,
//     },
//     creator: "u1",
//   },
//   {
//     id: "p2",
//     title: "Emp. State Building",
//     description: "One of the most famous sky scrapers in the world",
//     address: "20 W 34th St, New York, NY 10001",
//     location: {
//       lat: 40.748817,
//       lng: -73.985428,
//     },
//     creator: "u2",
//   },
// ];

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  // const place = DUMMY_PLACES.find((p) => {
  //   return p.id === placeId;
  // });
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a place",
      500
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError(
      "Could not find a place for the provided place id",
      404
    );
    return next(error);
  }
  res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  // const places = DUMMY_PLACES.filter((p) => {
  //   return p.creator === userId;
  // });
  let places;
  try {
    places = await Place.find({ creator: userId });
  } catch (err) {
    const error = new HttpError(
      "Fetching places failed, please try again later",
      500
    );
    return next(error);
  }

  if (!places || places.length === 0) {
    return next(
      new HttpError("Could not find a place for the provided user id", 404)
    );
  }
  res.json({
    places: places.map((place) => place.toObject({ getters: true })),
  });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { title, description, address, creator } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  // const createdPlace = {
  //   id: uuidv4(),
  //   title,
  //   description,
  //   location: coordinates,
  //   address,
  //   creator,
  // };
  const createdPlace = new Place({
    title,
    description,
    address,
    image: "https://cdn.mos.cms.futurecdn.net/nfZYT7SrLCY5EaaPVSScLG.png",
    location: coordinates,
    creator,
  });

  // DUMMY_PLACES.push(createdPlace); //unShift(createPlace)
  try {
    await createdPlace.save();
  } catch (err) {
    const error = new HttpError(
      "Creating place failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { title, description } = req.body;

  const placeId = req.params.pid;

  // const updatedPlace = { ...DUMMY_PLACES.find((p) => p.id === placeId) };
  // const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update place.",
      500
    );
    return next(error);
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update place",
      500
    );
    return next(error);
  }

  // DUMMY_PLACES[placeIndex] = updatedPlace;

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;
  // if (!DUMMY_PLACES.find((p) => p.id === placeId)) {
  //   throw new HttpError("Could not find a place for that id", 404);
  // }
  // DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId);

  //   const placeToBeDeletedIndex = DUMMY_PLACES.find((p) => p.id === placeId);

  //   DUMMY_PLACES.splice(placeToBeDeletedIndex, 1);

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete place",
      500
    );
    return next(error);
  }

  try {
    await place.remove();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete place",
      500
    );
    return next(error);
  }
  res.status(200).json({ message: "deleted place" });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
