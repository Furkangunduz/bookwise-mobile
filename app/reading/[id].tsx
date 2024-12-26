import {
  Annotation,
  Reader,
  ReaderProvider,
  useReader
} from '@epubjs-react-native/core';
import { useFileSystem } from '@epubjs-react-native/expo-file-system';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBookManagement } from '~/hooks/useBooksManagement';
import { Book } from '~/lib/type';
import { COLORS } from './components/AnnotationForm';
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

  return (
    <GestureHandlerRootView
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        backgroundColor: '#14161B',
      }}
    >
      {!isFullScreen && (
        <Header
          currentFontSize={currentFontSize}
          increaseFontSize={increaseFontSize}
          decreaseFontSize={decreaseFontSize}
          switchTheme={switchTheme}
          switchFontFamily={switchFontFamily}
          onPressSearch={() => searchListRef.current?.present()}
          onOpenBookmarksList={() => bookmarksListRef.current?.present()}
          onOpenTableOfContents={() => tableOfContentsRef.current?.present()}
          onOpenAnnotationsList={() => annotationsListRef.current?.present()}
        />
      )}

      <Reader
        src={book.uri}
        width={width}
        height={!isFullScreen ? height * 0.75 : height}
        fileSystem={useFileSystem}
        defaultTheme={myCustomTheme}
        initialLocation="introduction_001.xhtml"
        enableSwipe
        spread='always'
        onLocationChange={(totalLocations, currentLocation) => {
          // Handle location changes and manage content loading
          console.log('Location changed:', JSON.stringify({ totalLocations, currentLocation }, null,2));
        }}
        // initialAnnotations={[
        //   // Chapter 1
        //   {
        //     cfiRange: 'epubcfi(/6/10!/4/2/4,/1:0,/1:319)',
        //     data: {},
        //     sectionIndex: 4,
        //     styles: { color: '#00ff00' },
        //     cfiRangeText:
        //       'The pale Usher—threadbare in coat, heart, body, and brain; I see him now. He was ever dusting his old lexicons and grammars, with a queer handkerchief, mockingly embellished with all the gay flags of all the known nations of the world. He loved to dust his old grammars; it somehow mildly reminded him of his mortality.',
        //     type: 'highlight',
        //   },
        //   // Chapter 5
        //   {
        //     cfiRange: 'epubcfi(/6/22!/4/2/4,/1:80,/1:88)',
        //     data: {},
        //     sectionIndex: 3,
        //     styles: { color: '#CBA135' },
        //     cfiRangeText: 'landlord',
        //     type: 'highlight',
        //   },
        // ]}
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
                color: COLORS[2],
              });
              return true;
            },
          },
          {
            label: '🔴',
            action: (cfiRange) => {
              addAnnotation('highlight', cfiRange, undefined, {
                color: COLORS[0],
              });
              return true;
            },
          },
          {
            label: '🟢',
            action: (cfiRange) => {
              addAnnotation('highlight', cfiRange, undefined, {
                color: COLORS[3],
              });
              return true;
            },
          },
          {
            label: 'Add Note',
            action: (cfiRange, text) => {
              setSelection({ cfiRange, text });
              addAnnotation('highlight', cfiRange, { isTemp: true });
              annotationsListRef.current?.present();
              return true;
            },
          },
        ]}
        onDoublePress={() => setIsFullScreen((oldState) => !oldState)}
      />

      <BookmarksList
        ref={bookmarksListRef}
        onClose={() => bookmarksListRef.current?.dismiss()}
      />

      <SearchList
        ref={searchListRef}
        onClose={() => searchListRef.current?.dismiss()}
      />

      <TableOfContents
        ref={tableOfContentsRef}
        onClose={() => tableOfContentsRef.current?.dismiss()}
        onPressSection={(selectedSection) => {
          goToLocation(selectedSection.href.split('/')[1]);
          tableOfContentsRef.current?.dismiss();
        }}
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
        }}
      />

      {!isFullScreen && <Footer />}
    </GestureHandlerRootView>
  );
}

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
