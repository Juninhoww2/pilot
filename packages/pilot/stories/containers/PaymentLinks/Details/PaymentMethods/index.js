import React from 'react'
import { number } from '@storybook/addon-knobs'
import { path, split } from 'ramda'
import Section from '../../../../Section'
import translations from '../../../../../public/locales/pt/translations.json'
import PaymentMethods from '../../../../../src/containers/PaymentLinks/Details/PaymentMethods'

const t = (sentence = '') => path(split('.', sentence), translations)

const boletoConfig = {
  expires_in: 5,
}

const OnlyBoleto = () => (
  <Section>
    <PaymentMethods
      t={t}
      boletoConfig={boletoConfig}
    />
  </Section>
)

const WithoutInterestRate = () => (
  <Section>
    <PaymentMethods
      t={t}
      creditCardConfig={{
        free_installments: null,
        max_installments: 12,
      }}
    />
  </Section>
)

const WithInterestRate = () => (
  <Section>
    <PaymentMethods
      t={t}
      creditCardConfig={{
        free_installments: 1,
        interest_rate: 1.212312,
        max_installments: 12,
      }}
    />
  </Section>
)

const WithChargeTransactionFee = () => (
  <Section>
    <PaymentMethods
      t={t}
      creditCardConfig={{
        charge_transaction_fee: true,
        free_installments: number('free_installments', 0),
        interest_rate: 0,
        max_installments: 12,
      }}
    />
  </Section>
)

export default {
  OnlyBoleto,
  WithChargeTransactionFee,
  WithInterestRate,
  WithoutInterestRate,
}
