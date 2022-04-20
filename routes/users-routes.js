const express = require("express");

const router = express.Router();

const USERS = [
  {
    id: "u1",
    name: "Avi",
    image:
      "https://media-exp1.licdn.com/dms/image/C4E03AQHzQDXXa6pJXA/profile-displayphoto-shrink_200_200/0/1613667850675?e=1652313600&v=beta&t=NenQfI_iT9M5EQ76_NRXo-C3Kr-blhtgvTtt6M1UXBU",
    places: 3,
  },
];

router.get("/:uid", (req, res, next) => {
  const userId = req.params.uid;
  const user = USERS.find((u) => {
    return u.id === userId;
  });
  res.json({ user });
});

module.exports = router;
