/* eslint-disable @typescript-eslint/no-use-before-define */
import { Annotation, useReader } from '@epubjs-react-native/core';
import {
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import React, { forwardRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { COLORS } from '~/lib/colors';
import { Selection } from '../utils';
import AnnotationForm from './AnnotationForm';
import AnnotationItem from './AnnotationItem';

interface Props {
  selection: Selection | null;
  selectedAnnotation?: Annotation;
  annotations: Annotation[];
  onClose: () => void;
}
export type Ref = BottomSheetModalMethods;

export const AnnotationsList = forwardRef<Ref, Props>(
  ({ selection, selectedAnnotation, annotations, onClose }, ref) => {
    const { removeAnnotation, goToLocation } = useReader();

    const renderItem = React.useCallback(
      ({ item }: { item: Annotation }) => (
        <AnnotationItem
          annotation={item}
          onPressAnnotation={(annotation) => {
            goToLocation(annotation.cfiRange);
            onClose();
          }}
          onRemoveAnnotation={(annotation) => {
            if (annotation.data?.key) {
              const withMarkAnnotations = annotations.filter(
                ({ data }) => data.key === annotation.data.key
              );
              withMarkAnnotations.forEach((_annotation) =>
                removeAnnotation(_annotation)
              );
            } else {
              removeAnnotation(annotation);
            }
            onClose();
          }}
        />
      ),
      [annotations, goToLocation, onClose, removeAnnotation]
    );

    const header = React.useCallback(
      () => (
        <View style={styles.headerContainer}>
          <View style={styles.title}>
            <Text style={styles.headerText}>
              Annotations
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

          {(selection || selectedAnnotation) && (
            <View style={styles.formContainer}>
              <AnnotationForm
                annotation={selectedAnnotation}
                selection={selection}
                onClose={onClose}
              />
            </View>
          )}
        </View>
      ),
      [onClose, selectedAnnotation, selection]
    );

    return (
      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={ref}
          snapPoints={['60%']}
          enablePanDownToClose
          style={styles.container}
          handleStyle={styles.handle}
          backgroundStyle={styles.background}
          handleIndicatorStyle={styles.handleIndicator}
          android_keyboardInputMode="adjustResize"
          onDismiss={onClose}
        >
          <BottomSheetFlatList<Annotation>
            data={annotations.filter(
              (annotation) =>
                !annotation?.data?.isTemp && annotation.type !== 'mark'
            )}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.cfiRange}
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
  formContainer: {
    marginTop: 12,
    paddingHorizontal: 4,
    backgroundColor: COLORS.background.secondary,
    borderRadius: 12,
    padding: 16,
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
