const Certificate = require("../../models/certificate");
const MainStock = require("../../models/mainStock");
const OutOfStock = require("../../models/outOfStock");
const FinishedGoods = require("../../models/finishedGoods");

class DashboardService {
  // Get certificates that are close to expiry (within 2 months)
  static async getCertificatesCloseToExpiry() {
    try {
      const twoMonthsFromNow = new Date();
      twoMonthsFromNow.setMonth(twoMonthsFromNow.getMonth() + 2);

      const certificates = await Certificate.find({
        expiryDate: { $lte: twoMonthsFromNow },
        removed: false
      })
      .populate('createdBy', 'name email')
      .populate('assigned', 'name email')
      .sort({ expiryDate: 1 });

      return {
        success: true,
        data: certificates,
        count: certificates.length
      };
    } catch (error) {
      return {
        success: false,
        message: "Error fetching certificates close to expiry",
        error: error.message
      };
    }
  }

  // Get main stock items count
  static async getMainStockCount() {
    try {
      const count = await MainStock.countDocuments({ removed: false });
      
      return {
        success: true,
        data: { count },
        message: `Total main stock items: ${count}`
      };
    } catch (error) {
      return {
        success: false,
        message: "Error fetching main stock count",
        error: error.message
      };
    }
  }

  // Get out of stock items count
  static async getOutOfStockCount() {
    try {
      const count = await OutOfStock.countDocuments({ removed: false });
      
      return {
        success: true,
        data: { count },
        message: `Total out of stock items: ${count}`
      };
    } catch (error) {
      return {
        success: false,
        message: "Error fetching out of stock count",
        error: error.message
      };
    }
  }

  // Get finished goods count
  static async getFinishedGoodsCount() {
    try {
      const count = await FinishedGoods.countDocuments({ removed: false });
      
      return {
        success: true,
        data: { count },
        message: `Total finished goods: ${count}`
      };
    } catch (error) {
      return {
        success: false,
        message: "Error fetching finished goods count",
        error: error.message
      };
    }
  }

  // Get all dashboard data in one call
  static async getDashboardData() {
    try {
      const [
        certificatesResult,
        mainStockResult,
        outOfStockResult,
        finishedGoodsResult
      ] = await Promise.all([
        this.getCertificatesCloseToExpiry(),
        this.getMainStockCount(),
        this.getOutOfStockCount(),
        this.getFinishedGoodsCount()
      ]);

      return {
        success: true,
        data: {
          certificatesCloseToExpiry: certificatesResult.success ? certificatesResult.data : [],
          certificatesCount: certificatesResult.success ? certificatesResult.count : 0,
          mainStockCount: mainStockResult.success ? mainStockResult.data.count : 0,
          outOfStockCount: outOfStockResult.success ? outOfStockResult.data.count : 0,
          finishedGoodsCount: finishedGoodsResult.success ? finishedGoodsResult.data.count : 0
        },
        message: "Dashboard data retrieved successfully"
      };
    } catch (error) {
      return {
        success: false,
        message: "Error fetching dashboard data",
        error: error.message
      };
    }
  }
}

module.exports = DashboardService;
