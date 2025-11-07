import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import jwt from "jsonwebtoken";

// Interfaces for type safety
interface NIDUser {
  nid?: string;
  b_id?: string;
  email: string;
  name: string;
  blood_group?: string;
  gender?: string;
  dob?: string;
  father_name?: string;
  mother_name?: string;
  phone_number?: string;
  address?: {
    division?: string;
    zila?: string;
    upazila?: string;
    village?: string;
    birth_place?: string;
    holding_number?: string;
  };
}

interface User {
  uid: string;
  nid?: string;
  b_id?: string;
  email: string;
  name: string;
  b_group?: string;
  gender?: string;
  dob?: string;
  f_name?: string;
  m_name?: string;
  phone_number?: string;
  contact?: {
    division?: string;
    zila?: string;
    upzila?: string;
    village?: string;
    house?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

interface VerificationEntry {
  _id: string;
  nid?: string;
  b_id?: string;
  code: string;
  createdAt: Date;
  expiresAt: Date;
}

export async function POST(request: NextRequest) {
  try {
    const { type, id, code } = await request.json();

    if (!type || !id || !code) {
      return NextResponse.json({
        success: false,
        message: "Invalid Request: NID/BID and code are required",
      }, { status: 400 });
    }

    // Connect to database
    const db = await connectDB();

    // Check if user exists in NID DB
    let user: NIDUser | null = null;

    if (type === "nid") {
      user = await db.collection('nid_users').findOne({ nid: id }) as NIDUser | null;
    }
    if (type === "bid") {
      user = await db.collection('nid_users').findOne({ b_id: id }) as NIDUser | null;
    }

    if (!user) {
      return NextResponse.json({
        success: false,
        data: { message: "User not found" },
      }, { status: 404 });
    }

    // Get the latest verification entry
    const verificationEntry = await db.collection('verification_codes')
      .findOne(
        {
          $or: [{ nid: user.nid }, { b_id: user.b_id }]
        },
        {
          sort: { createdAt: -1 }
        }
      ) as VerificationEntry | null;

    if (!verificationEntry || verificationEntry.code !== code) {
      return NextResponse.json({
        success: false,
        data: { message: "Invalid or expired verification code" },
      }, { status: 400 });
    }

    // Check if code has expired
    if (new Date() > verificationEntry.expiresAt) {
      return NextResponse.json({
        success: false,
        data: { message: "Verification code has expired" },
      }, { status: 400 });
    }

    // Delete verification code after successful verification
    await db.collection('verification_codes').deleteOne({ 
      nid: user.nid || user.b_id,
      code: code 
    });

    // Check if user already exists in main User DB
    const userExists = await db.collection('users').findOne({
      $or: [{ nid: user.nid }, { b_id: user.b_id }]
    }) as User | null;

    let newUser: User | null = null;

    if (!userExists) {
      // Generate unique user ID
      const uid = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const userData = {
        uid,
        nid: user.nid,
        email: user.email,
        b_group: user.blood_group,
        b_id: user.b_id,
        gender: user.gender,
        name: user.name,
        dob: user.dob,
        f_name: user.father_name,
        m_name: user.mother_name,
        phone_number: user.phone_number,
        contact: {
          division: user.address?.division,
          zila: user.address?.zila,
          upzila: user.address?.upazila,
          village: user.address?.village,
          house: (user.address?.birth_place || '') + (user.address?.holding_number || ''),
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await db.collection('users').insertOne(userData);
      newUser = { ...userData, _id: result.insertedId } as User;
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        uid: userExists ? userExists.uid : newUser!.uid,
        nid: user.nid,
        b_id: user.b_id,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "30d" }
    );

    // Create response
    const response = NextResponse.json({
      success: true,
      data: {
        message: "Token generated successfully",
        token,
        user: userExists ? userExists : newUser,
      },
    });

    // Set HTTP-only cookie
    response.cookies.set({
      name: 'jwt_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
      sameSite: 'lax',
      path: '/',
    });

    // Also set a regular cookie for client-side access if needed
    response.cookies.set({
      name: 'token',
      value: token,
      maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
      sameSite: 'lax',
      path: '/',
    });

    return response;

  } catch (error) {
    console.error("Code Verification Error:", error);
    return NextResponse.json({
      success: false,
      data: { message: "Error verifying code", error: (error as Error).message },
    }, { status: 500 });
  }
}