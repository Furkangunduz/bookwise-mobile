/* eslint-disable @typescript-eslint/no-use-before-define */
import { Annotation, useReader } from '@epubjs-react-native/core';
import { BottomSheetView, TouchableOpacity } from '@gorhom/bottom-sheet';
import { Trash } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { contrast } from '../utils';

interface Props {
  annotation: Annotation;
  onPressAnnotation: (annotation: Annotation) => void;
  onRemoveAnnotation: (annotation: Annotation) => void;
}

function AnnotationItem({
  annotation,
  onPressAnnotation,
  onRemoveAnnotation,
}: Props) {
  const { theme } = useReader();
  return (
    <BottomSheetView key={annotation.cfiRange} className="flex-row items-center justify-between my-1">
      <View className="flex-row items-center">
        <View
          className="w-7 h-7 rounded-full mr-2.5 border border-solid"
          style={{
            backgroundColor: annotation.styles?.color,
            borderColor: contrast[theme.body.background],
          }}
        />

        <TouchableOpacity onPress={() => onPressAnnotation(annotation)}>
          {annotation.type === 'highlight' && (
            <Text
              className="font-semibold ml-1"
              style={{ color: contrast[theme.body.background] }}
            >
              {annotation.cfiRange}
            </Text>
          )}

          {annotation.type !== 'highlight' && (
            <Text
              className="font-semibold ml-1"
              style={{ color: contrast[theme.body.background] }}
            >
              {annotation.data?.observation}
            </Text>
          )}

          <Text
            className="italic flex-wrap max-w-[220px]"
            style={{ color: contrast[theme.body.background] }}
            numberOfLines={2}
          >
            &quot;{annotation.cfiRangeText}&quot;
          </Text>
        </TouchableOpacity>
      </View>

      <Button
        variant="ghost"
        size="icon"
        onPress={() => onRemoveAnnotation(annotation)}
      >
        <Trash className="h-5 w-5 text-red-500" />
      </Button>
    </BottomSheetView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  color: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 10,
    borderStyle: 'solid',
    borderWidth: 1,
  },
  cfiRange: {
    fontWeight: '600',
    marginLeft: 5,
  },
  cfiRangeText: {
    fontStyle: 'italic',
    flexWrap: 'wrap',
    maxWidth: 220,
  },
  observation: {
    fontWeight: '600',
    marginLeft: 5,
  },
});

export default AnnotationItem;
