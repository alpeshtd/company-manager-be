const Utilization = require("./models/Utilization");

const statsResolver = {
  utilizationStats: async (parent, args) => {
    const { fromT, toT} = args;
    const getUtilizations = await Utilization.find({ utilizationT: { $gte: fromT, $lte: toT} }).populate("stockId");

    if (!getUtilizations) {
      return {};
    }

    const stockStats = getUtilizations.reduce((rem, item) => {
      const isExists = rem.findIndex(
        (remItem) => remItem.id == item.stockId.id
      );
      if (isExists != -1) {
        const tempRem = [...rem];
        const i = rem[isExists];
        tempRem[isExists] = {
          ...i,
          totalUtilizations: i.totalUtilizations + +item.quantity,
          totalApproved:
            item.utilizationStatus.value == "approved"
              ? i.totalApproved + +item.quantity
              : i.totalApproved,
          totalRejected:
            item.utilizationStatus.value == "rejected"
              ? i.totalRejected + +item.quantity
              : i.totalRejected,
          totalInProgress:
            item.utilizationStatus.value == "inProgress"
              ? i.totalInProgress + +item.quantity
              : i.totalInProgress,
          totalCost: i.totalCost + item.rate * item.quantity,
          approvedQtyCost:
            item.utilizationStatus.value == "approved"
              ? i.approvedQtyCost + item.rate * item.quantity
              : i.approvedQtyCost,
          rejectedQtyCost:
            item.utilizationStatus.value == "rejected"
              ? i.rejectedQtyCost + item.rate * item.quantity
              : i.rejectedQtyCost,
          inProgressQtyCost:
            item.utilizationStatus.value == "inProgress"
              ? i.inProgressQtyCost + item.rate * item.quantity
              : i.inProgressQtyCost,
        };
        return tempRem;
      } else {
        const tempRem = {
          id: item.stockId.id,
          name: item.stockId.type,
          totalUtilizations: +item.quantity,
          totalApproved:
            item.utilizationStatus.value == "approved" ? +item.quantity : 0,
          totalRejected:
            item.utilizationStatus.value == "rejected" ? +item.quantity : 0,
          totalInProgress:
            item.utilizationStatus.value == "inProgress" ? +item.quantity : 0,
          totalCost: item.rate * item.quantity,
          approvedQtyCost:
            item.utilizationStatus.value == "approved"
              ? item.rate * item.quantity
              : 0,
          rejectedQtyCost:
            item.utilizationStatus.value == "rejected"
              ? item.rate * item.quantity
              : 0,
          inProgressQtyCost:
            item.utilizationStatus.value == "inProgress"
              ? item.rate * item.quantity
              : 0,
        };
        return [...rem, tempRem];
      }
    }, []);

    const utilizationStats = stockStats.reduce(
      (rem, item) => ({
        totalUtilizations: rem.totalUtilizations + item.totalUtilizations,
        totalApproved: rem.totalApproved + item.totalApproved,
        totalRejected: rem.totalRejected + item.totalRejected,
        totalInProgress: rem.totalInProgress + item.totalInProgress,
        totalCost: rem.totalCost + item.totalCost,
        approvedQtyCost: rem.approvedQtyCost + item.approvedQtyCost,
        rejectedQtyCost: rem.rejectedQtyCost + item.rejectedQtyCost,
        inProgressQtyCost: rem.inProgressQtyCost + item.inProgressQtyCost,
      }),
      {
        totalUtilizations: 0,
        totalApproved: 0,
        totalRejected: 0,
        totalInProgress: 0,
        totalCost: 0,
        approvedQtyCost: 0,
        rejectedQtyCost: 0,
        inProgressQtyCost: 0
      }
    );

    return {
      ...utilizationStats,
      stocks: [...stockStats],
    };
  },
};

module.exports = { statsResolver };
