import { Reader, ReaderProvider, useReader } from '@epubjs-react-native/core';
import { useFileSystem } from '@epubjs-react-native/expo-file-system';
import { BlurView } from 'expo-blur';
import * as FileSystem from 'expo-file-system';
import { FC, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View, useWindowDimensions } from 'react-native';
import { COLORS } from '~/lib/colors';
import { Metadata } from '~/lib/type';
import { Text } from './ui/text';

interface ReaderToGetMetaDataProps {
  src?: string | null;
  setMetaData: (meta: Metadata) => void;
}

const loadingMessages = [
  "Analyzing your book...",
  "Extracting book details...",
  "Almost there...",
  "Preparing your reading experience...",
  "Organizing book information...",
];

const ReaderToGetMetaData: FC<ReaderToGetMetaDataProps> = ({ src, setMetaData }) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const { getMeta } = useReader();
  const { width } = useWindowDimensions();
  const [isReaderReady, setIsReaderReady] = useState(false);

  useEffect(() => {
    const messageTimer = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2000);

    return () => clearInterval(messageTimer);
  }, []);

  useEffect(() => {
    if (!src || !isReaderReady) return;

    const extractMetadata = async () => {
      try {
        // Wait a bit after Reader is ready before trying to get metadata
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        let retries = 0;
        let meta = getMeta();
        while (!meta && retries < 15) {
          await new Promise(resolve => setTimeout(resolve, 500));
          meta = getMeta();
          retries++;
          console.log('Retrying metadata extraction:', { retries, meta });
        }

        if (!meta) {
          console.warn('No metadata found after retries');
          setMetaData({
            cover: null,
            title: src.split('/').pop() || 'Unknown Title',
          });
          return;
        }


        const coverDir = `${FileSystem.documentDirectory}covers`;
        await FileSystem.makeDirectoryAsync(coverDir, { intermediates: true });

        let coverUri = null;
        if (meta.cover) {
          const coverFileName = `${Date.now()}_cover.jpg`;
          const coverPath = `${coverDir}/${coverFileName}`;

          try {
            // Handle different types of cover data
            let coverData: string;
            
            if (meta.cover instanceof ArrayBuffer) {
              coverData = Buffer.from(meta.cover).toString('base64');
            } else if (typeof meta.cover === 'string') {
              if (!meta.cover.startsWith('data:')) {
                // If it's raw binary data, convert it to base64
                coverData = Buffer.from(meta.cover, 'binary').toString('base64');
              } else {
                coverData = meta.cover;
              }
            } else {
              throw new Error('Unsupported cover data format');
            }

            // Ensure the data is properly formatted as a data URL
            if (!coverData.startsWith('data:')) {
              coverData = `data:image/jpeg;base64,${coverData}`;
            }

            await FileSystem.writeAsStringAsync(coverPath, coverData.split(',')[1], {
              encoding: FileSystem.EncodingType.Base64,
            });
            
            coverUri = `file://${coverPath}`;
          } catch (coverError) {
            console.error('Error saving cover:', coverError);
          }
        }

        const metadata: Metadata = {
          cover: coverUri,
          author: (meta as any).creator || (meta as any).author || null,
          title: meta.title || null,
          description: meta.description || null,
          language: meta.language || null,
          publisher: meta.publisher || null,
          rights: meta.rights || null,
        };

        setMetaData(metadata);
      } catch (error) {
        console.error('Error extracting metadata:', error);
        setMetaData({
          cover: null,
          title: src.split('/').pop() || 'Unknown Title',
        });
      }
    };

    extractMetadata();
  }, [src, getMeta, setMetaData, isReaderReady]);

  if (!src) return null;

  return (
    <>
      <View style={{ height: 1, opacity: 0, overflow: 'hidden' }}>
        <Reader
          src={src}
          width={width}
          height={100}
          fileSystem={useFileSystem}
          enableSwipe={false}
          onReady={() => {
            console.log('Reader is ready');
            setIsReaderReady(true);
          }}
        />
      </View>

      <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill}>
        <View style={styles.container}>
          <ActivityIndicator size="large" color={COLORS.text.primary} />
          <Text style={styles.loadingText}>{loadingMessages[messageIndex]}</Text>
        </View>
      </BlurView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  loadingText: {
    color: COLORS.text.primary,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ({
  src,
  setMetaData,
}: ReaderToGetMetaDataProps) => {
  return (
    <ReaderProvider>
      <ReaderToGetMetaData src={src} setMetaData={setMetaData} />
    </ReaderProvider>
  );
};
