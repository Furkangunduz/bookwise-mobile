import {
  Section as SectionType,
  Toc,
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
import { StyleSheet, View } from 'react-native';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { COLORS } from '~/lib/colors';
import Section from './Section';

interface Props {
  onPressSection: (section: SectionType) => void;
  onClose: () => void;
}
export type Ref = BottomSheetModalMethods;

export const TableOfContents = forwardRef<Ref, Props>(
  ({ onPressSection, onClose }, ref) => {
    const { toc, section, theme } = useReader();

    const [searchTerm, setSearchTerm] = useState('');
    const [data, setData] = useState<Toc>(toc);

    const snapPoints = React.useMemo(() => ['50%', '90%'], []);

    const renderItem = React.useCallback(
      ({ item }: { item: SectionType }) => (
        <Section
          searchTerm={searchTerm}
          isCurrentSection={section?.id === item?.id}
          section={item}
          onPress={(_section) => {
            onPressSection(_section);
          }}
        />
      ),
      [onPressSection, searchTerm, section?.id]
    );

    const header = React.useCallback(
      () => (
        <View style={[styles.headerContainer, { backgroundColor: COLORS.background.primary }]}>
          <View style={styles.title}>
            <Text style={styles.headerText}>
              Table of Contents
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
              placeholder="Search chapters..."
              placeholderTextColor={COLORS.text.secondary}
              onSubmitEditing={(event) => {
                event.persist();
                setSearchTerm(event.nativeEvent?.text);
                setData(
                  toc.filter((elem) =>
                    new RegExp(event.nativeEvent?.text, 'gi').test(elem?.label)
                  )
                );
              }}
            />
          </View>
        </View>
      ),
      [onClose, searchTerm, toc]
    );

    return (
      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={ref}
          snapPoints={snapPoints}
          enablePanDownToClose
          style={styles.container}
          handleStyle={styles.handle}
          backgroundStyle={{ 
            backgroundColor: COLORS.background.primary,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
          }}
          handleIndicatorStyle={styles.handleIndicator}
          android_keyboardInputMode="adjustResize"
          onDismiss={onClose}
        >
          <BottomSheetFlatList
            data={data}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            ListHeaderComponent={header}
            style={styles.flatList}
            contentContainerStyle={styles.flatListContent}
            maxToRenderPerBatch={20}
          />
        </BottomSheetModal>
      </BottomSheetModalProvider>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    zIndex: 999999,
    elevation: 24,
    position: 'relative',
    backgroundColor: COLORS.background.primary,
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
  handle: {
    backgroundColor: COLORS.background.primary,
  },
  handleIndicator: {
    backgroundColor: COLORS.text.secondary,
    width: 40,
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
