import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

interface IconButtonProps {
  icon: string;
  title: string;
  onPress: () => void;
  color?: string;
  disabled?: boolean;
}

export function IconButton({ 
  icon, 
  title, 
  onPress, 
  color = '#3B82F6', 
  disabled = false 
}: IconButtonProps) {
  return (
    <TouchableOpacity 
      style={[styles.container, { opacity: disabled ? 0.5 : 1 }]} 
      onPress={onPress}
      disabled={disabled}
    >
      <View style={[styles.iconContainer, { backgroundColor: color }]}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    margin: 8,
    maxWidth: '45%',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  icon: {
    fontSize: 36,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    color: '#374151',
  }
});