import React from 'react';
// import { QueryClient, QueryClientProvider } from 'react-query';
import GlobalStyle from './GlobalStyle';
import Router from './shared/Router';
import Toaster from './toast';

import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
type AppProps = {};

const queryClient = new QueryClient();
const App: React.FC<AppProps> = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-center" />
      <GlobalStyle />
      <Router />
      <ReactQueryDevtools
        initialIsOpen={false}
        panelProps={{
          style: {
            backgroundColor: 'white',
          },
        }}
      />
    </QueryClientProvider>
  );
};
export default App;
