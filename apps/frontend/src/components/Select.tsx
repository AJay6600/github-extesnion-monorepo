import React from 'react';
import { UseControllerProps, useController } from 'react-hook-form';
import { Select as AntdSelect, SelectProps as AntdSelectPropType } from 'antd';

/** Type for mode of antd Select component, in multiple mode, we can select multiple options from the options list, in tag mode
 * also we can select multiple options, but additionally we can also add the new option which is not present in options list
 */
type SelectModeType = 'multiple' | 'tags';

/** Type for options data which we will be passed to option prop of Select component */
export type OptionsDataType = {
  /** Value which will be returned when the option is selected */
  value: string | number;
  /** Label for option in select dropdown */
  label: string | number;
};

type SelectPropsType = {
  name: string;
  defaultValue?: string | undefined;
  placeholder?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rhfControllerProps: Omit<UseControllerProps<any>, 'name' | 'defaultValue'>;
  customStyles?: React.CSSProperties;
  /** Props for antd Select component */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  antdSelectProps?: Omit<
    AntdSelectPropType<any>,
    'mode' | 'onChange' | 'value'
  >;
  /** To store the array of options, to be shown in select dropdown */
  options: Array<OptionsDataType>;
  /** Function to be called on onChange if we want any custom logic, in addition to rhfOnChange */
  onChange?: AntdSelectPropType<string | number | boolean>['onChange'];
  /** To set the mode of the select, it can be multiple or tags */
  mode?: SelectModeType;
  /** To decide if the field is valid or not */
  hasError?: boolean;
};

export const Select = ({
  name,
  defaultValue = undefined,
  placeholder = '',
  rhfControllerProps,
  customStyles = {},
  antdSelectProps = {},
  options,
  onChange = undefined,
  mode = undefined,
  hasError = false,
}: SelectPropsType) => {
  const {
    field: { onChange: rhfOnChange, ...rhfFields },
  } = useController({
    name,
    defaultValue,
    ...rhfControllerProps,
  });

  const onChangeHandler = (value: string | number | boolean) => {
    if (onChange) {
      onChange(value, options);
    }
    rhfOnChange(value);
  };

  return (
    <AntdSelect
      options={options}
      placeholder={placeholder}
      className={
        hasError
          ? 'border-[0.5px] border-error'
          : 'rounded-[5px] hover:border-primary'
      }
      style={{ width: '100%', ...customStyles }}
      mode={mode}
      onChange={onChangeHandler}
      {...rhfFields}
      {...antdSelectProps}
      data-testid={name}
    />
  );
};
