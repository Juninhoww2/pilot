import React from 'react'
import PropTypes from 'prop-types'
import {
  BulletSteps,
  Modal,
  ModalTitle,
} from 'former-kit'
import IconClose from 'emblematic-icons/svg/ClearClose32.svg'
import FirstStep from './FirstStep/FirstStep'
import SecondStep from './SecondStep'
import SuccessStep from './SuccessStep'
import ErrorStep from './ErrorStep'

const renderBulletSteps = (currentStep) => {
  const status = currentStep === 'first_step'
    ? [
      { id: 'firstStep', status: 'current' },
      { id: 'secondStep', status: 'next' },
    ]
    : [
      { id: 'firstStep', status: 'previous' },
      { id: 'secondStep', status: 'current' },
    ]

  return (
    <BulletSteps
      status={status}
      steps={[{ id: 'firstStep' }, { id: 'secondStep' }]}
    />
  )
}

const PaymentLinkAdd = ({
  canChargeTransactionFee,
  formData,
  handleFormChange,
  isOpen,
  loading,
  onClose,
  onCreateAnotherLink,
  onCreateLinkRequest,
  onNextStep,
  onPreviousStep,
  paymentLink,
  step,
  t,
}) => (
  <Modal isOpen={isOpen} size="small">
    <ModalTitle
      title={t(step.title)}
      titleAlign="start"
      closeIcon={<IconClose width={12} height={12} />}
      onClose={() => !loading && onClose()}
    />
    {
          step.name === 'first_step' && (
          <FirstStep
            formData={formData}
            onChange={handleFormChange}
            onSubmit={onNextStep}
            t={t}
            renderBulletSteps={renderBulletSteps}
          />
          )
      }
    {
        step.name === 'second_step' && (
          <SecondStep
            canChargeTransactionFee={canChargeTransactionFee}
            formData={formData}
            loading={loading}
            onBack={onPreviousStep}
            onChange={handleFormChange}
            onSubmit={onCreateLinkRequest}
            t={t}
            renderBulletSteps={renderBulletSteps}
          />
        )
      }
    {
        step.name === 'success_step' && (
          <SuccessStep
            onCreateAnotherLink={onCreateAnotherLink}
            paymentLink={paymentLink}
            t={t}
          />
        )
      }
    {
        step.name === 'error_step' && (
          <ErrorStep
            onCreateAnotherLink={onCreateAnotherLink}
            t={t}
          />
        )
      }
  </Modal>
)

PaymentLinkAdd.propTypes = {
  canChargeTransactionFee: PropTypes.bool.isRequired,
  formData: PropTypes.shape({
    amount: PropTypes.string,
    boleto: PropTypes.bool,
    boleto_expires_in: PropTypes.string,
    credit_card: PropTypes.bool,
    expiration_unit: PropTypes.string,
    fee_payer: PropTypes.string,
    free_installments: PropTypes.string,
    interest_rate: PropTypes.string,
    max_installments: PropTypes.string,
  }).isRequired,
  handleFormChange: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  onCreateAnotherLink: PropTypes.func,
  onCreateLinkRequest: PropTypes.func,
  onNextStep: PropTypes.func.isRequired,
  onPreviousStep: PropTypes.func.isRequired,
  paymentLink: PropTypes.string,
  step: PropTypes.shape({
    name: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
  t: PropTypes.func.isRequired,
}

PaymentLinkAdd.defaultProps = {
  onClose: () => {},
  onCreateAnotherLink: () => {},
  onCreateLinkRequest: () => {},
  paymentLink: '',
}

export default PaymentLinkAdd
