import Head from 'next/head';

export function AppHead(): JSX.Element {
  return (
    <Head>
      <title>Twitter</title>
      <meta name='og:title' content='Twitter' />
      <link rel='icon' href='/X.jpg' />
      <link rel='manifest' href='/site.webmanifest' key='site-manifest' />
      <meta name='description' content='Connect and share with Twitter' />
      <meta name='og:description' content='Connect and share with Twitter' />
    </Head>
  );
}
