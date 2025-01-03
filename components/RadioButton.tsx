import { StyleSheet, TouchableOpacity } from "react-native";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme.web";

export type RadioButtonProps = {
  label: string;
  selected: boolean;
  disabled?: boolean;
  onPress: () => void;
};

export const RadioButton = ({ label, selected, disabled, onPress }: RadioButtonProps) => {
  const colorScheme = useColorScheme() || 'light';

  return (
    <TouchableOpacity 
      style={styles(colorScheme).radioButtonContainer} 
      onPress={onPress}
      disabled={disabled}
    >
      <ThemedView style={styles(colorScheme).radioButton}>
        {selected && <ThemedView style={styles(colorScheme).radioButtonSelected} />}
      </ThemedView>
      <ThemedText style={styles(colorScheme).radioButtonLabel}>{label}</ThemedText>
    </TouchableOpacity>
  );
};

const styles = (colorScheme: 'light' | 'dark') => StyleSheet.create({
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  radioButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors[colorScheme].tint,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  radioButtonSelected: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: Colors[colorScheme].tint,
  },
  radioButtonLabel: {
    fontSize: 16,
    color: Colors[colorScheme].text,
    textAlign: 'center',
  },
});