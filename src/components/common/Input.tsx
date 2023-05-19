'use client';

import { FC, InputHTMLAttributes } from 'react';
type InputSizes = 'sm' | 'md' | 'lg';
type InputVariants = 'outline' | 'solid';
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    placeholder: string;
    variant?: InputVariants;
    buttonSize?: InputSizes;
    containerClassName?: string;
    label?: string;
    error?: string;
}

export const InputSizeMap: Record<InputSizes, string> = {
    sm: `h-8 px-3 text-sm font-medium rounded-sm`,
    md: `h-10 px-4 text-base font-medium rounded-md`,
    lg: `h-12 px-4 text-lg font-bold rounded-lg`,
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
    containerClassName,
    error,
    ...props
}) => {
    return (
        <div className={`flex flex-col w-full ${containerClassName || ''}`}>
            {label && (
                <span className="text-sm text-primary font-semibold mb-2">
                    {label}
                </span>
            )}
            <input
                {...props}
                className={`flex placeholder:text-gray-600 focus:outline-2 focus:outline-blue-500 flex-row align-middle justify-center ${
                    InputSizeMap[buttonSize]
                } ${InputVariantMap[variant]} ${className || ''} ${error ? 'border-red-600': ''}`}
            />
             
            <p className="text-[10px] mt-1 text-red-600">{error}</p> 
        </div>
    );
};
