import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Share, Switch, Platform, Alert } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import CustomHeader from '../components/CustomHeader';
import CustomDropdown from '../components/CustomDropdown';
import { Feather as Icon } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  const [selectedPooja, setSelectedPooja] = useState('Satyanarayan Pooja');
  const [includeHawan, setIncludeHawan] = useState(false);

  // State for checkboxes and responsibility. Defaults to Yajman organizing it.
  const [itemStates, setItemStates] = useState<Record<string, { checked: boolean, responsibility: 'pandit' | 'yajman' }>>({});

  const getPoojaLabel = (pooja: string) => {
    switch (pooja) {
      case 'Satyanarayan Pooja': return t('samagri.poojas.satyanarayan', 'Satyanarayan Pooja');
      case 'Griha Pravesh': return t('samagri.poojas.griha_pravesh', 'Griha Pravesh');
      case 'Vivah (Wedding)': return t('samagri.poojas.vivah', 'Vivah (Wedding)');
      case 'Namakaran': return t('samagri.poojas.namakaran', 'Namakaran');
      case 'Mundan': return t('samagri.poojas.mundan', 'Mundan');
      case 'Vastu Shanti': return t('samagri.poojas.vastu_shanti', 'Vastu Shanti');
      default: return pooja;
    }
  };

  const getItemName = (item: { id: string, name: string }) => {
    switch (item.id) {
      case '1': return t('samagri.items.kalash', item.name);
      case '2': return t('samagri.items.coconut', item.name);
      case '3': return t('samagri.items.supari', item.name);
      case '4': return t('samagri.items.haldi', item.name);
      case '5': return t('samagri.items.kumkum', item.name);
      case '6': return t('samagri.items.paan', item.name);
      case '7': return t('samagri.items.flowers', item.name);
      case '8': return t('samagri.items.fruits', item.name);
      case '9': return t('samagri.items.panchamrit', item.name);
      case '10': return t('samagri.items.prasad', item.name);
      case 'h1': return t('samagri.items.havan_kund', item.name);
      case 'h2': return t('samagri.items.mango_wood', item.name);
      case 'h3': return t('samagri.items.havan_mixture', item.name);
      case 'h4': return t('samagri.items.ghee', item.name);
      case 'h5': return t('samagri.items.navagraha_samidha', item.name);
      case 'h6': return t('samagri.items.camphor', item.name);
      default: return item.name;
    }
  };

  const poojaOptionsWithLabels = POOJA_OPTIONS.map(p => ({
    label: getPoojaLabel(p),
    value: p
  }));

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
    const poojaTitle = getPoojaLabel(selectedPooja);
    let message = `🕉️ *${poojaTitle} - ${t('samagri.list_title', 'Samagri List')}* 🕉️\n\n`;

    const panditItems: string[] = [];
    const yajmanItems: string[] = [];

    fullList.forEach(item => {
      const state = itemStates[item.id] || { checked: false, responsibility: 'yajman' };
      const itemName = getItemName(item);
      const line = `• ${itemName} × ${item.qty}${state.checked ? ` (${t('samagri.done', 'Done')} ✅)` : ''}`;
      if (state.responsibility === 'pandit') {
        panditItems.push(line);
      } else {
        yajmanItems.push(line);
      }
    });

    if (yajmanItems.length > 0) {
      message += `*${t('samagri.to_be_arranged_yajman', 'To be arranged by Yajman:')}*\n${yajmanItems.join('\n')}\n\n`;
    }
    if (panditItems.length > 0) {
      message += `*${t('samagri.pandit_bring', 'Panditji will bring:')}*\n${panditItems.join('\n')}\n\n`;
    }

    message += `_${t('samagri.shared_via', 'Shared via VipraSathi App')}_`;

    try {
      await Share.share({ message });
    } catch (error) {
      console.log(error);
    }
  };

  const handleShareOptions = () => {
    Alert.alert(
      t('samagri.share_title', 'Share Samagri List'),
      t('samagri.share_subtitle', 'How would you like to share the list with Yajman?'),
      [
        { text: t('samagri.whatsapp_text', 'WhatsApp Text'), onPress: handleShareWhatsApp },
        { text: t('samagri.branded_pdf', 'Branded PDF'), onPress: () => Alert.alert(t('samagri.coming_soon', 'Coming Soon'), t('samagri.coming_soon_msg', 'This export will be available in the next update.')) },
        { text: t('samagri.image', 'Image'), onPress: () => Alert.alert(t('samagri.coming_soon', 'Coming Soon'), t('samagri.coming_soon_msg', 'This export will be available in the next update.')) },
        { text: t('samagri.cancel', 'Cancel'), style: "cancel" }
      ]
    );
  };

  const renderItem = (item: { id: string, name: string, qty: string }, index: number) => {
    const state = itemStates[item.id] || { checked: false, responsibility: 'yajman' };
    const itemName = getItemName(item);

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
                {itemName}
              </Text>
              <Text style={[styles.itemQty, { color: colors.textLight }]}>{t('samagri.qty', 'Qty')}: {item.qty}</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={[styles.responsibilityRow, { borderTopColor: colors.border, backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }]}>
          <Text style={[styles.responsibilityLabel, { color: colors.textLight }]}>{t('samagri.who_arrange', 'Who will arrange?')}</Text>
          <View style={[styles.segmentedControl, { borderColor: colors.border, backgroundColor: isDark ? '#111' : '#F5F5F5' }]}>
            <TouchableOpacity
              style={[styles.segmentBtn, state.responsibility === 'yajman' && [styles.segmentActive, { backgroundColor: colors.primary }]]}
              onPress={() => setResponsibility(item.id, 'yajman')}
              activeOpacity={0.8}
            >
              <Text style={[styles.segmentText, state.responsibility === 'yajman' ? { color: '#FFF' } : { color: colors.textLight }]}>
                {t('samagri.yajman', 'Yajman')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.segmentBtn, state.responsibility === 'pandit' && [styles.segmentActive, { backgroundColor: colors.primary }]]}
              onPress={() => setResponsibility(item.id, 'pandit')}
              activeOpacity={0.8}
            >
              <Text style={[styles.segmentText, state.responsibility === 'pandit' ? { color: '#FFF' } : { color: colors.textLight }]}>
                {t('samagri.pandit', 'Pandit')}
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
      <CustomHeader title={t('samagri.header_title', 'Samagri Planner')} showBack={true} headerBgColor={colors.primary} headerTextColor="#FFF" />

      <View style={[styles.mainCard, { backgroundColor: colors.background }]}>

        {/* Configuration Section */}
        <View style={[styles.configSection, { backgroundColor: isDark ? colors.surface : '#FFF', borderBottomColor: colors.border }]}>
          <View style={styles.configRow}>
            {/* Pooja Dropdown */}
            <View style={styles.dropdownCol}>
              <CustomDropdown
                label={t('samagri.select_pooja', 'Select Pooja')}
                value={selectedPooja}
                options={poojaOptionsWithLabels}
                onSelect={setSelectedPooja}
                containerStyle={styles.dropdownContainer}
                triggerStyle={styles.dropdownTrigger}
              />
            </View>

            {/* Hawan Samagri Toggle */}
            <View style={styles.hawanCol}>
              <Text style={[styles.controlLabel, { color: colors.text }]}>{t('samagri.hawan_samagri', 'Hawan Samagri')}</Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setIncludeHawan(prev => !prev)}
                style={[
                  styles.hawanToggleCard,
                  {
                    backgroundColor: includeHawan
                      ? (isDark ? colors.primary + '22' : colors.primary + '12')
                      : (isDark ? 'rgba(255,255,255,0.03)' : colors.background),
                    borderColor: includeHawan ? colors.primary : colors.border,
                  },
                ]}
              >
                <View style={styles.hawanCardContent}>
                  <View
                    style={[
                      styles.hawanIconWrap,
                      {
                        backgroundColor: includeHawan ? colors.primary : colors.primary + '18',
                      },
                    ]}
                  >
                    <Icon name="sun" size={13} color={includeHawan ? '#FFF' : colors.primary} />
                  </View>
                  <Text
                    style={[
                      styles.hawanStatusText,
                      {
                        color: includeHawan ? colors.primary : colors.text,
                        fontWeight: includeHawan ? '700' : '500',
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {includeHawan ? t('samagri.added', 'Added') : t('samagri.include', 'Include')}
                  </Text>
                </View>

                <View pointerEvents="none" style={styles.switchContainer}>
                  <Switch
                    value={includeHawan}
                    onValueChange={setIncludeHawan}
                    trackColor={{ false: colors.border, true: colors.primary + '75' }}
                    thumbColor={includeHawan ? colors.primary : '#f4f3f4'}
                    style={
                      Platform.OS === 'ios'
                        ? { transform: [{ scaleX: 0.68 }, { scaleY: 0.68 }] }
                        : { transform: [{ scaleX: 0.78 }, { scaleY: 0.78 }] }
                    }
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* List Section */}
        <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>

          <View style={styles.listHeader}>
            <Text style={[styles.listTitle, { color: colors.text }]}>{t('samagri.list_title', 'Samagri List')}</Text>
            <Text style={[styles.listSubtitle, { color: colors.textLight }]}>
              {samagriProgress} / {fullList.length} {t('samagri.collected', 'Collected')}
            </Text>
          </View>

          {currentSamagri.map(renderItem)}

          {includeHawan && (
            <View style={styles.hawanSectionGroup}>
              <View style={styles.hawanSectionTitleRow}>
                <Icon name="sun" size={18} color={colors.primary} />
                <Text style={[styles.hawanSectionTitle, { color: colors.primary }]}>{t('samagri.hawan_requirements', 'Hawan Requirements')}</Text>
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
            <Text style={styles.shareBtnText}>{t('samagri.share_btn', 'Share with Yajman')}</Text>
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
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    zIndex: 10,
  },
  configRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  dropdownCol: {
    flex: 1.25,
  },
  dropdownContainer: {
    marginBottom: 0,
  },
  dropdownTrigger: {
    paddingHorizontal: 10,
    height: 44,
  },
  hawanCol: {
    flex: 1,
  },
  controlLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
    marginLeft: 4,
  },
  hawanToggleCard: {
    height: 44,
    borderWidth: 1,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  hawanCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 4,
  },
  hawanIconWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  hawanStatusText: {
    fontSize: 11,
    flexShrink: 1,
  },
  switchContainer: {
    justifyContent: 'center',
    alignItems: 'center',
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
