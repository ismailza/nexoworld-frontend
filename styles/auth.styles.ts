import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from '@/constants/Colors';

const { height } = Dimensions.get('window');
const isSmallDevice = height < 700;

export const authStyles = (colorScheme: 'light' | 'dark') => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: isSmallDevice ? '10%' : '20%',
    backgroundColor: Colors[colorScheme].background,
  },
  titleContainer: {
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  title: {
    fontSize: isSmallDevice ? 24 : 32,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: Colors[colorScheme].secondaryText,
  },
  formContainer: {
    paddingHorizontal: 24,
    gap: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    height: 56,
    borderWidth: 1.5,
    borderColor: Colors[colorScheme].border,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: Colors[colorScheme].inputBackground,
    color: Colors[colorScheme].text,
  },
  inputFocused: {
    borderColor: Colors[colorScheme].primary,
    borderWidth: 2,
  },
  inputError: {
    borderColor: Colors[colorScheme].error,
    borderWidth: 2,
  },
  labelText: {
    fontSize: 16,
    marginBottom: 8,
    color: Colors[colorScheme].text,
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  errorText: {
    color: Colors[colorScheme].error,
    fontSize: 13,
    marginTop: 4,
    marginLeft: 8,
    fontWeight: '500',
  },
  submitButton: {
    height: 56,
    backgroundColor: Colors[colorScheme].primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    letterSpacing: 0.5,
  },
  forgotPassword: {
    marginTop: 15,
    alignItems: 'center',
    padding: 8,
  },
  forgotPasswordText: {
    color: Colors[colorScheme].primary,
    fontSize: 15,
    fontWeight: '500',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors[colorScheme].border,
  },
  dividerText: {
    color: Colors[colorScheme].secondaryText,
    paddingHorizontal: 16,
    fontSize: 14,
  },
  secondaryButton: {
    height: 56,
    borderColor: Colors[colorScheme].primary,
    borderWidth: 1.5,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: Colors[colorScheme].primary,
    fontSize: 17,
    letterSpacing: 0.5,
  },
});