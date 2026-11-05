import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  StatusBar,
  Modal,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather as Icon } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const PRIMARY_MAROON = '#8B1D1D';
const SOFT_PINK = '#FFF0ED';
const LIGHT_BG = '#FFFFFF';
const BORDER_COLOR = '#E5E7EB';
const USER_BUBBLE_BG = '#FFF5F5';

export interface ChatMessage {
  id: string;
  sender: string;
  senderRole?: string;
  avatarChar: string;
  isCurrentUser: boolean;
  text: string;
  time: string;
  quote?: {
    author: string;
    snippet: string;
  };
  attachment?: {
    type: 'pdf' | 'image' | 'audio';
    name: string;
    size: string;
  };
  status?: 'sent' | 'delivered' | 'read';
}

export interface PrivateChat {
  id: string;
  name: string;
  avatarChar: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
}

// Initial messages matching reference screenshot exactly
const INITIAL_GROUP_MESSAGES: ChatMessage[] = [
  {
    id: 'msg_1',
    sender: 'पं. अरुण शर्मा',
    avatarChar: 'अ',
    isCurrentUser: false,
    text: 'गृह प्रवेश पूजा में कलश स्थापना की विधि और सामग्री पर मार्गदर्शन चाहिए।',
    time: '09:10',
  },
  {
    id: 'msg_2',
    sender: 'पं. विवेक मिश्रा',
    avatarChar: 'व',
    isCurrentUser: false,
    quote: {
      author: 'पं. अरुण शर्मा',
      snippet: 'कलश स्थापना की विधि...',
    },
    text: 'मैं अपनी उपयोग की जाने वाली सामग्री सूची साझा कर रहा हूँ।',
    attachment: {
      type: 'pdf',
      name: 'गृह प्रवेश सामग्री.pdf',
      size: 'PDF • 124 KB',
    },
    time: '09:12',
  },
  {
    id: 'msg_3',
    sender: 'आप',
    avatarChar: 'आ',
    isCurrentUser: true,
    text: 'धन्यवाद पंडित जी, यह सूची उपयोगी है।',
    time: '09:15',
    status: 'read',
  },
  {
    id: 'msg_4',
    sender: 'पं. संजय पांडेय',
    avatarChar: 'स',
    isCurrentUser: false,
    text: 'विधि में अपने क्षेत्र की परंपरा का भी ध्यान रखें।',
    time: '09:17',
  },
  {
    id: 'msg_5',
    sender: 'पं. दीपक शुक्ल',
    avatarChar: 'द',
    isCurrentUser: false,
    text: 'किसी के पास संक्षिप्त संकल्प का संदर्भ है?',
    time: '09:20',
  },
];

const INITIAL_PRIVATE_CHATS: PrivateChat[] = [
  {
    id: 'pchat_1',
    name: 'पं. अरुण शर्मा',
    avatarChar: 'अ',
    lastMessage: 'प्रणाम पंडित जी, कल के मुहूर्त का विवरण भेजें।',
    time: '09:14',
    unreadCount: 1,
  },
  {
    id: 'pchat_2',
    name: 'पं. विवेक मिश्रा',
    avatarChar: 'व',
    lastMessage: 'हवन सामग्री की सूची देख ली है।',
    time: 'कल',
    unreadCount: 1,
  },
];

const CommunityScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const flatListRef = useRef<FlatList>(null);

  const [activeTab, setActiveTab] = useState<'group' | 'private'>('group');
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_GROUP_MESSAGES);
  const [privateChats, setPrivateChats] = useState<PrivateChat[]>(INITIAL_PRIVATE_CHATS);

  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAttachModalOpen, setIsAttachModalOpen] = useState(false);

  // Filter messages by search query
  const filteredMessages = messages.filter(m => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      m.text.toLowerCase().includes(q) ||
      m.sender.toLowerCase().includes(q) ||
      (m.attachment && m.attachment.name.toLowerCase().includes(q))
    );
  });

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const currentTime = `${hours}:${minutes}`;

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'आप',
      avatarChar: 'आ',
      isCurrentUser: true,
      text: inputText.trim(),
      time: currentTime,
      status: 'sent',
      quote: replyingTo
        ? {
            author: replyingTo.sender,
            snippet: replyingTo.text.slice(0, 30) + '...',
          }
        : undefined,
    };

    setMessages(prev => [...prev, newMsg]);
    setInputText('');
    setReplyingTo(null);

    // Auto scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleReply = (msg: ChatMessage) => {
    setReplyingTo(msg);
  };

  const handlePrivateReply = (msg: ChatMessage) => {
    Toast.show({
      type: 'info',
      text1: `${msg.sender} को निजी संदेश`,
      text2: 'निजी संदेश अनुभाग में चैट शुरू हो गई है',
    });
    setActiveTab('private');
  };

  const handleDownloadAttachment = (attachmentName: string) => {
    Toast.show({
      type: 'success',
      text1: 'डाउनलोड शुरू हो गया',
      text2: `${attachmentName} आपके डिवाइस में सहेजा जा रहा है`,
    });
  };

  const handleAttachOption = (type: string) => {
    setIsAttachModalOpen(false);
    Toast.show({
      type: 'info',
      text1: `${type} चयन`,
      text2: 'फ़ाइल ब्राउज़र खोला जा रहा है...',
    });
  };

  // Render individual chat message
  const renderMessageItem = ({ item }: { item: ChatMessage }) => {
    // Current user message (Outgoing - Right aligned)
    if (item.isCurrentUser) {
      return (
        <View style={styles.outgoingRow}>
          <View style={styles.outgoingBubble}>
            <Text style={styles.outgoingSender}>आप</Text>

            {item.quote ? (
              <View style={styles.outgoingQuoteContainer}>
                <Text style={styles.quoteAuthor}>{item.quote.author}</Text>
                <Text style={styles.quoteSnippet} numberOfLines={1}>
                  {item.quote.snippet}
                </Text>
              </View>
            ) : null}

            <Text style={styles.outgoingMessageText}>{item.text}</Text>

            <View style={styles.outgoingFooter}>
              <Text style={styles.outgoingTime}>{item.time}</Text>
              <Text style={styles.readTicks}>✓✓</Text>
            </View>
          </View>
        </View>
      );
    }

    // Other user message (Incoming - Left aligned)
    return (
      <View style={styles.incomingRow}>
        {/* Avatar circle */}
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarChar}>{item.avatarChar}</Text>
        </View>

        {/* Message bubble card */}
        <View style={styles.incomingBubbleCard}>
          <Text style={styles.incomingSender}>{item.sender}</Text>

          {/* Quoted reply banner if present */}
          {item.quote ? (
            <View style={styles.quoteContainer}>
              <View style={styles.quoteBar} />
              <View style={styles.quoteContent}>
                <Text style={styles.quoteAuthor}>
                  {item.quote.author} • {item.quote.snippet}
                </Text>
              </View>
            </View>
          ) : null}

          {/* Message body text */}
          <Text style={styles.incomingMessageText}>{item.text}</Text>

          {/* Attachment box if present (e.g. PDF) */}
          {item.attachment ? (
            <TouchableOpacity
              style={styles.attachmentBox}
              activeOpacity={0.8}
              onPress={() => handleDownloadAttachment(item.attachment!.name)}
            >
              <View style={styles.pdfBadge}>
                <Text style={styles.pdfBadgeText}>PDF</Text>
              </View>

              <View style={styles.attachmentInfo}>
                <Text style={styles.attachmentName} numberOfLines={1}>
                  {item.attachment.name}
                </Text>
                <Text style={styles.attachmentSize}>{item.attachment.size}</Text>
              </View>

              <View style={styles.downloadIconBtn}>
                <Icon name="download" size={16} color="#374151" />
              </View>
            </TouchableOpacity>
          ) : null}

          {/* Timestamp */}
          <View style={styles.timestampRow}>
            <Text style={styles.incomingTime}>{item.time}</Text>
          </View>

          {/* Card footer: जवाब दें | निजी जवाब */}
          <View style={styles.actionLinksRow}>
            <TouchableOpacity
              style={styles.actionLinkBtn}
              onPress={() => handleReply(item)}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            >
              <Icon name="corner-up-left" size={12} color="#6B7280" style={{ marginRight: 4 }} />
              <Text style={styles.actionLinkText}>जवाब दें</Text>
            </TouchableOpacity>

            <Text style={styles.actionDivider}>|</Text>

            <TouchableOpacity
              style={styles.actionLinkBtn}
              onPress={() => handlePrivateReply(item)}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            >
              <Icon name="mail" size={12} color="#6B7280" style={{ marginRight: 4 }} />
              <Text style={styles.actionLinkText}>निजी जवाब</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.screenContainer, { paddingTop: Math.max(insets.top, 10) }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* 1. Header: समुदाय + सभी पंडितों की साझा चर्चा + Search & Menu */}
      <View style={styles.header}>
        <View style={styles.headerLeftCol}>
          {navigation.canGoBack() && (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Icon name="arrow-left" size={20} color="#1F2937" />
            </TouchableOpacity>
          )}
          <View style={styles.headerTitleCol}>
            <Text style={styles.headerTitle}>समुदाय</Text>
            <Text style={styles.headerSubtitle}>सभी पंडितों की साझा चर्चा</Text>
          </View>
        </View>

        <View style={styles.headerRightActions}>
          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => setIsSearchVisible(prev => !prev)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Icon name="search" size={18} color="#1F2937" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => setIsMenuOpen(true)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Icon name="more-vertical" size={18} color="#1F2937" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. Search Bar (Toggleable) */}
      {isSearchVisible ? (
        <View style={styles.searchBarContainer}>
          <Icon name="search" size={15} color="#6B7280" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchBarInput}
            placeholder="चर्चा या संदेश खोजें..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery.length > 0 ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="x" size={15} color="#9CA3AF" style={{ marginRight: 6 }} />
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity onPress={() => { setIsSearchVisible(false); setSearchQuery(''); }}>
            <Text style={styles.searchCloseText}>रद्द करें</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* 3. Top Tabs: सामूहिक चर्चा | निजी संदेश (2) */}
      <View style={styles.tabsContainer}>
        {/* सामूहिक चर्चा Tab */}
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'group' && styles.tabBtnActive]}
          onPress={() => setActiveTab('group')}
        >
          <Text style={[styles.tabBtnText, activeTab === 'group' && styles.tabBtnTextActive]}>
            सामूहिक चर्चा
          </Text>
          {activeTab === 'group' ? <View style={styles.tabActiveBar} /> : null}
        </TouchableOpacity>

        {/* निजी संदेश Tab with notification badge */}
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'private' && styles.tabBtnActive]}
          onPress={() => setActiveTab('private')}
        >
          <View style={styles.privateTabContent}>
            <Text style={[styles.tabBtnText, activeTab === 'private' && styles.tabBtnTextActive]}>
              निजी संदेश
            </Text>
            <View style={styles.badgeCount}>
              <Text style={styles.badgeCountText}>2</Text>
            </View>
          </View>
          {activeTab === 'private' ? <View style={styles.tabActiveBar} /> : null}
        </TouchableOpacity>
      </View>

      {/* 4. Tab Content */}
      {activeTab === 'group' ? (
        <KeyboardAvoidingView
          style={styles.chatArea}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
        >
          {/* Pinned notice banner */}
          <View style={styles.noticeBanner}>
            <Text style={styles.pinIcon}>📌</Text>
            <Text style={styles.noticeText}>
              सम्मानपूर्वक चर्चा करें • विषय से जुड़ी जानकारी साझा करें
            </Text>
          </View>

          {/* Chat Messages List */}
          <FlatList
            ref={flatListRef}
            data={filteredMessages}
            keyExtractor={item => item.id}
            renderItem={renderMessageItem}
            contentContainerStyle={styles.chatListContent}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <View style={styles.datePillContainer}>
                <View style={styles.datePill}>
                  <Text style={styles.datePillText}>आज</Text>
                </View>
              </View>
            }
          />

          {/* Replying quote bar if active */}
          {replyingTo ? (
            <View style={styles.replyPreviewBar}>
              <View style={styles.replyPreviewLeft}>
                <Text style={styles.replyPreviewTitle}>
                  जवाब दे रहे हैं: <Text style={{ fontWeight: 'bold' }}>{replyingTo.sender}</Text>
                </Text>
                <Text style={styles.replyPreviewSnippet} numberOfLines={1}>
                  {replyingTo.text}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setReplyingTo(null)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Icon name="x" size={16} color="#6B7280" />
              </TouchableOpacity>
            </View>
          ) : null}

          {/* 5. Input Bar: Notice + Pill Input Container */}
          <View style={[styles.inputAreaWrapper, { paddingBottom: Math.max(insets.bottom + 4, 10) }]}>
            <View style={styles.inputNoticeRow}>
              <Icon name="users" size={11} color="#6B7280" style={{ marginRight: 4 }} />
              <Text style={styles.inputNoticeText}>संदेश सभी सदस्यों को दिखेगा</Text>
            </View>

            <View style={styles.inputPillContainer}>
              {/* Attachment paperclip */}
              <TouchableOpacity
                style={styles.inputIconBtn}
                onPress={() => setIsAttachModalOpen(true)}
                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              >
                <Icon name="paperclip" size={17} color="#4B5563" />
              </TouchableOpacity>

              {/* TextInput */}
              <TextInput
                style={styles.messageTextInput}
                placeholder="समुदाय में संदेश लिखें..."
                placeholderTextColor="#9CA3AF"
                value={inputText}
                onChangeText={setInputText}
                multiline
              />

              {/* Mic Icon */}
              <TouchableOpacity
                style={styles.inputIconBtn}
                onPress={() => Toast.show({ type: 'info', text1: 'आवाज़ रिकॉर्डिंग', text2: 'बोलकर संदेश भेजें' })}
                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              >
                <Icon name="mic" size={17} color={PRIMARY_MAROON} />
              </TouchableOpacity>

              {/* Send Button */}
              <TouchableOpacity
                style={styles.sendButton}
                activeOpacity={0.8}
                onPress={handleSendMessage}
              >
                <Icon name="send" size={15} color="#FFFFFF" style={{ marginLeft: 2 }} />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      ) : (
        /* Private Messages Tab */
        <ScrollView style={styles.privateListContainer} showsVerticalScrollIndicator={false}>
          <Text style={styles.privateSectionHeader}>हाल की बातचीत ({privateChats.length})</Text>

          {privateChats.map(chat => (
            <TouchableOpacity
              key={chat.id}
              style={styles.privateChatItem}
              onPress={() => {
                Toast.show({
                  type: 'info',
                  text1: chat.name,
                  text2: 'सीधा संवाद खुल रहा है...',
                });
              }}
            >
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarChar}>{chat.avatarChar}</Text>
              </View>

              <View style={styles.privateChatInfo}>
                <View style={styles.privateChatTopRow}>
                  <Text style={styles.privateChatName}>{chat.name}</Text>
                  <Text style={styles.privateChatTime}>{chat.time}</Text>
                </View>
                <View style={styles.privateChatBottomRow}>
                  <Text style={styles.privateChatSnippet} numberOfLines={1}>
                    {chat.lastMessage}
                  </Text>
                  {chat.unreadCount > 0 ? (
                    <View style={styles.privateChatUnreadBadge}>
                      <Text style={styles.privateChatUnreadText}>{chat.unreadCount}</Text>
                    </View>
                  ) : null}
                </View>
              </View>
            </TouchableOpacity>
          ))}

          <View style={styles.privateEmptyHint}>
            <Icon name="lock" size={16} color="#9CA3AF" style={{ marginRight: 6 }} />
            <Text style={styles.privateEmptyHintText}>
              निजी संदेश केवल आपके और संबंधित पंडित जी के बीच सुरक्षित हैं।
            </Text>
          </View>
        </ScrollView>
      )}

      {/* Action Menu Modal (⋮) */}
      <Modal visible={isMenuOpen} transparent animationType="fade" onRequestClose={() => setIsMenuOpen(false)}>
        <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => setIsMenuOpen(false)}>
          <View style={styles.menuPopupCard}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setIsMenuOpen(false);
                Toast.show({ type: 'info', text1: 'समुदाय नियम', text2: 'कृपया मर्यादा और पवित्रता बनाए रखें' });
              }}
            >
              <Icon name="shield" size={15} color="#374151" style={{ marginRight: 10 }} />
              <Text style={styles.menuItemText}>नियम व दिशानिर्देश</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setIsMenuOpen(false);
                setMessages(INITIAL_GROUP_MESSAGES);
                Toast.show({ type: 'success', text1: 'चर्चा ताज़ा की गई' });
              }}
            >
              <Icon name="refresh-cw" size={15} color="#374151" style={{ marginRight: 10 }} />
              <Text style={styles.menuItemText}>संदेश रीफ़्रेश करें</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuItem, { borderBottomWidth: 0 }]}
              onPress={() => {
                setIsMenuOpen(false);
                Toast.show({ type: 'info', text1: 'सूचनाएं सक्रिय हैं' });
              }}
            >
              <Icon name="bell" size={15} color="#374151" style={{ marginRight: 10 }} />
              <Text style={styles.menuItemText}>समुदाय सूचनाएं</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* 8. Attachment Modal (📎) */}
      <Modal visible={isAttachModalOpen} transparent animationType="slide" onRequestClose={() => setIsAttachModalOpen(false)}>
        <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => setIsAttachModalOpen(false)}>
          <View style={styles.attachModalCard}>
            <Text style={styles.attachModalTitle}>सामग्री संलग्न करें</Text>

            <TouchableOpacity style={styles.attachOptionRow} onPress={() => handleAttachOption('पीडीएफ दस्तावेज')}>
              <View style={[styles.attachOptionIcon, { backgroundColor: '#FEE2E2' }]}>
                <Icon name="file-text" size={18} color="#DC2626" />
              </View>
              <Text style={styles.attachOptionText}>पूजा विधि / सामग्री सूची (PDF)</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.attachOptionRow} onPress={() => handleAttachOption('चित्र / फ़ोटो')}>
              <View style={[styles.attachOptionIcon, { backgroundColor: '#DBEAFE' }]}>
                <Icon name="image" size={18} color="#2563EB" />
              </View>
              <Text style={styles.attachOptionText}>चित्र या दस्तावेज की फोटो</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.attachOptionRow, { borderBottomWidth: 0 }]}
              onPress={() => handleAttachOption('ऑडियो रिकॉर्डिंग')}
            >
              <View style={[styles.attachOptionIcon, { backgroundColor: '#FEF3C7' }]}>
                <Icon name="mic" size={18} color="#D97706" />
              </View>
              <Text style={styles.attachOptionText}>मंत्र या पाठ ऑडियो</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 6,
  },
  headerLeftCol: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    padding: 6,
    marginRight: 8,
  },
  headerTitleCol: {
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: PRIMARY_MAROON,
    letterSpacing: -0.2,
  },
  headerSubtitle: {
    fontSize: 11.5,
    color: '#6B7280',
    marginTop: 1,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerIconBtn: {
    padding: 6,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    borderRadius: 10,
    marginHorizontal: 16,
    marginVertical: 4,
    paddingHorizontal: 10,
    height: 38,
  },
  searchBarInput: {
    flex: 1,
    fontSize: 12.5,
    color: '#1F2937',
    paddingVertical: 0,
  },
  searchCloseText: {
    fontSize: 12,
    color: PRIMARY_MAROON,
    fontWeight: '600',
    marginLeft: 6,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    marginTop: 2,
    paddingHorizontal: 16,
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    position: 'relative',
  },
  tabBtnActive: {},
  tabBtnText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
  },
  tabBtnTextActive: {
    fontWeight: '700',
    color: PRIMARY_MAROON,
  },
  tabActiveBar: {
    position: 'absolute',
    bottom: -1,
    left: 20,
    right: 20,
    height: 2.5,
    backgroundColor: PRIMARY_MAROON,
    borderRadius: 2,
  },
  privateTabContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeCount: {
    backgroundColor: PRIMARY_MAROON,
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
    paddingHorizontal: 4,
  },
  badgeCountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  chatArea: {
    flex: 1,
  },
  noticeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SOFT_PINK,
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  pinIcon: {
    fontSize: 12,
    marginRight: 6,
  },
  noticeText: {
    fontSize: 11,
    color: '#4B5563',
    fontWeight: '500',
    flex: 1,
  },
  chatListContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  datePillContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  datePill: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: 3,
    paddingHorizontal: 14,
  },
  datePillText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
  },
  incomingRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: SOFT_PINK,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginTop: 2,
  },
  avatarChar: {
    fontSize: 14,
    fontWeight: '700',
    color: PRIMARY_MAROON,
  },
  incomingBubbleCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    borderRadius: 12,
    padding: 10,
    maxWidth: '88%',
  },
  incomingSender: {
    fontSize: 12,
    fontWeight: '700',
    color: PRIMARY_MAROON,
    marginBottom: 4,
  },
  quoteContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF8F6',
    borderRadius: 4,
    marginBottom: 6,
    overflow: 'hidden',
  },
  quoteBar: {
    width: 3,
    backgroundColor: PRIMARY_MAROON,
  },
  quoteContent: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    flex: 1,
  },
  quoteAuthor: {
    fontSize: 11,
    color: PRIMARY_MAROON,
    fontWeight: '600',
  },
  quoteSnippet: {
    fontSize: 10.5,
    color: '#6B7280',
  },
  incomingMessageText: {
    fontSize: 12.5,
    lineHeight: 18,
    color: '#1F2937',
  },
  attachmentBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
  },
  pdfBadge: {
    backgroundColor: '#DC2626',
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 6,
    marginRight: 8,
  },
  pdfBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  attachmentInfo: {
    flex: 1,
  },
  attachmentName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
  },
  attachmentSize: {
    fontSize: 10.5,
    color: '#6B7280',
    marginTop: 1,
  },
  downloadIconBtn: {
    padding: 4,
  },
  timestampRow: {
    alignItems: 'flex-end',
    marginTop: 4,
  },
  incomingTime: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  actionLinksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    marginTop: 6,
    paddingTop: 6,
  },
  actionLinkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionLinkText: {
    fontSize: 11,
    color: '#4B5563',
    fontWeight: '500',
  },
  actionDivider: {
    color: '#D1D5DB',
    marginHorizontal: 10,
    fontSize: 11,
  },
  outgoingRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 12,
  },
  outgoingBubble: {
    backgroundColor: USER_BUBBLE_BG,
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 12,
    padding: 10,
    maxWidth: '82%',
  },
  outgoingSender: {
    fontSize: 11,
    fontWeight: '700',
    color: PRIMARY_MAROON,
    marginBottom: 2,
  },
  outgoingQuoteContainer: {
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 3,
    borderLeftColor: PRIMARY_MAROON,
    padding: 4,
    borderRadius: 4,
    marginBottom: 4,
  },
  outgoingMessageText: {
    fontSize: 12.5,
    lineHeight: 18,
    color: '#1F2937',
  },
  outgoingFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 4,
  },
  outgoingTime: {
    fontSize: 10,
    color: '#9CA3AF',
    marginRight: 4,
  },
  readTicks: {
    fontSize: 10,
    color: PRIMARY_MAROON,
    fontWeight: 'bold',
  },
  replyPreviewBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: BORDER_COLOR,
  },
  replyPreviewLeft: {
    flex: 1,
    marginRight: 10,
  },
  replyPreviewTitle: {
    fontSize: 11,
    color: '#374151',
  },
  replyPreviewSnippet: {
    fontSize: 10.5,
    color: '#6B7280',
  },
  inputAreaWrapper: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingTop: 4,
    paddingBottom: 6,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  inputNoticeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    paddingLeft: 4,
  },
  inputNoticeText: {
    fontSize: 10.5,
    color: '#6B7280',
  },
  inputPillContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    borderRadius: 22,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  inputIconBtn: {
    padding: 6,
  },
  messageTextInput: {
    flex: 1,
    fontSize: 12.5,
    color: '#1F2937',
    paddingVertical: 4,
    paddingHorizontal: 6,
    maxHeight: 80,
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: PRIMARY_MAROON,
    justifyContent: 'center',
    alignItems: 'center',
  },
  privateListContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  privateSectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
    marginBottom: 10,
  },
  privateChatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  privateChatInfo: {
    flex: 1,
  },
  privateChatTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  privateChatName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F2937',
  },
  privateChatTime: {
    fontSize: 10.5,
    color: '#9CA3AF',
  },
  privateChatBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  privateChatSnippet: {
    fontSize: 11.5,
    color: '#6B7280',
    flex: 1,
    marginRight: 8,
  },
  privateChatUnreadBadge: {
    backgroundColor: PRIMARY_MAROON,
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  privateChatUnreadText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  privateEmptyHint: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    marginTop: 20,
    justifyContent: 'center',
  },
  privateEmptyHintText: {
    fontSize: 11,
    color: '#6B7280',
    flex: 1,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  menuPopupCard: {
    width: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 6,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuItemText: {
    fontSize: 12,
    color: '#374151',
  },
  attachModalCard: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
  },
  attachModalTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 14,
  },
  attachOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  attachOptionIcon: {
    width: 34,
    height: 34,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  attachOptionText: {
    fontSize: 12.5,
    color: '#374151',
    fontWeight: '500',
  },
});

export default CommunityScreen;
