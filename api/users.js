const express = require("express");
const router = express.Router();

const users = [];

router.get("/", (req, res) => {
  res.json({
    data: {
      users: users,
    }
  })
})

router.get("/create/:id", (req, res) => {
  const newUser = req.params.id
  if(!users.includes(newUser)) {
    users.push(newUser);
    res.json({
      data: {
        userId: newUser,
      }
    })
    return;
  }
  res.status(400).json({
    error: "User id is already taken"
  });
})

module.exports = router;