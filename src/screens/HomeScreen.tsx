// import React from 'react';
// import { View, Text, FlatList, StyleSheet, RefreshControl, ScrollView } from 'react-native';
// // import { useAppContext } from '../context/AppProvider';
// import WeatherCard from '../components/WeatherCard';
// import NewsCard from '../components/NewsCard';
// import LoadingIndicator from '../components/LoadingIndicator';
// import { colors } from '../theme/colors';
// import { useAppContext } from '../context/AppProvider';

// const HomeScreen = () => {
//   const { weather, news, settings, loading, refreshData } = useAppContext();

//   if (loading) return <LoadingIndicator />;

//   return (
//     <ScrollView style={{flex: 1, backgroundColor: colors.background}}>
//     <View style={styles.container}>
//       {weather && <WeatherCard weather={weather} unit={settings.temperatureUnit} />}

//       <Text style={styles.newsHeader}>News Headlines</Text>

//       <FlatList
//         data={news}
//         keyExtractor={(item, index) => item.url + index}
//         renderItem={({ item }) => <NewsCard article={item} />}
//         refreshControl={
//           <RefreshControl refreshing={loading} onRefresh={refreshData} />
//         }
//         ListEmptyComponent={<Text style={styles.emptyText}>No news available.</Text>}
//         contentContainerStyle={{ paddingBottom: 20 }}
//       />
//     </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.background,
//     paddingHorizontal: 16,
//     paddingTop: 40,
//   },
//   newsHeader: {
//     fontSize: 22,
//     fontWeight: '700',
//     marginTop: 20,
//     marginBottom: 10,
//     color: colors.textPrimary,
//   },
//   emptyText: {
//     textAlign: 'center',
//     marginTop: 20,
//     color: colors.textSecondary,
//   },
// });

// export default HomeScreen;




import React from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import WeatherCard from '../components/WeatherCard';
import NewsCard from '../components/NewsCard';
import LoadingIndicator from '../components/LoadingIndicator';
import { colors } from '../theme/colors';
import { useAppContext } from '../context/AppProvider';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = () => {
  const { weather, news, settings, loading, refreshData } = useAppContext();

  // Create combined data for single FlatList
  const createListData = () => {
    const sections = [];
    
    // Add weather section
    if (weather) {
      sections.push({
        id: 'weather',
        type: 'weather',
        data: weather,
      });
    }
    
    // Add news header
    sections.push({
      id: 'news-header',
      type: 'news-header',
    });
    
    // Add news items
    if (news && news.length > 0) {
      news.forEach((article, index) => {
        sections.push({
          id: `news-${index}`,
          type: 'news',
          data: article,
        });
      });
    } else {
      sections.push({
        id: 'news-empty',
        type: 'news-empty',
      });
    }
    
    return sections;
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    switch (item.type) {
      case 'weather':
        return (
          <View style={styles.weatherContainer}>
            <WeatherCard weather={item.data} unit={settings.temperatureUnit} />
          </View>
        );
      
      case 'news-header':
        return (
          <View style={styles.newsHeaderContainer}>
            <View style={styles.newsHeaderContent}>
              <View style={styles.newsHeaderLeft}>
                <View style={styles.newsIconContainer}>
                  <Ionicons name="newspaper" size={20} color={colors.primary} />
                </View>
                <Text style={styles.newsHeader}>Latest News</Text>
              </View>
              <View style={styles.newsHeaderBadge}>
                <Text style={styles.newsCount}>
                  {news?.length || 0}
                </Text>
              </View>
            </View>
            <Text style={styles.newsSubheader}>
              Stay updated with the latest headlines
            </Text>
          </View>
        );
      
      case 'news':
        return (
          <View style={styles.newsItemContainer}>
            <NewsCard article={item.data} />
          </View>
        );
      
      case 'news-empty':
        return (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <Ionicons name="newspaper-outline" size={48} color={colors.textSecondary} />
            </View>
            <Text style={styles.emptyTitle}>No News Available</Text>
            <Text style={styles.emptySubtitle}>
              Pull down to refresh and get the latest headlines
            </Text>
          </View>
        );
      
      default:
        return null;
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <LinearGradient
        colors={[colors.primary + '20', 'transparent']}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <Text style={styles.greeting}>Good {getTimeOfDayGreeting()}</Text>
          <Text style={styles.headerTitle}>Your Dashboard</Text>
        </View>
      </LinearGradient>
    </View>
  );

  const getTimeOfDayGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Morning';
    if (hour < 17) return 'Afternoon';
    return 'Evening';
  };

  if (loading && !weather && !news?.length) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <LoadingIndicator />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar backgroundColor={colors.primary} />
      <FlatList
        data={createListData()}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        refreshControl={
          <RefreshControl 
            refreshing={loading} 
            onRefresh={refreshData}
            tintColor={colors.primary}
            colors={[colors.primary]}
            progressBackgroundColor={colors.cardBackground}
          />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: 20,
  },
  headerGradient: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    marginHorizontal: -20,
  },
  headerContent: {
    alignItems: 'flex-start',
  },
  greeting: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  weatherContainer: {
    marginBottom: 8,
  },
  newsHeaderContainer: {
    marginVertical: 20,
  },
  newsHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  newsHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  newsIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  newsHeader: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  newsHeaderBadge: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    minWidth: 32,
    alignItems: 'center',
  },
  newsCount: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  newsSubheader: {
    fontSize: 15,
    color: colors.textSecondary,
    fontWeight: '400',
    marginLeft: 52,
  },
  newsItemContainer: {
    marginVertical: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.textSecondary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 280,
  },
  separator: {
    height: 0,
  },
});

export default HomeScreen;