import { useCallback, useEffect, useRef } from 'react';

import Router from 'utils/router';
import { withApolloClient } from 'lib/apollo/hoc/withApolloClient';
import getReferralIdFromOrigin from 'lib/utils/getReferralIdFromOrigin';
import getQueryParams from 'lib/query/getQueryParams';
import { APPLY } from 'config/routes';
import { UUID, STEP, MODE, ORIGIN, REFERRAL_ID, TOS_URL } from 'config/constants/queryParams';

import ApplyTemplate from '../components/ApplyTemplate';

import { DEFAULT_STEP } from './config';
import { isOpenStep } from './helpers';
import ApplyContent from './ApplyContent';

const Apply = ({ location, termsOfServiceUrl }) => {
  const termsOfServiceUrlRef = useRef();

  useEffect(() => {
    if (location) {
      Router.push(location);
    }
  }, []);

  useEffect(() => {
    if (termsOfServiceUrl) {
      termsOfServiceUrlRef.current = termsOfServiceUrl;
    }
  }, [termsOfServiceUrl]);

  const resetForm = useCallback(({ referralId, mode }) => {
    Router.push(APPLY, { [STEP]: DEFAULT_STEP, [REFERRAL_ID]: referralId, [MODE]: mode });
  }, []);

  return (
    <ApplyTemplate content={<ApplyContent termsOfServiceUrl={termsOfServiceUrlRef.current} />} resetForm={resetForm} />
  );
};

Apply.getInitialProps = async (context) => {
  const { query } = context;
  const [uuid, step, referralId, mode, origin, termsOfServiceUrl] = getQueryParams(query ?? {}, [
    UUID,
    STEP,
    REFERRAL_ID,
    MODE,
    ORIGIN,
    TOS_URL,
  ]); // referralId is array
  const referralIdFromOrigin = mode === 'iframe' && origin && getReferralIdFromOrigin(origin, APPLY);

  if (!uuid && !isOpenStep(step?.toUpperCase(), DEFAULT_STEP)) {
    // eslint-disable-next-line no-nested-ternary
    const path = referralId ? `/${referralId}` : referralIdFromOrigin ? `/${referralIdFromOrigin}` : '';
    const location = `${APPLY}${path}?${STEP}=${DEFAULT_STEP}${mode ? `&${MODE}=${mode}` : ''}${
      origin ? `&${ORIGIN}=${origin}` : ''
    }`;

    return {
      location,
      termsOfServiceUrl,
    };
  }

  return { termsOfServiceUrl };
};

export default withApolloClient(Apply);
