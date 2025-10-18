const certificateService = require("../../services/adminServices/certificateService");

let certificateController = {};

certificateController.fetchCertificates = async (req, res) => {
  try {
    const result = await certificateService.fetchCertificates();
    res.status(result.status).json({
      message: result.message || "Certificates fetched successfully",
      data: result.data || [],
    });
  } catch (error) {
    console.log("Error in fetching certificates controller", error.message);
    res.status(500).json({ info: "An error occurred" });
  }
};

certificateController.newCertificate = async (req, res) => {
  try {
    const { certificateName, email, expiryDate, createdBy } = req.body;

    const result = await certificateService.newCertificate({
      certificateName,
      email,
      expiryDate,
      createdBy,
    });

    res.status(result.status).json({
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    console.log("Error in creating certificate controller", error.message);
    res.status(500).json({ info: "An error occurred" });
  }
};

module.exports = certificateController;


