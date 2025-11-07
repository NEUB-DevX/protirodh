import { sendMail } from "@/lib/mail";
import { connectDB } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";


// User interface for database operations
interface User {
  nid?: string;
  b_id?: string;
  email: string;
  name: string;
}

export async function POST(request: NextRequest) {
  try {
    const { type, id } = await request.json();
    console.log('Request body:', { type, id });

    if (!type || !id) {
      return NextResponse.json({
        success: false,
        message: 'Invalid Request: NID/BID is required',
      }, { status: 400 });
    }

    // Connect to database
    const db = await connectDB();
    
    // Check if user exists
    let user: User | null = null;
    
    if (type === "nid") {
      const foundUser = await db.collection('users').findOne({ nid: id });
      user = foundUser as User | null;
    }
    if (type === "bid") {
      const foundUser = await db.collection('users').findOne({ b_id: id });
      user = foundUser as User | null;
    }

    if (!user) {
      return NextResponse.json({
        success: false,
        data: { message: 'User is not in DB' },
      }, { status: 404 });
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set expiration time (10 minutes from now)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Save to verification model
    await db.collection('verification_codes').insertOne({
      nid: user.nid || user.b_id,
      code,
      createdAt: new Date(),
      expiresAt,
    });

    // Send verification email
    const currentYear = new Date().getFullYear();
    const mailOptions = {
      receiver: user.email,
      subject: "Your Verification Code | Protirodh",
      text: `Your verification code is ${code}. This code will expire in 10 minutes.`,
      html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #F8FAFC; color: #1F2937; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="width: 48px; height: 48px; background-color: #10B981; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 10px;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h1 style="color: #10B981; margin-top: 10px; font-weight: 600; font-size: 28px;">Protirodh</h1>
          <p style="color: #6B7280; margin: 5px 0 0 0;">Vaccination Management System</p>
        </div>
        
        <div style="background-color: #FFFFFF; padding: 30px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #10B981; margin-top: 0; font-size: 24px;">Verification Code</h2>
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 25px; color: #374151;">
            Hello ${user.name || 'User'},<br><br>
            We received a request to verify your identity. Please use the verification code below to proceed:
          </p>
          
          <div style="background-color: #F3F4F6; padding: 20px; border-left: 4px solid #10B981; margin-bottom: 25px; border-radius: 4px; text-align: center;">
            <p style="margin: 0; font-size: 14px; color: #6B7280; font-weight: 500;">VERIFICATION CODE</p>
            <p style="margin: 10px 0 0; font-size: 32px; font-weight: bold; color: #10B981; font-family: monospace; letter-spacing: 4px;">${code}</p>
          </div>
          
          <div style="background-color: #FEF3C7; padding: 15px; border-radius: 6px; margin-bottom: 20px; border-left: 4px solid #F59E0B;">
            <p style="margin: 0; font-weight: 600; color: #92400E; font-size: 14px;">
              ⚠️ This code will expire in 10 minutes for your security.
            </p>
          </div>
        </div>
        
        <div style="background-color: #FFFFFF; padding: 25px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
          <h3 style="color: #10B981; margin-top: 0; font-size: 18px;">Security Information</h3>
          <ul style="margin-left: 20px; line-height: 1.6; color: #374151;">
            <li>This verification code is valid for 10 minutes only</li>
            <li>Do not share this code with anyone</li>
            <li>If you didn't request this code, please ignore this email</li>
            <li>For security, we recommend completing verification soon</li>
          </ul>
        </div>
        
        <div style="background-color: #EF4444; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
          <p style="margin: 0; font-weight: 600; color: #FFFFFF; font-size: 14px;">
            🔒 SECURITY: Never share your verification code with anyone. Protirodh staff will never ask for your code.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB; color: #6B7280; font-size: 14px;">
          <p style="margin: 0 0 10px 0;">© ${currentYear} Protirodh Vaccination Management System. All rights reserved.</p>
          <p style="margin: 0;">
            Need help? Contact us at 
            <a href="mailto:support@protirodh.gov.bd" style="color: #10B981; text-decoration: none; font-weight: 500;">support@protirodh.gov.bd</a>
          </p>
        </div>
      </div>
      `,
    };

    const mailResult = await sendMail(mailOptions);
    if (!mailResult.success) {
      return NextResponse.json({
        success: false,
        data: { message: 'Failed to send verification email' },
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: { 
        message: 'Verification email sent successfully',
        email: user.email.replace(/(.{2}).*(@.*)/, '$1***$2') // Mask email for privacy
      },
    });
      
  } catch (error) {
    console.error('Email Sending Error:', error);
    return NextResponse.json({
      success: false,
      data: { message: 'Error Sending Email', error: (error as Error).message },
    }, { status: 500 });
  }
}