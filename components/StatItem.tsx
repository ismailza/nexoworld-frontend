import { useColorScheme } from "@/hooks/useColorScheme.web";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { profileStyles as styles } from "@/styles/profile.styles";

export const StatItem = ({
  value,
  label,
}: {
  value: string | number;
  label: string;
}) => {
  const colorScheme = useColorScheme() || "light";

  return (
    <ThemedView style={styles(colorScheme).statItem}>
      <ThemedText style={styles(colorScheme).statValue}>{value}</ThemedText>
      <ThemedText style={styles(colorScheme).statLabel}>{label}</ThemedText>
    </ThemedView>
  );
};