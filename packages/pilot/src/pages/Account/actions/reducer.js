import {
  __,
  always,
  anyPass,
  applySpec,
  equals,
  find,
  gte,
  merge,
  not,
  path,
  pathOr,
  pluck,
  pipe,
  prop,
  propEq,
  when,
} from 'ramda'

import {
  ACCOUNT_RECEIVE,
  COMPANY_RECEIVE,
  FEE_PRESET_RECEIVE,
  LOGIN_FAIL,
  LOGIN_RECEIVE,
  LOGIN_REQUEST,
  LOGOUT_RECEIVE,
  RECIPIENT_RECEIVE,
  RECIPIENT_BALANCE_RECEIVE,
  GET_ACQUIRERS_RESPONSE,
} from './actions'

const getBalance = applySpec({
  available: path(['withdrawal', 'maximum']),
  waitingFunds: path(['balance', 'waiting_funds', 'amount']),
})

const initialState = {
  defaultRecipient: {},
  loading: false,
  sessionId: null,
}

export default function loginReducer (state = initialState, action) {
  switch (action.type) {
    case ACCOUNT_RECEIVE: {
      return merge(state, {
        error: null,
        user: action.payload,
      })
    }

    case COMPANY_RECEIVE: {
      return merge(state, {
        company: action.payload,
        error: null,
        loading: false,
      })
    }

    case LOGIN_REQUEST: {
      return merge(state, {
        error: null,
        loading: true,
        user: null,
      })
    }
    case LOGIN_FAIL: {
      return merge(
        state,
        {
          client: null,
          error: action.payload,
          loading: false,
          sessionId: null,
          user: null,
        }
      )
    }
    case LOGIN_RECEIVE: {
      return merge(
        state,
        {
          client: action.payload,
          error: null,
          loading: false,
          sessionId: action.payload.authentication.session_id,
        }
      )
    }

    case LOGOUT_RECEIVE: {
      return initialState
    }

    case RECIPIENT_BALANCE_RECEIVE: {
      return merge(
        state,
        {
          balance: getBalance(action.payload),
        }
      )
    }

    case RECIPIENT_RECEIVE: {
      return merge(
        state,
        {
          defaultRecipient: action.payload,
        }
      )
    }

    case FEE_PRESET_RECEIVE: {
      return merge(
        state,
        {
          defaultRecipient: {
            ...state.defaultRecipient,
            feePreset: action.payload,
          },
        }
      )
    }

    case GET_ACQUIRERS_RESPONSE: {
      return merge(state, {
        acquirers: action.payload,
      })
    }

    default:
      return state
  }
}

const getAntifraudCost = pipe(
  pathOr([], ['gateway', 'live', 'antifraud_cost']),
  find(propEq('name', 'pagarme')),
  prop('cost')
)

const notDefaultInstallments = pipe(
  pluck('installment'),
  anyPass([equals([1, 2, 7]), equals([1])]),
  not
)

const CREDIT_CARD_MDRS_TYPES = [null, 'credit_card']
const findCreditCardMDR = mdrs => mdrs.find(({
  payment_method: paymentMethod,
}) => CREDIT_CARD_MDRS_TYPES.includes(paymentMethod))

const getInstallments = pipe(
  findCreditCardMDR,
  pathOr([], ['installments']),
  when(notDefaultInstallments, always([]))
)

const getFees = pipe(
  prop('pricing'),
  applySpec({
    anticipation: path(['psp', 'live', 'anticipation']),
    antifraud: getAntifraudCost,
    boleto: path(['gateway', 'live', 'boletos', 'payment_fixed_fee']),
    gateway: path(['gateway', 'live', 'transaction_cost', 'credit_card']),
    installments: pipe(
      pathOr([], ['psp', 'live', 'mdrs']),
      getInstallments
    ),
    pix: applySpec({
      paymentFixedFee: path(['gateway', 'live', 'pix', 'payment_fixed_fee']),
      paymentSpreadFee: path(['gateway', 'live', 'pix', 'payment_spread_fee']),
    }),
    transfer: path(['transfers', 'ted']),
  })
)

export const selectCompanyFees = ({ company, defaultRecipient = {} }) => {
  const companyFees = getFees(company)

  if (!defaultRecipient.feePreset) {
    return companyFees
  }

  if (defaultRecipient.anticipation_type === 'compulsory') {
    companyFees.anticipation = defaultRecipient.feePreset.anticipation_rate
  }

  return {
    ...companyFees,
    installments: getInstallments(defaultRecipient.feePreset.mdrs),
  }
}

// The value 1_000_000 is set by the Risk Team on the property
// `company.transfer.blocked_balance_amount` when the company is
// not allowed to do withdraws.
const BLOCKED_AMOUNT_LIMIT = 100000000

export const selectHasBlockedWithdraw = pipe(
  pathOr(0, ['transfers', 'blocked_balance_amount']),
  gte(__, BLOCKED_AMOUNT_LIMIT)
)

export const selectAnticipationType = ({ company, defaultRecipient }) => {
  if (company.capabilities.allow_transaction_anticipation) {
    return 'compulsory'
  }

  return defaultRecipient.automatic_anticipation_type
}
