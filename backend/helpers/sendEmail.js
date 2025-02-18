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
            padding: 20px;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            height: 40mm;
        }

        .logo-left {
            width: 35mm;
            height: 35mm;
            object-fit: contain;
        }

        .logo-right {
            width: 30mm;
            height: 30mm;
            object-fit: contain;
            margin-left: 10px;
        }

        .title {
            text-align: center;
            font-size: 32px;
            font-weight: bold;
            margin: 10px 0;
            color: #15803d;
        }

        .name {
            text-align: center;
            font-size: 36px;
            text-decoration: underline;
            text-decoration-color: #22c55e;
            text-decoration-thickness: 1px;
            margin: 10px 0;
            color: #0d7230;
            font-weight: bold;
        }

        .content {
            text-align: justify;
            line-height: 1.5;
            color: #374151;
            padding: 0 40px;
            margin-top: 10px;
        }

        .main-text,
        .appreciation-text {
            font-size: 18px;
            text-align: center;
            margin: 10px 0;
        }

        .divider {
            border-top: 0.5mm solid #e5e7eb;
            width: 90%;
            margin: 15px auto;
        }
    </style>
</head>
<body>
    <div class="certificate-wrapper">
        <div class="certificate">
            <div class="header">
                <!-- Top Left Image -->
                <img
                    src="https://www.oil-india.com/files/inline-images/OILLOGOWITHOUTBACKGROUND.png"
                    alt="Oil India Logo"
                    class="logo-left"
                />

                <!-- Top Right Images -->
                <div>
                    <img
                        src="https://www.oil-india.com/files/inline-images/Santulan%20Logo%203%20copy.png"
                        alt="Santulan Logo"
                        class="logo-right"
                    />
                    <img
                        src="https://www.oil-india.com/files/inline-images/OILLOGOWITHOUTBACKGROUND.png"
                        alt="Oil India Logo"
                        class="logo-right"
                    />
                </div>
            </div>

            <!-- Title -->
            <div class="title">Token of Gratitude</div>

            <!-- Name -->
            <div class="name">${name}</div>

            <!-- Content -->
            <div class="content">
                <div class="main-text">
                    For your valuable participation in the<br>
                    <strong>Townhall Meeting on OIL's Environmental Strategy held on 19<sup>th</sup> Feb, 2025 at Duliajan Club, Assam</strong><br>
                    and your commitment to building a sustainable future.
                </div>

                <div class="appreciation-text">
                    As a token of our appreciation for your involvement in this important conversation, we are pleased to present you with an <strong>e-plant gift</strong>, symbolizing our collective dedication to environmental stewardship and the fight against climate change.
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
      height: "210mm", // Exact A4 landscape height
      width: "297mm", // Exact A4 landscape width
      type: "pdf",
      renderDelay: 1000,
      zoomFactor: 1,
      printBackground: true,
      preferCSSPageSize: true,
      pageRanges: "1",
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
      text: `Dear ${certificateData.name},\n\nPlease find attached your Token of Gratitude from OIL INDIA.\n\nBest regards,\nOIL INDIA Team`,
      attachments: [
        {
          filename: "Token_of_Gratitude.pdf",
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
