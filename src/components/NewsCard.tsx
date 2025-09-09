// import React from 'react';
// import { View, Text, StyleSheet, Linking, TouchableOpacity } from 'react-native';
// import { NewsArticle } from '../api/newsApi';
// import { colors } from '../theme/colors';
// import { Ionicons } from '@expo/vector-icons';

// interface Props {
//   article: NewsArticle;
// }

// const NewsCard: React.FC<Props> = ({ article }) => {
//   const openLink = () => {
//     Linking.openURL(article.url);
//   };

//   return (
//     <TouchableOpacity style={styles.card} onPress={openLink} activeOpacity={0.7}>
//       <Text style={styles.title}>{article.title}</Text>
//       <Text style={styles.description} numberOfLines={3}>
//         {article.description}
//       </Text>
//       <View style={styles.footer}>
//         <Text style={styles.source}>{article.source}</Text>
//         <Ionicons name="open-outline" size={16} color={colors.primary} />
//       </View>
//     </TouchableOpacity>
//   );
// };

// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: colors.cardBackground,
//     borderRadius: 12,
//     padding: 16,
//     marginVertical: 8,
//     shadowColor: '#000',
//     shadowOpacity: 0.05,
//     shadowRadius: 5,
//     elevation: 2,
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: colors.textPrimary,
//   },
//   description: {
//     fontSize: 14,
//     color: colors.textSecondary,
//     marginVertical: 6,
//   },
//   footer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   source: {
//     fontSize: 12,
//     color: colors.textSecondary,
//   },
// });

// export default NewsCard;










import React from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import { NewsArticle } from '../api/newsApi';
import { colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  article: NewsArticle;
}

const NewsCard: React.FC<Props> = ({ article }) => {
  const openLink = () => {
    Linking.openURL(article.url);
  };

  const formatTimeAgo = (publishedAt?: string) => {
    if (!publishedAt) return '';
    
    const now = new Date();
    const published = new Date(publishedAt);
    const diffInHours = Math.floor((now.getTime() - published.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return published.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getSourceIcon = (source: string) => {
    const sourceLower = source.toLowerCase();
    if (sourceLower.includes('tech') || sourceLower.includes('verge') || sourceLower.includes('wired')) {
      return 'hardware-chip-outline';
    }
    if (sourceLower.includes('business') || sourceLower.includes('finance') || sourceLower.includes('bloomberg')) {
      return 'trending-up-outline';
    }
    if (sourceLower.includes('sport') || sourceLower.includes('espn')) {
      return 'football-outline';
    }
    if (sourceLower.includes('health') || sourceLower.includes('medical')) {
      return 'medical-outline';
    }
    return 'newspaper-outline';
  };

  const getSourceColor = (source: string) => {
    const sourceLower = source.toLowerCase();
    if (sourceLower.includes('tech')) return '#0066CC';
    if (sourceLower.includes('business')) return '#00AA44';
    if (sourceLower.includes('sport')) return '#FF6B35';
    if (sourceLower.includes('health')) return '#CC0066';
    return colors.primary;
  };

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={openLink} 
      activeOpacity={0.95}
    >
      {/* Content Container */}
      <View style={styles.content}>
        {/* Header with source badge */}
        <View style={styles.header}>
          <View style={[styles.sourceBadge, { backgroundColor: `${getSourceColor(article.source)}15` }]}>
            <Ionicons 
              name={getSourceIcon(article.source) as any} 
              size={12} 
              color={getSourceColor(article.source)} 
            />
            <Text style={[styles.sourceText, { color: getSourceColor(article.source) }]}>
              {article.source}
            </Text>
          </View>
          
          {article.publishedAt && (
            <Text style={styles.timeAgo}>
              {formatTimeAgo(article.publishedAt)}
            </Text>
          )}
        </View>

        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>
          {article.title}
        </Text>

        {/* Description */}
        <Text style={styles.description} numberOfLines={3}>
          {article.description}
        </Text>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.readMoreContainer}>
            <Text style={styles.readMoreText}>Read article</Text>
            <View style={styles.arrowContainer}>
              <Ionicons 
                name="arrow-forward" 
                size={14} 
                color={colors.primary} 
              />
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.shareButton}
            onPress={(e) => {
              e.stopPropagation();
              // Add share functionality here
            }}
          >
            <Ionicons name="share-outline" size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Accent border */}
      <View style={[styles.accentBorder, { backgroundColor: getSourceColor(article.source) }]} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    marginVertical: 8,
    marginHorizontal: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sourceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  sourceText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  timeAgo: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 24,
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 16,
    fontWeight: '400',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  readMoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  readMoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  arrowContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: `${colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: `${colors.textSecondary}10`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  accentBorder: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
});

export default NewsCard;