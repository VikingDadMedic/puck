import type { ComponentConfig } from "@/core";
import { imagePickerField } from "../../fields/image-picker";

export type TripHeaderProps = {
  destination: string;
  dateRange: string;
  heroImage: string;
  travelerCount: number;
};

export const TripHeader: ComponentConfig<TripHeaderProps> = {
  fields: {
    destination: { type: "text" },
    dateRange: { type: "text", label: "Date Range" },
    heroImage: imagePickerField,
    travelerCount: { type: "number", min: 1, max: 50 },
  },
  defaultProps: {
    destination: "Mediterranean Cruise",
    dateRange: "Jun 15 - Jun 29, 2026",
    heroImage: "",
    travelerCount: 2,
  },
  render: ({ destination, dateRange, heroImage, travelerCount, puck }) => {
    const isProposal = puck.metadata?.target === "proposal";
    const hasImage = heroImage.trim().length > 0;

    return (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: isProposal ? 340 : 280,
          borderRadius: 12,
          overflow: "hidden",
          background: hasImage
            ? `url(${heroImage}) center/cover no-repeat`
            : "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
        }}
      >
        {hasImage && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.15) 100%)",
            }}
          />
        )}

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: isProposal ? "40px 36px" : "32px 28px",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: isProposal ? 44 : 36,
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
          >
            {destination}
          </h1>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontSize: 16,
                color: "rgba(255,255,255,0.9)",
                fontWeight: 500,
              }}
            >
              {dateRange}
            </span>

            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#ffffff",
                background: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(4px)",
                padding: "4px 12px",
                borderRadius: 20,
              }}
            >
              {travelerCount} {travelerCount === 1 ? "traveler" : "travelers"}
            </span>
          </div>
        </div>
      </div>
    );
  },
};

export default TripHeader;
