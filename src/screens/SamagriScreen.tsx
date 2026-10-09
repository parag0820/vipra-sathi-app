import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Share, Switch, Platform, Alert } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import CustomHeader from '../components/CustomHeader';
import CustomDropdown from '../components/CustomDropdown';
import { Feather as Icon } from '@expo/vector-icons';

const POOJA_OPTIONS = ['Satyanarayan Pooja', 'Griha Pravesh', 'Vivah (Wedding)', 'Namakaran', 'Mundan', 'Vastu Shanti'];

const MOCK_SAMAGRI: Record<string, { id: string, name: string, qty: string }[]> = {
  'Satyanarayan Pooja': [
    { id: '1', name: 'Kalash', qty: '1' },
    { id: '2', name: 'Nariyal (Coconut)', qty: '2' },
    { id: '3', name: 'Supari (Betel Nut)', qty: '5' },
    { id: '4', name: 'Haldi Powder', qty: '50g' },
    { id: '5', name: 'Kumkum', qty: '50g' },
    { id: '6', name: 'Paan Leaves', qty: '11' },
    { id: '7', name: 'Flowers (Mixed)', qty: '500g' },
    { id: '8', name: 'Fruits (5 types)', qty: '5 each' },
    { id: '9', name: 'Panchamrit (Milk, Curd, Ghee, Honey, Sugar)', qty: '1 bowl' },
    { id: '10', name: 'Prasad (Sheera/Panjiri)', qty: '1 bowl' },
  ]
};
const FALLBACK_SAMAGRI = MOCK_SAMAGRI['Satyanarayan Pooja'];

const HAWAN_SAMAGRI = [
  { id: 'h1', name: 'Havan Kund', qty: '1' },
  { id: 'h2', name: 'Mango Wood (Aam ki Lakdi)', qty: '2 kg' },
  { id: 'h3', name: 'Havan Samagri Mixture', qty: '500g' },
  { id: 'h4', name: 'Pure Ghee', qty: '500g' },
  { id: 'h5', name: 'Navagraha Samidha', qty: '1 packet' },
  { id: 'h6', name: 'Camphor (Kapur)', qty: '1 packet' },
];

const SamagriScreen = () => {
  const { colors, isDark } = useTheme();
  const [selectedPooja, setSelectedPooja] = useState('Satyanarayan Pooja');
  const [includeHawan, setIncludeHawan] = useState(false);

  // State for checkboxes and responsibility. Defaults to Yajman organizing it.
  const [itemStates, setItemStates] = useState<Record<string, { checked: boolean, responsibility: 'pandit' | 'yajman' }>>({});

  const currentSamagri = MOCK_SAMAGRI[selectedPooja] || FALLBACK_SAMAGRI;
  const fullList = includeHawan ? [...currentSamagri, ...HAWAN_SAMAGRI] : currentSamagri;

  const toggleCheck = (id: string) => {
    setItemStates(prev => {
      const existing = prev[id] || { checked: false, responsibility: 'yajman' };
      return { ...prev, [id]: { ...existing, checked: !existing.checked } };
    });
  };

  const setResponsibility = (id: string, resp: 'pandit' | 'yajman') => {
    setItemStates(prev => {
      const existing = prev[id] || { checked: false, responsibility: 'yajman' };
      return { ...prev, [id]: { ...existing, responsibility: resp } };
    });
  };

  const handleShareWhatsApp = async () => {
    let message = `🕉️ *${selectedPooja} - Samagri List* 🕉️\n\n`;

    const panditItems: string[] = [];
    const yajmanItems: string[] = [];

    fullList.forEach(item => {
      const state = itemStates[item.id] || { checked: false, responsibility: 'yajman' };
      const line = `• ${item.name} × ${item.qty}${state.checked ? ' (Done ✅)' : ''}`;
      if (state.responsibility === 'pandit') {
        panditItems.push(line);
      } else {
        yajmanItems.push(line);
      }
    });

    if (yajmanItems.length > 0) {
      message += `*To be arranged by Yajman:*\n${yajmanItems.join('\n')}\n\n`;
    }
    if (panditItems.length > 0) {
      message += `*Panditji will bring:*\n${panditItems.join('\n')}\n\n`;
    }

    message += `_Shared via VipraSathi App_`;

    try {
      await Share.share({ message });
    } catch (error) {
      console.log(error);
    }
  };

  const handleShareOptions = () => {
    Alert.alert(
      "Share Samagri List",
      "How would you like to share the list with Yajman?",
      [
        { text: "WhatsApp Text", onPress: handleShareWhatsApp },
        { text: "Branded PDF", onPress: () => Alert.alert("Coming Soon", "PDF export will be available in the next update.") },
        { text: "Image", onPress: () => Alert.alert("Coming Soon", "Image export will be available in the next update.") },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  const renderItem = (item: { id: string, name: string, qty: string }, index: number) => {
    const state = itemStates[item.id] || { checked: false, responsibility: 'yajman' };

    return (
      <View key={item.id} style={[styles.itemCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.itemHeader}>
          <TouchableOpacity onPress={() => toggleCheck(item.id)} style={styles.checkArea} activeOpacity={0.7}>
            <Icon
              name={state.checked ? "check-square" : "square"}
              size={18}
              color={state.checked ? colors.primary : colors.textLight}
            />
            <View style={styles.itemTextContainer}>
              <Text style={[styles.itemName, { color: colors.text, textDecorationLine: state.checked ? 'line-through' : 'none' }]}>
                {item.name}
              </Text>
              <Text style={[styles.itemQty, { color: colors.textLight }]}>Qty: {item.qty}</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={[styles.responsibilityRow, { borderTopColor: colors.border, backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }]}>
          <Text style={[styles.responsibilityLabel, { color: colors.textLight }]}>Who will arrange?</Text>
          <View style={[styles.segmentedControl, { borderColor: colors.border, backgroundColor: isDark ? '#111' : '#F5F5F5' }]}>
            <TouchableOpacity
              style={[styles.segmentBtn, state.responsibility === 'yajman' && [styles.segmentActive, { backgroundColor: colors.primary }]]}
              onPress={() => setResponsibility(item.id, 'yajman')}
              activeOpacity={0.8}
            >
              <Text style={[styles.segmentText, state.responsibility === 'yajman' ? { color: '#FFF' } : { color: colors.textLight }]}>
                Yajman
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.segmentBtn, state.responsibility === 'pandit' && [styles.segmentActive, { backgroundColor: colors.primary }]]}
              onPress={() => setResponsibility(item.id, 'pandit')}
              activeOpacity={0.8}
            >
              <Text style={[styles.segmentText, state.responsibility === 'pandit' ? { color: '#FFF' } : { color: colors.textLight }]}>
                Pandit
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const samagriProgress = fullList.filter(item => itemStates[item.id]?.checked).length;

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <CustomHeader title="Samagri Planner" showBack={true} headerBgColor={colors.primary} headerTextColor="#FFF" />

      <View style={[styles.mainCard, { backgroundColor: colors.background }]}>

        {/* Configuration Section */}
        <View style={[styles.configSection, { backgroundColor: isDark ? colors.surface : '#FFF', borderBottomColor: colors.border }]}>
          <CustomDropdown
            label="Select Pooja"
            value={selectedPooja}
            options={POOJA_OPTIONS}
            onSelect={setSelectedPooja}
          />

          <View style={[styles.hawanToggleRow, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <View style={styles.hawanInfo}>
              <View style={[styles.hawanIconWrap, { backgroundColor: colors.primary + '15' }]}>
                <Icon name="sun" size={18} color={colors.primary} />
              </View>
              <Text style={[styles.hawanLabel, { color: colors.text }]}>Include Hawan Samagri?</Text>
            </View>
            <Switch
              value={includeHawan}
              onValueChange={setIncludeHawan}
              trackColor={{ false: colors.border, true: colors.primary + '80' }}
              thumbColor={includeHawan ? colors.primary : '#f4f3f4'}
            />
          </View>
        </View>

        {/* List Section */}
        <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>

          <View style={styles.listHeader}>
            <Text style={[styles.listTitle, { color: colors.text }]}>Samagri List</Text>
            <Text style={[styles.listSubtitle, { color: colors.textLight }]}>
              {samagriProgress} / {fullList.length} Collected
            </Text>
          </View>

          {currentSamagri.map(renderItem)}

          {includeHawan && (
            <View style={styles.hawanSectionGroup}>
              <View style={styles.hawanSectionTitleRow}>
                <Icon name="sun" size={18} color={colors.primary} />
                <Text style={[styles.hawanSectionTitle, { color: colors.primary }]}>Hawan Requirements</Text>
              </View>
              {HAWAN_SAMAGRI.map(renderItem)}
            </View>
          )}

          <View style={{ height: 20 }} />
        </ScrollView>

        {/* Bottom Bar for Sharing */}
        <View style={[styles.bottomBar, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
          <TouchableOpacity style={[styles.shareBtn, { backgroundColor: colors.primary }]} onPress={handleShareOptions} activeOpacity={0.8}>
            <Icon name="share-2" size={18} color="#FFF" />
            <Text style={styles.shareBtnText}>Share with Yajman</Text>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainCard: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  configSection: {
    padding: 12,
    paddingTop: 16,
    borderBottomWidth: 1,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    zIndex: 10,
  },
  hawanToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 0,
  },
  hawanInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hawanIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  hawanLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  listContent: {
    padding: 12,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  listTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  listSubtitle: {
    fontSize: 11,
    fontWeight: '600',
  },
  itemCard: {
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 10,
    overflow: 'hidden',
  },
  itemHeader: {
    padding: 10,
  },
  checkArea: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemTextContainer: {
    marginLeft: 10,
    flex: 1,
  },
  itemName: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 1,
  },
  itemQty: {
    fontSize: 11,
  },
  responsibilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  responsibilityLabel: {
    fontSize: 10,
    fontWeight: '500',
  },
  segmentedControl: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 6,
    overflow: 'hidden',
    height: 26,
  },
  segmentBtn: {
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  segmentActive: {
  },
  segmentText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  hawanSectionGroup: {
    marginTop: 8,
  },
  hawanSectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 6,
  },
  hawanSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  bottomBar: {
    padding: 12,
    paddingBottom: Platform.OS === 'ios' ? 20 : 12,
    borderTopWidth: 1,
  },
  shareBtn: {
    flexDirection: 'row',
    height: 42,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  shareBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 6,
  }
});

export default SamagriScreen;
