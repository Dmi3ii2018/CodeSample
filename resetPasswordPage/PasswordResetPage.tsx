import { withApolloClient } from 'lib/apollo/hoc/withApolloClient';
import WithAuth from 'lib/auth/withAuth';
import getQueryParams from 'lib/query/getQueryParams';
import Router from 'utils/router';
import { NotifierProvider } from 'contexts/NotifierContext';
import { RESET_TOKEN } from 'config/constants/queryParams';
import { LOGIN, HOME } from 'config/routes';

import DefaultTemplate from 'components/ui/templates/DefaultTemplate/DefaultTemplate';
import Notifier from 'components/ui/atoms/Notifier';

import PasswordResetForm from './PasswordResetForm';

const PasswordResetPage = () => {
  return (
    <DefaultTemplate>
      <NotifierProvider>
        <PasswordResetForm />
        <Notifier />
      </NotifierProvider>
    </DefaultTemplate>
  );
};

type PasswordResetPageContext = {
  res: any;
  req: any;
  accessTokenManager: any;
};

PasswordResetPage.getInitialProps = ({ res, req, accessTokenManager }: PasswordResetPageContext) => {
  const { query } = req || {};
  const [resetToken] = getQueryParams(query, [RESET_TOKEN]);

  if (!resetToken) {
    return !!req && !!res ? res.redirect(302, LOGIN) : Router.push(LOGIN);
  }

  const accessToken = accessTokenManager.get().accessToken || null;

  if (accessToken) {
    return !!req && !!res ? res.redirect(302, HOME) : Router.push(HOME);
  }

  return {};
};

export default withApolloClient(WithAuth(PasswordResetPage));
