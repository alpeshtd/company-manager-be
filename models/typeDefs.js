const typeDefs = `
  type Purchase {
    id: ID
    quantity: Float,
    purchaseRate: Float,
    totalAmount: Float,
    vendorId: Vendor,
    purchaseById: Employee,
    purchaseT: String,
    paidAmount: Float,
    orderId: Order,
    remainingAmount: Float,
    paymentMode: Access,
    description: String,
    purchaseTypeId: Stock,
    purchaseStatus: Access,
    performedById: User,
    performedT: String,
    transactionType: String,
    purchaseConfirmedById: User,
    changeLog: [String]
  }

  type Stock {
    id: ID,
    type: String!,
    quantity: Float,
    rate: Float!,
    unit: String!,
    changeLog: [String],
    performedById: User,
    performedT: String,
  }

  type Utilization {
    id: ID,
    stockId: Stock,
    quantity: Float,
    rate: Float,
    utilizationById: Employee,
    utilizationT: String,
    orderId: Order,
    performedById: User,
    performedT: String,
    description: String,
    changeLog: [String],
  }

  type Income {
    id: ID,
    amount: Float,
    customerId: Customer,
    transactionType: String,
    orderId: Order,
    incomeT: String,
    receivedById: Employee,
    performedById: User,
    performedT: String,
    description: String,
    paymentMode: Access,
    changeLog: [String]
  }

  type User {
    id: ID,
    userName: String,
    password: String,
    firstName: String,
    lastName: String,
    mail: String,
    mobile: String,
    userRoleId: UserRole,
    changeLog: [String],
    performedById: User,
    performedT: String,
  }

  type Access {
    label: String,
    id: String,
    value: String,
  }

  input AccessInput {
    label: String,
    id: String,
    value: String,
  }

  type UserRole {
    id: ID,
    name: String!,
    access: [Access],
    changeLog: [String],
    performedById: User,
    performedT: String,
  }

  type Customer {
    id: ID,
    name: String!,
    mobile: String,
    mail: String,
    address: String,
    orders: [Order],
    changeLog: [String],
    performedById: User,
    performedT: String,
  }

  type Order {
    id: ID,
    name: String!,
    customer: Customer,
    orderT: String,
    performedById: User,
    performedT: String,
    changeLog: [String],
    description: String,
    status: Access
  }

  type Vendor {
    id: ID,
    name: String!,
    mobile: String,
    mail: String,
    address: String,
    purchases: [Purchase],
    changeLog: [String],
    performedById: User,
    performedT: String,
  }

  type Employee {
    id: ID,
    name: String,
    address: String,
    mobile: String,
    joiningT: String,
    position: String,
    perDay: Int,
    performedById: User,
    performedT: String,
    changeLog: [String]
  }

  type Query {
    purchases: [Purchase],
    purchase(id: ID!): Purchase,
    stocks: [Stock],
    stock(id: ID!): Stock,
    utilizations: [Utilization],
    Utilization(id: ID!): Utilization,
    incomes: [Income],
    income(id: ID!): Income,
    users: [User],
    user(id: ID!): User,
    userRoles: [UserRole],
    userRole(id: ID!): UserRole,
    customers: [Customer],
    customer(id: ID!): Customer,
    orders: [Order],
    order(id: ID!): Order,
    vendors: [Vendor],
    vendor(id: ID!): Vendor,
    employees: [Employee],
    employee(id: ID!): Employee
  }

  # Mutation
  type Mutation {
    addPurchase(
        quantity: Float!,
        purchaseRate: Float!,
        totalAmount: Float!,
        vendorId: String,
        purchaseById: String,
        purchaseT: String,
        paidAmount: Float,
        orderId: String,
        remainingAmount: Float,
        paymentMode: AccessInput,
        description: String,
        purchaseTypeId: String,
        purchaseStatus: AccessInput,
        performedById: String,
        performedT: String,
        transactionType: String,
        purchaseConfirmedById: String,
        changeLog: [String]
    ): Purchase
    updatePurchase(
        id: ID!,
        quantity: Float,
        purchaseRate: Float,
        totalAmount: Float,
        vendorId: String,
        purchaseById: String,
        purchaseT: String,
        paidAmount: Float,
        orderId: String,
        remainingAmount: Float,
        paymentMode: AccessInput,
        description: String,
        purchaseTypeId: String,
        purchaseStatus: AccessInput,
        performedById: String,
        performedT: String,
        transactionType: String,
        purchaseConfirmedById: String,
        changeLog: [String]
    ): Purchase
    deletePurchase( id: ID!): Purchase
    addStock(
        type: String,
        quantity: Float,
        unit: String,
        rate: Float,
        changeLog: [String],
        performedById: String,
        performedT: String,
    ): Stock
    updateStock(
        id: ID!
        type: String
        quantity: Float,
        unit: String,
        rate: Float,
        changeLog: [String],
        performedById: String,
        performedT: String,
    ): Stock
    deleteStock( id: ID!): Stock
    addUtilization(
        stockId: String,
        quantity: Float,
        rate: Float,
        utilizationById: String,
        utilizationT: String,
        orderId: String,
        performedById: String,
        performedT: String,
        description: String,
        changeLog: [String],
    ): Utilization
    updateUtilization(
        id: ID!,
        stockId: String,
        quantity: Float,
        rate: Float,
        utilizationById: String,
        utilizationT: String,
        orderId: String,
        performedById: String,
        performedT: String,
        description: String,
        changeLog: [String],
    ): Utilization
    deleteUtilization(id: ID!) : Utilization
    addIncome(
        amount: Float!,
        customerId: String,
        transactionType: String,
        orderId: String,
        incomeT: String,
        receivedById: String!,
        performedById: String,
        performedT: String,
        description: String,
        paymentMode: AccessInput,
        changeLog: [String]
    ): Income
    updateIncome(
        id: ID!,
        amount: Float,
        customerId: String,
        transactionType: String,
        orderId: String,
        incomeT: String,
        receivedById: String,
        performedById: String,
        performedT: String,
        description: String,
        paymentMode: AccessInput,
        changeLog: [String]
    ): Income
    deleteIncome( id: ID!): Income
    addUser(
        userName: String!,
        password: String!,
        firstName: String!,
        lastName: String!,
        mail: String,
        mobile: String,
        userRoleId: String!,
        changeLog: [String],
        performedById: String,
        performedT: String,
    ): User
    updateUser(
        id: ID!,
        userName: String,
        password: String,
        firstName: String,
        lastName: String,
        mail: String,
        mobile: String,
        userRoleId: String,
        changeLog: [String],
        performedById: String,
        performedT: String,
    ): User
    deleteUser(id: ID!): User
    addUserRole(
        name: String!,
        access: [AccessInput],
        changeLog: [String],
        performedById: String,
        performedT: String,
    ): UserRole
    updateUserRole(
        id: ID!,
        name: String,
        access: [AccessInput],
        changeLog: [String],
        performedById: String,
        performedT: String,
    ): UserRole
    deleteUserRole(id: ID!): UserRole,
    addCustomer(
        name: String!,
        mobile: String,
        mail: String,
        address: String,
        changeLog: [String],
        performedById: String,
        performedT: String,
    ): Customer
    updateCustomer(
        id: ID!,
        name: String,
        mobile: String,
        mail: String,
        address: String,
        changeLog: [String],
        performedById: String,
        performedT: String,
    ): Customer
    deleteCustomer(id: ID!): Customer
    addOrder(
        name: String!,
        customer: String,
        orderT: String,
        performedById: String,
        performedT: String,
        changeLog: [String],
        description: String
        status: AccessInput
    ): Order
    updateOrder(
        id: ID!,
        name: String,
        customer: String,
        orderT: String,
        performedById: String,
        performedT: String,
        changeLog: [String],
        description: String,
        status: AccessInput
    ): Order
    deleteOrder(id: ID!): Order
    addVendor(
        name: String!,
        mobile: String,
        mail: String,
        address: String,
        changeLog: [String],
        performedById: String,
        performedT: String,
    ): Vendor
    updateVendor(
        id: ID!,
        name: String,
        mobile: String,
        mail: String,
        address: String,
        changeLog: [String],
        performedById: String,
        performedT: String,
    ): Vendor
    deleteVendor(id: ID!): Vendor
    addEmployee(
        name: String,
        address: String,
        mobile: String,
        joiningT: String,
        position: String,
        perDay: Int,
        performedById: String,
        performedT: String,
        changeLog: [String]
    ): Employee
    updateEmployee(
        id: ID,
        name: String,
        address: String,
        mobile: String,
        joiningT: String,
        position: String,
        perDay: Int,
        performedById: String,
        performedT: String,
        changeLog: [String]
    ): Employee
    deleteEmployee(id: ID!): Employee
  }
`;

module.exports = { typeDefs };
