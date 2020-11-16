import {
  always,
  applySpec,
  ifElse,
  omit,
  pipe,
  prop,
  propEq,
  uncurryN,
  when,
} from 'ramda'
import moment from 'moment'
import shortid from 'shortid'

const minInstallments = 0
const maxInstallments = 12

const parseIntValue = uncurryN(2, propName => pipe(
  prop(propName),
  propValue => parseInt(propValue, 10)
))

const expiresIn = ({
  expiration_amount: expirationAmount,
  expiration_unit: expirationUnit,
}) => {
  if (!expirationAmount) {
    return undefined
  }

  const date = moment()
  const expirationDate = date.clone().add(expirationAmount, expirationUnit)
  const duration = moment.duration(expirationDate.diff(date))
  return parseInt(duration.asMinutes(), 10)
}

const checkFeePayerAndSetFreeInstallments = (object) => {
  if (object.fee_payer === 'customer') {
    return minInstallments
  }

  return parseIntValue('free_installments', object)
}

const checkChargeTransactionFeeAndSetMaxInstallments = (object) => {
  if (object.chargeTransactionFee) {
    return maxInstallments
  }

  return parseIntValue('max_installments', object)
}

const checkChargeTransactionFeeAndSetInterestRate = (object) => {
  if (object.chargeTransactionFee) {
    return 0
  }

  return parseIntValue('interest_rate', object) || 0
}

const buildBoleto = applySpec({
  enabled: prop('boleto'),
  expires_in: parseIntValue('boleto_expires_in'),
})

const paymentMethod = ifElse(
  propEq('credit_card', true),
  always('credit_card'),
  always('boleto')
)

const paymentConfigBoleto = ifElse(
  propEq('boleto', true),
  buildBoleto,
  always(null)
)

const buildCreditCard = pipe(
  applySpec({
    charge_transaction_fee: prop('chargeTransactionFee'),
    enabled: prop('credit_card'),
    free_installments: checkFeePayerAndSetFreeInstallments,
    interest_rate: checkChargeTransactionFeeAndSetInterestRate,
    max_installments: checkChargeTransactionFeeAndSetMaxInstallments,
  }),
  when(propEq('interest_rate', 0), omit(['interest_rate']))
)

const paymentConfigCreditCard = ifElse(
  propEq('credit_card', true),
  buildCreditCard,
  always(null)
)

const paymentConfig = applySpec({
  boleto: paymentConfigBoleto,
  credit_card: paymentConfigCreditCard,
  default_payment_method: paymentMethod,
})

const omitBoletoOrCreditCard = (values) => {
  const payload = values

  if (!values.boleto) {
    return omit(['boleto'], payload)
  }

  if (!values.credit_card) {
    return omit(['credit_card'], payload)
  }

  return payload
}

const buildItems = obj => [
  {
    id: shortid(),
    quantity: 1,
    tangible: true,
    title: obj.name,
    unit_price: parseIntValue('amount')(obj),
  },
]

export default applySpec({
  amount: parseIntValue('amount'),
  expires_in: expiresIn,
  items: buildItems,
  name: prop('name'),
  payment_config: pipe(paymentConfig, omitBoletoOrCreditCard),
})
