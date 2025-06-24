import { useAuth } from '@lib/context/auth-context';
import { NextImage } from '@components/ui/next-image';
import { Button } from '@components/ui/button';
// import { IconBrandGoogleFilled } from '@tabler/icons-react';
import { FaApple } from 'react-icons/fa';

export function LoginMain(): JSX.Element {
  const { signInWithGoogle } = useAuth() || {};

  return (
    <main>
      <div className='grid min-h-screen lg:grid-cols-[1fr,45vw]'>
        <div className='relative hidden items-center justify-center lg:flex'>
          <NextImage
            imgClassName='object-cover'
            blurClassName='bg-accent-blue'
            src='/assets/twitter-avatar.jpg'
            alt='Twitter banner'
            width={384}
            height={384}
            className='h-96 w-96'
            onError={(e) => {
              e.currentTarget.src = '/assets/twitter-icon.png';
            }}
          />
        </div>

        <div className='flex flex-col items-center justify-between gap-6 p-8 lg:items-start lg:justify-center'>
          <div className='mb-0 self-center lg:mb-10 lg:self-auto'>
            {/* <FcGoogle /> */}
            {/* <IconBrandGoogleFilled/> */}
          </div>

          <div className='font-twitter-chirp-extended flex max-w-xs flex-col gap-4 lg:max-w-none lg:gap-16'>
            <h1 className='text-3xl lg:text-6xl'>Happening now</h1>
            <h2 className='hidden text-xl lg:block lg:text-3xl'>
              Join Twitter today.
            </h2>
          </div>

          <div className='flex max-w-xs flex-col gap-6 [&_button]:py-2'>
            <div className='grid gap-3 font-bold'>
              <Button
                className='flex justify-center gap-2 border border-light-line-reply font-bold text-light-primary transition
                  hover:bg-[#e6e6e6] focus-visible:bg-[#e6e6e6] active:bg-[#cccccc] dark:border-0 dark:bg-white
                  dark:hover:brightness-90 dark:focus-visible:brightness-90 dark:active:brightness-75'
                onClick={signInWithGoogle}
              >
                {/* <FcGoogle /> Sign up with Google */}
              </Button>

              <Button
                className='flex justify-center gap-2 border border-light-line-reply font-bold text-light-primary transition
                  hover:bg-[#e6e6e6] focus-visible:bg-[#e6e6e6] active:bg-[#cccccc] dark:border-0 dark:bg-white
                  dark:hover:brightness-90 dark:focus-visible:brightness-90 dark:active:brightness-75'
                disabled
              >
                <FaApple /> Sign up with Apple
              </Button>

              <div className='grid w-full grid-cols-[1fr,auto,1fr] items-center gap-2'>
                <i className='border-b border-light-border dark:border-dark-border' />
                <p>or</p>
                <i className='border-b border-light-border dark:border-dark-border' />
              </div>

              <Button
                className='bg-accent-blue text-white transition hover:brightness-90
                  focus-visible:!ring-accent-blue/80 focus-visible:brightness-90 active:brightness-75'
                disabled
              >
                Sign up with phone or email
              </Button>

              <p className='text-center text-xs text-light-secondary dark:text-dark-secondary'>
                By signing up, you agree to the{' '}
                <a
                  href='https://twitter.com/tos'
                  target='_blank'
                  rel='noreferrer'
                  className='text-accent-blue underline'
                >
                  Terms of Service
                </a>{' '}
                and{' '}
                <a
                  href='https://twitter.com/privacy'
                  target='_blank'
                  rel='noreferrer'
                  className='text-accent-blue underline'
                >
                  Privacy Policy
                </a>
                , including{' '}
                <a
                  href='https://help.twitter.com/rules-and-policies/twitter-cookies'
                  target='_blank'
                  rel='noreferrer'
                  className='text-accent-blue underline'
                >
                  Cookie Use
                </a>
                .
              </p>
            </div>

            <div className='flex flex-col gap-3'>
              <p className='font-bold'>Already have an account?</p>
              <Button
                className='border border-light-line-reply font-bold text-accent-blue hover:bg-accent-blue/10
                  focus-visible:bg-accent-blue/10 focus-visible:!ring-accent-blue/80 active:bg-accent-blue/20
                  dark:border-light-secondary'
                onClick={signInWithGoogle}
              >
                Sign in
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
