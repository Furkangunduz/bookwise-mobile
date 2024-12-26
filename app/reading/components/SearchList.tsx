import {
  SearchResult as SearchResultType,
  useReader,
} from '@epubjs-react-native/core';
import {
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import React, { forwardRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { COLORS } from '~/lib/colors';
import SearchResult from './SearchResult';

interface Props {
  onClose: () => void;
}
export type Ref = BottomSheetModalMethods;

export const SearchList = forwardRef<Ref, Props>(({ onClose }, ref) => {
  const {
    searchResults,
    goToLocation,
    search,
    clearSearchResults,
    isSearching,
    addAnnotation,
    removeAnnotationByCfi,
  } = useReader();

  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState<SearchResultType[]>(searchResults.results);
  const [page, setPage] = useState(1);

  const renderItem = React.useCallback(
    ({ item }: { item: SearchResultType }) => (
      <SearchResult
        searchTerm={searchTerm}
        searchResult={item}
        onPress={(searchResult) => {
          goToLocation(searchResult.cfi);
          addAnnotation('highlight', searchResult.cfi);
          setTimeout(() => {
            removeAnnotationByCfi(searchResult.cfi);
          }, 3000);
          clearSearchResults();
          setPage(1);
          setData([]);
          onClose();
        }}
      />
    ),
    [
      addAnnotation,
      clearSearchResults,
      goToLocation,
      onClose,
      removeAnnotationByCfi,
      searchTerm,
    ]
  );

  const header = React.useCallback(
    () => (
      <View style={styles.headerContainer}>
        <View style={styles.title}>
          <Text style={styles.headerText}>
            Search Results
          </Text>

          <Button
            variant="ghost"
            onPress={onClose}
            style={styles.closeButton}
          >
            <Text style={styles.closeButtonText}>
              Close
            </Text>
          </Button>
        </View>

        <View style={styles.searchContainer}>
          <BottomSheetTextInput
            inputMode="search"
            returnKeyType="search"
            returnKeyLabel="Search"
            autoCorrect={false}
            autoCapitalize="none"
            defaultValue={searchTerm}
            style={styles.input}
            placeholder="Search in book..."
            placeholderTextColor={COLORS.text.secondary}
            onSubmitEditing={(event) => {
              setSearchTerm(event.nativeEvent.text);
              clearSearchResults();
              setData([]);
              setPage(1);
              search(event.nativeEvent.text, 1, 20);
            }}
          />
        </View>

        {isSearching && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>
              Searching results...
            </Text>
          </View>
        )}
      </View>
    ),
    [clearSearchResults, isSearching, onClose, search, searchTerm]
  );

  const footer = React.useCallback(
    () => (
      <View style={styles.footerContainer}>
        {isSearching && (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={COLORS.text.primary} />
            <Text style={styles.loadingText}>
              fetching results...
            </Text>
          </View>
        )}

        {data.length > 0 &&
          data.length === searchResults.totalResults &&
          !isSearching && (
            <Text style={styles.noMoreText}>
              No more results at the moment...
            </Text>
          )}
      </View>
    ),
    [data.length, isSearching, searchResults.totalResults]
  );

  const empty = React.useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          No results...
        </Text>
      </View>
    ),
    []
  );

  const handleClose = React.useCallback(() => {
    clearSearchResults();
    setPage(1);
    setData([]);
    onClose();
  }, [clearSearchResults, onClose]);

  const fetchMoreData = React.useCallback(() => {
    if (searchResults.results.length > 0 && !isSearching) {
      search(searchTerm, page + 1, 20);
      setPage(page + 1);
    }
  }, [isSearching, page, search, searchResults.results.length, searchTerm]);

  React.useEffect(() => {
    if (searchResults.results.length > 0) {
      setData((oldState) => [...oldState, ...searchResults.results]);
    }
  }, [searchResults]);

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={['60%']}
        enablePanDownToClose
        style={styles.container}
        handleStyle={styles.handle}
        backgroundStyle={styles.background}
        handleIndicatorStyle={styles.handleIndicator}
        android_keyboardInputMode="adjustResize"
        onDismiss={handleClose}
      >
        <BottomSheetFlatList<SearchResultType>
          data={data}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => item.cfi.concat(index.toString())}
          renderItem={renderItem}
          ListHeaderComponent={header}
          ListFooterComponent={footer}
          ListEmptyComponent={empty}
          style={styles.flatList}
          contentContainerStyle={styles.flatListContent}
          maxToRenderPerBatch={20}
          onEndReachedThreshold={0.2}
          onEndReached={fetchMoreData}
        />
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    zIndex: 999999,
    elevation: 24,
    position: 'relative',
  },
  background: {
    backgroundColor: COLORS.background.modal,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  headerContainer: {
    paddingTop: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background.secondary,
  },
  title: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerText: {
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.text.primary,
    letterSpacing: 0.35,
  },
  closeButton: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: COLORS.background.secondary,
  },
  closeButtonText: {
    fontSize: 16,
    color: COLORS.text.primary,
    opacity: 0.9,
  },
  searchContainer: {
    marginTop: 12,
    paddingHorizontal: 4,
  },
  input: {
    width: '100%',
    borderRadius: 12,
    fontSize: 16,
    lineHeight: 20,
    padding: 12,
    backgroundColor: COLORS.background.secondary,
    color: COLORS.text.primary,
  },
  loadingContainer: {
    marginTop: 12,
  },
  loadingText: {
    color: COLORS.text.secondary,
    fontStyle: 'italic',
    marginLeft: 8,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerContainer: {
    paddingVertical: 16,
  },
  noMoreText: {
    color: COLORS.text.secondary,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  emptyContainer: {
    padding: 16,
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.text.secondary,
    fontStyle: 'italic',
  },
  handle: {
    backgroundColor: COLORS.background.modal,
  },
  handleIndicator: {
    backgroundColor: COLORS.text.secondary,
    width: 32,
    height: 4,
    borderRadius: 2,
    marginTop: 8,
  },
  flatList: {
    width: '100%',
  },
  flatListContent: {
    paddingBottom: 24,
  },
});
