import re

with open('src/screens/HomeScreen.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Replace the return JSX
return_pattern = re.compile(r'  return \(\n    <View style=\{\[styles\.container, \{ paddingTop: insets\.top, backgroundColor: colors\.background \}\]\}>.*?    </View>\n  \);\n\};\n', re.DOTALL)

new_return = """  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={['#800000', '#5c0000']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.topHeaderGradient, { paddingTop: insets.top }]}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logoWhite}
              resizeMode="contain"
            />
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerIconBtnDark} onPress={toggleTheme}>
              <Icon name={isDark ? 'sun' : 'moon'} size={18} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerIconBtnDark}
              onPress={() => navigation.navigate('Notifications')}
            >
              <Icon name="bell" size={18} color="#FFF" />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>2</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIconBtnWhite}>
              <Icon name="user" size={18} color="#800000" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.greetingSection}>
          <Text style={styles.greetingTextWhite}>{t('home.namaste', 'नमस्ते,')} {user?.fullName || t('home.pandit_ji', 'पंडित जी')}</Text>
          <Text style={styles.greetingSubtextWhite}>{t('home.dharma_seva', 'धर्म सेवा ही परम सेवा है')}</Text>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Daily Spiritual Card */}
        <View style={[styles.spiritualCard, { backgroundColor: '#FFF5EE' }]}>
          <View style={styles.spiritualCardTopRow}>
            <View style={styles.spiritualContent}>
              <View style={styles.spiritualTag}>
                <Icon name="sun" size={12} color="#800000" />
                <Text style={styles.spiritualTagText}>{t('home.spiritual_card', 'Daily Spiritual Card')}</Text>
              </View>
              <Text style={styles.quoteText}>
                "Inner peace begins when you choose not to allow another person or event to control your emotions."
              </Text>
            </View>
            <Image
              source={require('../../logo.png')}
              style={styles.ganeshaImage}
              resizeMode="contain"
            />
          </View>

          <View style={styles.mantraContainer}>
            <Text style={styles.mantraLabel}>Today's Mantra</Text>
            <Text style={styles.mantraText}>Om Gam Ganapataye Namaha</Text>
          </View>
        </View>

        {/* Quick Actions / Grid */}
        <View style={styles.gridSection}>
          <View style={styles.gridSectionHeader}>
            <Text style={styles.gridSectionTitle}>{t('home.all_services', 'सभी सेवाएँ')}</Text>
            <View style={styles.gridSectionDivider} />
            <TouchableOpacity style={styles.sarveBhavantuBtn}>
              <Text style={styles.sarveBhavantuText}>{t('home.sarve_bhavantu', 'सर्वे भवन्तु सुखिनः')}</Text>
              <Icon name="chevron-right" size={14} color="#800000" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.quickActionsContainer}>
            {QUICK_ACTIONS.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.quickActionCard}
                onPress={() => navigation.navigate(item.screen)}
                activeOpacity={0.7}
              >
                <Icon name={item.icon as any} size={28} color="#800000" style={styles.quickActionIconImage} />
                <Text style={styles.quickActionLabel}>{t(`quick_actions.${item.labelKey}`)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Today's Panchang (Swapped order: Before Pooja) */}
        <View style={styles.panchangSection}>
          <TouchableOpacity
            style={styles.panchangMainCard}
            onPress={() => navigation.navigate('Panchang')}
            activeOpacity={0.8}
          >
            <View style={styles.panchangHeaderRow}>
              <Text style={styles.panchangMainTitle}>{t('home.todays_panchang', 'आज का पंचांग')}</Text>
              <View style={styles.panchangHeaderDivider} />
              <View style={styles.panchangDateInfo}>
                <Text style={styles.panchangDateTextTop}>
                  {panchang ? `${t(panchang.monthKey)}, ${t(panchang.pakshaKey)}` : t('home.mock_month_paksha', "मंगलवार, 15 अप्रैल 2025")}
                </Text>
                <Text style={styles.panchangDateTextBottom}>
                  {panchang ? t(panchang.tithiKey) : t('home.mock_tithi', "विक्रम संवत् 2082 | चैत्र शुक्ल पक्ष")}
                </Text>
              </View>
            </View>
            
            <View style={styles.panchangThreeCols}>
              <View style={styles.panchangCol}>
                <Icon name="calendar" size={26} color="#800000" />
                <Text style={styles.panchangColLabel}>{t('home.tithi', 'तिथि')}</Text>
                <Text style={styles.panchangColValue}>{panchang ? t(panchang.tithiKey) : 'अष्टमी'}</Text>
              </View>
              <View style={styles.panchangDividerVertical} />
              <View style={styles.panchangCol}>
                <Icon name="star" size={26} color="#800000" />
                <Text style={styles.panchangColLabel}>{t('home.nakshatra', 'नक्षत्र')}</Text>
                <Text style={styles.panchangColValue}>रोहिणी</Text>
              </View>
              <View style={styles.panchangDividerVertical} />
              <View style={styles.panchangCol}>
                <Icon name="moon" size={26} color="#800000" />
                <Text style={styles.panchangColLabel}>{t('home.rahu_kaal', 'राहु काल')}</Text>
                <Text style={styles.panchangColValue}>03:12 - 04:48</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Today's Pooja (Swapped order: After Panchang) */}
        <View style={styles.poojaSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.poojaTitleRow}>
              <Icon name="calendar" size={18} color="#800000" />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('home.todays_pooja')}</Text>
            </View>
            <TouchableOpacity style={styles.viewAllBtn}>
              <Text style={styles.viewAllText}>View All</Text>
              <Icon name="chevron-right" size={14} color="#800000" />
            </TouchableOpacity>
          </View>

          <View style={[styles.poojaCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Image
              source={require('../assets/images/onboarding_1.jpg')}
              style={styles.poojaImage}
              resizeMode="cover"
            />
            <View style={styles.poojaInfo}>
              <View style={styles.aajKaTag}>
                <Text style={styles.aajKaTagText}>{t('home.aaj_ka_karyakram')}</Text>
              </View>
              <Text style={[styles.poojaName, { color: colors.text }]}>Griha Pravesh</Text>
              <View style={styles.poojaDetailRow}>
                <Icon name="user" size={13} color={colors.textLight} />
                <Text style={[styles.poojaDetailText, { color: colors.textLight }]}>Sharma Family</Text>
              </View>
              <View style={styles.poojaDetailRow}>
                <Icon name="clock" size={13} color={colors.textLight} />
                <Text style={[styles.poojaDetailText, { color: colors.textLight }]}>10:30 AM</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.poojaArrowBtn}>
              <Icon name="chevron-right" size={18} color="#800000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Yajman Overview Card */}
        <View style={styles.yajmanSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.poojaTitleRow}>
              <Icon name="users" size={18} color="#800000" />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('home.yajman_overview', "Yajman Overview")}</Text>
            </View>
            <TouchableOpacity style={styles.viewAllBtn} onPress={toggleYajmanFilter}>
              <Text style={styles.viewAllText}>
                {yajmanFilter === 'today' ? t('home.today', "Today") : t('home.last_30_days', "Last 30 Days")} ▾
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.yajmanCard, { backgroundColor: '#FFF5EE' }]}
            onPress={() => navigation.navigate('YajmanList')}
            activeOpacity={0.8}
          >
            <View style={styles.yajmanStatsRow}>
              <View style={styles.yajmanStatItem}>
                <View style={[styles.statIconBg, { backgroundColor: 'rgba(34, 197, 94, 0.15)' }]}>
                  <Icon name="arrow-down-left" size={16} color="#22C55E" />
                </View>
                <Text style={styles.statLabel}>{t('home.income', "Income")}</Text>
                <Text style={[styles.statValue, { color: '#22C55E' }]}>{yajmanStats.income}</Text>
              </View>

              <View style={styles.statDivider} />

              <View style={styles.yajmanStatItem}>
                <View style={[styles.statIconBg, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
                  <Icon name="arrow-up-right" size={16} color="#EF4444" />
                </View>
                <Text style={styles.statLabel}>{t('home.expense', "Expense")}</Text>
                <Text style={[styles.statValue, { color: '#EF4444' }]}>{yajmanStats.expense}</Text>
              </View>

              <View style={styles.statDivider} />

              <View style={styles.yajmanStatItem}>
                <View style={[styles.statIconBg, { backgroundColor: 'rgba(128, 0, 0, 0.15)' }]}>
                  <Icon name="user-plus" size={16} color="#800000" />
                </View>
                <Text style={styles.statLabel}>{t('home.new_yajmans', "New Yajmans")}</Text>
                <Text style={[styles.statValue, { color: '#1E293B' }]}>{yajmanStats.newCount}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Upcoming Festivals */}
        <View style={styles.festivalSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.poojaTitleRow}>
              <Icon name="star" size={18} color="#800000" />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Upcoming Festivals</Text>
            </View>
          </View>

          <View style={[styles.festivalCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.festivalIconContainer}>
              <Icon name="droplet" size={20} color="#800000" />
            </View>
            <View style={styles.festivalInfo}>
              <Text style={[styles.festivalName, { color: colors.text }]}>Ganesh Chaturthi</Text>
              <Text style={[styles.festivalDate, { color: colors.textLight }]}>7 Sep 2025</Text>
            </View>
            <TouchableOpacity style={styles.viewDetailsBtn}>
              <Text style={styles.viewDetailsText}>View Details</Text>
              <Icon name="chevron-right" size={14} color="#800000" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
};
"""

content = return_pattern.sub(new_return, content)

# 2. Append styles
styles_to_append = """  topHeaderGradient: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingBottom: 24,
    marginBottom: 10,
    overflow: 'hidden',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6 },
      android: { elevation: 6 },
    }),
  },
  logoWhite: {
    width: 140,
    height: 50,
    tintColor: '#FFF',
  },
  headerIconBtnDark: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  headerIconBtnWhite: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  greetingTextWhite: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 10,
    marginLeft: 14,
  },
  greetingSubtextWhite: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    marginLeft: 14,
    marginTop: 4,
  },
  gridSection: {
    marginBottom: 16,
  },
  gridSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  gridSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#800000',
    marginRight: 10,
  },
  gridSectionDivider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E8D4B4',
  },
  sarveBhavantuBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    gap: 4,
  },
  sarveBhavantuText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#800000',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: '31.5%',
    backgroundColor: '#FFF5EE',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E8D4B4',
    alignItems: 'center',
    paddingVertical: 14,
    marginBottom: 10,
    ...Platform.select({
      ios: { shadowColor: '#C75B12', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
      android: { elevation: 2 },
    }),
  },
  quickActionIconImage: {
    marginBottom: 8,
  },
  panchangMainCard: {
    backgroundColor: '#FFF5EE',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8D4B4',
    ...Platform.select({
      ios: { shadowColor: '#C75B12', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8 },
      android: { elevation: 2 },
    }),
  },
  panchangHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  panchangMainTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#800000',
    marginRight: 10,
  },
  panchangHeaderDivider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E8D4B4',
  },
  panchangDateInfo: {
    alignItems: 'flex-end',
    marginLeft: 10,
  },
  panchangDateTextTop: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#800000',
  },
  panchangDateTextBottom: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 2,
  },
  panchangThreeCols: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  panchangCol: {
    alignItems: 'center',
    flex: 1,
  },
  panchangDividerVertical: {
    width: 1,
    height: 40,
    backgroundColor: '#E8D4B4',
  },
  panchangColLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#800000',
    marginTop: 6,
    marginBottom: 2,
  },
  panchangColValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1E293B',
    textAlign: 'center',
  },
"""

content = content.replace('});', styles_to_append + '\n});')

with open('src/screens/HomeScreen.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated HomeScreen.tsx successfully!")
