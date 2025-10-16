let certificateService = {};
const Certificate = require("../../models/certificate");
const { AuditLog } = require("../../models/auditLog");
const { sendCertificateExpiryReminder } = require("../../configs/certificateMailer");

certificateService.fetchCertificates = async () => {
  try {
    const data = await Certificate.find({ removed: { $ne: true } });
    return {
      status: 200,
      data,
    };
  } catch (error) {
    console.log("An error occurred fetching certificates", error.message);
    return {
      status: 500,
      message: "Failed to fetch certificates",
    };
  }
};

certificateService.newCertificate = async (payload) => {
  try {
    const { certificateName, email, expiryDate, createdBy } = payload;

    const existing = await Certificate.findOne({
      certificateName: certificateName,
      email: email.toLowerCase(),
      expiryDate: new Date(expiryDate),
      removed: { $ne: true },
    });

    if (existing) {
      return { status: 409, message: "Certificate already exists" };
    }

    const certificate = new Certificate({
      certificateName,
      email: email.toLowerCase(),
      expiryDate: new Date(expiryDate),
    });

    await certificate.save();

    const newAuditLog = new AuditLog({
      action: "create",
      model: "certificate",
      recordId: certificate._id,
      user: createdBy,
    });
    await newAuditLog.save();

    return { status: 201, message: "Certificate created successfully" };
  } catch (error) {
    console.log("An error occurred creating certificate", error.message);
    return {
      status: 500,
      message: "Failed to create certificate",
    };
  }
};

certificateService.send30DayExpiryReminders = async () => {
  try {
    const now = new Date();
    const in30Days = new Date(now);
    in30Days.setDate(in30Days.getDate() + 30);

    const start = new Date(in30Days);
    start.setHours(0, 0, 0, 0);
    const end = new Date(in30Days);
    end.setHours(23, 59, 59, 999);

    const candidates = await Certificate.find({
      removed: { $ne: true },
      reminderSent30: { $ne: true },
      expiryDate: { $gte: start, $lte: end },
    });

    for (const cert of candidates) {
      const result = await sendCertificateExpiryReminder(
        cert.email,
        cert.certificateName,
        cert.expiryDate
      );
      if (result && result.ok) {
        cert.reminderSent30 = true;
        await cert.save();
        const newAuditLog = new AuditLog({
          action: "reminder",
          model: "certificate",
          recordId: cert._id,
          user: "system",
          data: { type: "30-days" },
        });
        await newAuditLog.save();
      }
    }

    return { status: 200, message: "Reminder job executed", count: candidates.length };
  } catch (error) {
    console.log("Error running 30-day certificate reminders", error.message);
    return { status: 500, message: "Reminder job failed" };
  }
};

module.exports = certificateService;


