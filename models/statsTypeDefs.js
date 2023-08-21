const statsTypeDefs = `
  type UtilizationStock {
    id: String
    name: String,
    totalUtilizations: Int,
    totalApproved: Int,
    totalRejected: Int,
    totalInProgress: Int,
    totalCost: Int,
    approvedQtyCost: Int,
    rejectedQtyCost: Int,
    inProgressQtyCost: Int
  }
  type UtilizationStats {
    totalUtilizations: Int,
    totalApproved: Int,
    totalRejected: Int,
    totalInProgress: Int,
    totalCost: Int,
    approvedQtyCost: Int,
    rejectedQtyCost: Int,
    inProgressQtyCost: Int,
    stocks: [UtilizationStock],
  }
  type OrderStats {
    total: Int,
    completed: Int,
    inProgress: Int,
    inPipeline: Int,
    pending: Int,
    rejected: Int,
  }
  type IncomeExpenseStats {
    totalIncome: Int,
    totalExpense: Int,
    paidExpense: Int,
    remainingExpense: Int
  }
`;

const statsQueryDefs = `
    utilizationStats(fromT: String, toT: String): UtilizationStats,
    orderStats(fromT: String, toT: String): OrderStats,
    incomeExpenseStats(fromT: String, toT: String): IncomeExpenseStats,
`

module.exports = { statsTypeDefs, statsQueryDefs };
