import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker'; // Import ImagePicker

// import { Camera } from 'expo-camera'; // Uncomment if you want real camera

export default function DoctorChatScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  let doctor = undefined;
  if (params.doctor) {
    try {
      doctor = JSON.parse(params.doctor as string);
    } catch (e) {
      doctor = undefined;
    }
  }

  const navigation = useNavigation();
  const route = useRoute();
  const [message, setMessage] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const [ringing, setRinging] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<{ uri: string; type: string } | null>(null);

  // const cameraRef = useRef(null); // For real camera

  const handleVideoCall = () => {
    setShowCamera(true);
    setRinging(true);
    setTimeout(() => setRinging(false), 3000); // Fake ring for 3s
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please allow access to your gallery to select images.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setSelectedMedia({ uri: result.assets[0].uri, type: 'image' });
    }
  };

  const pickVideo = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please allow access to your gallery to select videos.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: false,
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setSelectedMedia({ uri: result.assets[0].uri, type: 'video' });
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with video/call */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{doctor?.name || 'Doctor'}</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleVideoCall} style={styles.iconBtn}>
            <Ionicons name="videocam" size={24} color="#3B82F6" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="call" size={24} color="#3B82F6" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Chat area (placeholder) */}
      <View style={styles.chatArea}>
        {selectedMedia ? (
          selectedMedia.type === 'image' ? (
            <Image source={{ uri: selectedMedia.uri }} style={{ width: 200, height: 200, borderRadius: 12, alignSelf: 'center' }} />
          ) : (
            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: '#888', marginBottom: 8 }}>Video selected:</Text>
              <Text style={{ color: '#3B82F6' }}>{selectedMedia.uri}</Text>
            </View>
          )
        ) : (
          <Text style={{ color: '#888', textAlign: 'center', marginTop: 32 }}>
            Chat messages will appear here.
          </Text>
        )}
      </View>

      {/* Input area */}
      <View style={styles.inputArea}>
        <TextInput
          style={styles.textInput}
          placeholder="Type a message..."
          value={message}
          onChangeText={setMessage}
        />
        <View style={styles.inputActions}>
          <TouchableOpacity style={styles.actionBtn} onPress={pickVideo}>
            <Ionicons name="videocam" size={20} color="#3B82F6" />
            <Text style={styles.actionText}>Video</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={pickImage}>
            <Ionicons name="image" size={20} color="#3B82F6" />
            <Text style={styles.actionText}>Image</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Fake Camera Modal */}
      <Modal visible={showCamera} animationType="slide" transparent>
        <View style={styles.cameraModal}>
          {/* <Camera style={styles.cameraPreview} ref={cameraRef} /> */}
          <View style={styles.fakeCameraPreview}>
            <Ionicons name="person" size={80} color="#fff" />
            <Text style={{ color: '#fff', marginTop: 8 }}>Camera On</Text>
          </View>
          {ringing && (
            <View style={styles.ringingOverlay}>
              <Ionicons name="call" size={40} color="#22C55E" />
              <Text style={{ color: '#fff', fontSize: 18, marginTop: 8 }}>Ringing...</Text>
            </View>
          )}
          <TouchableOpacity style={styles.closeBtn} onPress={() => setShowCamera(false)}>
            <Ionicons name="close" size={32} color="#fff" />
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    elevation: 2,
    shadowOpacity: 0.05,
    shadowRadius: 2,
    zIndex: 2,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 16,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  iconBtn: {
    marginLeft: 12,
  },
  chatArea: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: 8,
    padding: 16,
  },
  inputArea: {
    backgroundColor: '#fff',
    padding: 12,
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
  },
  textInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 8,
  },
  inputActions: {
    flexDirection: 'row',
    gap: 16,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF4FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
  },
  actionText: {
    marginLeft: 4,
    color: '#3B82F6',
    fontWeight: '500',
  },
  cameraModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fakeCameraPreview: {
    width: 280,
    height: 400,
    backgroundColor: '#222',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringingOverlay: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: 40,
    right: 32,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 20,
    padding: 4,
  },
});
