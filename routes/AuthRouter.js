const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { signToken } = require("../middlewares/auth");

const authRouter = express.Router();

authRouter.post("/logout", async (req, res, next) => {
  req.session.destroy();
  res.send({
    data: {
      status: "success",
    },
  });
});

authRouter.get("/getUser", async (req, res, next) => {
  if (req.user) {
    res.send({
      data: {
        id: req.user._id,
        userName: req.user.userName,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        mail: req.user.mail,
        mobile: req.user.mobile,
        role: req.user.userRoleId,
      },
    });
  } else {
    res.status = 401;
    res.send({
      data: {
        error: "Unauthenticated!",
      },
    });
  }
});

authRouter.post("/login", async (req, res, next) => {
  let { userName, password } = req.body;
  userName = userName.trim().toLowerCase();
  if (!userName || !password) {
    req.authenticated = false;
    req.authErr = "Please provide required fields";
    // throw new Error("Please provide required fields");
  }

  const userFound = await User.findOne({ userName }).select("+password");
  if (!userFound) {
    req.authenticated = false;
    req.authErr = "Invalid credentials";
    // throw new Error("Invalid credentials");
    return next();
  }
  //   //   const result = await userFound.isPasswordCorrect(password);
  //   const result = await bcrypt.compare(password, userFound.password)
  //   console.log(password, userFound.password, result)
  //   if (!result) {
  //     req.authenticated = false;
  //     req.authErr = "Invalid credentials";
  //   }

  // Sign the JWT token
  const token = signToken({ id: userFound.id });
  req.session.token = token;
  res.send({
    data: {
      id: userFound._id,
      userName: userFound.userName,
      firstName: userFound.firstName,
      lastName: userFound.lastName,
      mail: userFound.mail,
      mobile: userFound.mobile,
      role: userFound.userRoleId.name,
    },
  });
});

module.exports = authRouter;
