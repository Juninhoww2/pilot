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

const paymentMethod = ifElse(
  propEq('credit_card', true),
  always('credit_card'),
  ifElse(
    propEq('pix', true),
    always('pix'),
    always('boleto')
  )
)

const buildBoleto = applySpec({
  enabled: prop('boleto'),
  expires_in: parseIntValue('boleto_expires_in'),
})

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

const pixExpirationDate = ({
  expiration_amount: expirationAmount,
  expiration_unit: expirationUnit,
}) => {
  if (!expirationAmount) {
    return moment().add(1, 'year').toISOString()
  }

  return moment().add(
    parseInt(expirationAmount, 10),
    expirationUnit
  ).add(1, 'minute').toISOString()
}

const buildPix = applySpec({
  enabled: prop('pix'),
  expiration_date: pixExpirationDate,
})

const paymentConfigPix = ifElse(
  propEq('pix', true),
  buildPix,
  always(null)
)

const paymentConfig = applySpec({
  boleto: paymentConfigBoleto,
  credit_card: paymentConfigCreditCard,
  default_payment_method: paymentMethod,
  pix: paymentConfigPix,
})

const omitBoletoCreditCardOrPix = (values) => {
  const payload = values
  const props = []

  if (!values.boleto) {
    props.push('boleto')
  }

  if (!values.credit_card) {
    props.push('credit_card')
  }

  if (!values.pix) {
    props.push('pix')
  }

  if (props.length > 0) {
    return omit(props, payload)
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
  payment_config: pipe(paymentConfig, omitBoletoCreditCardOrPix),
})
