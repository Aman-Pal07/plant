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
            cursor: pointer;
            transition: background-color 0.3s ease;
            margin-top: 2mm;
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
            <img src="https://www.oil-india.com/files/inline-images/OILLOGOWITHOUTBACKGROUND.png" alt="Oil India Logo" class="logo-left" />
            <img src="https://www.oil-india.com/files/inline-images/Santulan%20Logo%203%20copy.png" alt="Santulan Logo" class="logo-right" />
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
        <a href="#" class="view-button">View Plant Location</a>
    </div>
</body>
</html>
  `;
};

// New function to generate PDF using puppeteer with improved error handling
const generatePDF = async (html, outputPath) => {
  let browser = null;
  let page = null;

  try {
    // Launch browser with increased timeout
    browser = await puppeteer.launch({
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--single-process",
      ],
      headless: "new",
      timeout: 60000, // Increase timeout to 60 seconds
    });

    // Create new page with timeout
    page = await browser.newPage();

    // Set viewport
    await page.setViewport({
      width: 1687,
      height: 1192,
    });

    // Set content with extended timeout
    await page.setContent(html, {
      waitUntil: ["load", "networkidle0"],
      timeout: 30000,
    });

    // Add a small delay to ensure content is fully rendered
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Generate PDF with specific settings and timeout
    const pdfBuffer = await page.pdf({
      path: outputPath,
      format: "A4",
      landscape: true,
      printBackground: true,
      margin: {
        top: "0",
        right: "0",
        bottom: "0",
        left: "0",
      },
      timeout: 30000,
    });

    // Verify PDF was generated
    if (!pdfBuffer) {
      throw new Error("PDF generation failed - no buffer returned");
    }

    // Verify file exists and has size
    const stats = await fs.stat(outputPath);
    if (stats.size === 0) {
      throw new Error("Generated PDF file is empty");
    }

    return outputPath;
  } catch (error) {
    // Enhanced error logging
    console.error("PDF Generation Error Details:", {
      error: error.message,
      stack: error.stack,
      cause: error.cause,
      browserState: browser ? "launched" : "not launched",
      pageState: page ? "created" : "not created",
    });

    throw new Error(`PDF generation failed: ${error.message}`);
  } finally {
    // Careful cleanup
    try {
      if (page) {
        await page
          .close()
          .catch((e) => console.error("Error closing page:", e));
      }
      if (browser) {
        await browser
          .close()
          .catch((e) => console.error("Error closing browser:", e));
      }
    } catch (cleanupError) {
      console.error("Error in cleanup:", cleanupError);
    }
  }
};

const sendEmail = async (to, subject, certificateData) => {
  let pdfPath = null;
  let retries = 3;

  while (retries > 0) {
    try {
      // Create temp directory with robust error handling
      const tempDir = path.join(__dirname, "../temp");
      await fs.mkdir(tempDir, { recursive: true }).catch((err) => {
        if (err.code !== "EEXIST") throw err;
      });

      // Generate unique filename with timestamp
      const timestamp = new Date().getTime();
      pdfPath = path.join(
        tempDir,
        `${certificateData.certificateId}_${timestamp}.pdf`
      );

      const html = generateCertificateHTML(certificateData);

      console.log(`Attempt ${4 - retries}: Starting PDF generation...`);
      await generatePDF(html, pdfPath);
      console.log("PDF generated successfully at:", pdfPath);

      // Create transporter
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.SMPT_MAIL,
          pass: process.env.SMPT_PASSWORD,
        },
        tls: {
          rejectUnauthorized: true,
          minVersion: "TLSv1.2",
        },
        pool: true,
        maxConnections: 5,
        maxMessages: 100,
        rateDelta: 1000,
        rateLimit: 5,
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
      console.log("✅ Email sent successfully!");
      break;
    } catch (error) {
      console.error(`Attempt ${4 - retries} failed:`, error);
      retries--;

      if (retries === 0) {
        throw new Error(`All attempts failed: ${error.message}`);
      }

      // Clean up failed PDF
      if (pdfPath) {
        try {
          await fs.unlink(pdfPath).catch(console.error);
        } catch (cleanupError) {
          console.error("Failed to clean up PDF:", cleanupError);
        }
      }

      // Wait before retrying
      const delay = (4 - retries) * 3000;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  // Final cleanup
  if (pdfPath) {
    try {
      await fs.unlink(pdfPath);
      console.log("Temporary PDF file cleaned up:", pdfPath);
    } catch (cleanupError) {
      console.error("Warning: Failed to clean up PDF file:", cleanupError);
    }
  }
};

module.exports = { sendEmail, generateCertificateHTML };
