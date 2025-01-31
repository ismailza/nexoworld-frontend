import { authStyles as styles } from "@/styles/auth.styles";
import { RegisterCredentials } from "@/types/register.types";
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
import { RadioButton } from "@/components/RadioButton";
import { useAuth } from "@/hooks/useAuth";

export default function RegisterScreen() {
  const colorScheme = useColorScheme() || "light";
  const { register, isLoading, error, resetError } = useAuth();

  const [formState, setFormState] = useState({
    name: "",
    gender: "",
    email: "",
    username: "",
    password: "",
    nameError: "",
    genderError: "",
    emailError: "",
    usernameError: "",
    passwordError: "",
  });

  useEffect(() => {
    if (error) {
      alert(error);
      resetError();
    }
  }, [error]);

  const [focusedInput, setFocusedInput] = useState<
    "name" | "gender" | "email" | "username" | "password" | null
  >(null);

  const handleFocus = (
    input: "name" | "gender" | "email" | "username" | "password"
  ) => {
    setFocusedInput(input);
  };

  const handleBlur = () => {
    setFocusedInput(null);
  };

  const validateName = (name: string): boolean => {
    if (!name) {
      setFormState((prev) => ({ ...prev, nameError: "Name is required" }));
      return false;
    }

    setFormState((prev) => ({ ...prev, nameError: "" }));
    return true;
  };

  const validateGender = (gender: string): boolean => {
    if (!gender) {
      setFormState((prev) => ({ ...prev, genderError: "Gender is required" }));
      return false;
    }

    setFormState((prev) => ({ ...prev, genderError: "" }));
    return true;
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

  const validateUsername = (username: string): boolean => {
    const usernameRegex = /^[a-zA-Z0-9._-]+$/;

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

  const handleNameChange = (name: string) => {
    setFormState((prev) => ({ ...prev, name }));
  };

  const handleGenderSelect = (selectedGender: string) => {
    setFormState((prev) => ({
      ...prev,
      gender: selectedGender,
      genderError: "",
    }));
  };

  const handleEmailChange = (email: string) => {
    setFormState((prev) => ({ ...prev, email }));
  };

  const handleUsernameChange = (username: string) => {
    setFormState((prev) => ({ ...prev, username }));
  };

  const handlePasswordChange = (password: string) => {
    setFormState((prev) => ({ ...prev, password }));
  };

  const handleRegister = async (): Promise<void> => {
    try {
      const isNameValid = validateName(formState.name);
      const isUsernameValid = validateUsername(formState.username);
      const isPasswordValid = validatePassword(formState.password);
      const isEmailValid = validateEmail(formState.email);
      const isGenderValid = validateGender(formState.gender);

      if (
        !isNameValid ||
        !isGenderValid ||
        !isEmailValid ||
        !isUsernameValid ||
        !isPasswordValid
      ) {
        return;
      }

      const credentials: RegisterCredentials = {
        name: formState.name.trim(),
        gender: formState.gender,
        email: formState.email.trim(),
        username: formState.username.trim(),
        password: formState.password,
      };

      await register(credentials);
      router.replace('/auth/login');
    } catch (error) {
      console.log(error);
    } finally {
      setFormState(prev => ({
        ...prev,
        password: '',
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
            Welcome
          </ThemedText>
          <ThemedText type="default" style={styles(colorScheme).subtitle}>
            Sign up to get started
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles(colorScheme).formContainer}>
          {/* Name Input */}
          <View style={styles(colorScheme).inputContainer}>
            <TextInput
              style={[
                styles(colorScheme).input,
                focusedInput === "name" && styles(colorScheme).inputFocused,
                formState.nameError && styles(colorScheme).inputError,
              ]}
              placeholder="Name"
              placeholderTextColor={Colors[colorScheme].placeholder}
              value={formState.name}
              onChangeText={handleNameChange}
              onFocus={() => handleFocus("name")}
              onBlur={handleBlur}
              autoCapitalize="words"
              autoCorrect={false}
              editable={!isLoading}
            />
            {formState.nameError && (
              <ThemedText style={styles(colorScheme).errorText}>
                {formState.nameError}
              </ThemedText>
            )}
          </View>

          {/* Email Input */}
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
              keyboardType="email-address"
              editable={!isLoading}
            />
            {formState.emailError && (
              <ThemedText style={styles(colorScheme).errorText}>
                {formState.emailError}
              </ThemedText>
            )}
          </View>

          {/* Username Input */}
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

          {/* Password Input */}
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

          {/* Gender Selection */}
          <View style={styles(colorScheme).inputContainer}>
            <View style={styles(colorScheme).radioGroup}>
              <RadioButton
                selected={formState.gender === "male"}
                onPress={() => handleGenderSelect("male")}
                label="Male"
                disabled={isLoading}
              />
              <RadioButton
                selected={formState.gender === "female"}
                onPress={() => handleGenderSelect("female")}
                label="Female"
                disabled={isLoading}
              />
            </View>
            {formState.genderError && (
              <ThemedText style={styles(colorScheme).errorText}>
                {formState.genderError}
              </ThemedText>
            )}
          </View>

          {/* Register Button */}
          <TouchableOpacity
            style={[
              styles(colorScheme).submitButton,
              isLoading && styles(colorScheme).submitButtonDisabled,
            ]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ThemedText style={styles(colorScheme).submitButtonText}>
                Register
              </ThemedText>
            )}
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles(colorScheme).divider}>
            <View style={styles(colorScheme).dividerLine} />
            <ThemedText style={styles(colorScheme).dividerText}>
              Already have an account?
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