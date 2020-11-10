import React from 'react'
import { path, split } from 'ramda'
import Section from '../../Section'
import FeesDetails from '../../../src/components/FeesDetails'
import translations from '../../../public/locales/pt/translations.json'

const t = (sentence = '') => path(split('.', sentence), translations)

const FeesDetailsDefaultExample = () => (
  <Section>
    <FeesDetails
      fees={{
        anticipation: undefined,
        antifraud: 70,
        boleto: 380,
        gateway: undefined,
        installments: [
          { installment: 1, mdr: 1.2 },
          { installment: 2, mdr: 2.3 },
          { installment: 7, mdr: 3 },
        ],
        pix: {
          paymentFixedFee: 380,
          paymentSpreadFee: 1.19,
        },
        transfer: 187,
      }}
      t={t}
    />
  </Section>
)

const FeesDetailsMDRzaoExample = () => (
  <Section>
    <FeesDetails
      fees={{
        anticipation: 1.99,
        antifraud: 70,
        boleto: 380,
        gateway: undefined,
        installments: [
          { installment: 1, mdr: 1.2 },
        ],
        pix: {
          paymentFixedFee: 380,
          paymentSpreadFee: 1.19,
        },
        transfer: 187,
      }}
      isMDRzao
      t={t}
    />
  </Section>
)

export default {
  FeesDetailsDefault: FeesDetailsDefaultExample,
  FeesDetailsMDRzao: FeesDetailsMDRzaoExample,
}
