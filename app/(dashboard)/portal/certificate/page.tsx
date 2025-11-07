"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaSyringe,
  FaArrowLeft,
  FaDownload,
  FaPrint,
  FaCheckCircle,
  FaQrcode,
  FaIdCard,
  FaCalendarAlt,
  FaShieldAlt,
} from "react-icons/fa";
import { useGlobal } from "../../../context/GlobalContext";

export default function VaccinationCertificate() {
  const { user } = useGlobal();
  const [showQR, setShowQR] = useState(false);

  // Mock certificate data
  const certificateData = {
    certificateId: "CERT-BD-2024-001234",
    qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=CERT-BD-2024-001234",
    issueDate: "2024-10-16",
    validUntil: "2025-10-16",
    vaccinations: [
      {
        vaccine: "Pfizer-BioNTech COVID-19 Vaccine",
        manufacturer: "Pfizer Inc.",
        dose: 1,
        date: "2024-09-15",
        batchNumber: "EK9234",
        center: "Dhaka Medical College Vaccination Center",
      },
      {
        vaccine: "Pfizer-BioNTech COVID-19 Vaccine",
        manufacturer: "Pfizer Inc.",
        dose: 2,
        date: "2024-10-15",
        batchNumber: "EK9788",
        center: "Dhaka Medical College Vaccination Center",
      },
    ],
  };

  const handleDownload = () => {
    alert("Certificate download initiated (demo)");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white shadow-sm print:hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/portal"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <FaArrowLeft />
                <span className="font-medium">Back to Portal</span>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 rounded-lg border-2 border-gray-300 bg-white px-4 py-2 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                <FaPrint />
                Print
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-green-700"
              >
                <FaDownload />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Certificate Card */}
        <div className="rounded-2xl border-2 border-green-600 bg-white shadow-2xl print:border print:shadow-none">
          {/* Certificate Header */}
          <div className="border-b-2 border-green-600 bg-linear-to-r from-green-600 to-green-700 p-8 text-white">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white">
                  <FaSyringe className="text-3xl text-green-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Protirodh</h1>
                  <p className="text-sm text-green-100">
                    Ministry of Health & Family Welfare
                  </p>
                  <p className="text-xs text-green-200">Government of Bangladesh</p>
                </div>
              </div>
              <div className="text-right">
                <div className="mb-1 inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5">
                  <FaShieldAlt className="text-green-600" />
                  <span className="text-sm font-semibold text-green-600">Verified</span>
                </div>
              </div>
            </div>
            <div className="border-t border-green-500 pt-4">
              <h2 className="text-3xl font-bold">COVID-19 Vaccination Certificate</h2>
            </div>
          </div>

          {/* Certificate Body */}
          <div className="p-8">
            {/* Personal Information */}
            <div className="mb-8">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
                <FaIdCard className="text-green-600" />
                Personal Information
              </h3>
              <div className="grid gap-4 rounded-xl border border-gray-200 bg-gray-50 p-6 md:grid-cols-2">
                <div>
                  <p className="text-xs font-medium text-gray-500">Full Name</p>
                  <p className="text-lg font-semibold text-gray-900">{user?.name}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Date of Birth</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {user?.dob || "January 15, 1990"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">National ID / Birth Certificate</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {user?.nid || "1234567890"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Certificate ID</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {certificateData.certificateId}
                  </p>
                </div>
              </div>
            </div>

            {/* Vaccination Details */}
            <div className="mb-8">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
                <FaSyringe className="text-green-600" />
                Vaccination Details
              </h3>
              <div className="space-y-4">
                {certificateData.vaccinations.map((vaccination, index) => (
                  <div
                    key={index}
                    className="rounded-xl border-2 border-green-200 bg-green-50 p-6"
                  >
                    <div className="mb-4 flex items-start justify-between">
                      <div>
                        <h4 className="mb-1 text-lg font-bold text-gray-900">
                          Dose {vaccination.dose}
                        </h4>
                        <p className="font-semibold text-green-700">
                          {vaccination.vaccine}
                        </p>
                        <p className="text-sm text-gray-600">{vaccination.manufacturer}</p>
                      </div>
                      <FaCheckCircle className="text-3xl text-green-600" />
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <p className="text-xs font-medium text-gray-600">Date Administered</p>
                        <p className="font-semibold text-gray-900">
                          {new Date(vaccination.date).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-600">Batch Number</p>
                        <p className="font-semibold text-gray-900">{vaccination.batchNumber}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-600">Vaccination Center</p>
                        <p className="font-semibold text-gray-900">{vaccination.center}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* QR Code and Validity */}
            <div className="mb-8 grid gap-6 md:grid-cols-2">
              {/* QR Code */}
              <div className="rounded-xl border-2 border-gray-300 bg-white p-6 text-center">
                <h4 className="mb-4 flex items-center justify-center gap-2 font-bold text-gray-900">
                  <FaQrcode className="text-green-600" />
                  Verification QR Code
                </h4>
                <div className="mb-4 flex justify-center">
                  {showQR ? (
                    <Image
                      src={certificateData.qrCode}
                      alt="Certificate QR Code"
                      width={192}
                      height={192}
                      className="h-48 w-48 rounded-lg border-2 border-gray-200"
                    />
                  ) : (
                    <div className="flex h-48 w-48 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                      <button
                        onClick={() => setShowQR(true)}
                        className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-700"
                      >
                        Show QR Code
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  Scan to verify certificate authenticity
                </p>
              </div>

              {/* Validity Information */}
              <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-6">
                <h4 className="mb-4 flex items-center gap-2 font-bold text-gray-900">
                  <FaCalendarAlt className="text-blue-600" />
                  Certificate Validity
                </h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-medium text-gray-600">Issue Date</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {new Date(certificateData.issueDate).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600">Valid Until</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {new Date(certificateData.validUntil).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="rounded-lg bg-white p-3">
                    <div className="flex items-center gap-2 text-green-700">
                      <FaCheckCircle className="text-xl" />
                      <span className="font-semibold">Certificate is Valid</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t-2 border-gray-200 pt-6">
              <div className="mb-4 rounded-lg bg-yellow-50 p-4">
                <p className="text-xs font-medium text-yellow-800">
                  <strong>Important:</strong> This certificate is issued by the Ministry of
                  Health & Family Welfare, Government of Bangladesh. Any forgery or
                  unauthorized modification is punishable under the law.
                </p>
              </div>
              <div className="grid gap-4 text-center text-xs text-gray-500 md:grid-cols-3">
                <div>
                  <p className="font-semibold text-gray-700">Issued By</p>
                  <p>Ministry of Health & Family Welfare</p>
                  <p>Government of Bangladesh</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700">Verify Online</p>
                  <p>www.protirodh.gov.bd/verify</p>
                  <p>Certificate ID: {certificateData.certificateId}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700">Help & Support</p>
                  <p>Email: support@protirodh.gov.bd</p>
                  <p>Hotline: 333</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Box - Print Hidden */}
        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 print:hidden">
          <h3 className="mb-3 font-semibold text-gray-900">About This Certificate</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <FaCheckCircle className="mt-0.5 text-green-600" />
              <span>
                This is an official digital vaccination certificate issued by the Government
                of Bangladesh.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <FaCheckCircle className="mt-0.5 text-green-600" />
              <span>
                The QR code can be scanned to verify the authenticity of this certificate.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <FaCheckCircle className="mt-0.5 text-green-600" />
              <span>
                You can download or print this certificate for travel and official purposes.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <FaCheckCircle className="mt-0.5 text-green-600" />
              <span>
                Keep this certificate safe and present it when required by authorities.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
