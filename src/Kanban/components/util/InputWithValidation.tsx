import { FieldError, UseFormRegisterReturn } from 'react-hook-form';

const InputWithValidation = (props: Props) => {
  const {
    darkEnabled = false,
    register,
    error,
    placeholder,
    label,
    defaultValue,
    readOnly,
    autoFocus,
    inputClass,
    type,
  } = props;
  return (
    <div>
      <label
        htmlFor={label}
        className={`text-sm tracking-wide}`}
        
      >
        {label}
      </label>
      <input style={{background:'var(--c-2)'}}
        id={label}
        defaultValue={defaultValue ?? ''}
        className={`mt-2 block w-full rounded-sm border-2 px-3 py-1 text-sm outline-none duration-200 focus:border-chakra-blue ${inputClass ?? ' border-transparent'} ${readOnly ? 'pointer-events-none' : ''}`}
        {...{ placeholder, readOnly, autoFocus, type }}
        {...register}
      />
      <span className='text-[13px] text-red-400'>{error?.message?.toString()}</span>
    </div>
  );
};

export default InputWithValidation;

type Props = {
  register: UseFormRegisterReturn;
  error: FieldError;
  placeholder?: string;
  label: string;
  defaultValue?: string;
  readOnly?: boolean;
  autoFocus?: boolean;
  darkEnabled?: boolean;
  inputClass?: string;
  type?: string;
};
