// // import AsyncStorage from '@react-native-async-storage/async-storage';

// // export const getChatForAgent = async (agentId) => {
// //   try {
// //     const json = await AsyncStorage.getItem(`chat_${agentId}`);
// //     return json != null ? JSON.parse(json) : [];
// //   } catch (e) {
// //     console.error('Failed to load chat', e);
// //     return [];
// //   }
// // };

// // export const saveChatForAgent = async (agentId, messages) => {
// //   try {
// //     await AsyncStorage.setItem(`chat_${agentId}`, JSON.stringify(messages));
// //   } catch (e) {
// //     console.error('Failed to save chat', e);
// //   }
// // };
// // 
// import AsyncStorage from '@react-native-async-storage/async-storage';

// // Unique key using property ID
// const getChatKey = (propertyId) => `chat_${propertyId}`;

// // Get messages for a specific property
// export const getChatForProperty = async (propertyId) => {
//   try {
//     const data = await AsyncStorage.getItem(getChatKey(propertyId));
//     return data ? JSON.parse(data) : [];
//   } catch (error) {
//     console.error('Error fetching chat:', error);
//     return [];
//   }
// };

// // Save messages for a specific property
// export const saveChatForProperty = async (propertyId, messages) => {
//   try {
//     await AsyncStorage.setItem(getChatKey(propertyId), JSON.stringify(messages));
//   } catch (error) {
//     console.error('Error saving chat:', error);
//   }
// };

// // Optional: Clear chat for testing
// export const clearChatForProperty = async (propertyId) => {
//   try {
//     await AsyncStorage.removeItem(getChatKey(propertyId));
//   } catch (error) {
//     console.error('Error clearing chat:', error);
//   }
// };

// chatStorage.js
import { getMessagesForProperty, saveMessage } from '../common/sqliteService';

/**
 * Get all messages for a specific property
 * @param {string|number} propertyId 
 * @returns {Promise<Array>}
 */
export const getChatForProperty = async (propertyId) => {
  try {
    return await getMessagesForProperty(propertyId.toString());
  } catch (error) {
    console.error('Failed to load chat from SQLite:', error);
    return [];
  }
};

/**
 * Save all messages for a property (bulk update)
 * @param {string|number} propertyId 
 * @param {Array} messages 
 */
export const saveChatForProperty = async (propertyId, messages) => {
  try {
    for (const msg of messages) {
      await saveMessage({
        id: msg.id,
        property_id: propertyId.toString(),
        sender: msg.sender,
        text: msg.text,
        timestamp: msg.timestamp
      });
    }
  } catch (error) {
    console.error(' Failed to save chat to SQLite:', error);
  }
};
