import User from "../../models/User.model.js";

// Helper to escape HTML values
const escapeHtml = (unsafe) =>
  String(unsafe || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

export const handleVerifyVaccination = async (req, res) => {
  try {
    // Expecting route params: type (nid|bid), nid (the identifier value), optional vaccName
    const { type, nid: identifier, vaccName } = req.params;

    if (!type || !identifier) {
      return res.status(400).send("<h2>Missing search type or identifier</h2>");
    }

    // determine query field
    const queryField = type === "bid" ? "b_id" : "nid";

    // Build query object dynamically
    const query = { [queryField]: identifier };

    // Find user by chosen identifier
    const user = await User.findOne(query).lean();
    if (!user) {
      return res
        .status(404)
        .send("<h2 style='color:red;'>User not found</h2>");
    }

    // Determine what to show:
    // - if vaccName provided: show doses for that vaccine only (match by id or name)
    // - otherwise: show all doses across all vaccines
    let rows = [];
    if (vaccName) {
      const vaccine =
        user.vaccines && user.vaccines.find((v) => v.id === vaccName || v.name === vaccName);
      if (!vaccine) {
        return res
          .status(404)
          .send("<h2 style='color:red;'>Vaccine record not found</h2>");
      }
      const doses = vaccine.doses || [];
      rows = doses.map((dose, i) => ({
        idx: i + 1,
        vaccineName: vaccine.name || vaccine.id || "Unknown",
        doseName: dose.name || `Dose ${i + 1}`,
        date: dose.date || "N/A",
        status: dose.status || "Unknown",
        center: vaccine.center?.name || "N/A",
      }));
    } else {
      // aggregate all doses from all vaccines
      const vaccines = user.vaccines || [];
      vaccines.forEach((vaccine) => {
        (vaccine.doses || []).forEach((dose, i) => {
          rows.push({
            idx: rows.length + 1,
            vaccineName: vaccine.name || vaccine.id || "Unknown",
            doseName: dose.name || `Dose ${i + 1}`,
            date: dose.date || "N/A",
            status: dose.status || "Unknown",
            center: vaccine.center?.name || "N/A",
          });
        });
      });
    }

    // Build rows HTML with status badges
    const statusBadge = (status) => {
      const s = String(status || "").toLowerCase();
      let bg = "#bdbdbd";
      let color = "#fff";
      if (s.includes("complete") || s.includes("done") || s.includes("completed") || s.includes("applied")) {
        bg = "#3cb371"; // same green
      } else if (s.includes("pending") || s.includes("scheduled")) {
        bg = "#FFA726"; // orange
      } else if (s.includes("missed") || s.includes("cancel")) {
        bg = "#e53935"; // red
      }
      return `<span style="display:inline-block;padding:6px 10px;border-radius:12px;background:${bg};color:${color};font-weight:600;font-size:13px;">${escapeHtml(status)}</span>`;
    };

    const rowsHtml =
      rows.length > 0
        ? rows
            .map(
              (r) => `
        <tr>
          <td>${r.idx}</td>
          <td>${escapeHtml(r.vaccineName)}</td>
          <td>${escapeHtml(r.doseName)}</td>
          <td>${escapeHtml(r.date)}</td>
          <td>${statusBadge(r.status)}</td>
          <td>${escapeHtml(r.center)}</td>
        </tr>
      `
            )
            .join("")
        : `<tr><td colspan="6" style="text-align:center;padding:18px;color:#666;">No dose records found</td></tr>`;

    const html = `
      <!DOCTYPE html>
      <html lang="bn">
      <head>
        <meta charset="UTF-8" />
        <title>Vaccination Verification</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <style>
          :root{ --accent: #3cb371; --muted:#6b6b6b; --card-bg:#ffffff; --bg:#f6fff8; --shadow:0 6px 22px rgba(60,179,113,0.08);}
          *{box-sizing:border-box}
          body{
            margin:0;
            font-family:Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
            background: linear-gradient(180deg, #f6fff8 0%, #ffffff 100%);
            color:#222;
            padding:28px;
            -webkit-font-smoothing:antialiased;
          }
          .container{max-width:900px;margin:32px auto}
          .card{
            background:var(--card-bg);
            border-radius:14px;
            box-shadow:var(--shadow);
            padding:28px;
            border-top:6px solid var(--accent);
          }
          .header{
            display:flex;
            align-items:center;
            gap:16px;
            margin-bottom:12px;
          }
          .avatar{
            width:68px;height:68px;border-radius:12px;background:linear-gradient(135deg, rgba(60,179,113,0.12), rgba(60,179,113,0.04));
            display:flex;align-items:center;justify-content:center;font-weight:700;color:var(--accent);font-size:20px;
          }
          .meta h1{margin:0;font-size:20px;color:#1b5e20;}
          .meta p{margin:2px 0;color:var(--muted);font-size:13px;}
          .info{
            display:flex;
            gap:12px;
            flex-wrap:wrap;
            margin-top:10px;
          }
          .pill{
            background:#f1fef4;
            color:var(--accent);
            padding:8px 12px;
            border-radius:10px;
            font-weight:600;
            font-size:13px;
            border:1px solid rgba(60,179,113,0.06);
          }
          table{
            width:100%;
            border-collapse:collapse;
            margin-top:18px;
            font-size:14px;
          }
          thead th{
            text-align:left;
            padding:12px 10px;
            background:#f0faf2;
            color:var(--accent);
            font-weight:700;
            border-bottom:1px solid #e9f6ee;
          }
          tbody td{
            padding:12px 10px;
            border-bottom:1px solid #f3f6f3;
            vertical-align:middle;
          }
          tbody tr:hover{background:#fbfffb}
          .footer{
            margin-top:16px;
            display:flex;
            justify-content:space-between;
            align-items:center;
            color:#7a7a7a;
            font-size:13px;
          }
          @media (max-width:720px){
            .header{flex-direction:row;gap:12px}
            .avatar{width:56px;height:56px}
            thead th, tbody td{padding:10px 8px;font-size:13px}
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="card">
            <div class="header">
              <div class="avatar">${escapeHtml((user.name || "U").slice(0,2)).toUpperCase()}</div>
              <div class="meta">
                <h1>✅ ${escapeHtml(user.name || "Unknown")}</h1>
                <p>NID: <strong>${escapeHtml(user.nid || user.b_id || "")}</strong> &nbsp;•&nbsp; Identifier type: <strong>${escapeHtml(type)}</strong></p>
                <div class="info">
                  <div class="pill">Records: ${rows.length}</div>
                  <div class="pill">Verified: ${new Date().toLocaleDateString()}</div>
                </div>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Vaccine</th>
                  <th>Dose</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Center</th>
                </tr>
              </thead>
              <tbody>
                ${rowsHtml}
              </tbody>
            </table>

            <div class="footer">
              <div>প্রতিরোধ (Protirodh)</div>
              <div style="color:#9e9e9e;font-size:12px;">Vaccination Verified</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    return res.status(200).send(html);
  } catch (error) {
    console.error("Verify Vaccination Error:", error);
    return res
      .status(500)
      .send("<h2 style='color:red;'>Server Error: " + escapeHtml(error.message) + "</h2>");
  }
};
