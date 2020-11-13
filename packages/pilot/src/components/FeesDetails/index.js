import React from 'react'
import PropTypes from 'prop-types'
import { Flexbox } from 'former-kit'
import FeeTitleAndValues from './FeeTitleAndValues'
import styles from './styles.css'

const installmentsTranslations = {
  DEFAULT: {
    1: 'pages.empty_state.fees.one_installment',
    2: 'pages.empty_state.fees.two_to_six_installments',
    7: 'pages.empty_state.fees.seven_or_more_installments',
  },
  MDRZAO: {
    1: 'pages.empty_state.fees.mdrzao_installment',
  },
}

const buildInstallmentsValues = (
  anticipationType,
  installments
) => installments.map(item => ({
  fees: [{
    type: 'percent',
    value: item.mdr,
  }],
  translationPath: installmentsTranslations[anticipationType][item.installment],
}))

const loadFirstInstallmentMDR = (installments) => {
  if (installments.length < 1) {
    return null
  }

  return installments[0].mdr
}

const buildCreditCardFees = ({ fees, isMDRzao }) => (
  isMDRzao
    ? [
      {
        fees: [{
          type: 'percent',
          value: loadFirstInstallmentMDR(fees.installments),
          valueSuffixPath: 'pages.empty_state.fees.per_transaction',
        }],
        translationPath: 'pages.empty_state.fees.mdrzao_installment',
      },
    ]
    : [...buildInstallmentsValues('DEFAULT', fees.installments)])

const buildProcessingFees = (fees) => {
  const processingFees = [
    {
      fees: [{
        type: 'currency',
        value: fees.gateway,
      }],
      translationPath: 'pages.empty_state.fees.processing',
    },
    {
      fees: [{
        type: 'currency',
        value: fees.antifraud,
      }],
      translationPath: 'pages.empty_state.fees.antifraud',
    },
  ]

  return processingFees.filter(v => v.value !== 0)
}

export const buildPixValues = ({ pix }) => {
  const fees = []

  if (pix && pix.paymentFixedFee) {
    fees.push({
      type: 'currency',
      value: pix.paymentFixedFee,
    })
  }

  if (pix && pix.paymentSpreadFee) {
    fees.push({
      type: 'percent',
      value: pix.paymentSpreadFee,
    })
  }

  return fees
}

const FeesDetails = ({ fees, isMDRzao, t }) => {
  const creditCardFees = buildCreditCardFees({ fees, isMDRzao })
  const processingFees = buildProcessingFees(fees)

  return (
    <div>
      <FeeTitleAndValues
        t={t}
        title={t('pages.empty_state.fees.credit_card')}
        values={[...creditCardFees, ...processingFees]}
      />
      <Flexbox className={styles.marginRight}>
        <FeeTitleAndValues
          t={t}
          title={t('pages.empty_state.fees.boleto')}
          values={[
            {
              fees: [{
                type: 'currency',
                value: fees.boleto,
              }],
              translationPath: 'pages.empty_state.fees.paid',
            },
          ]}
        />
        <FeeTitleAndValues
          t={t}
          title={t('pages.empty_state.fees.anticipation')}
          values={[
            {
              fees: [{
                type: 'percent',
                value: fees.anticipation,
                valueSuffixPath: isMDRzao ? 'pages.empty_state.fees.per_installment' : '',
              }],
              translationPath: 'pages.empty_state.fees.tax',
            },
          ]}
        />
        <FeeTitleAndValues
          t={t}
          title={t('pages.empty_state.fees.transfers')}
          values={[
            {
              fees: [{
                type: 'currency',
                value: fees.transfer,
              }],
              translationPath: 'pages.empty_state.fees.doc_ted',
            },
          ]}
        />
      </Flexbox>
      <Flexbox className={styles.marginRight}>
        <FeeTitleAndValues
          t={t}
          title={t('pages.empty_state.fees.pix')}
          values={[{
            fees: buildPixValues(fees),
            translationPath: 'pages.empty_state.fees.paid',
          }]}
        />
      </Flexbox>
    </div>
  )
}

FeesDetails.propTypes = {
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
  isMDRzao: PropTypes.bool,
  t: PropTypes.func.isRequired,
}

FeesDetails.defaultProps = {
  fees: {
    anticipation: null,
    antifraud: null,
    boleto: null,
    gateway: null,
    installments: [],
    transfer: null,
  },
  isMDRzao: false,
}

export default FeesDetails
