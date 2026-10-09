import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { Feather as Icon } from '@expo/vector-icons';
import { Post, PostType } from '../types/community';
import { communityApi } from '../api/community';
import CreatePostModal from '../components/CreatePostModal';
import CustomHeader from '../components/CustomHeader';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const CommunityScreen = () => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();

  const [posts, setPosts] = useState<Post[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [filter, setFilter] = useState<PostType | 'all'>('all');
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  const loadPosts = async () => {
    try {
      const data = await communityApi.getAllPosts();
      if (Array.isArray(data)) {
        const mappedPosts = data.map((d: any) => ({
          id: d._id || d.id || Math.random().toString(),
          title: d.title || 'Untitled',
          content: d.description || d.content || '',
          type: (d.type || 'question').toLowerCase(),
          author: { id: d.userId || d.adminId || 'unknown', name: 'User', verified: false },
          createdAt: d.createdAt || new Date().toISOString(),
          likes: Array.isArray(d.likes) ? d.likes.length : (d.likes || 0),
          comments: d.comments || [],
        }));
        setPosts(mappedPosts);
      }
    } catch (error) {
      console.error('Failed to load posts:', error);
    }
  };

  React.useEffect(() => {
    loadPosts();
  }, []);

  const handleCreatePost = async (title: string, content: string, type: PostType) => {
    const optimisticPost: Post = {
      id: Math.random().toString(),
      title,
      content,
      type,
      author: { id: 'STATIC_USER_123', name: 'You', verified: false },
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: [],
    };
    
    setPosts(prev => [optimisticPost, ...prev]);

    try {
      await communityApi.createPost({
        title,
        description: content,
        type: type.charAt(0).toUpperCase() + type.slice(1),
        tags: []
      });
      loadPosts();
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  const toggleLike = async (postId: string) => {
    const isLiked = likedPosts.has(postId);
    
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (isLiked) newSet.delete(postId);
      else newSet.add(postId);
      return newSet;
    });
    
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: isLiked ? Math.max(0, post.likes - 1) : post.likes + 1
        };
      }
      return post;
    }));

    try {
      if (isLiked) {
        await communityApi.unlikePost(postId);
      } else {
        await communityApi.likePost(postId);
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
      // Revert optimistic update
      setLikedPosts(prev => {
        const newSet = new Set(prev);
        if (isLiked) newSet.add(postId);
        else newSet.delete(postId);
        return newSet;
      });
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            likes: isLiked ? post.likes + 1 : Math.max(0, post.likes - 1)
          };
        }
        return post;
      }));
    }
  };

  const filteredPosts = filter === 'all' ? posts : posts.filter(p => p.type === filter);

  const getBadgeColor = (type: PostType) => {
    switch (type) {
      case 'question': return '#F59E0B'; // Orange
      case 'knowledge': return '#16A34A'; // Green
      case 'suggestion': return '#2563EB'; // Blue
    }
  };

  const renderPost = ({ item }: { item: Post }) => (
    <TouchableOpacity
      style={[styles.postCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={() => navigation.navigate('PostDetail', { postId: item.id })}
    >
      <View style={styles.postHeader}>
        <View style={styles.authorContainer}>
          <View style={[styles.avatar, { backgroundColor: colors.primary + '20' }]}>
            <Text style={[styles.avatarText, { color: colors.primary }]}>{item.author?.name?.charAt(0) || 'U'}</Text>
          </View>
          <View>
            <View style={styles.nameRow}>
              <Text style={[styles.authorName, { color: colors.text }]}>{item.author?.name || 'User'}</Text>
              {item.author?.verified && <Icon name="check-circle" size={14} color="#16A34A" style={styles.verified} />}
            </View>
            <Text style={[styles.time, { color: colors.textLight }]}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>
        <View style={[styles.badge, { backgroundColor: getBadgeColor(item.type) + '20' }]}>
          <Text style={[styles.badgeText, { color: getBadgeColor(item.type) }]}>
            {item.type.toUpperCase()}
          </Text>
        </View>
      </View>

      <Text style={[styles.postTitle, { color: colors.text }]}>{item.title}</Text>
      <Text style={[styles.postContent, { color: colors.textLight }]} numberOfLines={3}>
        {item.content}
      </Text>

      <View style={styles.postFooter}>
        <TouchableOpacity 
          style={styles.footerItem}
          onPress={() => toggleLike(item.id)}
        >
          <Icon 
            name="heart" 
            size={18} 
            color={likedPosts.has(item.id) ? '#ef4444' : colors.textLight} 
          />
          <Text style={[styles.footerText, { color: likedPosts.has(item.id) ? '#ef4444' : colors.textLight }]}>
            {item.likes}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.footerItem}
          onPress={() => navigation.navigate('PostDetail', { postId: item.id })}
        >
          <Icon name="message-square" size={18} color={colors.textLight} />
          <Text style={[styles.footerText, { color: colors.textLight }]}>{item.comments?.length || 0}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <CustomHeader 
        title="Community" 
        showBack={false} 
        headerBgColor={colors.primary}
        headerTextColor="#FFF"
      />
      <View style={[styles.mainCard, { backgroundColor: colors.background }]}>

      <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 10 }}>
        <Text style={[styles.headerSubtitle, { color: colors.textLight }]}>
          Share knowledge and discuss with other Pandits.
        </Text>
      </View>

      {/* Filters */}
      <View style={styles.filterContainer}>
        {(['all', 'question', 'knowledge', 'suggestion'] as const).map(f => (
          <TouchableOpacity
            key={f}
            style={[
              styles.filterPill,
              filter === f ? { backgroundColor: colors.primary } : { backgroundColor: colors.surface, borderColor: colors.border }
            ]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, { color: filter === f ? '#FFF' : colors.text }]}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredPosts}
        keyExtractor={item => item.id}
        renderItem={renderPost}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary, bottom: Math.max(insets.bottom + 24, 24) }]}
        onPress={() => setModalVisible(true)}
      >
        <Icon name="edit-2" size={24} color="#FFF" />
      </TouchableOpacity>

      <CreatePostModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleCreatePost}
      />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  mainCard: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  header: { padding: 20, paddingTop: 30, paddingBottom: 10 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  headerSubtitle: { fontSize: 16 },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
  },
  filterText: { fontSize: 12, fontWeight: 'bold' },
  listContainer: { padding: 16, paddingBottom: 100 },
  postCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  authorContainer: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: { fontSize: 18, fontWeight: 'bold' },
  nameRow: { flexDirection: 'row', alignItems: 'center' },
  authorName: { fontSize: 14, fontWeight: 'bold' },
  verified: { marginLeft: 4 },
  time: { fontSize: 12, marginTop: 2 },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: { fontSize: 10, fontWeight: 'bold', letterSpacing: 0.5 },
  postTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  postContent: { fontSize: 14, lineHeight: 20, marginBottom: 12 },
  postFooter: { flexDirection: 'row', marginTop: 8 },
  footerItem: { flexDirection: 'row', alignItems: 'center', marginRight: 20, paddingVertical: 4, paddingRight: 8 },
  footerText: { marginLeft: 6, fontSize: 14, fontWeight: '500' },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  }
});

export default CommunityScreen;
