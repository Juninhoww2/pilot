import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  applySpec,
  compose,
  contains,
  find,
  head,
  path,
  propOr,
  pipe,
  prop,
  propEq,
  split,
} from 'ramda'
import { translate } from 'react-i18next'
import EmptyStateContainer from '../../containers/EmptyState'
import { withError } from '../ErrorBoundary'
import environment from '../../environment'

import { getAcquirersRequest as getAcquirersRequestAction } from '../Account/actions/actions'
import { selectCompanyFees, selectAnticipationType } from '../Account/actions/reducer'

const getUserName = pipe(prop('name'), split(' '), head)

const hasAdminPermission = propEq('permission', 'admin')

const getAccessKeys = applySpec({
  apiKey: path(['api_key', environment]),
  encryptionKey: path(['encryption_key', environment]),
})

const getAlreadyTransacted = propOr(true, 'alreadyTransacted')

const mapStateToProps = ({
  account: {
    acquirers,
    company,
    defaultRecipient,
    user,
  },
  welcome: {
    onboardingAnswers,
  },
}) => ({
  accessKeys: getAccessKeys(company),
  acquirers,
  alreadyTransacted: getAlreadyTransacted(company),
  anticipationType: selectAnticipationType({ company, defaultRecipient }),
  company,
  fees: selectCompanyFees({ company, defaultRecipient }),
  isAdmin: hasAdminPermission(user),
  onboardingAnswers,
  userName: getUserName(user),
})

const mapDispatchToProp = ({
  getAcquirersRequest: getAcquirersRequestAction,
})

const enhanced = compose(
  translate(),
  connect(
    mapStateToProps,
    mapDispatchToProp
  ),
  withError
)

const hideEmptyState = push => () => {
  localStorage.setItem('hide_empty-state', true)
  return push('/home')
}

const EmptyState = ({
  accessKeys,
  acquirers,
  anticipationType,
  fees,
  getAcquirersRequest,
  history: {
    push,
  },
  isAdmin,
  onboardingAnswers,
  t,
  userName,
}) => {
  useEffect(() => {
    getAcquirersRequest()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const isPixEnabled = !!find(
    pipe(
      propOr([], 'payment_methods'),
      contains('pix')
    )
  )(acquirers)

  return (
    <EmptyStateContainer
      apiKey={accessKeys.apiKey}
      encryptionKey={accessKeys.encryptionKey}
      environment={environment}
      fees={fees}
      isAdmin={isAdmin}
      isMDRzao={anticipationType === 'compulsory'}
      isPixEnabled={isPixEnabled}
      onboardingAnswers={onboardingAnswers}
      onDisableWelcome={hideEmptyState(push)}
      t={t}
      userName={userName}
    />
  )
}

EmptyState.propTypes = {
  accessKeys: PropTypes.shape({
    apiKey: PropTypes.string,
    encryptionKey: PropTypes.string,
  }),
  acquirers: PropTypes.arrayOf(PropTypes.shape()),
  anticipationType: PropTypes.string,
  fees: PropTypes.shape({
    anticipation: PropTypes.number,
    antifraud: PropTypes.number,
    boleto: PropTypes.number,
    gateway: PropTypes.number,
    installments: PropTypes.arrayOf(PropTypes.shape({
      installment: PropTypes.number.isRequired,
      mdr: PropTypes.number.isRequired,
    })),
    transfer: PropTypes.number,
  }),
  getAcquirersRequest: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  isAdmin: PropTypes.bool.isRequired,
  onboardingAnswers: PropTypes.shape({}),
  t: PropTypes.func.isRequired,
  userName: PropTypes.string,
}

EmptyState.defaultProps = {
  accessKeys: {},
  acquirers: [],
  anticipationType: '',
  fees: {},
  onboardingAnswers: undefined,
  userName: '',
}

export default enhanced(EmptyState)
