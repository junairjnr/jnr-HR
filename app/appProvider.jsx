'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { getUserContext } from './app_packages/tocken';

export default function AppProviders({ children }) {

  const router = useRouter();

  useEffect(() => {
    if (!getUserContext().token) {    
      router.push("login"); 
    } 
  }, [router]);

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
