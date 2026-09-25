import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import CustomHeader from '../components/CustomHeader';
import { Feather as Icon } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SubscriptionScreen = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const renderFeatureList = (title: string, features: string[], included: boolean) => {
    if (!features || features.length === 0) return (
      <View style={styles.featureGroup}>
        <Text style={[styles.featureListTitle, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.featureText, { color: colors.textLight, fontStyle: 'italic' }]}>None</Text>
      </View>
    );

    return (
      <View style={styles.featureGroup}>
        <Text style={[styles.featureListTitle, { color: colors.text }]}>{title}</Text>
        {features.map((feature, idx) => (
          <View key={idx} style={styles.featureRow}>
            <Icon
              name={included ? "check-circle" : "x-circle"}
              size={12}
              color={included ? "#10B981" : "#EF4444"}
              style={{ marginTop: 2 }}
            />
            <Text style={[
              styles.featureText,
              { color: included ? colors.text : colors.textLight, textDecorationLine: included ? 'none' : 'line-through' }
            ]}>
              {feature}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const renderPlanCard = (
    name: string,
    price: string,
    badgeColor: string,
    included: string[],
    notIncluded: string[],
    idealFor: string,
    isPopular: boolean = false
  ) => (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: isPopular ? colors.primary : colors.border, borderWidth: isPopular ? 2 : 1 }]}>
      {isPopular && (
        <View style={[styles.popularBadge, { backgroundColor: colors.primary }]}>
          <Text style={styles.popularText}>Most Popular</Text>
        </View>
      )}

      <View style={styles.cardHeader}>
        <View style={[styles.planBadge, { backgroundColor: badgeColor }]} />
        <Text style={[styles.planName, { color: colors.text }]}>{name}</Text>
      </View>

      <View style={styles.priceContainer}>
        <Text style={[styles.price, { color: colors.primary }]}>{price}</Text>
        <Text style={[styles.priceSubtitle, { color: colors.textLight }]}>/ Month</Text>
      </View>

      <TouchableOpacity style={[styles.subscribeBtn, { backgroundColor: isPopular ? colors.primary : colors.surface, borderColor: colors.primary, borderWidth: 1 }]}>
        <Text style={[styles.subscribeBtnText, { color: isPopular ? '#FFF' : colors.primary }]}>Select Plan</Text>
      </TouchableOpacity>

      <View style={styles.divider} />

      {/* Features Side by Side */}
      <View style={styles.featuresContainer}>
        <View style={styles.featureColumn}>
          {renderFeatureList('Includes', included, true)}
        </View>
        <View style={styles.featureColumn}>
          {renderFeatureList('Not Included', notIncluded, false)}
        </View>
      </View>

      <View style={[styles.idealForContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.idealForTitle, { color: colors.text }]}>Ideal For:</Text>
        <Text style={[styles.idealForText, { color: colors.textLight }]}>{idealFor}</Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingBottom: insets.bottom }]}>
      <CustomHeader title="Subscription Plans" showBack={true} />
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {renderPlanCard(
          "Vipra Saarthi Basic",
          "₹51",
          "#10B981", // Green
          [
            "Pooja Library",
            "Stotram Library",
            "Availability Calendar",
            "Community Access",
            "Work & Activity History"
          ],
          [
            "Branded PDF Generation",
            "Kundali Generation",
            "Kundali Matching",
            "Muhurt",
            "Panchang"
          ],
          "Pandits who primarily require Pooja references, Stotrams, booking management, and community access."
        )}

        {renderPlanCard(
          "Vipra Saarthi Plus",
          "₹201",
          "#3B82F6", // Blue
          [
            "Everything in Basic",
            "Muhurt",
            "Panchang",
            "Branded PDF Generation"
          ],
          [
            "Kundali Generation",
            "Kundali Matching"
          ],
          "Pandits who regularly perform rituals and ceremonies requiring Panchang, Muhurt, and branded reports.",
          true
        )}

        {renderPlanCard(
          "Vipra Saarthi Pro",
          "₹351",
          "#8B5CF6", // Purple
          [
            "Everything in Plus",
            "Kundali Generation",
            "Kundali Matching",
            "Complete Pooja & Stotram Library",
            "Community & Availability Calendar",
            "Complete Work History",
            "Branded PDF Generation for All Modules"
          ],
          [],
          "Professional Pandits running a complete digital practice who need full access to every premium tool and branded report."
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    position: 'relative',
    overflow: 'hidden',
  },
  popularBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderBottomLeftRadius: 12,
  },
  popularText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  planBadge: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  planName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  priceSubtitle: {
    fontSize: 12,
    marginBottom: 4,
    marginLeft: 4,
  },
  subscribeBtn: {
    width: '100%',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  subscribeBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginBottom: 10,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  featureColumn: {
    flex: 1,
    paddingRight: 8,
  },
  featureGroup: {
    marginBottom: 8,
  },
  featureListTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  featureText: {
    fontSize: 11,
    marginLeft: 6,
    flex: 1,
    lineHeight: 16,
  },
  idealForContainer: {
    marginTop: 4,
    padding: 12,
    borderRadius: 8,
  },
  idealForTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  idealForText: {
    fontSize: 11,
    lineHeight: 16,
  }
});

export default SubscriptionScreen;
