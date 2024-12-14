import { Link, useRouter } from 'expo-router';
import * as React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icons } from '~/components/icons';
import { Button } from '~/components/ui/button';

const languages = [
  {
    icon: '🇺🇸',
    label: 'English',
  },
  {
    icon: '🇹🇷',
    label: 'Turkish',
  },
  {
    icon: '🇩🇪',
    label: 'German',
  },
  {
    icon: '🇪🇸',
    label: 'Spanish',
  },
  {
    icon: '🇫🇷',
    label: 'French',
  },
  {
    icon: '🇮🇹',
    label: 'Italian',
  },
];

export default function NativeLanguage() {
  const router = useRouter();

  return (
    <SafeAreaView className='flex-1 bg-background px-10 py-10'>
      <View className='flex-row gap-7'>
        <Link href={'..'} asChild>
          <Button size={'icon'} className='m-1 bg-white/10'>
            <Icons.ArrowLeftIcon stroke={'white'} size={18} />
          </Button>
        </Link>
        <Text className='text-3xl font-semibold text-foreground'>What language do you speak natively ?</Text>
      </View>
      <View className='mt-10 gap-4'>
        {languages.map((language) => (
          <Link href={'/(onboarding)/target-language'} asChild>
            <Button
              key={language.label}
              className='items-start justify-center rounded-lg border border-foreground/20 bg-black/5'
              size={'lg'}
            >
              <View className='flex-row items-center gap-3'>
                <Text className='text-3xl text-foreground'>{language.icon}</Text>
                <Text className='text-2xl text-foreground'>{language.label}</Text>
              </View>
            </Button>
          </Link>
        ))}
      </View>
    </SafeAreaView>
  );
}
