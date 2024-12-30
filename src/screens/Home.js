import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import Toast from 'react-native-toast-message'; // Import Toast
import { create } from 'zustand';

// Zustand store for click count
const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));

const HomeScreen = ({ route, navigation }) => {
  const [books, setBooks] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null); // State to handle errors
  const { username } = route.params;

  // Access Zustand store actions and state
  const { count, increment } = useStore();

  // Update navigation options in useEffect
  useEffect(() => {
    navigation.setOptions({
      title: `Welcome, ${username}`,
    });
  }, [navigation, username]);

  // Fetch books related to multiple subjects from Open Library API
  const fetchBooks = async () => {
    setLoading(true);

    const subjects = [
      'computer_science', 'mathematics', 'economics', 'management', 'statistics',
      'biology', 'chemistry', 'physics', 'history', 'philosophy', 'psychology',
      'literature', 'art', 'music', 'engineering', 'medicine', 'architecture',
      'sociology', 'law', 'business', 'education', 'astronomy', 'geography', 'anthropology',
    ];

    try {
      const fetchPromises = subjects.map((subject) =>
        fetch(`https://openlibrary.org/subjects/${subject}.json?limit=5`)
          .then((response) => response.json())
          .then((data) => {
            return data.works.map((book) => ({
              title: book.title,
              description: book.first_sentence ? book.first_sentence[0] : 'No description available.',
              author: book.authors.map((author) => author.name).join(', '),
              key: book.key,
              subject: subject,
              image: book.cover_id ? `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg` : null,
              status: Math.random() < 0.7 ? 'Available' : 'Not Available',
            }));
          })
      );

      const results = await Promise.all(fetchPromises);
      const allBooks = results.flat();
      setBooks(allBooks);
    } catch (error) {
      console.error('Error fetching books:', error);
      setError('Failed to load books. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        increment(); // Increment count in Zustand store
        Toast.show({
          type: 'success',
          position: 'top',
          text1: `Book Clicked: ${item.title}`,
          text2: 'You have explored this book.',
        });
      }}
    >
      <View style={styles.cardContent}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.bookImage} />
        ) : (
          <View style={styles.bookImage} />
        )}

        <View style={styles.textContent}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.author}>By: {item.author}</Text>
          <Text style={styles.description}>{item.description}</Text>
          <View
            style={[
              styles.statusTag,
              { backgroundColor: item.status === 'Available' ? '#d4edda' : '#f8d7da' },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: item.status === 'Available' ? '#155724' : '#721c24' },
              ]}
            >
              {item.status}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, padding: 10 }}>
      {loading ? (
        <ActivityIndicator size="large" color="#000" style={styles.loader} />
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={books}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.key}-${index}`}
          contentContainerStyle={styles.list}
        />
      )}

      {/* Floating Button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => {
          Toast.show({
            type: 'info',
            position: 'bottom',
            text1: `Total Books Explored: ${count}`,
          });
        }}
      >
        <Text style={styles.floatingButtonText}>{count}</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  textContent: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  author: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
  },
  description: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
  },
  statusTag: {
    marginTop: 10,
    padding: 5,
    borderRadius: 5,
    width: '40%',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#ff6347',
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  floatingButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    paddingBottom: 60,
  },
  errorContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f8d7da',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#f5c6cb',
  },
  errorText: {
    color: '#721c24',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default HomeScreen;
