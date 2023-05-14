'use client';

import { FC, InputHTMLAttributes, ReactElement } from 'react';
type InputSizes = 'sm' | 'md' | 'lg';
type InputVariants = 'outline' | 'solid';
export interface InputProps extends InputHTMLAttributes<HTMLSelectElement> {
    placeholder: string;
    variant?: InputVariants;
options: any[];
    buttonSize?: InputSizes;
    label?: string;
    children?: ReactElement
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
export const SelectInput: FC<InputProps> = ({
    label,
    buttonSize = 'sm',
    variant = 'solid',
    className,
    options,
    children,
    ...props
}) => {
    return (
        <div className="flex flex-col w-full">
            {label && (
                <span className="text-sm text-primary font-semibold mb-2">
                    {label}
                </span>
            )}
            <select
                {...props}
                className={`flex placeholder:text-gray-600 placeholder: focus:outline-2 focus:outline-blue-500 flex-row align-middle justify-center ${
                    InputSizeMap[buttonSize]
                } ${InputVariantMap[variant]} ${className || ''}`}
            >
               {
                  options ? 
                  <>
                  <option value='' className='text-gray-600' disabled>{props.placeholder}</option>
                  
                {options.map((value) => (
                    <option className='text-sm font-semibold' key={`${label}-option-${value}`} value={value}>
                        {value}
                    </option>
                ))}
                  </> : 
                  null
               }{
                  !options && children ? children : null
               }
            </select>
        </div>
    );
};
