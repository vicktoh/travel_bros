'use client';

import { FC, InputHTMLAttributes, ReactElement } from 'react';
import { InputSizeMap } from './Input';
type InputSizes = 'sm' | 'md' | 'lg';
type InputVariants = 'outline' | 'solid';
export interface InputProps extends InputHTMLAttributes<HTMLSelectElement> {
    placeholder: string;
    variant?: InputVariants;
options: any[];
    buttonSize?: InputSizes;
    label?: string;
    children?: ReactElement;
    error?: string;
    containerClassName?: string;

}


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
    error,
    containerClassName,
    ...props
}) => {
    return (
        <div className={`flex flex-col w-full ${containerClassName || ''}`}>
            {label && (
                <span className="text-sm text-primary font-semibold mb-2">
                    {label}
                </span>
            )}
            <select
                {...props}
                className={`flex placeholder:text-gray-600 focus:outline-2 focus:outline-blue-500 flex-row align-middle justify-center ${
                    InputSizeMap[buttonSize]
                } ${InputVariantMap[variant]} ${className || ''} ${error ? 'border-red-600 border-2': ''}`}
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
        
                <p className="text-[10px]  mt-1 text-red-600">{error}</p>
        
        </div>
    );
};
