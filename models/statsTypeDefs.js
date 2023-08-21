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
`;

const statsQueryDefs = `
    utilizationStats(fromT: String, toT: String): UtilizationStats
`

module.exports = { statsTypeDefs, statsQueryDefs };
