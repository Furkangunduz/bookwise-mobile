import { Reader, ReaderProvider, useReader } from '@epubjs-react-native/core';
import { useFileSystem } from '@epubjs-react-native/expo-file-system';
import { FC, useEffect } from 'react';
import { Metadata } from '~/lib/type';

interface ReaderToGetMetaDataProps {
  src?: string | null;
  setMetaData: (meta: Metadata) => void;
}

// desc: This component is used to get metadata of the book from the epub file. It uses the Reader component from the @epubjs-react-native/core package. It will not shown on the screen as it is used to get metadata only.

const ReaderToGetMetaData: FC<ReaderToGetMetaDataProps> = ({ src, setMetaData }) => {
  if (!src) return null;
  const { getMeta } = useReader();

  useEffect(() => {
    const meta = getMeta();
    if (meta) {
      setMetaData(meta as Metadata);
    }
  }, [getMeta, setMetaData]);

  return (
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
};

export default ReaderToGetMetaData;
