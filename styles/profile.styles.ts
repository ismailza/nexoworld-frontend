import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { Layout } from "@/constants/Layout";

const CARD_HORIZONTAL_PADDING = 20;

export const profileStyles = (colorScheme: "light" | "dark") => {
  const colors = Colors[colorScheme];

  return StyleSheet.create({
    container: {
      flex: 1,
    },
    gradientContainer: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: Layout.tabBarHeight + 100,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    profileHeader: {
      alignItems: "center",
      paddingVertical: 20,
      backgroundColor: "transparent",
    },
    avatarOuterContainer: {
      padding: 3,
      borderRadius: 70,
      backgroundColor: "transparent",
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.25,
      shadowRadius: 16,
      elevation: 8,
    },
    avatarContainer: {
      width: 130,
      height: 130,
      borderRadius: 65,
      borderWidth: 4,
      borderColor: colors.primary,
      overflow: "hidden",
    },
    avatar: {
      width: "100%",
      height: "100%",
      borderRadius: 65,
    },
    usernameContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 16,
      backgroundColor:
        colorScheme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 25,
      borderWidth: 1,
      borderColor:
        colorScheme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
    },
    username: {
      fontSize: 24,
      fontWeight: "700",
      marginRight: 8,
      color: colors.text,
    },
    verifiedBadge: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.primary,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
    },
    verifiedText: {
      color: "#FFFFFF",
      fontSize: 13,
      fontWeight: "600",
      marginLeft: 4,
    },
    card: {
      marginHorizontal: CARD_HORIZONTAL_PADDING,
      marginVertical: 10,
      borderRadius: 25,
      backgroundColor:
        colorScheme === "dark" ? colors.surfaceDefault : colors.background,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: colorScheme === "dark" ? 0.3 : 0.1,
      shadowRadius: 12,
      elevation: 5,
      borderWidth: 1,
      borderColor:
        colorScheme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
    },
    cardContent: {
      padding: 20,
      borderRadius: 25,
    },
    levelHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    levelTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
    },
    levelNumber: {
      fontSize: 24,
      fontWeight: "700",
      color: colors.primary,
    },
    progressContainer: {
      marginVertical: 8,
    },
    progressBar: {
      height: 8,
      borderRadius: 4,
      overflow: "hidden",
      backgroundColor: colors.primary + "20",
    },
    progressFill: {
      height: "100%",
      backgroundColor: colors.primary,
      borderRadius: 4,
    },
    xpText: {
      fontSize: 13,
      fontWeight: "500",
      color: colors.secondaryText,
      marginTop: 8,
      textAlign: "right",
    },
    statsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      backgroundColor:
        colorScheme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)",
      marginHorizontal: -20,
      marginBottom: -20,
      padding: 20,
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
      marginTop: 20,
      borderTopWidth: 1,
      borderTopColor:
        colorScheme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
    },
    statItem: {
      backgroundColor: "transparent",
      alignItems: "center",
      flex: 1,
    },
    statValue: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.primary,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      fontWeight: "500",
      color: colors.secondaryText,
      textTransform: "uppercase",
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 20,
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
      padding: 16,
      backgroundColor:
        colorScheme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)",
      borderRadius: 16,
      borderWidth: 1,
      borderColor:
        colorScheme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
    },
    infoIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary + "15",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
    },
    infoContent: {
      flex: 1,
      backgroundColor: "transparent",
    },
    infoLabel: {
      fontSize: 13,
      color: colors.secondaryText,
      marginBottom: 4,
    },
    infoValue: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
    },
    buttonContainer: {
      backgroundColor: "transparent",
      marginVertical: 10,
      paddingTop: 10,
      paddingHorizontal: 20,
      zIndex: 1,
    },
    button: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: 12,
      borderRadius: 20,
      marginVertical: 6,
    },
    tradeButton: {
      backgroundColor: colors.primary,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
    },
    logoutButton: {
      borderWidth: 2,
      borderColor: colors.error,
      backgroundColor:
        colorScheme === "dark" ? "rgba(255,59,48,0.1)" : "rgba(255,59,48,0.05)",
    },
    buttonText: {
      fontSize: 16,
      fontWeight: "600",
      marginLeft: 10,
    },
    buttonIcon: {
      width: 24,
      height: 24,
      backgroundColor: "transparent",
      alignItems: "center",
      justifyContent: "center",
    },
  });
};
