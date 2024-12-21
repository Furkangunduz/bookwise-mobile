import { Reader, ReaderProvider, useReader } from '@epubjs-react-native/core';
import { useFileSystem } from '@epubjs-react-native/expo-file-system';
import { useEffect } from 'react';

/**
 * Extracts metadata from an EPUB file.
 * @param src The URI of the EPUB file.
 * @returns A promise that resolves with the metadata (or null if extraction fails).
 */
export const extractEpubMetadata = async (src: string): Promise<any> => {
  if (!src) {
    console.error('No source provided for EPUB file');
    return null;
  }

  return new Promise((resolve, reject) => {
    const ReaderToGetMetaData = () => {
      const { getMeta } = useReader();

      useEffect(() => {
        const meta = getMeta();
        if (meta) {
          resolve(meta);
        } else {
          reject(new Error('Failed to retrieve metadata'));
        }
      }, [getMeta]);

      return null; // Render nothing, as this is a metadata-only operation
    };

    const FileReaderComponent = () => (
      <ReaderProvider>
        <Reader
          src={src}
          width={0}
          height={0}
          fileSystem={useFileSystem}
          onFinish={(...props) => {
            console.log('onFinish', props);
          }}
        />
      </ReaderProvider>
    );

    const App = () => (
      <>
        <ReaderToGetMetaData />
        <FileReaderComponent />
      </>
    );

    App();
  });
};
