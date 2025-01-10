import { authStyles as styles } from "@/styles/auth.styles";
import { LoginCredentials } from "@/types/login.types";
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

export default function LoginScreen() {
  const colorScheme = useColorScheme() || "light";
  const { login, isLoading, error, resetError } = useAuth();

  const [formState, setFormState] = useState({
    username: "",
    password: "",
    usernameError: "",
    passwordError: "",
  });

  const [focusedInput, setFocusedInput] = useState<
    "username" | "password" | null
  >(null);

  useEffect(() => {
    if (error) {
      alert(error);
      resetError();
    }
  }, [error]);

  const handleFocus = (input: "username" | "password") => {
    setFocusedInput(input);
  };

  const handleBlur = () => {
    setFocusedInput(null);
  };

  const validateUsername = (username: string): boolean => {
    const usernameRegex = /^[a-zA-Z0-9._@-]+$/;

    if (!username) {
      setFormState((prev) => ({
        ...prev,
        usernameError: "Username is required",
      }));
      return false;
    }

    if (!usernameRegex.test(username)) {
      setFormState((prev) => ({ ...prev, usernameError: "Invalid username" }));
      return false;
    }

    setFormState((prev) => ({ ...prev, usernameError: "" }));
    return true;
  };

  const validatePassword = (password: string): boolean => {
    if (!password) {
      setFormState((prev) => ({
        ...prev,
        passwordError: "Password is required",
      }));
      return false;
    }

    if (password.length < 6) {
      setFormState((prev) => ({
        ...prev,
        passwordError: "Password must be at least 6 characters",
      }));
      return false;
    }

    setFormState((prev) => ({ ...prev, passwordError: "" }));
    return true;
  };

  const handleUsernameChange = (username: string) => {
    setFormState((prev) => ({ ...prev, username }));
  };

  const handlePasswordChange = (password: string) => {
    setFormState((prev) => ({ ...prev, password }));
  };

  const handleLogin = async (): Promise<void> => {
    try {
      const isUsernameValid = validateUsername(formState.username);
      const isPasswordValid = validatePassword(formState.password);

      if (!isUsernameValid || !isPasswordValid) {
        return;
      }

      const credentials: LoginCredentials = {
        username: formState.username.trim(),
        password: formState.password,
      };

      await login(credentials);
      router.replace("/");
    } catch (error) {
      // Error handling is done through Redux state
      console.log(error);
    } finally {
      setFormState((prev) => ({
        ...prev,
        password: "",
      }));
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
                focusedInput === "username" && styles(colorScheme).inputFocused,
                formState.usernameError && styles(colorScheme).inputError,
              ]}
              placeholder="Username"
              placeholderTextColor={Colors[colorScheme].placeholder}
              value={formState.username}
              onChangeText={handleUsernameChange}
              onFocus={() => handleFocus("username")}
              onBlur={handleBlur}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
            {formState.usernameError && (
              <ThemedText style={styles(colorScheme).errorText}>
                {formState.usernameError}
              </ThemedText>
            )}
          </View>

          <View style={styles(colorScheme).inputContainer}>
            <TextInput
              style={[
                styles(colorScheme).input,
                focusedInput === "password" && styles(colorScheme).inputFocused,
                formState.passwordError && styles(colorScheme).inputError,
              ]}
              placeholder="Password"
              placeholderTextColor={Colors[colorScheme].placeholder}
              value={formState.password}
              onChangeText={handlePasswordChange}
              onFocus={() => handleFocus("password")}
              onBlur={handleBlur}
              secureTextEntry
              editable={!isLoading}
            />
            {formState.passwordError && (
              <ThemedText style={styles(colorScheme).errorText}>
                {formState.passwordError}
              </ThemedText>
            )}
          </View>

          <TouchableOpacity
            style={[
              styles(colorScheme).submitButton,
              isLoading && styles(colorScheme).submitButtonDisabled,
            ]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ThemedText style={styles(colorScheme).submitButtonText}>
                Log In
              </ThemedText>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles(colorScheme).forgotPassword}
            onPress={() => router.replace("/auth/forgot-password")}
            disabled={isLoading}
          >
            <ThemedText style={styles(colorScheme).forgotPasswordText}>
              Forgot Password?
            </ThemedText>
          </TouchableOpacity>

          <View style={styles(colorScheme).divider}>
            <View style={styles(colorScheme).dividerLine} />
            <ThemedText style={styles(colorScheme).dividerText}>
              Don't have an account?
            </ThemedText>
            <View style={styles(colorScheme).dividerLine} />
          </View>

          <TouchableOpacity
            style={styles(colorScheme).secondaryButton}
            onPress={() => router.replace("/auth/register")}
          >
            <ThemedText style={styles(colorScheme).secondaryButtonText}>
              Register
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
