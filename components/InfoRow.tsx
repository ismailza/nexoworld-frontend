import { Ionicons } from "@expo/vector-icons";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import { Colors } from "@/constants/Colors";
import { profileStyles as styles } from "@/styles/profile.styles";

export const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) => {
  const colorScheme = useColorScheme() || "light";
  const colors = Colors[colorScheme];

  return (
    <ThemedView style={styles(colorScheme).infoRow}>
      <ThemedView style={styles(colorScheme).infoIcon}>
        <Ionicons name={icon} size={20} color={colors.primary} />
      </ThemedView>
      <ThemedView style={styles(colorScheme).infoContent}>
        <ThemedText style={styles(colorScheme).infoLabel}>{label}</ThemedText>
        <ThemedText style={styles(colorScheme).infoValue}>{value}</ThemedText>
      </ThemedView>
    </ThemedView>
  );
};