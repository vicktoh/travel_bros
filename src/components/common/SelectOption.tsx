import { Listbox, ListboxProps } from '@headlessui/react';
import React, { FC, ReactElement, useState } from 'react'
import { InputProps, InputSizeMap, InputVariantMap } from './Input';
type ValueType = {
   label: string;
   id: string;
};
type SelectOptionProps = {
   selected: ValueType;
   options: ValueType[];
   onSelectOption: (value: ValueType) => void;
   placeholder: string;
}
export const SelectOption: FC<InputProps & SelectOptionProps> = ({
    selected,
    options,
    onSelectOption,
    placeholder,
    buttonSize = 'sm',
    variant = 'solid',
    className,
    label,
    ...props
}) => {
   const [open, setOpen] = useState(false);
    return (
        <Listbox value={selected} onChange={onSelectOption}>
            <div className="flex flex-col">
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
                    readOnly
                    onClick={() => setOpen((open) => !open)}
                />
            </div>
            {open && (
                <ul data-headlessui-sate="open">
                    {options.map((option, i) => (
                        <Listbox.Option
                            key={`${option.label}-${i}`}
                            value={selected}
                            className={
                                option.id === selected.id
                                    ? 'bg-primary-light'
                                    : 'bg-white'
                            }
                        >
                            {option.label}
                        </Listbox.Option>
                    ))}
                </ul>
            )}
        </Listbox>
    );
};
