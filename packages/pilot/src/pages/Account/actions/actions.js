import { createAction } from 'redux-actions'

export const LOGIN_REQUEST = 'pilot/account/LOGIN_REQUEST'
export const requestLogin = createAction(LOGIN_REQUEST)

export const LOGOUT_REQUEST = 'pilot/account/LOGOUT_REQUEST'
export const requestLogout = createAction(LOGOUT_REQUEST)

export const LOGOUT_RECEIVE = 'pilot/account/LOGOUT_RECEIVE'
export const receiveLogout = createAction(LOGOUT_RECEIVE)

export const LOGIN_RECEIVE = 'pilot/account/LOGIN_RECEIVE'
export const receiveLogin = createAction(LOGIN_RECEIVE)

export const ACCOUNT_RECEIVE = 'pilot/account/ACCOUNT_RECEIVE'
export const receiveAccount = createAction(ACCOUNT_RECEIVE)

export const COMPANY_RECEIVE = 'pilot/account/COMPANY_RECEIVE'
export const receiveCompany = createAction(COMPANY_RECEIVE)

export const LOGIN_FAIL = 'pilot/account/LOGIN_FAIL'
export const failLogin = createAction(LOGIN_FAIL)

export const RECIPIENT_RECEIVE = 'pilot/account/RECIPIENT_RECEIVE'
export const receiveRecipient = createAction(RECIPIENT_RECEIVE)

export const RECIPIENT_BALANCE_RECEIVE = 'pilot/account/RECIPIENT_BALANCE_RECEIVE'
export const receiveRecipientBalance = createAction(RECIPIENT_BALANCE_RECEIVE)

export const FEE_PRESET_RECEIVE = 'pilot/account/FEE_PRESET_RECEIVE'
export const receiveFeePreset = createAction(FEE_PRESET_RECEIVE)

export const GET_ACQUIRERS_REQUEST = 'pilot/payment_links/list/GET_ACQUIRERS_REQUEST'
export const getAcquirersRequest = createAction(GET_ACQUIRERS_REQUEST)

export const GET_ACQUIRERS_RESPONSE = 'pilot/payment_links/list/GET_ACQUIRERS_RESPONSE'
export const getAcquirersResponse = createAction(GET_ACQUIRERS_RESPONSE)
