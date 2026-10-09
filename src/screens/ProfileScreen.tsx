import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Feather as Icon } from '@expo/vector-icons';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import CustomHeader from '../components/CustomHeader';
import { launchImageLibrary } from 'react-native-image-picker';
import Toast from 'react-native-toast-message';

const ProfileScreen = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    fullName: '',
    displayName: '',
    mobileNumber: '',
    email: '',
    experience: '',
    specialisations: '',
    city: '',
    address: '',
    whatsappNumber: '',
    pdfFooterText: '',
  });

  const [images, setImages] = useState({
    profilePhoto: '',
    personalLogo: '',
    signature: '',
  });

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const pickImage = async (field: keyof typeof images) => {
    const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.8 });
    if (result.assets && result.assets.length > 0) {
      setImages(prev => ({ ...prev, [field]: result.assets![0].uri || '' }));
    }
  };

  const handleSaveProfile = () => {
    Toast.show({ type: 'success', text1: 'Profile Saved!' });
  };

  const renderImagePicker = (label: string, field: keyof typeof images) => (
    <View style={styles.imagePickerContainer}>
      <Text style={[styles.imageLabel, { color: colors.text }]}>{label}</Text>
      <TouchableOpacity
        style={[styles.imageBox, { borderColor: colors.border, backgroundColor: colors.inputBg }]}
        onPress={() => pickImage(field)}
      >
        {images[field] ? (
          <Image source={{ uri: images[field] }} style={styles.previewImage} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <View style={[styles.cameraIcon, { backgroundColor: colors.primary + '10' }]}>
              <Icon name="camera" size={20} color={colors.primary} />
            </View>
            <Text style={[styles.imagePlaceholderText, { color: colors.textLight }]}>Tap to upload</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.primary }}>
      <CustomHeader 
        title="Profile" 
        icon="user" 
        showBack={true} 
        headerBgColor={colors.primary}
        headerTextColor="#FFF"
      />
      <View style={[styles.mainCard, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Header Card */}
          <View style={[styles.headerCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[styles.avatarContainer, { backgroundColor: colors.primary + '15' }]}>
              {images.profilePhoto ? (
                <Image source={{ uri: images.profilePhoto }} style={styles.avatarImage} />
              ) : (
                <Icon name="user" size={36} color={colors.primary} />
              )}
            </View>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Professional Profile</Text>
            <Text style={[styles.headerSubtitle, { color: colors.textLight }]}>Manage your public information</Text>
          </View>

          {/* Basic Info Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Basic Information</Text>
            <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <CustomInput label="Full Name" placeholder="Enter your full name" value={formData.fullName} onChangeText={(v) => updateField('fullName', v)} />
              <CustomInput label="Display Name" placeholder="Name shown to clients" value={formData.displayName} onChangeText={(v) => updateField('displayName', v)} />
              <CustomInput label="Mobile Number" placeholder="e.g. 9876543210" keyboardType="phone-pad" value={formData.mobileNumber} onChangeText={(v) => updateField('mobileNumber', v)} />
              <CustomInput label="Email Address" placeholder="e.g. pandit@example.com" keyboardType="email-address" autoCapitalize="none" value={formData.email} onChangeText={(v) => updateField('email', v)} />
            </View>
          </View>

          {/* Professional Info */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Professional Details</Text>
            <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <CustomInput label="WhatsApp Number" placeholder="e.g. 9876543210" keyboardType="phone-pad" value={formData.whatsappNumber} onChangeText={(v) => updateField('whatsappNumber', v)} />
              <CustomInput label="Years of Experience" placeholder="e.g. 15 Years" value={formData.experience} onChangeText={(v) => updateField('experience', v)} />
              <CustomInput label="Specialisations" placeholder="e.g. Vastu, Astrology, Vivah" value={formData.specialisations} onChangeText={(v) => updateField('specialisations', v)} />
              <CustomInput label="City" placeholder="e.g. Mumbai" value={formData.city} onChangeText={(v) => updateField('city', v)} />
              <CustomInput label="Full Address" placeholder="Your complete address" value={formData.address} onChangeText={(v) => updateField('address', v)} multiline style={[styles.textArea, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.text }]} />
            </View>
          </View>

          {/* Branding Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Branding & Assets</Text>
            <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              {renderImagePicker('Profile Photo', 'profilePhoto')}
              {renderImagePicker('Personal Logo', 'personalLogo')}
              {renderImagePicker('Signature', 'signature')}
              <CustomInput label="PDF Footer Text" placeholder="Text for invoices and reports" value={formData.pdfFooterText} onChangeText={(v) => updateField('pdfFooterText', v)} />
            </View>
          </View>

          <View style={{ paddingHorizontal: 16, paddingBottom: 20 }}>
            <CustomButton title="Save Profile" onPress={handleSaveProfile} />
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainCard: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  headerCard: {
    margin: 16,
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
      },
      android: { elevation: 2 },
    }),
  },
  avatarContainer: {
    width: 72,
    height: 72,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
    marginLeft: 4,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
      },
      android: { elevation: 2 },
    }),
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  imagePickerContainer: {
    marginBottom: 16,
  },
  imageLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  imageBox: {
    height: 110,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  imagePlaceholder: {
    alignItems: 'center',
    gap: 8,
  },
  cameraIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default ProfileScreen;
