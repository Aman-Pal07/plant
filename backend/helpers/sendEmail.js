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
            width: 297mm;
            height: 210mm;
            position: relative;
            padding: 20mm;
            display: flex;
            flex-direction: column;
        }

        .logo-left {
            width: 25mm;
            height: 25mm;
            object-fit: contain;
            margin-bottom: 10mm;
        }

        .main-content {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            max-width: 240mm;
            margin: 0 auto;
        }

        .title {
            text-align: right;
            font-size: 32px;
            color: #008753;
            font-weight: bold;
            margin-bottom: 20mm;
        }

        .name-container {
            text-align: right;
            margin-bottom: 25mm;
        }

        .name {
            font-size: 28px;
            color: #000000;
            padding-bottom: 1mm;
            border-bottom: 0.5mm solid #008753;
            display: inline-block;
        }

        .content {
            text-align: center;
            line-height: 1.5;
            font-size: 15px;
        }

        .meeting-text {
            color: #008753;
            font-weight: bold;
            margin: 6mm 0;
        }

        .content p {
            margin-bottom: 10mm;
        }

        .e-plant {
            color: #008753;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="certificate">
        <img src="https://www.oil-india.com/files/inline-images/OILLOGOWITHOUTBACKGROUND.png" alt="Oil India Logo" class="logo-left" />
        
        <div class="main-content">
            <div class="title">Token of Gratitude</div>
            
            <div class="name-container">
                <div class="name">${name}</div>
            </div>
            
            <div class="content">
                <p>For your valuable participation in the</p>
                <p class="meeting-text">Townhall Meeting on OIL's Environmental Strategy held on 19<sup>th</sup> Feb, 2025 at Duliajan Club, Assam</p>
                <p>and your commitment to building a sustainable future.</p>
                
                <p>As a token of our appreciation for your involvement in this important conversation, we are pleased to present you with an <span class="e-plant">e-plant gift</span>, symbolizing our collective dedication to environmental stewardship and the fight against climate change.</p>
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
