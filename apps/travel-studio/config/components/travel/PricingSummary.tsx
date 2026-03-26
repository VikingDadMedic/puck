import type { ComponentConfig } from "@/core";

export type PricingSummaryProps = {
  currency: string;
  lineItems: { description: string; amount: string }[];
  total: string;
  notes: string;
};

export const PricingSummary: ComponentConfig<PricingSummaryProps> = {
  fields: {
    currency: { type: "text" },
    lineItems: {
      type: "array",
      arrayFields: {
        description: { type: "text" },
        amount: { type: "text" },
      },
      getItemSummary: (item: { description: string; amount: string }) =>
        item.description ? `${item.description} — ${item.amount}` : "Item",
      defaultItemProps: { description: "", amount: "" },
    },
    total: { type: "text", label: "Total" },
    notes: { type: "textarea" },
  },
  defaultProps: {
    currency: "USD",
    lineItems: [],
    total: "",
    notes: "",
  },
  render: ({ currency, lineItems, total, notes, puck }) => {
    const isProposal = puck.metadata?.target === "proposal";

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
                {lineItems.map((item) => (
                  <tr
                    key={`${item.description}-${item.amount}`}
                    style={{
                      borderBottom: "1px solid #f3f4f6",
                    }}
                  >
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
                      {currency} {item.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {total && (
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
                {currency} {total}
              </span>
            </div>
          )}

          {notes && (
            <p
              style={{
                margin: "12px 0 0",
                fontSize: 13,
                lineHeight: 1.5,
                color: "#6b7280",
                fontStyle: "italic",
              }}
            >
              {notes}
            </p>
          )}
        </div>
      </div>
    );
  },
};

export default PricingSummary;
