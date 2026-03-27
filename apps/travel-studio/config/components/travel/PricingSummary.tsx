import type { ComponentConfig } from "@/core";
import { richTextToSafeHtml } from "../../../lib/render/richtext";

export type PricingSummaryProps = {
  currency: string;
  basis: "perPerson" | "total";
  lineItems: { description: string; amount: number }[];
  total: number;
  notes: string;
};

export const PricingSummary: ComponentConfig<PricingSummaryProps> = {
  fields: {
    currency: { type: "text", label: "Currency" },
    basis: {
      type: "select",
      label: "Price Basis",
      options: [
        { value: "perPerson", label: "Per Person" },
        { value: "total", label: "Total" },
      ],
    },
    lineItems: {
      type: "array",
      label: "Line Items",
      arrayFields: {
        description: { type: "text", label: "Description" },
        amount: { type: "number", label: "Amount" },
      },
      getItemSummary: (item: { description: string; amount: number }) =>
        item.description ? `${item.description} — ${item.amount}` : "Item",
      defaultItemProps: { description: "", amount: 0 },
    },
    total: { type: "number", label: "Total" },
    notes: { type: "richtext", label: "Notes" },
  },
  defaultProps: {
    currency: "USD",
    basis: "perPerson",
    lineItems: [],
    total: 0,
    notes: "",
  },
  render: ({ currency, basis, lineItems, total, notes, puck }) => {
    const isProposal = puck.metadata?.target === "proposal";
    const basisLabel = basis === "perPerson" ? "per person" : "total";

    const formatAmount = (amount: number) => {
      if (!amount) return `${currency} 0`;
      return `${currency} ${amount.toLocaleString("en-US", {
        minimumFractionDigits: 0,
      })}`;
    };

    return (
      <div
        style={{
          background: "#ffffff",
          borderRadius: 12,
          overflow: "hidden",
          border: "1px solid #e5e7eb",
          boxShadow: isProposal
            ? "0 4px 12px rgba(0,0,0,0.08)"
            : "0 1px 3px rgba(0,0,0,0.06)",
        }}
      >
        <div
          style={{
            background: "#1e40af",
            padding: isProposal ? "16px 24px" : "10px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: isProposal ? 18 : 15,
              fontWeight: 700,
              color: "#ffffff",
            }}
          >
            Pricing Summary
          </h3>
          <span
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.7)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {basisLabel}
          </span>
        </div>

        <div style={{ padding: isProposal ? "20px 24px" : "12px 20px" }}>
          {lineItems.length > 0 && (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: isProposal ? 15 : 14,
              }}
            >
              <tbody>
                {lineItems.map((item, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <td
                      style={{
                        padding: isProposal ? "10px 0" : "8px 0",
                        color: "#374151",
                      }}
                    >
                      {item.description}
                    </td>
                    <td
                      style={{
                        padding: isProposal ? "10px 0" : "8px 0",
                        textAlign: "right",
                        fontWeight: 500,
                        color: "#111827",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {formatAmount(item.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {total > 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderTop: "2px solid #1e40af",
                marginTop: lineItems.length > 0 ? 4 : 0,
                paddingTop: isProposal ? 14 : 10,
              }}
            >
              <span
                style={{
                  fontSize: isProposal ? 17 : 15,
                  fontWeight: 700,
                  color: "#111827",
                }}
              >
                Total
              </span>
              <span
                style={{
                  fontSize: isProposal ? 22 : 17,
                  fontWeight: 800,
                  color: "#1e40af",
                }}
              >
                {formatAmount(total)}
              </span>
            </div>
          )}

          {notes && (
            <div
              style={{
                margin: "12px 0 0",
                fontSize: 13,
                lineHeight: 1.5,
                color: "#6b7280",
                fontStyle: "italic",
              }}
              dangerouslySetInnerHTML={{ __html: richTextToSafeHtml(notes) }}
            />
          )}
        </div>
      </div>
    );
  },
};

export default PricingSummary;
