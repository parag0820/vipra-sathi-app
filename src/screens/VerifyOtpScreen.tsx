import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import Toast from 'react-native-toast-message';
import { useAuth } from '../context/AuthContext';

const BG_COLOR = '#FDF0E6';

const VerifyOtpScreen = ({ route, navigation }: any) => {
  const mobile = route.params?.mobile || '';
  const [otp, setOtp] = useState('');
  const [verifying, setVerifying] = useState(false);
  const { login } = useAuth();

  const handleVerify = async () => {
    if (!otp || otp.length < 1) {
      Toast.show({ type: 'error', text1: 'Validation Error', text2: 'Please enter the OTP' });
      return;
    }

    setVerifying(true);
    
    // Simulate network request - accept any OTP
    setTimeout(async () => {
      setVerifying(false);
      Toast.show({ type: 'success', text1: 'Verified', text2: 'OTP verified successfully' });
      
      const mockUid = `usr_${Math.random().toString(36).substr(2, 9)}`;
      await login(mockUid);
    }, 1000);
  };

  const handleResend = () => {
    Toast.show({ type: 'success', text1: 'OTP Resent', text2: `A new OTP has been sent to ${mobile}.` });
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Verify OTP</Text>
          <Text style={styles.subtitle}>Enter the code sent to +91 {mobile}</Text>
        </View>

        <CustomInput
          label="One Time Password (OTP)"
          placeholder="Enter OTP (e.g., 1234)"
          keyboardType="number-pad"
          value={otp}
          onChangeText={setOtp}
          maxLength={6}
        />

        <CustomButton
          title="Verify & Login"
          onPress={handleVerify}
          loading={verifying}
          style={styles.button}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Didn't receive code? </Text>
          <TouchableOpacity onPress={handleResend}>
            <Text style={styles.footerLink}>Resend</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_COLOR,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  button: {
    marginTop: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
  },
  footerText: {
    color: '#6B7280',
    fontSize: 14,
  },
  footerLink: {
    color: '#C75B12',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default VerifyOtpScreen;
