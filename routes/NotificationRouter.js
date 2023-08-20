const Notification = require("../models/Notification");
const express = require("express");
const Purchase = require("../models/Purchase");
const UserRole = require("../models/UserRole");

const notificationRouter = express.Router();

// notificationRouter.use((req, res, next) => {
//   next();
// });

// notificationRouter.use(express.json());

// notificationRouter.use(function (req, res, next) {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type");
//   // res.setHeader('Access-Control-Allow-Credentials', true);
//   next();
// });

notificationRouter.post("/addNotification", async (req, res) => {
  const newNotification = new Notification({});
  await newNotification.save();
  res.send(newNotification);
});

notificationRouter.post("/updateNotification", async (req, res) => {
  const updatedNotification = await Notification.findByIdAndUpdate(
    req.body.id,
    req.body
  );
  if (!updatedNotification) {
    throw new Error(`Notification with ID ${req.body.id} not found`);
  }
  res.send(updatedNotification);
});

notificationRouter.get("/getNotifications", async (req, res) => {
  // const sortedPurchases = await Purchase.find({ 'purchaseStatus.value': { $nin: ['approved', 'rejected'] }});
  const userRole = await UserRole.findById(req.user.userRoleId);
  if (userRole && userRole.access.find((role) => role.value == "superUser")) {
    const newNotification = await Notification.find({})
      .populate({
        path: "data",
        populate: [
          {
            path: "purchaseTypeId",
            strictPopulate: false
          },
          {
            path: "purchaseById",
            strictPopulate: false
          },
          {
            path: "purchaseConfirmedById",
            strictPopulate: false
          },
          {
            path: "expenseById",
            strictPopulate: false
          },
          {
            path: "expenseConfirmedById",
            strictPopulate: false
          }
        ],
      })
      .sort({ time: -1 });
    res.send({ data: newNotification });
  } else {
    // console.log(req.user._id.toString()); 61316c327033653473356836
    let newNotification = await Notification.find({})
      .populate({
        path: "data",
        match: {
          performedById: req.user._id,
        },
        populate: [
          {
            path: "purchaseTypeId",
          },
          {
            path: "purchaseById",
          },
          {
            path: "purchaseConfirmedById"
          }
        ],
      })
      .sort({ time: -1 });
    newNotification = newNotification.filter((n) => n.data);
    res.send({ data: newNotification });
  }
});

module.exports = notificationRouter;
