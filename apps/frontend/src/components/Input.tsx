import React from 'react';
import { useController, UseControllerProps } from 'react-hook-form';
import { Input as AntdInput, Row, Tooltip, Col } from 'antd';
import { TextAreaProps as AntdTextAreaProps } from 'antd/lib/input/TextArea';
import { InputProps as AntdInputProps } from 'antd/lib/input/Input';
import { BiErrorCircle } from 'react-icons/bi';
import { AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai';

type InputPropsType = {
  name: string;
  defaultValue?: string | undefined;
  placeholder: string;
  /** To decide type of input field */
  type?: 'default' | 'password' | 'textArea';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rhfControllerProps: Omit<UseControllerProps<any>, 'name' | 'defaultValue'>;
  /** Custom styles for input box */
  customStyles?: React.CSSProperties;
  /** To decide if the field is valid or not */
  hasError?: boolean;
  /** Props for input field */
  antdInputProps?: Omit<
    AntdInputProps,
    'onChange' | 'value' | 'onBlur' | 'ref' | 'suffix'
  >;
  /** Function to be called on onChange if we want any custom logic, in addition to rhfOnChange*/
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  /** Props for input of type textArea */
  antdTextAreaProps?: Omit<
    AntdTextAreaProps,
    'onChange' | 'value' | 'onBlur' | 'ref'
  >;
  /** Function to be called on onBlur if we want any custom logic, in addition to rhfOnBlur*/
  onBlur?: (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
    value: string
  ) => void;
};

export const Input = ({
  name,
  defaultValue = undefined,
  placeholder,
  customStyles = {},
  type = 'default',
  rhfControllerProps,
  hasError = false,
  antdInputProps = {},
  onChange = undefined,
  antdTextAreaProps = {},
  onBlur = undefined,
}: InputPropsType) => {
  const {
    field: { onChange: rhfOnChange, onBlur: rhfOnBlur, ...rhfFields },
  } = useController({
    name,
    defaultValue,
    ...rhfControllerProps,
  });

  /** Common props which are used in all types of input i.e. (password, textArea and text input types) */
  const commonProps: Pick<
    AntdInputProps,
    'placeholder' | 'className' | 'style' | 'suffix'
  > & {
    onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    onBlur: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    'data-testid': string;
  } = {
    placeholder,
    onChange: (e) => {
      if (onChange) {
        onChange(e);
      }
      rhfOnChange(e.target.value);
    },
    className: `${hasError ? 'border-error' : 'py-[0.47rem] px-[0.75rem]'}`,
    style: { ...customStyles },
    suffix: (
      <Tooltip title="Required field">
        <BiErrorCircle
          style={
            hasError
              ? { color: 'var(--color-error)', fontSize: '1.2rem' }
              : { display: 'none' }
          }
        />
      </Tooltip>
    ),
    onBlur: (e) => {
      const inputValue = e.target.value; // Get the input value
      if (onBlur) {
        onBlur(e, inputValue); // Pass input value to onBlur function
      }
      rhfOnBlur();
    },
    'data-testid': name,
    ...rhfFields,
  };

  /** Const used to store Input password icon */
  const passwordIcon = (visible: boolean) => (
    <Row>
      {hasError ? (
        <Col>
          <Tooltip title="Required field">
            <BiErrorCircle
              style={{ color: 'var(--color-error)', fontSize: '1.2rem' }}
            />
          </Tooltip>
        </Col>
      ) : null}
      <Col>
        {visible ? (
          <AiOutlineEye color="var(--color-grey)" size={20} />
        ) : (
          <AiOutlineEyeInvisible color="var(--color-grey)" size={20} />
        )}
      </Col>
    </Row>
  );

  // Password input
  if (type === 'password') {
    return (
      <AntdInput.Password
        {...commonProps}
        {...antdInputProps}
        iconRender={passwordIcon}
        prefix={null}
      />
    );
  }

  // Textarea input
  if (type === 'textArea') {
    return <AntdInput.TextArea {...commonProps} {...antdTextAreaProps} />;
  }

  // Default text input
  return <AntdInput {...commonProps} {...antdInputProps} />;
};
