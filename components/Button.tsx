import { ButtonHTMLAttributes } from 'react';
import clsx from 'classnames';

export default function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={clsx(
        'inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors',
        className
      )}
    />
  );
}
