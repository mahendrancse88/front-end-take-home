import React from 'react';
import { useFormContext } from 'react-hook-form';

type FormInputProps = {
  label: string;
  name: string;
  type?: string;
  value?: string;
};

const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  type = 'text',
  value
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const update  = (e) => {
    
    value =e;
    console.log(value);
  }
  console.log(register(name))
  return (
    <div className=''>
      <label htmlFor={name} className='block text-ct-blue-600 mb-3'>
        {label}
      </label>
      <input
        type={type}
        placeholder=' '
        className='block w-full rounded-2xl appearance-none focus:outline-none py-2 px-4'
        {...register(name)}
        value ={value}
        onChange ={e=> update(e.target.value) }
      />
      {errors[name] &&  (
        <span className='text-red-500 text-xs pt-1 block'>
          {errors[name]?.message as string}
        </span>
      )}
    </div>
  );
};

export default FormInput;
