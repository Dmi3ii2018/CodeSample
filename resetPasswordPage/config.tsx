import { UpdatePasswordVariables } from 'api/mutation/auth/useUpdatePasswordMutation';

import { YUP_NULLABLE_REQUIRED } from 'config/constants/yup';

import Input from 'components/ui/atoms/forms/Input';

export const FORM_ID = 'PasswordResetForm';

export enum UpdatePasswordInfoFields {
  Password = 'password',
}

export type UpdatePasswordValues = {
  [UpdatePasswordVariables.Password]: string;
};

export const FIELDS_INFO = {
  [UpdatePasswordInfoFields.Password]: {
    control: <Input />,
    id: UpdatePasswordInfoFields.Password,
    name: UpdatePasswordVariables.Password,
    label: 'Password',
    placeholder: '',
    type: 'password',
    'data-testid': 'new-password-field',
  },
};

export const VALIDATION_FIELDS = {
  [UpdatePasswordInfoFields.Password]: YUP_NULLABLE_REQUIRED,
};

export const FIELDS_ORDER = [UpdatePasswordInfoFields.Password];
