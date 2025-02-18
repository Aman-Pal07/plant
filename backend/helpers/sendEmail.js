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
    <meta charset="UTF-8">
    <meta name="viewport" content="width=297mm, height=210mm">
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

        html, body {
            width: 297mm;
            height: 210mm;
            background: white;
            font-family: Arial, sans-serif;
            overflow: hidden;
        }

        .certificate {
            width: 100%;
            height: 100%;
            padding: 20mm;
            position: relative;
            display: flex;
            flex-direction: column;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            height: 35mm;
        }

        .logo {
            width: 30mm;
            height: 30mm;
            object-fit: contain;
        }

        .title {
            text-align: center;
            font-size: 36px;
            color: #15803d;
            font-weight: bold;
            margin: 15mm 0 10mm 0;
        }

        .name-container {
            text-align: center;
            margin-bottom: 10mm;
        }

        .name {
            font-size: 32px;
            color: #0d7230;
            padding-bottom: 2mm;
            border-bottom: 0.5mm solid #22c55e;
            display: inline-block;
        }

        .content {
            text-align: center;
            line-height: 1.6;
            color: #374151;
            font-size: 16px;
        }

        .content p {
            margin: 5mm 0;
        }

        strong {
            color: #166534;
        }
    </style>
</head>
<body>
    <div class="certificate">
        <div class="header">
            <img src="/api/placeholder/120/120" alt="Oil India Logo" class="logo" />
            <img src="/api/placeholder/120/120" alt="Santulan Logo" class="logo" />
        </div>
        
        <div class="title">Token of Gratitude</div>
        
        <div class="name-container">
            <div class="name">${name}</div>
        </div>
        
        <div class="content">
            <p>For your valuable participation in the<br>
            <strong>Townhall Meeting on OIL's Environmental Strategy held on 19<sup>th</sup> Feb, 2025 at Duliajan Club, Assam</strong><br>
            and your commitment to building a sustainable future.</p>
            
            <p>As a token of our appreciation for your involvement in this important conversation, we are pleased to present you with an <strong>e-plant gift</strong>, symbolizing our collective dedication to environmental stewardship and the fight against climate change.</p>
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
