import { Link, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icons } from '~/components/icons';
import { Button } from '~/components/ui/button';
import { isOnboardingCompleted } from '~/lib/onboarding';

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const completed = await isOnboardingCompleted();
        
        if (completed) {
          router.push('/library');
        }
      } catch (error) {
        console.error('Error initializing app:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, [router]);

  if (loading) {
    return (
      <SafeAreaView className='flex-1 items-center justify-center bg-background'>
        <ActivityIndicator size='large' color='#8C31FF' />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className='flex-1 items-center gap-20 bg-background font-inter'>
      <Image source={require('~/assets/images/intro-book-view.png')} style={{ width: 390, height: 350 }} />
      <View className='flex-1 justify-between pb-10'>
        <View>
          <Text className='text-center text-5xl font-semibold text-white'>Learn language easily with books</Text>
          <Text className='mt-5 text-center text-2xl font-light text-[#83899F]'>
            Read favorite books in their original language with parallel translation
          </Text>
        </View>
        <Link href={'/(onboarding)/age-selection'} asChild>
          <Button size={'default'} className='flex-row items-center justify-center gap-3 rounded-2xl bg-[#8C31FF]'>
            <Icons.Book stroke={'white'} size={25} />
            <Text className='text-xl font-semibold text-white'> Get Started</Text>
          </Button>
        </Link>
      </View>
    </SafeAreaView>
  );
}
