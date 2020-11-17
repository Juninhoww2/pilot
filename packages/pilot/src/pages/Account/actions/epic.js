import pagarme from 'pagarme'
import {
  complement,
  identity,
  isEmpty,
  path,
  pathOr,
  propEq,
} from 'ramda'
import {
  map,
  mergeMap,
  tap,
} from 'rxjs/operators'
import { of as rxOf } from 'rxjs'
import { combineEpics, ofType } from 'redux-observable'
import cockpit from 'cockpit'
import env from '../../../environment'
import identifyUser from '../../../vendor/identifyUser'
import setCompany from '../../../vendor/setCompany'
import { zopimAddTags, zopimClearAll } from '../../../vendor/zopim'
import {
  ACCOUNT_RECEIVE,
  COMPANY_RECEIVE,
  failLogin,
  LOGIN_RECEIVE,
  LOGIN_REQUEST,
  LOGOUT_REQUEST,
  RECIPIENT_RECEIVE,
  receiveAccount,
  receiveCompany,
  receiveLogin,
  receiveLogout,
  receiveRecipientBalance,
  receiveRecipient,
  receiveFeePreset,
  GET_ACQUIRERS_REQUEST,
  getAcquirersResponse,
} from './actions'

import store from '../../../configureStore'

import { WITHDRAW_RECEIVE } from '../../Withdraw/actions'
import { receiveError } from '../../ErrorBoundary'
import {
  activeCompanyLogin,
  paymentLinkCompanyLogin,
  inactiveCompanyLogin,
} from '../../../vendor/googleTagManager'

import isPaymentLink from '../../../validation/isPaymentLink'

const isActiveCompany = propEq('status', 'active')
const isSelfRegister = propEq('type', 'self_register')
const isPendingRiskAnalysis = propEq('status', 'pending_risk_analysis')

const hasDashboardAccess = path(['capabilities', 'allow_dashboard_login'])

const getRecipientId = pathOr(null, ['account', 'company', 'default_recipient_id', env])
const getFeePresetId = pathOr(null, ['account', 'defaultRecipient', 'fee_preset_id'])

const isNotEmpty = complement(isEmpty)

const errorHandler = (error) => {
  store.dispatch(receiveError(error))
  return Promise.reject(error)
}

const verifyCapabilityPermission = client => (
  client.company.current()
    .then((company) => {
      if (!hasDashboardAccess(company)) {
        client.session.destroy(client.authentication.session_id)

        throw new Error('Unauthorized Login')
      }

      return client
    })
)

const alreadyTransacted = async (client) => {
  try {
    const [transactions, payables] = await Promise.all([
      client.transactions.all({ count: 1 }),
      client.payables.all({ count: 1 }),
    ])
    return isNotEmpty(transactions) || isNotEmpty(payables)
  } catch (e) {
    return true
  }
}

const loginEpic = action$ => action$
  .pipe(
    ofType(LOGIN_REQUEST),
    mergeMap(action => pagarme.client.connect(action.payload)
      .then(client => cockpit(client, errorHandler))
      .then(verifyCapabilityPermission)
      .then(receiveLogin)
      .catch((error) => {
        try {
          // eslint-disable-next-line no-undef
          localStorage.removeItem('redux_localstorage_simple_account.sessionId')
        } catch (err) {
          console.warn(err.message) //eslint-disable-line
        }
        return failLogin(error)
      }))
  )

const accountEpic = action$ => action$
  .pipe(
    ofType(LOGIN_RECEIVE),
    mergeMap((action) => {
      const { error, payload: client } = action

      if (error) {
        return Promise.resolve(action.payload)
      }

      return client.user.current().catch(identity)
    }),
    map(receiveAccount),
    tap(({ error, payload }) => {
      if (error) {
        return
      }

      const {
        date_created: dateCreated,
        email,
        id,
        name,
        permission,
      } = payload

      identifyUser(
        id,
        email,
        name,
        dateCreated,
        permission,
        env
      )

      zopimAddTags([
        `nível de acesso do usuário: ${permission}`,
        `email do usuário: ${email}`,
      ])
    })
  )

const companyEpic = (action$, state$) => action$.pipe(
  ofType(ACCOUNT_RECEIVE),
  mergeMap(({ error, payload }) => {
    const { value: state } = state$
    const { account: { client } } = state

    if (error) {
      return Promise.resolve(payload)
    }

    return client.company.current()
      .catch(errorPayload => ({
        error: true,
        payload: errorPayload,
      }))
  }),
  mergeMap(async (action) => {
    if (action.error) {
      return rxOf(action)
    }

    const { value: state } = state$
    const { account: { client } } = state

    return Promise.resolve({
      ...action,
      alreadyTransacted: await alreadyTransacted(client),
    })
  }),
  mergeMap((action) => {
    if (action.error) {
      return rxOf(receiveError(action.payload))
    }

    return rxOf(receiveCompany(action))
  }),
  tap(({ error, payload }) => {
    if (error) {
      return
    }
    const { value: state } = state$
    const {
      api_version: apiVersion,
      dateCreated,
      id,
      name,
      status,
      transfers,
      type,
    } = payload

    const {
      account: {
        user: {
          id: userId,
        },
      },
    } = state

    setCompany(
      id,
      name,
      dateCreated,
      status,
      type,
      userId
    )

    zopimAddTags([
      `tipo da company: ${type}`,
      `id da company: ${id}`,
      'Aplicação: dashboard beta',
      `status da company: ${status}`,
      `versão de api da company (live): ${apiVersion.live}`,
      `saldo bloqueado da company: ${transfers.blocked_balance_amount}`,
    ])

    if (status === 'active') {
      if (isPaymentLink(type)) {
        paymentLinkCompanyLogin()
      } else {
        activeCompanyLogin()
      }
    } else {
      inactiveCompanyLogin()
    }
  })
)

const recipientEpic = (action$, state$) => action$.pipe(
  ofType(COMPANY_RECEIVE),
  mergeMap(() => {
    const state = state$.value
    const recipientId = getRecipientId(state)
    const { account: { client } } = state

    return client.recipients.find({ id: recipientId })
  }),
  map(receiveRecipient)
)

const feePresetEpic = (action$, state$) => action$.pipe(
  ofType(RECIPIENT_RECEIVE),
  mergeMap(() => {
    const state = state$.value
    const feePresetId = getFeePresetId(state)
    const { account: { client } } = state

    if (!feePresetId) {
      return Promise.resolve(null)
    }

    return client.feePresets.find({ id: feePresetId })
  }),
  map(receiveFeePreset)
)

const recipientBalanceEpic = (action$, state$) => action$.pipe(
  ofType(COMPANY_RECEIVE, WITHDRAW_RECEIVE),
  mergeMap(({ error, payload }) => {
    const state = state$.value
    const recipientId = getRecipientId(state)
    const { account: { client } } = state

    if (error) {
      return Promise.resolve(payload)
    }

    return Promise.all([
      client.recipient.balance(recipientId),
      client.transfers.limits({ recipient_id: recipientId }),
    ])
      .then(([balance, withdrawal]) => ({
        balance,
        withdrawal,
      }))
      .catch(identity)
  }),
  map(receiveRecipientBalance)
)

const verifyEnvironmentPermission = (company) => {
  if (
    env === 'live'
    && isSelfRegister(company)
    && isPendingRiskAnalysis(company)
  ) {
    throw new Error('Pending risk analysis')
  }

  if (env === 'live' && !isActiveCompany(company)) {
    throw new Error('Unauthorized environment')
  }

  return company
}

const onCompanyReceive = action$ => action$.pipe(
  ofType(COMPANY_RECEIVE),
  mergeMap(({ payload }) => {
    try {
      return rxOf(verifyEnvironmentPermission(payload))
    } catch (error) {
      return rxOf({
        error: true,
        payload: error,
      })
    }
  }),
  mergeMap((action) => {
    if (action.error) {
      return rxOf(receiveError(action.payload))
    }

    return rxOf(action)
  })
)

const logoutEpic = (action$, state$) => action$.pipe(
  ofType(LOGOUT_REQUEST),
  mergeMap(() => {
    const state = state$.value
    const {
      account: {
        client,
        sessionId,
      },
    } = state

    zopimClearAll()

    return client.session
      .destroy(sessionId)
  }),
  map(receiveLogout)
)

const getAcquirersEpic = (action$, state$) => action$
  .pipe(
    ofType(GET_ACQUIRERS_REQUEST),
    mergeMap(() => {
      const state = state$.value
      const { account: { client } } = state

      return client.acquirers.all()
        .then(getAcquirersResponse)
    })
  )

export default combineEpics(
  loginEpic,
  accountEpic,
  getAcquirersEpic,
  companyEpic,
  feePresetEpic,
  recipientEpic,
  recipientBalanceEpic,
  onCompanyReceive,
  logoutEpic
)
