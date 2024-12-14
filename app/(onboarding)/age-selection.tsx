import { Link } from 'expo-router';
import * as React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icons } from '~/components/icons';
import { Button } from '~/components/ui/button';

const ageRanges = [
  { label: '10-15', min: 10, max: 15 },
  { label: '15-20', min: 15, max: 20 },
  { label: '20-40', min: 20, max: 35 },
  { label: '40+ ', min: 40, max: 110 },
];

export default function AgeSelection() {
  return (
    <SafeAreaView className='flex-1 bg-background px-10 py-10'>
      <View className='flex-row gap-7'>
        <Link href={'..'} asChild>
          <Button size={'icon'} className='m-1 bg-white/10'>
            <Icons.ArrowLeftIcon stroke={'white'} size={18} />
          </Button>
        </Link>
        <Text className='text-3xl font-semibold text-foreground'>What's your age?</Text>
      </View>
      <View className='mt-10 gap-4'>
        {ageRanges.map((range) => (
          <Link href={'/(onboarding)/native-language'} asChild>
            <Button key={range.label} className='items-start justify-center rounded-lg border border-foreground/20 bg-black/5' size={'lg'}>
              <Text className='text-xl text-white'>{range.label}</Text>
            </Button>
          </Link>
        ))}
      </View>
    </SafeAreaView>
  );
}
