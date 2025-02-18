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
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Token of Gratitude</title>
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

        html, body {
            width: 297mm;
            height: 210mm;
            margin: 0;
            padding: 0;
            background: white;
            font-family: Arial, sans-serif;
            overflow: hidden;
        }

        .certificate-wrapper {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: white;
            padding: 15mm;
        }

        .certificate {
            width: 100%;
            height: 100%;
            background: white;
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 20px;
            height: 40mm;
        }

        .logo {
            width: 35mm;
            height: 35mm;
            object-fit: contain;
        }

        .title {
            text-align: center;
            font-size: 32px;
            font-weight: bold;
            margin: 15px 0;
            color: #15803d;
        }

        .name {
            text-align: center;
            font-size: 36px;
            text-decoration: underline;
            text-decoration-color: #22c55e;
            text-decoration-thickness: 1px;
            margin: 20px 0;
            color: #0d7230;
            font-weight: bold;
        }

        .content {
            text-align: justify;
            line-height: 1.5;
            margin: 10px 0;
            color: #374151;
            padding: 0 20px;
        }

        .main-text {
            margin: 15px 0;
            font-size: 18px;
            text-align: center;
        }

        .date-location {
            margin: 15px 0;
            font-size: 18px;
            text-align: center;
        }

        .appreciation-text {
            margin: 15px 0;
            font-size: 18px;
            text-align: center;
            padding: 0 40px;
        }

        .divider {
            border-top: 0.5mm solid #e5e7eb;
            width: 90%;
            margin: 15px auto;
        }

        .button-container {
            text-align: center;
            margin: 15px 0 20px 0;
        }

        .location-button {
            background-color: #15803d;
            color: white;
            padding: 8px 20px;
            border-radius: 4px;
            border: none;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            font-weight: 500;
        }

        strong {
            color: #15803d;
        }
    </style>
</head>
<body>
    <div class="certificate-wrapper">
        <div class="certificate">
            <div class="header">
                <img
                    src="https://www.oil-india.com/files/inline-images/OILLOGOWITHOUTBACKGROUND.png"
                    alt="Oil India Logo"
                    class="logo"
                />
                <img
                    src="https://www.oil-india.com/files/inline-images/Santulan%20Logo%203%20copy.png"
                    alt="Santulan Logo"
                    class="logo"
                />
            </div>

            <div class="title">Token of Gratitude</div>

            <div class="name">${name}</div>

            <div class="content">
                <div class="main-text">
                    For your valuable participation in the
                </div>

                <div class="date-location">
                    <strong>Townhall Meeting on OIL's Environmental Strategy held on 19<sup>th</sup> Feb, 2025 at Duliajan Club, Assam</strong>
                    and your commitment to building a sustainable future.
                </div>

                <div class="appreciation-text">
                    As a token of our appreciation for your involvement in this important conversation, we are pleased to present you with an <strong>e-plant gift</strong>, symbolizing our collective dedication to environmental stewardship and the fight against climate change.
                </div>
            </div>

            <div>
                <div class="divider"></div>
                <div class="button-container">
                    <a href="https://maps.app.goo.gl/xTyGAKBoTb2CXxtc7" class="location-button">View Plant Location</a>
                </div>
            </div>
        </div>
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
      height: "215mm", // Standard A4 height in landscape
      width: "310mm", // Standard A4 width in landscape
      type: "pdf",
      renderDelay: 1000,
      zoomFactor: 1, // Prevent any automatic scaling
      printBackground: true,
      preferCSSPageSize: true,
      pageRanges: "1", // Only generate first page
    };

    htmlPdf.create(html, options).toFile(outputPath, (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
};

const sendEmail = async (to, subject, certificateData) => {
  try {
    const html = generateCertificateHTML(certificateData);
    const pdfPath = path.join(
      __dirname,
      `../temp/${certificateData.certificateId}.pdf`
    );
    await generatePDF(html, pdfPath);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMPT_MAIL,
        pass: process.env.SMPT_PASSWORD,
      },
    });

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

    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully with PDF certificate!");

    await fs.unlink(pdfPath);
  } catch (error) {
    console.error("❌ Email failed to send:", error);
    throw new Error("Email could not be sent!");
  }
};

module.exports = { sendEmail, generateCertificateHTML };
