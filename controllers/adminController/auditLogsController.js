const auditLogsService = require("../../services/adminServices/auditLogsService");


let auditLogsController = {};

auditLogsController.getAllLogs = async (req, res) => {
    try {
        const logs = await auditLogsService.fetchAllLogs();
        res.status(200).json({ data: logs, message: "All purchase orders fetched successfully" });
    } catch (err) {
        console.error("Error occurred in login data", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = auditLogsController;
