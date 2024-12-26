import {
  Annotation,
  Reader,
  ReaderProvider,
  useReader
} from '@epubjs-react-native/core';
import { useFileSystem } from '@epubjs-react-native/expo-file-system';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetProps } from '@gorhom/bottom-sheet';
import { useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBookManagement } from '~/hooks/useBooksManagement';
import { COLORS } from '~/lib/colors';
import { Book } from '~/lib/type';
import { AnnotationsList } from './components/AnnotationsList';
import { BookmarksList } from './components/BookmarksList';
import { SearchList } from './components/SearchList';
import { TableOfContents } from './components/TableOfContents';
import { Footer } from './components/footer';
import { Header } from './components/header';
import { availableFonts, MAX_FONT_SIZE, MIN_FONT_SIZE } from './utils';
import { createCustomTheme } from './utils/themes';

function Component({ book }: { book: Book }) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const myCustomTheme = React.useMemo(() => createCustomTheme({
    body: {
      background: '#1C1C1E',
      fontSize: '18px',
    },
    p: {
      lineHeight: '1.8',
    },
  }), []);

  const {
    theme,
    annotations,
    changeFontSize,
    changeFontFamily,
    changeTheme,
    goToLocation,
    addAnnotation,
    removeAnnotation,
  } = useReader();

  const bookmarksListRef = React.useRef<BottomSheetModal>(null);
  const searchListRef = React.useRef<BottomSheetModal>(null);
  const tableOfContentsRef = React.useRef<BottomSheetModal>(null);
  const annotationsListRef = React.useRef<BottomSheetModal>(null);

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentFontSize, setCurrentFontSize] = useState(14);
  const [currentFontFamily, setCurrentFontFamily] = useState(availableFonts[0]);
  const [tempMark, setTempMark] = React.useState<Annotation | null>(null);
  const [selection, setSelection] = React.useState<{
    cfiRange: string;
    text: string;
  } | null>(null);
  const [selectedAnnotation, setSelectedAnnotation] = React.useState<
    Annotation | undefined
  >(undefined);
  const [activeSheet, setActiveSheet] = useState<string | null>(null);

  const increaseFontSize = () => {
    if (currentFontSize < MAX_FONT_SIZE) {
      setCurrentFontSize(currentFontSize + 1);
      changeFontSize(`${currentFontSize + 1}px`);
    }
  };

  const decreaseFontSize = () => {
    if (currentFontSize > MIN_FONT_SIZE) {
      setCurrentFontSize(currentFontSize - 1);
      changeFontSize(`${currentFontSize - 1}px`);
    }
  };

  const switchTheme = React.useCallback(() => {
  //  const themeNames = ['dark', 'light', 'sepia'] as const;
  //   const currentIndex = themeNames.indexOf(theme?.name as typeof themeNames[number] || 'dark');
  //   const nextIndex = (currentIndex + 1) % themeNames.length;
  //   const nextThemeName = themeNames[nextIndex];
    
  //   changeTheme({
  //     name: nextThemeName,
  //     ...cust omThemes[nextThemeName]
  //   });
  }, [theme?.name, changeTheme]);

  const switchFontFamily = () => {
    const index = availableFonts.indexOf(currentFontFamily);
    const nextFontFamily = availableFonts[(index + 1) % availableFonts.length];

    setCurrentFontFamily(nextFontFamily);
    changeFontFamily(nextFontFamily);
  };

  const closeAllSheets = useCallback(() => {
    bookmarksListRef.current?.dismiss();
    searchListRef.current?.dismiss();
    tableOfContentsRef.current?.dismiss();
    annotationsListRef.current?.dismiss();
    setActiveSheet(null);
  }, []);

  const openSheet = useCallback((sheetName: string, ref: React.RefObject<BottomSheetModal>) => {
    if (activeSheet && activeSheet !== sheetName) {
      closeAllSheets();
      setTimeout(() => {
        ref.current?.present();
        setActiveSheet(sheetName);
      }, 100);
    } else {
      ref.current?.present();
      setActiveSheet(sheetName);
    }
  }, [activeSheet, closeAllSheets]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
        opacity={0.7}
      />
    ),
    []
  );

  const sheetProps: Partial<BottomSheetProps> = {
    snapPoints: ['60%'],
    index: 0,
    handleIndicatorStyle: styles.handleIndicator,
    backgroundStyle: styles.bottomSheetBackground,
    containerStyle: styles.bottomSheetContainer,
    backdropComponent: renderBackdrop,
    enablePanDownToClose: true,
    enableDynamicSizing: true,
    android_keyboardInputMode: 'adjustResize',
  };

  const HIGHLIGHT_COLORS = {
    yellow: COLORS.highlight.yellow,
    red: COLORS.highlight.red,
    green: COLORS.highlight.green,
  };

  return (
    <GestureHandlerRootView
      style={[styles.container, {
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }]}
    >
      {!isFullScreen && (
        <Header
          currentFontSize={currentFontSize}
          increaseFontSize={increaseFontSize}
          decreaseFontSize={decreaseFontSize}
          switchTheme={switchTheme}
          switchFontFamily={switchFontFamily}
          onPressSearch={() => openSheet('search', searchListRef)}
          onOpenBookmarksList={() => openSheet('bookmarks', bookmarksListRef)}
          onOpenTableOfContents={() => openSheet('toc', tableOfContentsRef)}
          onOpenAnnotationsList={() => openSheet('annotations', annotationsListRef)}
        />
      )}

      <View style={{ flex: 1, width: '100%', backgroundColor:theme?.body?.background   }}>
        <Reader
          src={book.uri}
          width={width}
          height={!isFullScreen ? height * 0.75 : height}
          fileSystem={useFileSystem}
          defaultTheme={myCustomTheme}
          enableSwipe
          spread='always'
          onLocationChange={(totalLocations, currentLocation) => {
            console.log('Location changed:', JSON.stringify({ totalLocations, currentLocation }, null,2));
          }}
          onAddAnnotation={(annotation) => {
            if (annotation.type === 'highlight' && annotation.data?.isTemp) {
              setTempMark(annotation);
            }
          }}
          onPressAnnotation={(annotation) => {
            setSelectedAnnotation(annotation);
            annotationsListRef.current?.present();
          }}
          menuItems={[
            {
              label: '🟡',
              action: (cfiRange) => {
                addAnnotation('highlight', cfiRange, undefined, {
                  color: HIGHLIGHT_COLORS.yellow,
                });
                return true;
              },
            },
            {
              label: '🔴',
              action: (cfiRange) => {
                addAnnotation('highlight', cfiRange, undefined, {
                  color: HIGHLIGHT_COLORS.red,
                });
                return true;
              },
            },
            {
              label: '🟢',
              action: (cfiRange) => {
                addAnnotation('highlight', cfiRange, undefined, {
                  color: HIGHLIGHT_COLORS.green,
                });
                return true;
              },
            },
            {
              label: 'Add Note',
              action: (cfiRange, text) => {
                setSelection({ cfiRange, text });
                addAnnotation('highlight', cfiRange, { isTemp: true });
                openSheet('annotations', annotationsListRef);
                return true;
              },
            },
          ]}
          onDoublePress={() => setIsFullScreen((oldState) => !oldState)}
        />
      </View>

      <View style={styles.footerContainer}>
        <Footer />
      </View>

      <View style={styles.bottomSheetsContainer}>
        <BookmarksList
          ref={bookmarksListRef}
          onClose={() => {
            bookmarksListRef.current?.dismiss();
            setActiveSheet(null);
          }}
          {...sheetProps}
        />

        <SearchList
          ref={searchListRef}
          onClose={() => {
            searchListRef.current?.dismiss();
            setActiveSheet(null);
          }}
          {...sheetProps}
        />

        <TableOfContents
          ref={tableOfContentsRef}
          onClose={() => {
            tableOfContentsRef.current?.dismiss();
            setActiveSheet(null);
          }}
          onPressSection={(selectedSection) => {
            goToLocation(selectedSection.href.split('/')[1]);
            tableOfContentsRef.current?.dismiss();
            setActiveSheet(null);
          }}
          {...sheetProps}
        />

        <AnnotationsList
          ref={annotationsListRef}
          selection={selection}
          selectedAnnotation={selectedAnnotation}
          annotations={annotations}
          onClose={() => {
            setTempMark(null);
            setSelection(null);
            setSelectedAnnotation(undefined);
            if (tempMark) removeAnnotation(tempMark);
            annotationsListRef.current?.dismiss();
            setActiveSheet(null);
          }}
          {...sheetProps}
        />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
  },
  bottomSheetBackground: {
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
  bottomSheetContainer: {
    zIndex: 9999,
    elevation: 9999,
  },
  handleIndicator: {
    backgroundColor: COLORS.text.secondary,
    width: 32,
    height: 4,
    borderRadius: 2,
    marginTop: 8,
  },
  footerContainer: {
    zIndex: 1,
  },
  bottomSheetsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    pointerEvents: 'box-none',
  },
});

export default function FullExample() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [book, setBook] = useState<Book>();
  const { findBookById } = useBookManagement();

  useEffect(() => {
    (
      async () => {
        const book = await findBookById(id);
        if (book) {
          setBook(book);
        }
      }
    )()
  }, []);
  
  return (
    <ReaderProvider>
      {book && 
      <Component book={book} />
      }
    </ReaderProvider>
  );
}
