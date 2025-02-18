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
    <title>Certificate of Completion</title>
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
    width: 297mm; /* Standard A4 landscape width */
            height: 210mm; /* Standard A4 landscape height */
            margin: 0;
            padding: 0;
            background: white;
            font-family: Arial, sans-serif;
        }

        .certificate-wrapper {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
            background: white;
        }

        .certificate {
            width: 100%; /* Full width of A4 landscape */
            height: 100%; /* Full height of A4 landscape */
            background: white;
            position: relative;
            border-top: 10mm solid #15803d; /* Thick border at the top */
            padding: 20mm; /* Padding to ensure content fits */
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        .logo {
            position: absolute;
            margin:20px;
            top: 10mm; /* Position from the top */
            right: 10mm; /* Position from the right */
            width: 30mm; /* Logo size */
            height: 30mm; /* Logo size */
        }

        .logo img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }

        .header {
            width: 60%; /* Header width */
            background: linear-gradient(to right, #15803d, #22c55e);
            color: white;
            padding: 5mm 10mm; /* Padding for header */
            border-top-left-radius: 2mm; /* Rounded corners */
            border-top-right-radius: 2mm; /* Rounded corners */
        }

        .header h1 {
            font-size: 8mm; /* Header font size */
            font-weight: 800;
            text-transform: none;
            white-space: nowrap;
        }

        .content {
           padding-top: 3rem;
        
            text-align: center;
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            margin-top: 10mm; /* Margin from the header */
        }

        .intro {
        margin-top: 4rem;
            color: #374151;
            font-size: 13mm; /* Intro font size */
            margin-bottom: 5mm; /* Margin below intro */
            white-space: nowrap;
        }

        .recipient {
        margin-top: 2rem;
            color: #0d7230;
            font-size: 23mm; /* Recipient name font size */
            font-weight: 800;
            margin: 5mm 0; /* Margin around recipient name */
            text-decoration: underline;
            text-decoration-color: #22c55e;
            text-underline-offset: 2mm; /* Underline offset */
        }

        .description {
           margin-top: 1rem;
            color: #374151;
            max-width: 80%; /* Description width */
            margin: 5mm auto; /* Margin around description */
            font-size: 7mm; /* Description font size */
            line-height: 1.625;
        }

        .academy-name {
            font-weight: 700;
            color: #1e5531;
        }

        .date {
           margin-top: 3rem;
                    margin-bottom: 3rem;

            color: #4b5563;
            font-size: 8mm; /* Date font size */
            font-weight: 500;
            margin-top: 5mm; /* Margin above date */
        }

        .divider {
           margin-top: 4rem;
            border-top: 1mm solid #e5e7eb; /* Divider line */
            width: 100%;
            margin: 5mm 0; /* Margin around divider */
        }

        .button-container {
        padding-top:3rem;
            text-align: center;
            margin-top: 5mm; /* Margin above button */
        }

        .location-button {
            background-color: #15803d;
            color: white;
            padding: 3mm 6mm; /* Button padding */
            border-radius: 2mm; /* Button border radius */
            border: none;
            text-decoration: none;
            display: inline-block;
            font-size: 8mm; /* Button font size */
            font-weight: 500;
        }
    </style>
</head>
<body>
    <div class="certificate-wrapper">
        <div class="certificate">
            <div class="logo">
                <img
                    src="https://www.oil-india.com/files/inline-images/OILLOGOWITHOUTBACKGROUND.png"
                    alt="Logo"
                />
            </div>

            <div class="header">
                <h1>Certificate of Completion</h1>
            </div>

            <div class="content">
                <p class="intro">This Certificate of Completion is Presented to</p>
                <h2 class="recipient">${name}</h2>
                <p class="description">
                    Thank you for your co-operation for signing this initiative from
                    <span class="academy-name">OIL CLIMATE ACADEMY</span>
                    for successfully completing the program aimed to enhance
                    understanding and capabilities in addressing challenges related to
                    climate change, sustainability & energy transition.
                </p>
                <p class="date" id="current-date"></p>
            </div>

            <div>
                <div class="divider"></div>
                <div class="button-container">
                    <a
                        href="https://maps.app.goo.gl/xTyGAKBoTb2CXxtc7"
                        class="location-button"
                    >View Plant Location</a>
                </div>
            </div>
        </div>
    </div>

    <script>
        const currentDateElement = document.getElementById("current-date");
        const currentDate = new Date();
        const options = { year: "numeric", month: "long", day: "numeric" };
        currentDateElement.textContent = currentDate.toLocaleDateString(
            "en-US",
            options
        );
    </script>
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
