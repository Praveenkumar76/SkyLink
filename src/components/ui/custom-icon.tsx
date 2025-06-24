import cn from 'clsx';

type IconProps = {
  className?: string;
  src?: string;
  alt?: string;
};

export function CustomIcon({ className, src, alt }: IconProps): JSX.Element {
  return (
    <img
      src={src ?? '/assets/twitter-avatar.jpg'}
      alt={alt ?? 'Icon'}
      className={className ?? 'h-6 w-6'}
    />
  );
}
