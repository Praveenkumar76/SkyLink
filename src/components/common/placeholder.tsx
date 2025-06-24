import { CustomIcon } from '@components/ui/custom-icon';
import { SEO } from './seo';

export function Placeholder(): JSX.Element {
  return (
    <main className='flex min-h-screen items-center justify-center'>
      <SEO
        title='Twitter'
        description='Connect and share with Twitter - Your social platform for meaningful connections.'
        image='/home.png'
      />
      <i>
        <CustomIcon className='h-20 w-20' src='/X.jpg' alt='Twitter' />
      </i>
    </main>
  );
}
