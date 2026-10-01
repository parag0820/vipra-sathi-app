import re

with open('src/screens/HomeScreen.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Fix the Location.getCurrentPositionAsync broken edit
# The user inserted all the styles into getCurrentPositionAsync({ ... })
# We need to replace that with just getCurrentPositionAsync({})
pattern_location = re.compile(r'let location = await Location\.getCurrentPositionAsync\(\{.*?textAlign: \'center\',\n          \},\n\n        \}\);', re.DOTALL)
content = pattern_location.sub('let location = await Location.getCurrentPositionAsync({});', content)

# 2. Fix the broken JSX around lines 317-322 and update the header design
pattern_header = re.compile(r'<View style=\{styles\.headerRight\}>.*?<View style=\{styles\.greetingSection\}>', re.DOTALL)

new_header = """<View style={styles.headerRight}>
            <View style={{ alignItems: 'flex-end', marginRight: 10, marginTop: 4 }}>
              <Text style={{ color: '#FCE596', fontSize: 10, fontWeight: 'bold' }}>सनातन</Text>
              <Text style={{ color: '#FCE596', fontSize: 10, fontWeight: 'bold' }}>सेवा में सदैव</Text>
            </View>
            <View style={{ alignItems: 'center', marginRight: 10, marginTop: 4 }}>
              <Text style={{ color: '#FCE596', fontSize: 20, fontWeight: 'bold' }}>ॐ</Text>
            </View>
            <TouchableOpacity style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#E5C287', justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: '#FFF' }}>
              <Icon name="user" size={18} color="#5C0000" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.greetingSection, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingRight: 14 }]}>"""

content = pattern_header.sub(new_header, content)

# 3. Fix the Panchang Top Right Date alignment
pattern_panchang = re.compile(r'<View style=\{styles\.panchangHeaderDivider\} />\s*<View style=\{styles\.panchangDateInfo\}>\s*<Text style=\{styles\.panchangDateTextTop\}>\s*\{panchang \? `\$\{t\(panchang\.monthKey\)\}, \$\{t\(panchang\.pakshaKey\)\}` : t\(\'home\.mock_month_paksha\', "मंगलवार, 15 अप्रैल 2025"\)\}\s*</Text>\s*<Text style=\{styles\.panchangDateTextBottom\}>\s*\{panchang \? t\(panchang\.tithiKey\) : t\(\'home\.mock_tithi\', "विक्रम संवत् 2082 \| चैत्र शुक्ल पक्ष"\)\}\s*</Text>\s*</View>')

new_panchang = """<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginHorizontal: 8 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: '#E8D4B4' }} />
            <Icon name="sun" size={12} color="#E8D4B4" style={{ marginHorizontal: 4 }} />
            <View style={{ flex: 1, height: 1, backgroundColor: '#E8D4B4' }} />
          </View>
          <View style={[styles.panchangDateInfo, { alignItems: 'flex-end' }]}>
            <Text style={[styles.panchangDateTextTop, { textAlign: 'right' }]}>
              {panchang ? `${t(panchang.monthKey)}, ${t(panchang.pakshaKey)}` : t('home.mock_month_paksha', "मंगलवार, 15 अप्रैल 2025")}
            </Text>
            <Text style={[styles.panchangDateTextBottom, { textAlign: 'right' }]}>
              {panchang ? t(panchang.tithiKey) : t('home.mock_tithi', "विक्रम संवत् 2082 | चैत्र शुक्ल पक्ष")}
            </Text>
          </View>"""

content = pattern_panchang.sub(new_panchang, content)

# 4. Make sure logoWhite uses #FCE596 instead of #c9b12cff to look better if they want a golden logo
content = content.replace("tintColor: '#c9b12cff'", "tintColor: '#FCE596'")

with open('src/screens/HomeScreen.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated HomeScreen.tsx successfully!")
