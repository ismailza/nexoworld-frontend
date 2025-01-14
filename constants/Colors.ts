// Primary colors and variations
const bronze = {
  50: "#FFF8E5",
  100: "#FFEDB8",
  200: "#FFD87A",
  300: "#E5A52D",
  400: "#B27409", // Main bronze
  500: "#935E00",
  600: "#744A00",
  700: "#593900",
};

const teal = {
  50: "#E6F3F6",
  100: "#B8E1E9",
  200: "#85CCD9",
  300: "#3DA6BC",
  400: "#0c6980", // Main teal
  500: "#0A5A70",
  600: "#084B60",
  700: "#063A4B",
};

export const Colors = {
  light: {
    // Primary Colors
    primary: bronze[400],
    secondary: teal[400],

    // Text Colors
    text: "#11181C",
    secondaryText: "#4A5561",
    tertiaryText: "#6B7280",

    // Background Colors
    background: "#FFFFFF",
    surfaceDefault: "#F8FAFC",
    surfaceHighlighted: "#F1F5F9",
    surfacePressed: "#E2E8F0",

    // Input & Interactive Elements
    inputBackground: "#F9FAFB",
    inputBorder: "#E5E7EB",
    inputFocused: teal[100],

    // Status Colors
    success: "#10B981",
    warning: bronze[300],
    error: "#EF4444",
    info: teal[300],

    // Accent Colors
    tint: bronze[400],
    accent: teal[400],

    // Icon Colors
    icon: "#64748B",
    tabIconDefault: teal[400],
    tabIconSelected: bronze[400],

    // UI Element Colors
    placeholder: "#94A3B8",
    border: "#E2E8F0",
    divider: "#F1F5F9",
    shadow: "rgba(0, 0, 0, 0.1)",

    // Interactive States
    buttonPrimary: bronze[400],
    buttonPrimaryPressed: bronze[500],
    buttonSecondary: teal[400],
    buttonSecondaryPressed: teal[500],

    // Link Colors
    link: teal[400],
    linkVisited: teal[500],
  },

  dark: {
    // Primary Colors
    primary: bronze[300],
    secondary: teal[300],

    // Text Colors
    text: "#F8FAFC",
    secondaryText: "#E2E8F0",
    tertiaryText: "#CBD5E1",

    // Background Colors
    background: "#0F172A",
    surfaceDefault: "#1E293B",
    surfaceHighlighted: "#334155",
    surfacePressed: "#475569",

    // Input & Interactive Elements
    inputBackground: "#1E293B",
    inputBorder: "#334155",
    inputFocused: teal[700],

    // Status Colors
    success: "#34D399",
    warning: bronze[200],
    error: "#F87171",
    info: teal[200],

    // Accent Colors
    tint: bronze[300],
    accent: teal[300],

    // Icon Colors
    icon: "#94A3B8",
    tabIconDefault: teal[300],
    tabIconSelected: bronze[300],

    // UI Element Colors
    placeholder: "#64748B",
    border: "#334155",
    divider: "#1E293B",
    shadow: "rgba(0, 0, 0, 0.25)",

    // Interactive States
    buttonPrimary: bronze[300],
    buttonPrimaryPressed: bronze[400],
    buttonSecondary: teal[300],
    buttonSecondaryPressed: teal[400],

    // Link Colors
    link: teal[300],
    linkVisited: teal[400],
  },
} as const;
