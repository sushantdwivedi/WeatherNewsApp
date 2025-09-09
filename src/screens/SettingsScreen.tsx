import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
// import { useAppContext } from '../context/AppProvider';
import { colors } from '../theme/colors';
import { NewsCategory, TemperatureUnit } from '../context/types';
import { useAppContext } from '../context/AppProvider';

const NEWS_CATEGORIES: NewsCategory[] = [
  'depressing',
  'fear',
  'winning',
  'happiness',
];

const SettingsScreen = () => {
  const { settings, setSettings } = useAppContext();
  const [tempUnit, setTempUnit] = useState<TemperatureUnit>(settings.temperatureUnit);
  const [selectedCategories, setSelectedCategories] = useState<NewsCategory[]>(settings.newsCategories);

  const toggleTempUnit = () => {
    const newUnit = tempUnit === 'celsius' ? 'fahrenheit' : 'celsius';
    setTempUnit(newUnit);
    setSettings((prev) => ({ ...prev, temperatureUnit: newUnit }));
  };

  const toggleCategory = (category: NewsCategory) => {
    let updatedCategories: NewsCategory[];
    if (selectedCategories.includes(category)) {
      updatedCategories = selectedCategories.filter((c) => c !== category);
    } else {
      updatedCategories = [...selectedCategories, category];
    }
    setSelectedCategories(updatedCategories);
    setSettings((prev) => ({ ...prev, newsCategories: updatedCategories }));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.header}>Settings</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Temperature Unit</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Celsius</Text>
          <Switch
            value={tempUnit === 'fahrenheit'}
            onValueChange={toggleTempUnit}
            thumbColor={colors.primary}
            trackColor={{ false: 'rgb(39,41,48)', true: '#81b0ff' }}
          />
          <Text style={styles.label}>Fahrenheit</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>News Categories</Text>
        {NEWS_CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category}
            style={styles.categoryRow}
            onPress={() => toggleCategory(category)}
            activeOpacity={0.7}
          >
            <Text style={styles.categoryText}>{category.charAt(0).toUpperCase() + category.slice(1)}</Text>
            <Switch
              value={selectedCategories.includes(category)}
              onValueChange={() => toggleCategory(category)}
              thumbColor={colors.primary}
              trackColor={{ false: 'rgb(39,41,48)', true: '#81b0ff' }}
            />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
    paddingTop: 40,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  section: {
    marginBottom: 30,
    padding: 16,
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    color: colors.textPrimary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },    
    label: {
    fontSize: 16,
    color: colors.textPrimary,
  },
    categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',    
    paddingVertical: 10,
  },
  categoryText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
});