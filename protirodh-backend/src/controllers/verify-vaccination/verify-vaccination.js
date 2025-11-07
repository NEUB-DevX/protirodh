import User from "../../models/User.model.js";

export const handleVerifyVaccination = async (req, res) => {
  try {
    const { nid, vaccName } = req.params; // ✅ lowercase params

    if (!nid || !vaccName) {
      return res.status(400).send("<h2>Missing NID or Vaccine Name</h2>");
    }

    // Find user by NID
    const user = await User.findOne({ nid });
    if (!user) {
      return res
        .status(404)
        .send("<h2 style='color:red;'>User not found</h2>");
    }

    // Find the vaccine details
    const vaccine = user.vaccines.find((v) => v.id === vaccName);
    if (!vaccine) {
      return res
        .status(404)
        .send("<h2 style='color:red;'>Vaccine record not found</h2>");
    }

    // Generate HTML response
    const dosesHtml = vaccine.doses
      .map(
        (dose, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${dose.name}</td>
            <td>${dose.date || "N/A"}</td>
            <td>${dose.status}</td>
          </tr>
        `
      )
      .join("");

    const html = `
      <!DOCTYPE html>
      <html lang="bn">
      <head>
        <meta charset="UTF-8">
        <title>Vaccination Verification</title>
        <style>
          body {
            font-family: "Poppins", sans-serif;
            background: #f6fff8;
            color: #222;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
          }
          .card {
            background: white;
            border-radius: 16px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            padding: 24px 36px;
            width: 420px;
            border-top: 8px solid #3cb371;
          }
          h1 {
            color: #2e7d32;
            text-align: center;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 16px;
          }
          th, td {
            text-align: left;
            padding: 8px;
            border-bottom: 1px solid #e0e0e0;
          }
          th {
            background-color: #e8f5e9;
            color: #2e7d32;
          }
          .footer {
            text-align: center;
            font-size: 12px;
            color: gray;
            margin-top: 16px;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>✅ ${user.name}</h1>
          <p><strong>NID:</strong> ${user.nid}</p>
          <p><strong>Vaccine:</strong> ${vaccine.center?.name || "N/A"}</p>
          <p><strong>Applied on:</strong> ${vaccine.apply_date || "N/A"}</p>

          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Dose</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>${dosesHtml}</tbody>
          </table>

          <div class="footer">প্রতিরোধ (Protirodh) | Vaccination Verified</div>
        </div>
      </body>
      </html>
    `;

    return res.status(200).send(html);
  } catch (error) {
    console.error("Verify Vaccination Error:", error);
    return res
      .status(500)
      .send("<h2 style='color:red;'>Server Error: " + error.message + "</h2>");
  }
};
