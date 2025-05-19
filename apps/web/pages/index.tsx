import React from 'react';
import { CountdownView } from '@countdown-timer-app/ui'; // Ensure your monorepo setup allows this import
import Head from 'next/head';

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Countdown Timer</title>
        <meta name="description" content="A simple cross-platform countdown timer" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={webPageStyles.main}>
        <CountdownView initialSeconds={120} />
      </main>
    </>
  );
}

const webPageStyles = {
  main: {
    display: 'flex',
    flexDirection: 'column' as 'column', // Type assertion for TypeScript
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#e0e0e0',
  },
};
