"use client";

import Link from "next/link";
import { useSelfClient } from "@/components/self-client/SelfClientProvider";
import StatusBadge from "@/components/self-client/StatusBadge";
import type { SelfClientPayment } from "@/data/selfClientMock";

function downloadMockInvoice(payment: SelfClientPayment, caseId: string) {
  const content = [
    "Amit Bansal & Associates — Payment Receipt",
    `Invoice: ${payment.id}`,
    `Case: ${caseId}`,
    `Description: ${payment.description}`,
    `Amount: $${payment.amount}`,
    `Date: ${payment.date}`,
    `Status: ${payment.status}`,
  ].join("\n");
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${payment.id}-invoice.txt`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function PaymentsPage() {
  const { payments, cases, payInvoice } = useSelfClient();

  const caseNameFor = (caseId: string) => cases.find((c) => c.id === caseId)?.serviceName || caseId;

  return (
    <div>
      <div className="portal-page-header">
        <div>
          <h1>Payments &amp; Invoices</h1>
          <p>Your payment history, pending dues, and downloadable invoices.</p>
        </div>
      </div>

      <div className="portal-panel">
        <table className="portal-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Case</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td>{payment.description}</td>
                <td>
                  <Link href={`/self-client/cases/${payment.caseId}`}>{caseNameFor(payment.caseId)}</Link>
                </td>
                <td>${payment.amount}</td>
                <td><StatusBadge status={payment.status} /></td>
                <td>{payment.date}</td>
                <td>
                  {payment.status === "Pending" && (
                    <button
                      type="button"
                      className="btn btn-primary payment-pay-btn"
                      onClick={() => payInvoice(payment.id)}
                    >
                      Pay Now
                    </button>
                  )}
                  {payment.status === "Success" && payment.invoiceAvailable && (
                    <button
                      type="button"
                      className="btn-link"
                      onClick={() => downloadMockInvoice(payment, payment.caseId)}
                    >
                      Download Invoice
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
