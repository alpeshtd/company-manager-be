const Customer = require("./models/Customer");
const Employee = require("./models/Employee");
const Expense = require("./models/Expense");
const Income = require("./models/Income");
const Notification = require("./models/Notification");
const Order = require("./models/Order");
const Purchase = require("./models/Purchase");
const Stock = require("./models/Stock");
const User = require("./models/User");
const UserRole = require("./models/UserRole");
const Utilization = require("./models/Utilization");
const Vendor = require("./models/Vendor");

const io = require("./socket");

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    purchases: async () =>
      await Purchase.find({})
        .populate("vendorId")
        .populate("purchaseTypeId")
        .populate("orderId")
        .populate("purchaseById")
        .populate("performedById")
        .populate("purchaseConfirmedById"),
    purchase: async (parent, args) =>
      await Purchase.findById(args.id)
        .populate("vendorId")
        .populate("purchaseTypeId")
        .populate("orderId")
        .populate("purchaseById")
        .populate("performedById")
        .populate("purchaseConfirmedById"),
    expenses: async () =>
      await Expense.find({})
        .populate("orderId")
        .populate("expenseById")
        .populate("performedById")
        .populate("expenseConfirmedById"),
    expense: async (parent, args) =>
      await Expense.findById(args.id)
        .populate("orderId")
        .populate("expenseById")
        .populate("performedById")
        .populate("expenseConfirmedById"),
    stocks: async () => await Stock.find({}).populate("performedById"),
    stock: async (parent, args) =>
      await Stock.findById(args.id).populate("performedById"),
    utilizations: async () =>
      await Utilization.find({})
        .populate("stockId")
        .populate("utilizationById")
        .populate("performedById")
        .populate("orderId"),
    utilization: async (parent, args) =>
      await Utilization.findById(args.id)
        .populate("stockId")
        .populate("utilizationById")
        .populate("performedById")
        .populate("orderId"),
    incomes: async () =>
      await Income.find({})
        .populate("customerId")
        .populate("orderId")
        .populate("performedById")
        .populate("receivedById"),
    income: async (parent, args) =>
      await Income.findById(args.id)
        .populate("customerId")
        .populate("orderId")
        .populate("performedById")
        .populate("receivedById"),
    users: async () =>
      await User.find({}).populate("userRoleId").populate("performedById"),
    user: async (parent, args) =>
      await User.findById(args.id)
        .populate("userRoleId")
        .populate("performedById"),
    userRoles: async () => await UserRole.find({}).populate("performedById"),
    userRole: async (parent, args) =>
      await UserRole.findById(args.id).populate("performedById"),
    customers: async () =>
      await Customer.find({}).populate("orders").populate("performedById"),
    customer: async (parent, args) =>
      await Customer.findById(args.id)
        .populate("orders")
        .populate("performedById"),
    orders: async () =>
      await Order.find({}).populate("customer").populate("performedById"),
    order: async (parent, args) =>
      await Order.findById(args.id)
        .populate("customer")
        .populate("performedById"),
    vendors: async () =>
      await Vendor.find({}).populate("purchases").populate("performedById"),
    vendor: async (parent, args) =>
      await Vendor.findById(args.id)
        .populate("purchases")
        .populate("performedById"),
    employees: async () => await Employee.find({}).populate("performedById"),
    employee: async (parent, args) =>
      await Employee.findById(args.id).populate("performedById"),
  },
  Mutation: {
    addPurchase: async (parent, args) => {
      const {
        quantity,
        purchaseRate,
        totalAmount,
        vendorId,
        purchaseById,
        purchaseT,
        paidAmount,
        orderId,
        remainingAmount,
        paymentMode,
        description,
        purchaseTypeId,
        purchaseStatus,
        performedById,
        performedT,
        transactionType,
        purchaseConfirmedById,
        changeLog,
      } = args;
      const newPurchase = new Purchase({
        quantity,
        purchaseRate,
        totalAmount,
        vendorId,
        purchaseById,
        purchaseT,
        paidAmount,
        orderId,
        remainingAmount,
        paymentMode,
        description,
        purchaseTypeId,
        purchaseStatus,
        performedById,
        performedT,
        transactionType,
        purchaseConfirmedById:
          purchaseStatus.value === "approved" ? performedById : null,
        changeLog,
      });
      await newPurchase.save();
      if (newPurchase) {
        if (purchaseStatus.value !== "approved") {
          const newNotification = new Notification({
            type: "Purchase",
            data: newPurchase._id,
            unread: true,
            time: newPurchase.performedT,
          });
          await newNotification.save();
          if (newNotification) {
            io.getIo().emit("refresh", {
              action: "notification",
              data: newNotification._id,
            });
          }
        } else {
          const getStock = await Stock.findById(purchaseTypeId);
          if (getStock) {
            getStock.quantity = getStock.quantity + quantity;
            await getStock.save();
          }
        }
      }
      return newPurchase;
    },
    updatePurchase: async (parent, args) => {
      const { id } = args;
      const oldPurchase = await Purchase.findById(id);
      if (oldPurchase.purchaseStatus.value === "approved") {
        throw new Error(`Purchase with ID ${id} is already approved!`);
      }
      // args.purchaseConfirmedById = req.user.userRoleId;
      const updatedPurchase = await Purchase.findByIdAndUpdate(id, args);
      if (!updatedPurchase) {
        throw new Error(`Purchase with ID ${id} not found`);
      }
      if (updatedPurchase && args.purchaseStatus.value === "approved") {
        const getStock = await Stock.findById(
          updatedPurchase.purchaseTypeId._id
        );
        if (getStock) {
          if (oldPurchase.quantity != updatedPurchase.quantity) {
            getStock.quantity =
              getStock.quantity -
              (oldPurchase.quantity - updatedPurchase.quantity);
          } else {
            getStock.quantity = getStock.quantity + updatedPurchase.quantity;
          }
          await getStock.save();
        }
        io.getIo().emit("refresh", {
          action: "notification",
          data: null,
        });
      }
      return updatedPurchase;
    },
    deletePurchase: async (parent, args) => {
      const { id } = args;
      const oldPurchase = await Purchase.findById(id);
      if (oldPurchase.purchaseStatus.value === "approved") {
        throw new Error(`Purchase with ID ${id} is already approved!`);
      }
      const deletedPurchase = await Purchase.findByIdAndDelete(id);
      if (!deletedPurchase) {
        throw new Error(`Purchase with ID ${id} not found`);
      }
      return deletedPurchase;
    },
    addExpense: async (parent, args) => {
      const {
        amount,
        expenseById,
        expenseT,
        paidAmount,
        orderId,
        remainingAmount,
        paymentMode,
        description,
        expenseStatus,
        performedById,
        performedT,
        expenseConfirmedById,
        changeLog,
      } = args;
      const newExpense = new Expense({
        amount,
        expenseById,
        expenseT,
        paidAmount,
        orderId,
        remainingAmount,
        paymentMode,
        description,
        expenseStatus,
        performedById,
        performedT,
        expenseConfirmedById:
          expenseStatus.value === "approved" ? performedById : null,
        changeLog,
      });
      await newExpense.save();
      if (newExpense) {
        if (expenseStatus.value !== "approved") {
          const newNotification = new Notification({
            type: "Expense",
            data: newExpense._id,
            unread: true,
            time: newExpense.performedT,
          });
          await newNotification.save();
          if (newNotification) {
            io.getIo().emit("refresh", {
              action: "notification",
              data: newNotification._id,
            });
          }
        }
      }
      return newExpense;
    },
    updateExpense: async (parent, args) => {
      const { id } = args;
      const oldExpense = await Expense.findById(id);
      if (oldExpense.expenseStatus.value === "approved") {
        throw new Error(`Expense with ID ${id} is already approved!`);
      }
      // args.purchaseConfirmedById = req.user.userRoleId;
      const updatedExpense = await Expense.findByIdAndUpdate(id, args);
      if (!updatedExpense) {
        throw new Error(`Expense with ID ${id} not found`);
      }
      if (updatedExpense && args.expenseStatus.value === "approved") {
        io.getIo().emit("refresh", {
          action: "notification",
          data: null,
        });
      }
      return updatedExpense;
    },
    deleteExpense: async (parent, args) => {
      const { id } = args;
      const oldExpense = await Expense.findById(id);
      if (oldExpense.expenseStatus.value === "approved") {
        throw new Error(`Expense with ID ${id} is already approved!`);
      }
      const deletedExpense = await Expense.findByIdAndDelete(id);
      if (!deletedExpense) {
        throw new Error(`Expense with ID ${id} not found`);
      }
      return deletedExpense;
    },
    addStock: async (parent, args) => {
      const {
        type,
        quantity,
        rate,
        unit,
        changeLog,
        performedById,
        performedT,
      } = args;
      const newStock = new Stock({
        type,
        quantity,
        unit,
        rate,
        changeLog,
        performedById,
        performedT,
      });
      await newStock.save();
      return newStock;
    },
    updateStock: async (parent, args) => {
      const { id } = args;
      const updatedStock = await Stock.findByIdAndUpdate(id, args);
      if (!updatedStock) {
        throw new Error(`Stock with ID ${id} not found`);
      }
      return updatedStock;
    },
    deleteStock: async (parent, args) => {
      const { id } = args;
      const deletedStock = await Stock.findByIdAndDelete(id);
      if (!deletedStock) {
        throw new Error(`Stock with ID ${id} not found`);
      }
      return deletedStock;
    },
    addUtilization: async (parent, args) => {
      const {
        stockId,
        quantity,
        rate,
        utilizationById,
        utilizationT,
        orderId,
        performedById,
        performedT,
        description,
        changeLog,
      } = args;
      const newUtilization = new Utilization({
        stockId,
        quantity,
        rate,
        utilizationById,
        utilizationT,
        orderId,
        performedById,
        performedT,
        description,
        changeLog,
      });
      await newUtilization.save();
      if (newUtilization) {
        const getStock = await Stock.findById(stockId);
        if (getStock) {
          getStock.quantity = getStock.quantity - quantity;
          await getStock.save();
        }
      }
      return newUtilization;
    },
    updateUtilization: async (parent, args) => {
      const { id } = args;
      const oldUtilization = await Utilization.findById(id);
      const updatedUtilization = await Utilization.findByIdAndUpdate(id, args);
      if (!updatedUtilization) {
        throw new Error(`Utilization with ID ${id} not found`);
      }
      if (updatedUtilization && oldUtilization.quantity != args.quantity) {
        const getStock = await Stock.findById(args.stockId);
        if (getStock) {
          getStock.quantity =
            getStock.quantity + (oldUtilization.quantity - args.quantity);
          await getStock.save();
        }
      }
      return updatedUtilization;
    },
    deleteUtilization: async (parent, args) => {
      const { id } = args;
      const deletedUtilization = await Utilization.findByIdAndDelete(id);
      if (!deletedUtilization) {
        throw new Error(`Utilization with ID ${id} not found`);
      }
      return deletedUtilization;
    },
    addIncome: async (parent, args) => {
      const {
        amount,
        customerId,
        orderId,
        transactionType,
        incomeT,
        receivedById,
        performedById,
        performedT,
        description,
        paymentMode,
        changeLog,
      } = args;
      const newIncome = new Income({
        amount,
        customerId,
        orderId,
        transactionType,
        incomeT,
        receivedById,
        performedById,
        performedT,
        description,
        paymentMode,
        changeLog,
      });
      await newIncome.save();
      return newIncome;
    },
    updateIncome: async (parent, args) => {
      const { id } = args;
      const updatedIncome = await Income.findByIdAndUpdate(id, args);
      if (!updatedIncome) {
        throw new Error(`Income with ID ${id} not found`);
      }
      return updatedIncome;
    },
    deleteIncome: async (parent, args) => {
      const { id } = args;
      const deletedIncome = await Income.findByIdAndDelete(id);
      if (!deletedIncome) {
        throw new Error(`Income with ID ${id} not found`);
      }
      return deletedIncome;
    },
    addUser: async (parent, args) => {
      const {
        userName,
        password,
        firstName,
        lastName,
        mail,
        mobile,
        userRoleId,
        changeLog,
        performedById,
        performedT,
      } = args;
      const newUser = new User({
        userName,
        password,
        firstName,
        lastName,
        mail,
        mobile,
        userRoleId,
        changeLog,
        performedById,
        performedT,
      });
      await newUser.save();
      return newUser;
    },
    updateUser: async (parent, args) => {
      const { id } = args;
      const updatedUser = await User.findByIdAndUpdate(id, args);
      if (!updatedUser) {
        throw new Error(`User with ID ${id} not found`);
      }
      return updatedUser;
    },
    deleteUser: async (parent, args) => {
      const { id } = args;
      const deletedUser = await User.findByIdAndDelete(id);
      if (!deletedUser) {
        throw new Error(`User with ID ${id} not found`);
      }
      return deletedUser;
    },
    addUserRole: async (parent, args) => {
      const { name, access, performedById, performedT, changeLog } = args;
      const newUserRole = new UserRole({
        name,
        access,
        performedById,
        performedT,
      });
      await newUserRole.save();
      return newUserRole;
    },
    updateUserRole: async (parent, args) => {
      const { id } = args;
      const updatedUserRole = await UserRole.findByIdAndUpdate(id, args);
      if (!updatedUserRole) {
        throw new Error(`UserRole with ID ${id} not found`);
      }
      return updatedUserRole;
    },
    deleteUserRole: async (parent, args) => {
      const { id } = args;
      const deletedUserRole = await UserRole.findByIdAndDelete(id);
      if (!deletedUserRole) {
        throw new Error(`UserRole with ID ${id} not found`);
      }
      return deletedUserRole;
    },
    addCustomer: async (parent, args) => {
      const {
        name,
        mobile,
        mail,
        address,
        changeLog,
        performedById,
        performedT,
      } = args;
      const newCustomer = new Customer({
        name,
        mobile,
        mail,
        address,
        changeLog,
        performedById,
        performedT,
      });
      await newCustomer.save();
      return newCustomer;
    },
    updateCustomer: async (parent, args) => {
      const { id } = args;
      const updatedCustomer = await Customer.findByIdAndUpdate(id, args);
      if (!updatedCustomer) {
        throw new Error(`Customer with ID ${id} not found`);
      }
      return updatedCustomer;
    },
    deleteCustomer: async (parent, args) => {
      const { id } = args;
      const deletedCustomer = await Customer.findByIdAndDelete(id);
      if (!deletedCustomer) {
        throw new Error(`Customer with ID ${id} not found`);
      }
      return deletedCustomer;
    },
    addOrder: async (parent, args) => {
      const {
        name,
        customer,
        orderT,
        performedById,
        performedT,
        changeLog,
        description,
        status,
      } = args;
      const newOrder = new Order({
        name,
        customer,
        orderT,
        performedById,
        performedT,
        changeLog,
        description,
        status,
      });
      await newOrder.save();
      // if (newOrder) {
      //   const getCustomers = await Customer.findById(customer);
      //   getCustomers.orders.push(newOrder.id);
      //   getCustomers.save();
      // }
      return newOrder;
    },
    updateOrder: async (parent, args) => {
      const { id } = args;
      const updatedOrder = await Order.findByIdAndUpdate(id, args);
      if (!updatedOrder) {
        throw new Error(`Order with ID ${id} not found`);
      }
      return updatedOrder;
    },
    deleteOrder: async (parent, args) => {
      const { id } = args;
      const deletedOrder = await Order.findByIdAndDelete(id);
      if (!deletedOrder) {
        throw new Error(`Order with ID ${id} not found`);
      }
      return deletedOrder;
    },
    addVendor: async (parent, args) => {
      const {
        name,
        mobile,
        mail,
        address,
        changeLog,
        performedById,
        performedT,
      } = args;
      const newCustomer = new Vendor({
        name,
        mobile,
        mail,
        address,
        changeLog,
        performedById,
        performedT,
      });
      await newCustomer.save();
      return newCustomer;
    },
    updateVendor: async (parent, args) => {
      const { id } = args;
      const updatedVendor = await Vendor.findByIdAndUpdate(id, args);
      if (!updatedVendor) {
        throw new Error(`Vendor with ID ${id} not found`);
      }
      return updatedVendor;
    },
    deleteVendor: async (parent, args) => {
      const { id } = args;
      const deletedVendor = await Vendor.findByIdAndDelete(id);
      if (!deletedVendor) {
        throw new Error(`Vendor with ID ${id} not found`);
      }
      return deletedVendor;
    },
    addEmployee: async (parent, args) => {
      const {
        name,
        address,
        mobile,
        joiningT,
        position,
        perDay,
        performedById,
        performedT,
        changeLog,
      } = args;
      const newEmployee = new Employee({
        name,
        address,
        mobile,
        joiningT,
        position,
        perDay,
        performedById,
        performedT,
        changeLog,
      });
      await newEmployee.save();
      return newEmployee;
    },
    updateEmployee: async (parent, args) => {
      const { id } = args;
      const updatedEmployee = await Employee.findByIdAndUpdate(id, args);
      if (!updatedEmployee) {
        throw new Error(`Employee with ID ${id} not found`);
      }
      return updatedEmployee;
    },
    deleteEmployee: async (parent, args) => {
      const { id } = args;
      const deletedEmployee = await Employee.findByIdAndDelete(id);
      if (!deletedEmployee) {
        throw new Error(`Employee with ID ${id} not found`);
      }
      return deletedEmployee;
    },
  },
};

module.exports = { resolvers };
