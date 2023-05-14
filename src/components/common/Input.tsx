'use client';

import { FC, InputHTMLAttributes } from 'react';
type InputSizes = 'sm' | 'md' | 'lg';
type InputVariants = 'outline' | 'solid';
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    placeholder: string;
    variant?: InputVariants;
    buttonSize?: InputSizes;
    label?: string;
}

export const InputSizeMap: Record<InputSizes, string> = {
    sm: `py-1 px-3 text-sm font-medium rounded-md`,
    md: `py-3 px-5 text-base font-medium rounded-lg`,
    lg: `py-4 px-6 text-xl font-bold rounded-2xl`,
};
export const InputVariantMap: Record<InputVariants, string> = {
    outline: `hover:bg-primary-light text-primary border-2 border-primary`,
    solid: `hover:bg-primary-light bg-primary-light bg text-primary  border-primary hover:border-1 :hover:border-primary`,
};
export const Input: FC<InputProps> = ({
    label,
    buttonSize = 'sm',
    variant = 'solid',
    className,
    ...props
}) => {
    return (
        <div className="flex flex-col w-full">
            {label && (
                <span className="text-sm text-primary font-semibold mb-2">
                    {label}
                </span>
            )}
            <input
                {...props}
                className={`flex placeholder:text-gray-600 placeholder: focus:outline-2 focus:outline-blue-500 flex-row align-middle justify-center ${
                    InputSizeMap[buttonSize]
                } ${InputVariantMap[variant]} ${className || ''}`}
            />
        </div>
    );
};
