import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useSocket } from "@/hooks/useSocket";
import { Ionicons } from "@expo/vector-icons";

interface Message {
  sender: string;
  content: string;
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const { sendMessage, onMessageRecieve } = useSocket();

  useEffect(() => {
    const unsubscribe = onMessageRecieve((message: string) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "Server", content: message },
      ]);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "You", content: newMessage },
      ]);
      sendMessage(newMessage);
      setNewMessage("");
    }
  };

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.messageList}
        renderItem={({ item }) => (
          <ThemedView
            style={[
              styles.messageBubble,
              item.sender === "Server"
                ? styles.serverMessageBubble
                : styles.selfMessageBubble,
            ]}
          >
            <ThemedText
              style={[
                styles.messageText,
                item.sender === "Server"
                  ? styles.serverMessageText
                  : styles.selfMessageText,
              ]}
            >
              {item.content}
            </ThemedText>
          </ThemedView>
        )}
      />
      <ThemedView style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          placeholderTextColor="#888"
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "linear-gradient(180deg, #e0eafc, #cfdef3)",
  },
  messageList: {
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  messageBubble: {
    padding: 10,
    marginVertical: 5,
    maxWidth: "80%",
    borderRadius: 20,
  },
  serverMessageBubble: {
    backgroundColor: "#e0e0e0",
    alignSelf: "flex-start",
  },
  selfMessageBubble: {
    backgroundColor: "#007AFF",
    alignSelf: "flex-end",
  },
  messageText: {
    fontSize: 16,
  },
  serverMessageText: {
    color: "#333",
  },
  selfMessageText: {
    color: "#fff",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    backgroundColor: "#f9f9f9",
  },
  input: {
    flex: 1,
    marginRight: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 25,
    backgroundColor: "#fff",
  },
  sendButton: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#007AFF",
    borderRadius: 25,
  },
});
