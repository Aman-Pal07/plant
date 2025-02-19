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
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
        }

        .header {
            width: 100%;
            height: 25mm;
            margin-bottom: 5mm;
            position: relative;
        }

        .logo-left,
        .logo-right {
            position: absolute;
            top: 0;
            width: 22mm;
            height: 22mm;
            object-fit: contain;
        }

        .logo-left {
            left: 0;
        }

        .logo-right {
            right: 0;
        }

        .title {
            text-align: center;
            font-size: 32px;
            color: #15803d;
            font-weight: bold;
            margin-bottom: 8mm;
        }

        .name-container {
            text-align: center;
            margin-bottom: 8mm;
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

        .divider {
            width: 80%;
            height: 0.5mm;
            background: linear-gradient(to right, transparent, #22c55e, transparent);
            margin: 10mm auto 6mm;
        }

        .view-button {
            background-color: #15803d;
            color: white;
            padding: 2mm 6mm;
            border: none;
            border-radius: 1mm;
            font-size: 16px;
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
            <img src="https://res.cloudinary.com/do4acizfd/image/upload/v1739952327/OILLOGOWITHOUTBACKGROUND_s3rfxc.jpg" alt="Oil India Logo" class="logo-left" />
            <img src="https://res.cloudinary.com/do4acizfd/image/upload/v1739952327/Santulan_Logo_3_copy_lxwscp.jpg" alt="Santulan Logo" class="logo-right" />
        </div>
        
        <div class="title">Token of Gratitude</div>
        
        <div class="name-container">
            <div class="name">${name}</div>
        </div>
        
        <div class="content">
            <p>For your valuable participation in the
           Townhall Meeting on OIL's Environmental Strategy held on 19<sup>th</sup> Feb, 2025 at Duliajan Club, Assam and your commitment to building a sustainable future.</p>
            
            <p>As a token of our appreciation for your involvement in this important conversation, we are pleased to present you with an <strong>e-plant gift</strong>, symbolizing our collective dedication to environmental stewardship and the fight against climate change.</p>
        </div>

        <div class="divider"></div>
        <a href="https://maps.app.goo.gl/fJrCDuSKG6qbKA3BA" class="view-button">View Plant Location</a>
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
      renderDelay: 2000, // Reduced delay for faster generation
      timeout: 30000, // Reduced timeout for optimization
      printBackground: true,
      preferCSSPageSize: true,
    };

    htmlPdf.create(html, options).toFile(outputPath, (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
};

const sendEmail = async (to, subject, certificateData) => {
  try {
    const tempDir = path.join(__dirname, "../temp");
    await fs.mkdir(tempDir, { recursive: true });

    const html = generateCertificateHTML(certificateData);
    const pdfPath = path.join(tempDir, `${certificateData.certificateId}.pdf`);

    await generatePDF(html, pdfPath);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMPT_MAIL,
        pass: process.env.SMPT_PASSWORD,
      },
      tls: { rejectUnauthorized: false },
      connectionTimeout: 30000,
      socketTimeout: 30000,
    });

    await transporter.verify();

    const mailOptions = {
      from: process.env.SMPT_MAIL,
      to,
      subject,
      text: `Dear ${certificateData.name},\n\nThank you for your valuable participation in the Townhall Meeting on OIL’s Environmental Strategy held on 19th February 2025 at Duliajan Club, Assam. Your involvement in this vital discussion plays an essential role in our collective journey toward building a sustainable future.\n\nAs a token of our gratitude for your commitment to environmental stewardship and the fight against climate change, we are pleased to present you with an e-plant gift. This gift symbolizes our shared dedication to creating a greener, more sustainable world.\n\nPlease find attached your Token of Gratitude, recognizing your contribution to the Townhall meeting and the future of OIL’s Environmental Strategy.\n\nBest regards,\nTeam HSE & ESG`,
      attachments: [
        {
          filename: "Certificate.pdf",
          path: pdfPath,
          contentType: "application/pdf",
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    await fs.unlink(pdfPath);
  } catch (error) {
    throw new Error(`Email could not be sent: ${error.message}`);
  }
};

module.exports = { sendEmail, generateCertificateHTML };
