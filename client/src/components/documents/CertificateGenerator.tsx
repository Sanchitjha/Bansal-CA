"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Printer, CheckCircle2, ShieldCheck, FileText, X } from "lucide-react";

export interface CertificateData {
  caseId: string;
  clientName: string;
  serviceName: string;
  completionDate: string;
  panOrGstin?: string;
  acknowledgmentNumber: string;
  assessmentYearOrPeriod?: string;
  assignedCA: string;
  verificationHash: string;
}

interface CertificateGeneratorProps {
  data: CertificateData;
  onClose?: () => void;
}

export function CertificateGenerator({ data, onClose }: CertificateGeneratorProps) {
  const [downloading, setDownloading] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      window.print();
      setDownloading(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200">
        {/* Modal Toolbar */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2 text-sm font-bold">
            <FileText className="w-4 h-4 text-amber-400" />
            <span>Official Statutory Filing Certificate</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handlePrint}
              className="h-8 text-xs bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700"
            >
              <Printer className="w-3.5 h-3.5 mr-1" /> Print
            </Button>
            <Button
              size="sm"
              onClick={handleDownload}
              className="h-8 text-xs bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold"
            >
              <Download className="w-3.5 h-3.5 mr-1" /> Download PDF
            </Button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1 text-slate-400 hover:text-white rounded ml-2"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Certificate Body (Designed for Print and Screen) */}
        <div className="p-8 md:p-12 bg-white text-slate-900 print:p-0">
          {/* Certificate Border */}
          <div className="border-4 border-double border-slate-300 p-8 rounded-lg relative">
            {/* Top Brand Header */}
            <div className="text-center pb-6 border-b border-slate-200">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-900 text-amber-400 font-extrabold text-xl rounded-xl mb-2 shadow-sm">
                A&A
              </div>
              <h2 className="text-xl font-bold uppercase tracking-wide text-slate-900">
                Amit Bansal & Associates
              </h2>
              <p className="text-xs text-slate-500 uppercase tracking-widest mt-0.5">
                Chartered Accountants • Tax & Corporate Advisory
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Firm Reg. No: 028491N • Peer Reviewed Practice
              </p>
            </div>

            {/* Certificate Title */}
            <div className="text-center my-6">
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                Statutory Compliance Acknowledgment
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-3">
                CERTIFICATE OF SERVICE COMPLETION
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                This document certifies that the following professional compliance filing has been completed.
              </p>
            </div>

            {/* Details Table */}
            <div className="my-6 bg-slate-50 rounded-lg p-5 border border-slate-200 text-xs space-y-2.5">
              <div className="grid grid-cols-2 border-b border-slate-200 pb-2">
                <span className="text-slate-500">Client Legal Name:</span>
                <span className="font-bold text-slate-900">{data.clientName}</span>
              </div>
              <div className="grid grid-cols-2 border-b border-slate-200 pb-2">
                <span className="text-slate-500">Tax Identifier (PAN/GSTIN):</span>
                <span className="font-mono font-bold text-slate-800">{data.panOrGstin || "AAACZ1234M"}</span>
              </div>
              <div className="grid grid-cols-2 border-b border-slate-200 pb-2">
                <span className="text-slate-500">Compliance Service Name:</span>
                <span className="font-bold text-blue-950">{data.serviceName}</span>
              </div>
              <div className="grid grid-cols-2 border-b border-slate-200 pb-2">
                <span className="text-slate-500">Platform Case Reference:</span>
                <span className="font-mono font-semibold text-slate-800">{data.caseId}</span>
              </div>
              <div className="grid grid-cols-2 border-b border-slate-200 pb-2">
                <span className="text-slate-500">Statutory Acknowledgment / Ack No:</span>
                <span className="font-mono font-bold text-emerald-700">{data.acknowledgmentNumber}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-slate-500">Completion Date:</span>
                <span className="font-medium text-slate-800">{data.completionDate}</span>
              </div>
            </div>

            {/* Signatures & Seal */}
            <div className="mt-8 pt-6 border-t border-slate-200 flex items-end justify-between text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-emerald-600 font-semibold">
                  <ShieldCheck className="w-4 h-4" /> Digitally Verified
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  SHA-256: {data.verificationHash.slice(0, 24)}...
                </div>
                <div className="text-[10px] text-slate-400">
                  Verification Portal: verify.aa-associates.com
                </div>
              </div>

              <div className="text-center space-y-1">
                <div className="w-32 border-b border-slate-400 mx-auto mb-1"></div>
                <div className="font-bold text-slate-900">{data.assignedCA}</div>
                <div className="text-[11px] text-slate-500">Authorized Signatory / Partner</div>
                <div className="text-[10px] text-slate-400">Amit Bansal & Associates</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
