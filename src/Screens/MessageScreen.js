import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';

// import { getChatForProperty, saveChatForProperty } from '../common/chatStorage';
import { saveMessage, getMessagesForProperty } from '../common/sqlliteService';
import AsyncStorage from '@react-native-async-storage/async-storage'; // For logged in email

const MessageScreen = () => {
  const { agent, property } = useRoute().params;
  const navigation = useNavigation();
  const flatListRef = useRef();

  const [inputText, setInputText] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([]);
  const hasBotReplied = useRef(false);

  // useEffect(() => {
  //   const loadMessages = async () => {
  //     const stored = await getChatForProperty(property.id);
  //     if (stored.length > 0) {
  //       setMessages(stored);
  //     } else {
  //       const systemMsg = {
  //         id: '0',
  //         text: `You're now connected with ${agent.name}.`,
  //         sender: 'system',
  //         timestamp: new Date().toISOString(),
  //       };
  //       setMessages([systemMsg]);
  //       saveChatForProperty(property.id, [systemMsg]);
  //     }
  //   };
  //   loadMessages();
  // }, [property.id]);
// useEffect(() => {
//  const loadMessages = async () => {
//   const rows = await getMessagesForProperty(property.id);
//   if (rows.length > 0) {
//     setMessages(rows);
//   } else {
//     const systemMsg = {
//       id: '0',
//       property_id: property.id.toString(),
//       sender: 'system',
//       text: `You're now connected with ${agent.name}.`,
//       timestamp: new Date().toISOString(),
//     };
//     await saveMessage(systemMsg);
//     setMessages([systemMsg]);
//   }
// };

//   loadMessages();
// }, [property.id]);
useEffect(() => {
  const loadMessages = async () => {
    const rows = await getMessagesForProperty(property.id);
    if (rows.length > 0) {
      setMessages(rows);
    } else {
      const systemMsg = {
        id: Date.now().toString() + '_system',
        property_id: property.id.toString(),
        sender: 'system',
        text: `You're now connected with ${agent.name}.`,
        timestamp: new Date().toISOString(),
      };
      await saveMessage(systemMsg);
      setMessages([systemMsg]);
    }
  };

  loadMessages();
}, [property.id]);

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', e =>
      setKeyboardHeight(e.endCoordinates.height)
    );
    const hideSub = Keyboard.addListener('keyboardDidHide', () =>
      setKeyboardHeight(0)
    );

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // const sendMessage = () => {
  //   if (!inputText.trim()) return;

  //   const newMessage = {
  //     id: Date.now().toString(),
  //     text: inputText,
  //     sender: 'user',
  //     timestamp: new Date().toISOString(),
  //   };

  //   const updated = [...messages, newMessage];
  //   setMessages(updated);
  //   saveChatForProperty(property.id, updated);
  //   setInputText('');

  //   if (!hasBotReplied.current) {
  //     hasBotReplied.current = true;
  //     setIsTyping(true);

  //     setTimeout(() => {
  //       const botMessage = {
  //         id: Date.now().toString() + '_bot',
  //         text: `${agent.name} will be with you shortly.`,
  //         sender: 'bot',
  //         timestamp: new Date().toISOString(),
  //       };
  //       const afterBot = [...updated, botMessage];
  //       setMessages(afterBot);
  //       saveChatForProperty(property.id, afterBot);
  //       setIsTyping(false);
  //     }, 3000);
  //   }

  //   setTimeout(() => {
  //     const agentMessage = {
  //       id: Date.now().toString() + '_followup',
  //       text: `Great! Ask any questions you have about the property.`,
  //       sender: 'agent',
  //       timestamp: new Date().toISOString(),
  //     };

  //     setMessages(prev => {
  //       const updatedMessages = [...prev, agentMessage];
  //       saveChatForProperty(property.id, updatedMessages);
  //       return updatedMessages;
  //     });
  //   }, 30000);
  // };

  const sendMessage = async () => {
  if (!inputText.trim()) return;

  const loggedInEmail = await AsyncStorage.getItem('@logged_in_email');
  const userMessage = {
    id: Date.now().toString(),
    property_id: property.id.toString(),
    sender: 'user',
    text: inputText,
    timestamp: new Date().toISOString(),
  };

  await saveMessage(userMessage);
  setMessages(prev => [...prev, userMessage]);
  setInputText('');

  if (!hasBotReplied.current) {
    hasBotReplied.current = true;
    setIsTyping(true);

    setTimeout(async () => {
      const botMessage = {
        id: Date.now().toString() + '_bot',
        property_id: property.id.toString(),
        sender: 'bot',
        text: `${agent.name} will be with you shortly.`,
        timestamp: new Date().toISOString(),
      };
      await saveMessage(botMessage);
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 3000);
  }

  setTimeout(async () => {
    const agentMessage = {
      id: Date.now().toString() + '_followup',
      property_id: property.id.toString(),
      sender: 'agent',
      text: 'Great! Ask any questions you have about the property.',
      timestamp: new Date().toISOString(),
    };
    await saveMessage(agentMessage);
    setMessages(prev => [...prev, agentMessage]);
  }, 30000);
};
const renderItem = ({ item }) => {
    if (item.sender === 'system') {
      return (
        <View style={styles.systemMessageWrapper}>
          <Text style={styles.systemMessage}>{item.text}</Text>
        </View>
      );
    }

    const isUser = item.sender === 'user';
    return (
      <View style={[styles.messageWrapper, isUser ? styles.userMessage : styles.agentMessage]}>
        <Text style={styles.messageText}>{item.text}</Text>
        {item.timestamp && (
          <Text style={styles.timestamp}>
            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={RFValue(20)} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{agent.name}</Text>
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {isTyping && (
          <Text style={styles.typingIndicator}>{agent.name} is typing...</Text>
        )}

        <KeyboardAvoidingView
          behavior="padding"
          keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        >
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Type a message..."
              value={inputText}
              onChangeText={setInputText}
            />
            <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
              <Ionicons name="send" size={RFValue(18)} color="#fff" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

export default MessageScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS=='android'? StatusBar.currentHeight:0
  },
  header: {
    padding: RFValue(16),
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  headerTitle: {
    marginLeft: RFValue(10),
    fontSize: RFValue(16),
    fontWeight: 'bold',
  },
  messageList: {
    padding: RFValue(10),
    flexGrow: 1,
  },
  systemMessageWrapper: {
    alignItems: 'center',
    marginVertical: RFValue(5),
  },
  systemMessage: {
    fontSize: RFValue(10),
    color: '#999',
    fontStyle: 'italic',
  },
  messageWrapper: {
    maxWidth: '75%',
    borderRadius: RFValue(10),
    padding: RFValue(10),
    marginVertical: RFValue(4),
  },
  userMessage: {
    backgroundColor: '#D9FDD3',
    alignSelf: 'flex-end',
  },
  agentMessage: {
    backgroundColor: '#F1F0F0',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: RFValue(13),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#eee',
    paddingHorizontal: RFValue(10),
    paddingVertical: RFValue(8),
    backgroundColor: '#fff',
    marginBottom:RFValue(15)
  },
  textInput: {
    flex: 1,
    borderRadius: RFValue(20),
    paddingVertical: RFValue(8),
    paddingHorizontal: RFValue(14),
    backgroundColor: '#F3F3F3',
    fontSize: RFValue(13),
  },
  sendButton: {
    backgroundColor: '#00C48C',
    padding: RFValue(10),
    borderRadius: RFValue(20),
    marginLeft: RFValue(8),
  },
});
