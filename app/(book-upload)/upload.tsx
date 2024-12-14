import { PlusSquare } from 'lucide-react-native';
import * as React from 'react';
import { Image, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '~/components/ui/button';

export default function UploadBook() {
  return (
    <SafeAreaView className='flex-1 items-center justify-center gap-10 bg-background px-10 font-inter'>
      <Image source={require('~/assets/images/book-upload.png')} style={{ width: 150, height: 150 }} />
      <Text className='text-center text-3xl font-bold text-white'> Upload your favorite book and start your journey!</Text>
      <Text className='text-center text-2xl font-light text-[#83899F]'>You can upload book in .EPUB format</Text>
      <Button size={'lg'} className='w-full rounded-2xl bg-[#8C31FF]'>
        <View className='w-full flex-row items-center justify-center gap-5'>
          <PlusSquare fill={'white'} stroke={'#8C31FF'} />
          <Text className='text-xl font-bold text-white'>Add new book</Text>
        </View>
      </Button>
    </SafeAreaView>
  );
}
