import React from 'react'
import { path, split } from 'ramda'
import EmptyState from '../../../src/containers/EmptyState'
import Section from '../../Section'
import translations from '../../../public/locales/pt/translations.json'

const t = (sentence = '') => path(split('.', sentence), translations)

const EmptyStateExample = () => (
  <Section>
    <EmptyState
      apiKey="api-key"
      encryptionKey="encryption-key"
      environment="live"
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
        transfer: 187,
      }}
      isMDRzao={false}
      isPixEnabled={false}
      isAdmin
      t={t}
    />
  </Section>
)

const EmptyStateMDRzaoExample = () => (
  <Section>
    <EmptyState
      apiKey="api-key"
      encryptionKey="encryption-key"
      environment="live"
      fees={{
        anticipation: 1.99,
        antifraud: 70,
        boleto: 380,
        gateway: undefined,
        installments: [
          { installment: 1, mdr: 1.2 },
        ],
        transfer: 187,
      }}
      isMDRzao
      isPixEnabled={false}
      isAdmin
      t={t}
    />
  </Section>
)

const EmptyStatePixExample = () => (
  <Section>
    <EmptyState
      apiKey="api-key"
      encryptionKey="encryption-key"
      environment="live"
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
      isPixEnabled
      isAdmin
      t={t}
    />
  </Section>
)

export default {
  EmptyStateDefault: EmptyStateExample,
  EmptyStateMDRzao: EmptyStateMDRzaoExample,
  EmptyStatePix: EmptyStatePixExample,
}
