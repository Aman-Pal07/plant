const nodemailer = require("nodemailer");
const htmlPdf = require("html-pdf");
const path = require("path");
const fs = require("fs").promises;

const generateCertificateHTML = ({
  name,
  email,
  certificateId,
  registrationDate,
}) => {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=297mm, height=210mm" />
    <title>Certificate</title>
    <style>
      @page {
        size: A4 landscape;
        margin: 0;
      }

      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      html,
      body {
        width: 260mm;
        height: 230mm;
        background: white;
        font-family: Arial, sans-serif;
        overflow: hidden;
      }

      .certificate {
        width: 100%;
        height: 100%;
        padding: 12mm;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
      }

      .header {
        position: relative;
        width: 100%;
        height: 25mm;
        margin-bottom: 5mm;
      }

      .logo-left {
        position: absolute;
        left: 0;
        top: 0;
        width: 22mm;
        height: 22mm;
        object-fit: contain;
      }

      .logo-right {
        position: absolute;
        right: 0;
        top: 0;
        width: 22mm;
        height: 22mm;
        object-fit: contain;
      }

      .title {
        text-align: center;
        font-size: 32px;
        color: #15803d;
        font-weight: bold;
        margin-bottom: 8mm;
        margin-top: -5mm;
      }

      .name-container {
        text-align: center;
        margin-bottom: 8mm;
        width: 100%;
      }

      .name {
        font-size: 28px;
        color: #0d7230;
        padding-bottom: 1mm;
        border-bottom: 0.5mm solid #22c55e;
        display: inline-block;
      }

      .content {
        text-align: center;
        line-height: 1.4;
        color: #374151;
        font-size: 18px;
        max-width: 180mm;
        margin: 0 auto;
      }

      .content p {
        margin-bottom: 8mm;
      }

      .content p:last-child {
        margin-bottom: 0;
      }

      strong {
        color: #166534;
      }

      sup {
        font-size: 60%;
      }

      br {
        line-height: 1.2;
      }

      /* New styles for divider and button */
      .divider {
        width: 80%;
        height: 0.5mm;
        background: linear-gradient(
          to right,
          transparent,
          #22c55e,
          transparent
        );
        margin: 10mm auto 6mm;
      }

      .view-button {
        background-color: #15803d;
        color: white;
        padding: 2mm 6mm;
        border: none;
        border-radius: 1mm;
        font-size: 16px;
        cursor: pointer;
        transition: background-color 0.3s ease;
        margin-top: 1mm;
        text-decoration: none;
        display: inline-block;
      }

      .view-button:hover {
        background-color: #166534;
      }
    </style>
  </head>
  <body>
    <div class="certificate">
      <div class="header">
        <img
          src="https://www.oil-india.com/files/inline-images/OILLOGOWITHOUTBACKGROUND.png"
          alt="Oil India Logo"
          class="logo-left"
        />
        <img
          src="https://www.oil-india.com/files/inline-images/Santulan%20Logo%203%20copy.png"
          alt="Santulan Logo"
          class="logo-right"
        />
      </div>

      <div class="title">Token of Gratitude</div>

      <div class="name-container">
        <div class="name">${name}</div>
      </div>

      <div class="content">
        <p>
          For your valuable participation in the Townhall Meeting on OIL's
          Environmental Strategy held on 19<sup>th</sup> Feb, 2025 at Duliajan
          Club, Assam and your commitment to building a sustainable future.
        </p>

        <p>
          As a token of our appreciation for your involvement in this important
          conversation, we are pleased to present you with an
          <strong>e-plant gift</strong>, symbolizing our collective dedication
          to environmental stewardship and the fight against climate change.
        </p>
      </div>

      <div class="divider"></div>
      <a href="#" class="view-button">View Plant Location</a>
    </div>
  </body>
</html>

  `;
};

const generatePDF = async (html, outputPath) => {
  return new Promise((resolve, reject) => {
    const options = {
      format: "A4",
      orientation: "landscape",
      border: "0",
      width: "350mm",
      height: "230mm",
      type: "pdf",
      renderDelay: 2000, // Increased delay
      timeout: 30000, // Added timeout
      zoomFactor: 1,
      printBackground: true,
      preferCSSPageSize: true,
      pageRanges: "1",
    };

    htmlPdf.create(html, options).toFile(outputPath, (err, res) => {
      if (err) {
        console.error("PDF generation error:", err);
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
};

const sendEmail = async (to, subject, certificateData) => {
  try {
    // Create temp directory if it doesn't exist
    const tempDir = path.join(__dirname, "../temp");
    try {
      await fs.mkdir(tempDir, { recursive: true });
    } catch (err) {
      console.log("Temp directory already exists or error creating:", err);
    }

    const html = generateCertificateHTML(certificateData);
    const pdfPath = path.join(tempDir, `${certificateData.certificateId}.pdf`);

    // Add more detailed logging
    console.log("Generating PDF at path:", pdfPath);
    await generatePDF(html, pdfPath);
    console.log("PDF generated successfully");

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMPT_MAIL,
        pass: process.env.SMPT_PASSWORD,
      },
      // Add timeout settings
      tls: {
        rejectUnauthorized: false,
      },
      timeout: 30000, // 30 seconds
    });

    // Verify SMTP connection
    await transporter.verify();
    console.log("SMTP connection verified");

    const mailOptions = {
      from: process.env.SMPT_MAIL,
      to,
      subject,
      text: `Dear ${certificateData.name},\n\nPlease find attached your Certificate of Completion from OIL CLIMATE ACADEMY.\n\nBest regards,\nOIL CLIMATE ACADEMY Team`,
      attachments: [
        {
          filename: "Certificate.pdf",
          path: pdfPath,
          contentType: "application/pdf",
        },
      ],
    };

    // Add retry logic
    let retries = 3;
    while (retries > 0) {
      try {
        await transporter.sendMail(mailOptions);
        console.log("✅ Email sent successfully with PDF certificate!");
        break;
      } catch (error) {
        retries--;
        console.error(
          `Email send attempt failed. ${retries} retries left:`,
          error
        );
        if (retries === 0) throw error;
        await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait 3 seconds before retry
      }
    }

    // Clean up file
    try {
      await fs.unlink(pdfPath);
      console.log("Temporary PDF file cleaned up");
    } catch (cleanupError) {
      console.error("Error cleaning up PDF file:", cleanupError);
    }
  } catch (error) {
    console.error("❌ Detailed email error:", error);
    console.error("Stack trace:", error.stack);
    throw new Error(`Email could not be sent: ${error.message}`);
  }
};

module.exports = { sendEmail, generateCertificateHTML };
