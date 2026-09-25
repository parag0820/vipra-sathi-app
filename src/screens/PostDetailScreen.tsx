import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext';
import { Feather as Icon } from '@expo/vector-icons';
import { communityApi, communityReplyApi } from '../api/community';
import { Comment, PostType } from '../types/community';

const PostDetailScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { colors, isDark } = useTheme();
  
  const postId = route.params?.postId;
  
  // Find the post and hold it in state so we can add comments locally
  const [post, setPost] = useState<any>(null);
  const [isLiked, setIsLiked] = useState(false);

  React.useEffect(() => {
    const loadPost = async () => {
      try {
        const data = await communityApi.getPostById(postId);
        if (data) {
          const mappedPost = {
            id: data._id || data.id,
            title: data.title || 'Untitled',
            content: data.description || data.content || '',
            type: (data.type || 'question').toLowerCase(),
            author: { id: data.userId || data.adminId || 'unknown', name: 'User', verified: false },
            createdAt: data.createdAt || new Date().toISOString(),
            likes: Array.isArray(data.likes) ? data.likes.length : (data.likes || 0),
            comments: data.comments || [],
          };
          setPost(mappedPost);
        }
      } catch (error) {
        console.error('Failed to load post:', error);
      }
    };
    if (postId) loadPost();
  }, [postId]);

  const toggleLike = async () => {
    if (!post) return;
    try {
      if (isLiked) {
        await communityApi.unlikePost(post.id);
        setPost({ ...post, likes: Math.max(0, post.likes - 1) });
        setIsLiked(false);
      } else {
        await communityApi.likePost(post.id);
        setPost({ ...post, likes: post.likes + 1 });
        setIsLiked(true);
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };
  const [replyText, setReplyText] = useState('');
  const [isReplying, setIsReplying] = useState(false);

  const handleReply = async () => {
    if (!replyText.trim() || isReplying) return;
    
    try {
      setIsReplying(true);
      const response = await communityReplyApi.createReply({
        postId: post.id,
        reply: replyText.trim(),
      });
      
      const newComment: Comment = {
        id: response?._id || Math.random().toString(36).substr(2, 9),
        author: { id: 'admin', name: 'You (PanditJi)', verified: true },
        content: replyText.trim(),
        createdAt: new Date().toISOString(),
        likes: 0,
      };
      
      setPost({ ...post, comments: [...post.comments, newComment] });
      setReplyText('');
    } catch (error) {
      console.error('Failed to post reply:', error);
    } finally {
      setIsReplying(false);
    }
  };

  const getBadgeColor = (type: PostType) => {
    switch(type) {
      case 'question': return '#F59E0B';
      case 'knowledge': return '#16A34A';
      case 'suggestion': return '#2563EB';
    }
  };

  if (!post) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: colors.text }}>Loading...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Post</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Original Post */}
        <View style={styles.postSection}>
          <View style={styles.authorContainer}>
            <View style={[styles.avatar, { backgroundColor: colors.primary + '20' }]}>
              <Text style={[styles.avatarText, { color: colors.primary }]}>{post.author.name.charAt(0)}</Text>
            </View>
            <View>
              <View style={styles.nameRow}>
                <Text style={[styles.authorName, { color: colors.text }]}>{post.author.name}</Text>
                {post.author.verified && <Icon name="check-circle" size={14} color="#16A34A" style={styles.verified} />}
              </View>
              <Text style={[styles.time, { color: colors.textLight }]}>
                {new Date(post.createdAt).toLocaleString()}
              </Text>
            </View>
          </View>
          
          <View style={[styles.badge, { backgroundColor: getBadgeColor(post.type) + '20' }]}>
            <Text style={[styles.badgeText, { color: getBadgeColor(post.type) }]}>
              {post.type.toUpperCase()}
            </Text>
          </View>

          <Text style={[styles.postTitle, { color: colors.text }]}>{post.title}</Text>
          <Text style={[styles.postContent, { color: colors.text }]}>{post.content}</Text>
          
          <View style={[styles.tagsContainer, { borderBottomColor: colors.border }]}>
            {post.tags?.map((tag: string) => (
              <View key={tag} style={[styles.tag, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Text style={[styles.tagText, { color: colors.textLight }]}>#{tag}</Text>
              </View>
            ))}
          </View>
          
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionBtn} onPress={toggleLike}>
              <Icon name="heart" size={20} color={isLiked ? '#ef4444' : colors.textLight} />
              <Text style={[styles.actionText, { color: isLiked ? '#ef4444' : colors.textLight }]}>{post.likes} Likes</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Comments Section */}
        <Text style={[styles.commentsHeader, { color: colors.text }]}>Replies ({post.comments.length})</Text>
        
        {post.comments.map((comment: any) => (
          <View key={comment.id} style={[styles.commentCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.authorContainer}>
              <View style={[styles.avatarSmall, { backgroundColor: colors.primary + '20' }]}>
                <Text style={[styles.avatarTextSmall, { color: colors.primary }]}>{comment.author.name.charAt(0)}</Text>
              </View>
              <View>
                <View style={styles.nameRow}>
                  <Text style={[styles.authorNameSmall, { color: colors.text }]}>{comment.author.name}</Text>
                  {comment.author.verified && <Icon name="check-circle" size={12} color="#16A34A" style={styles.verified} />}
                </View>
                <Text style={[styles.timeSmall, { color: colors.textLight }]}>
                  {new Date(comment.createdAt).toLocaleString()}
                </Text>
              </View>
            </View>
            <Text style={[styles.commentContent, { color: colors.text }]}>{comment.content}</Text>
          </View>
        ))}
        
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Reply Input Bar */}
      <View style={[styles.inputBar, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <TextInput
          style={[styles.input, { color: colors.text, backgroundColor: colors.background, borderColor: colors.border }]}
          placeholder="Add a reply..."
          placeholderTextColor={colors.textLight}
          value={replyText}
          onChangeText={setReplyText}
          multiline
        />
        <TouchableOpacity 
          style={[styles.sendButton, { backgroundColor: replyText.trim() && !isReplying ? colors.primary : colors.border }]}
          onPress={handleReply}
          disabled={!replyText.trim() || isReplying}
        >
          <Icon name="send" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 16,
    borderBottomWidth: 1,
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  scrollContent: { padding: 16 },
  
  postSection: { marginBottom: 24 },
  authorContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { fontSize: 20, fontWeight: 'bold' },
  nameRow: { flexDirection: 'row', alignItems: 'center' },
  authorName: { fontSize: 16, fontWeight: 'bold' },
  verified: { marginLeft: 4 },
  time: { fontSize: 12, marginTop: 2 },
  
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start', marginBottom: 12 },
  badgeText: { fontSize: 12, fontWeight: 'bold', letterSpacing: 0.5 },
  
  postTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  postContent: { fontSize: 16, lineHeight: 24, marginBottom: 16 },
  
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', paddingBottom: 16, borderBottomWidth: 1 },
  tag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 16, borderWidth: 1, marginRight: 8, marginBottom: 8 },
  tagText: { fontSize: 12 },

  actionRow: { flexDirection: 'row', paddingTop: 16 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', marginRight: 24 },
  actionText: { marginLeft: 8, fontSize: 14, fontWeight: '500' },
  
  commentsHeader: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  commentCard: { padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 12 },
  avatarSmall: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  avatarTextSmall: { fontSize: 14, fontWeight: 'bold' },
  authorNameSmall: { fontSize: 14, fontWeight: 'bold' },
  timeSmall: { fontSize: 10, marginTop: 2 },
  commentContent: { fontSize: 15, lineHeight: 22, marginTop: 12 },

  inputBar: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    borderTopWidth: 1,
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    minHeight: 40,
    maxHeight: 100,
    marginRight: 12,
    fontSize: 16,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default PostDetailScreen;
