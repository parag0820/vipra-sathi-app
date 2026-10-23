import React from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';

interface CustomInputProps extends TextInputProps {
  label?: string;
  error?: string;
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  inputContainerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  error,
  rightIcon,
  leftIcon,
  onRightIconPress,
  containerStyle,
  inputContainerStyle,
  labelStyle,
  style,
  placeholderTextColor,
  ...props
}) => {
  const { colors, isDark } = useTheme();

  const activePlaceholderColor =
    placeholderTextColor || (isDark ? '#64748B' : '#94A3B8');

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? (
        <Text style={[styles.label, { color: isDark ? '#E2E8F0' : '#475569' }, labelStyle]}>
          {label}
        </Text>
      ) : null}
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
            borderColor: isDark ? '#334155' : '#E2E8F0',
          },
          leftIcon ? styles.inputWithLeftIcon : null,
          inputContainerStyle,
          error ? styles.inputError : null,
        ]}
      >
        {leftIcon && (
          <View
            style={[
              styles.leftIconContainer,
              {
                backgroundColor: isDark ? '#0F172A' : '#FFF5EE',
                borderRightColor: isDark ? '#334155' : '#E5E7EB',
              },
            ]}
          >
            {leftIcon}
          </View>
        )}
        <TextInput
          style={[
            styles.input,
            { color: colors.text || (isDark ? '#F8FAFC' : '#1E293B') },
            rightIcon ? styles.inputWithIcon : null,
            leftIcon ? styles.inputWithLeftPadding : null,
            style,
          ]}
          placeholderTextColor={activePlaceholderColor}
          textAlignVertical={props.multiline ? 'top' : 'center'}
          {...props}
        />
        {rightIcon && (
          <TouchableOpacity style={styles.iconContainer} onPress={onRightIconPress}>
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    width: '100%',
  },
  label: {
    fontSize: 12,
    marginBottom: 4,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  inputWithLeftIcon: {
    borderColor: '#E5E7EB',
  },
  leftIconContainer: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRightWidth: 1,
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 12.5,
    minHeight: 40,
  },
  inputWithLeftPadding: {
    paddingLeft: 10,
  },
  inputWithIcon: {
    paddingRight: 40,
  },
  iconContainer: {
    position: 'absolute',
    right: 12,
    height: '100%',
    justifyContent: 'center',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 11,
    marginTop: 3,
  },
});

export default CustomInput;
