import type { ComponentConfig, Slot } from "@/core";

export type SidebarLayoutProps = {
  main: Slot;
  sidebar: Slot;
};

export const SidebarLayout: ComponentConfig<SidebarLayoutProps> = {
  fields: {
    main: { type: "slot" },
    sidebar: { type: "slot" },
  },
  defaultProps: {
    main: [],
    sidebar: [],
  },
  render: ({ main: Main, sidebar: Sidebar }) => {
    return (
      <div
        style={{
          display: "flex",
          gap: 24,
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: "1 1 0%", minWidth: 0 }}>
          <Main />
        </div>
        <div style={{ flex: "0 0 30%", minWidth: 280 }}>
          <Sidebar />
        </div>
      </div>
    );
  },
};

export default SidebarLayout;
