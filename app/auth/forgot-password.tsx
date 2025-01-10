import { authStyles as styles } from "@/styles/auth.styles";
import { useState, useEffect } from "react";
import {
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  View,
  ScrollView,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";
import { useAuth } from "@/hooks/useAuth";

export default function ForgotPasswordScreen() {
  const colorScheme = useColorScheme() || "light";
  const { isLoading, error, resetError } = useAuth();

  const [formState, setFormState] = useState({
    email: "",
    emailError: "",
  });

  const [focusedInput, setFocusedInput] = useState<"email" | null>(null);

  useEffect(() => {
    if (error) {
      alert(error);
      resetError();
    }
  }, [error]);

  const handleFocus = (input: "email") => {
    setFocusedInput(input);
  };

  const handleBlur = () => {
    setFocusedInput(null);
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    if (!email) {
      setFormState((prev) => ({ ...prev, emailError: "Email is required" }));
      return false;
    }

    if (!emailRegex.test(email)) {
      setFormState((prev) => ({ ...prev, emailError: "Invalid email" }));
      return false;
    }

    setFormState((prev) => ({ ...prev, emailError: "" }));
    return true;
  };

  const handleEmailChange = (email: string) => {
    setFormState((prev) => ({ ...prev, email }));
  };

  const handleSubmit = async (): Promise<void> => {
    try {
      const isEmailValid = validateEmail(formState.email);

      if (!isEmailValid) {
        return;
      }

      const credentials = {
        email: formState.email.trim(),
      };

      // Call the verifyEmail function from the useAuth hook
      
    } catch (error) {
      // Error handling is done through Redux state
      console.log(error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles(colorScheme).container}
    >
      <ScrollView
        contentContainerStyle={styles(colorScheme).scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <ThemedView style={styles(colorScheme).titleContainer}>
          <ThemedText type="title" style={styles(colorScheme).title}>
            Welcome Back
          </ThemedText>
          <ThemedText type="default" style={styles(colorScheme).subtitle}>
            Log in to your account
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles(colorScheme).formContainer}>
          <View style={styles(colorScheme).inputContainer}>
            <TextInput
              style={[
                styles(colorScheme).input,
                focusedInput === "email" && styles(colorScheme).inputFocused,
                formState.emailError && styles(colorScheme).inputError,
              ]}
              placeholder="Email"
              placeholderTextColor={Colors[colorScheme].placeholder}
              value={formState.email}
              onChangeText={handleEmailChange}
              onFocus={() => handleFocus("email")}
              onBlur={handleBlur}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
            {formState.emailError && (
              <ThemedText style={styles(colorScheme).errorText}>
                {formState.emailError}
              </ThemedText>
            )}
          </View>

          <TouchableOpacity
            style={[
              styles(colorScheme).submitButton,
              isLoading && styles(colorScheme).submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ThemedText style={styles(colorScheme).submitButtonText}>
                Verify Email
              </ThemedText>
            )}
          </TouchableOpacity>

          <View style={styles(colorScheme).divider}>
            <View style={styles(colorScheme).dividerLine} />
            <ThemedText style={styles(colorScheme).dividerText}>
              OR
            </ThemedText>
            <View style={styles(colorScheme).dividerLine} />
          </View>

          <TouchableOpacity
            style={styles(colorScheme).secondaryButton}
            onPress={() => router.replace("/auth/login")}
          >
            <ThemedText style={styles(colorScheme).secondaryButtonText}>
              Log In
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
