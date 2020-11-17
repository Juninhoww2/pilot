import React, { useState } from 'react'
import { path, split } from 'ramda'
import { action } from '@storybook/addon-actions'
import { boolean } from '@storybook/addon-knobs'
import PaymentLinkAdd from '../../../../../src/containers/PaymentLinks/List/PaymentLinkAdd'

import translations from '../../../../../public/locales/pt/translations.json'

const t = sentence => path(split('.', sentence), translations)

const steps = {
  error_step: {
    name: 'error_step',
    title: 'pages.payment_links.add_link.error.title',
  },
  first_step: {
    name: 'first_step',
    title: 'pages.payment_links.add_link.first_step.title',
  },
  second_step: {
    name: 'second_step',
    title: 'pages.payment_links.add_link.second_step.title',
  },
  success_step: {
    name: 'success_step',
    title: 'pages.payment_links.add_link.success.title',
  },
}

const defaultFormData = {
  amount: '0',
  boleto: false,
  credit_card: false,
  expiration_unit: 'days',
  interest_rate: '0',
}

const PaymentLinkAddExample = () => {
  const [formData, setFormData] = useState(defaultFormData)
  const [step, setStep] = useState(steps.first_step)
  const [loading, setLoading] = useState(false)
  const paymentLink = 'link.pagar.me/tBy6bncOoN'

  const onCreateLinkRequest = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setStep(steps.success_step)
    }, 2000)
  }

  const onCreateAnotherLink = () => setStep(steps.first_step)
  const onNextStep = () => setStep(steps.second_step)
  const onPreviousStep = () => setStep(steps.first_step)

  return (
    <PaymentLinkAdd
      canChargeTransactionFee={boolean('canChargeTransactionFee')}
      loading={loading}
      formData={formData}
      handleFormChange={setFormData}
      isOpen
      onNextStep={onNextStep}
      onPreviousStep={onPreviousStep}
      onCreateAnotherLink={onCreateAnotherLink}
      onCreateLinkRequest={onCreateLinkRequest}
      paymentLink={paymentLink}
      step={step}
      t={t}
    />
  )
}

const baseProps = {
  formData: defaultFormData,
  isOpen: true,
  loading: false,
  onCreateAnotherLink: action('onCreateAnotherLink'),
  onCreateLinkRequest: action('onCreateLinkRequests'),
  onNextStep: action('onNextStep'),
  onPreviousStep: action('onPreviousStep'),
  paymentLink: 'link.pagar.me/tBy6bncOoN',
  t,
}

const PaymentLinkFirstStepExample = () => (
  <PaymentLinkAdd {...baseProps} step={steps.first_step} />
)

const PaymentLinkSecondStepExample = () => (
  <PaymentLinkAdd
    {...baseProps}
    canChargeTransactionFee={boolean('canChargeTransactionFee')}
    step={steps.second_step}
  />
)

const PaymentLinkSecondStepPixEnabledExample = () => (
  <PaymentLinkAdd
    {...baseProps}
    canChargeTransactionFee={boolean('canChargeTransactionFee')}
    isPixEnabled
    step={steps.second_step}
  />
)

const PaymentLinkSuccessStepExample = () => (
  <PaymentLinkAdd {...baseProps} step={steps.success_step} />
)

const PaymentLinkErrorStepExample = () => (
  <PaymentLinkAdd {...baseProps} step={steps.error_step} />
)

export default {
  PaymentLinkAddModal: PaymentLinkAddExample,
  PaymentLinkErrorStep: PaymentLinkErrorStepExample,
  PaymentLinkFirstStep: PaymentLinkFirstStepExample,
  PaymentLinkSecondStep: PaymentLinkSecondStepExample,
  PaymentLinkSecondStepPixEnabled: PaymentLinkSecondStepPixEnabledExample,
  PaymentLinkSuccessStep: PaymentLinkSuccessStepExample,
}
