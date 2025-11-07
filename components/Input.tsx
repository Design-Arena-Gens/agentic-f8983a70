import { InputHTMLAttributes } from 'react';
import clsx from 'classnames';

export function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-gray-700 mb-1">{children}</label>;
}

export default function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={clsx(
        'w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500',
        className
      )}
    />
  );
}
