const DashboardService = require("../../services/adminServices/dashboardService");

class DashboardController {
  // Get certificates close to expiry
  static async getCertificatesCloseToExpiry(req, res) {
    try {
      const result = await DashboardService.getCertificatesCloseToExpiry();
      
      if (result.success) {
        return res.status(200).json({
          success: true,
          message: "Certificates close to expiry retrieved successfully",
          data: result.data,
          count: result.count
        });
      } else {
        return res.status(500).json({
          success: false,
          message: result.message,
          error: result.error
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message
      });
    }
  }

  // Get main stock count
  static async getMainStockCount(req, res) {
    try {
      const result = await DashboardService.getMainStockCount();
      
      if (result.success) {
        return res.status(200).json({
          success: true,
          message: result.message,
          data: result.data
        });
      } else {
        return res.status(500).json({
          success: false,
          message: result.message,
          error: result.error
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message
      });
    }
  }

  // Get out of stock count
  static async getOutOfStockCount(req, res) {
    try {
      const result = await DashboardService.getOutOfStockCount();
      
      if (result.success) {
        return res.status(200).json({
          success: true,
          message: result.message,
          data: result.data
        });
      } else {
        return res.status(500).json({
          success: false,
          message: result.message,
          error: result.error
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message
      });
    }
  }

  // Get finished goods count
  static async getFinishedGoodsCount(req, res) {
    try {
      const result = await DashboardService.getFinishedGoodsCount();
      
      if (result.success) {
        return res.status(200).json({
          success: true,
          message: result.message,
          data: result.data
        });
      } else {
        return res.status(500).json({
          success: false,
          message: result.message,
          error: result.error
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message
      });
    }
  }

  // Get all dashboard data
  static async getDashboardData(req, res) {
    try {
      const result = await DashboardService.getDashboardData();
      
      if (result.success) {
        return res.status(200).json({
          success: true,
          message: result.message,
          data: result.data
        });
      } else {
        return res.status(500).json({
          success: false,
          message: result.message,
          error: result.error
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message
      });
    }
  }
}

module.exports = DashboardController;
