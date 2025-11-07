// /Users/rohit/Desktop/devx-pre/Node-Server/src/emails/successTemplate.js
function capitalize(s) {
    return String(s).charAt(0).toUpperCase() + String(s).slice(1);
}

/**
 * Returns an object { subject, html } for a successful-completion email.
 * Usage:
 *   const { buildSuccessEmail } = require('./successTemplate');
 *   const email = buildSuccessEmail({ recipientName: 'Rohit', action: 'backup', appName: 'DevX' });
 */
export function buildSuccessEmail({
    recipientName = 'Jhon Doe',
    action = 'operation',
    appName = 'DevX',
    details = 'Test',
    supportEmail = 'devx.hello@gmail.com'
} = {}) {
    const subject = `${appName}: ${capitalize(action)} completed successfully`;

    const html = `<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <title>${subject}</title>
    <style>
        body{font-family: Arial, Helvetica, sans-serif;color:#333;background:#f7f7f7;padding:20px}
        .card{max-width:600px;margin:0 auto;background:#fff;border-radius:8px;padding:24px;border:1px solid #e6e6e6}
        .title{color:#155bd8;font-size:18px;font-weight:600;margin-bottom:8px}
        .text{font-size:14px;line-height:1.6}
        .footer{margin-top:20px;font-size:13px;color:#666}
        .btn{display:inline-block;margin-top:12px;padding:10px 14px;background:#155bd8;color:#fff;border-radius:6px;text-decoration:none}
    </style>
</head>
<body>
    <div class="card">
        <div class="title">${appName} — Success</div>
        <div class="text">
            <p>Hi ${recipientName || 'there'},</p>
            <p>Your ${action} has completed successfully.${details ? ` ${details}` : ''}</p>
            <p>If you need further assistance, reply to this email or contact <a href="mailto:${supportEmail}">${supportEmail}</a>.</p>
            <p class="footer">Thanks,<br>${appName} Team</p>
        </div>
    </div>
</body>
</html>`;

    return { subject, html };
}
