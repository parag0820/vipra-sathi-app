import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacityProps,
} from 'react-native';
import { colors } from '../theme/colors';

interface CustomButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  loading,
  style,
  ...props
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, props.disabled && styles.buttonDisabled, style]}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={colors.surface} />
      ) : (
        <Text style={styles.title}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginVertical: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonDisabled: {
    backgroundColor: colors.textLight,
    shadowOpacity: 0,
    elevation: 0,
  },
  title: {
    color: colors.surface,
    fontSize: 12.5,
    fontWeight: 'bold',
  },
});

export default CustomButton;
