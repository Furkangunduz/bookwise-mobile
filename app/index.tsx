import * as React from 'react';
import { Image, Text, View } from 'react-native';
import { Icons } from '~/components/icons';
import { Button } from '~/components/ui/button';

export default function Index() {
  return (
    <View className='flex-1 items-center gap-20 bg-[#14161B] py-6 font-inter'>
      <Image source={require('~/assets/images/intro-book-view.png')} style={{ width: 390, height: 420 }} />
      <View>
        <Text className='text-center text-5xl font-semibold text-white'>Learn language easily with books</Text>
        <Text className='mt-5 text-center text-2xl font-light text-[#83899F]'>
          Read favorite books in their original language with parallel translation
        </Text>
        <Button size={'default'} className='mt-14 flex-row items-center justify-center gap-3 rounded-2xl bg-[#8C31FF]'>
          <Icons.Book stroke={'white'} size={25} />
          <Text className='text-xl font-semibold text-white'> Get Started</Text>
        </Button>
      </View>
    </View>
  );
}
