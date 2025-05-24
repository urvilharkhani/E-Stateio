import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

const { width } = Dimensions.get('window');

const CustomModal = ({ visible, onClose, onConfirm }) => {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Remove from Favorites?</Text>
          <Text style={styles.message}>Are you sure you want to remove this item?</Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmBtn} onPress={onConfirm}>
              <Text style={styles.confirmText}>Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.8,
    backgroundColor: '#fff',
    borderRadius: RFValue(14),
    padding: RFValue(20),
  },
  title: {
    fontSize: RFValue(16),
    fontWeight: 'bold',
    marginBottom: RFValue(10),
  },
  message: {
    fontSize: RFValue(13),
    color: '#444',
    marginBottom: RFValue(20),
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems:'center'
  },
  cancelBtn: {
    marginRight: RFValue(10),
  },
  cancelText: {
    fontSize: RFValue(14),
    color: '#888',
  },
  confirmBtn: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: RFValue(14),
    paddingVertical: RFValue(8),
    borderRadius: RFValue(6),
  },
  confirmText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: RFValue(14),
  },
});
