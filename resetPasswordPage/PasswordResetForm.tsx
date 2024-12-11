import toString from 'lodash/toString';

import useUpdatePasswordMutation, { UpdatePasswordVariables } from 'api/mutation/auth/useUpdatePasswordMutation';

import getQueryParams from 'lib/query/getQueryParams';
import Router, { useRouterQuery } from 'utils/router';
import { RESET_TOKEN } from 'config/constants/queryParams';
import { SIGNIN } from 'config/routes';

import AutoForm from 'components/shared/organisms/Forms/AutoForm';
import Button from 'components/ui/atoms/Button';

import { StyledFormWrapper, StyledFormTitle } from './styled';
import { FORM_ID, FIELDS_INFO, FIELDS_ORDER, VALIDATION_FIELDS, UpdatePasswordValues } from './config';

const PasswordResetForm = () => {
  const query = useRouterQuery();
  const [resetToken] = getQueryParams(query, [RESET_TOKEN]);

  const [updatePassword, { loading }] = useUpdatePasswordMutation({
    onCompleted: () => {
      Router.push(SIGNIN);
    },
  });

  const onSubmit = (values: UpdatePasswordValues) => {
    updatePassword({
      variables: {
        ...values,
        [UpdatePasswordVariables.ResetToken]: toString(resetToken),
      },
    });
  };

  return (
    <StyledFormWrapper>
      <StyledFormTitle id="passwordResetFormTitle" data-testid="password-reset-title">
        Create New Password
      </StyledFormTitle>
      <AutoForm
        formId={FORM_ID}
        fieldsInfo={FIELDS_INFO}
        validationFields={VALIDATION_FIELDS}
        fieldsOrder={FIELDS_ORDER}
        onSubmit={onSubmit}
        reactive={false}
        columns={1}
      />
      <Button disabled={loading} variant="contained" type="submit" form={FORM_ID} data-testid="save-password-button">
        Save
      </Button>
    </StyledFormWrapper>
  );
};

export default PasswordResetForm;
