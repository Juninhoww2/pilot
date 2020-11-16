import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  ModalContent,
} from 'former-kit'
import Form from 'react-vanilla-form'
import renderBoletoInput from './BoletoInput'
import renderCreditCardInput from './CreditCardInput'
import PaymentLinkActionsContainer from '../PaymentLinkActionsContainer'
import {
  validateBoletoExpiresIn,
  validateInterestRate,
  validateRequiredField,
} from './validators'
import styles from './style.css'

const SecondStep = ({
  canChargeTransactionFee,
  formData,
  loading,
  onBack,
  onChange,
  onSubmit,
  renderBulletSteps,
  t,
}) => {
  const [isPaymentMethodEnabled, setIsPaymentMethodEnabled] = useState(true)

  const internalOnChange = (newData) => {
    setIsPaymentMethodEnabled(newData.boleto || newData.credit_card)
    onChange(newData)
  }

  return (
    <>
      <Form
        data={formData}
        onChange={internalOnChange}
        onSubmit={(_, errors) => !errors && onSubmit()}
        validateOn="blur"
        validation={{
          boleto_expires_in: validateBoletoExpiresIn(formData.boleto, t),
          fee_payer: validateRequiredField(formData.credit_card, t),
          free_installments: validateRequiredField(formData.credit_card, t),
          interest_rate: validateInterestRate(formData.credit_card, t),
          max_installments: validateRequiredField(formData.credit_card, t),
        }}
      >
        <ModalContent>
          {renderBoletoInput(formData, t)}
          {renderCreditCardInput(formData, t, canChargeTransactionFee)}
        </ModalContent>
        <PaymentLinkActionsContainer>
          <div className={styles.secondStepActions}>
            <Button disabled={loading} fill="outline" onClick={onBack}>
              {t('go_back')}
            </Button>
            <Button
              disabled={!isPaymentMethodEnabled || loading}
              loading={loading}
              fill="flat"
              type="submit"
            >
              {t('finish')}
            </Button>
          </div>
          {renderBulletSteps('second_step')}
        </PaymentLinkActionsContainer>
      </Form>
    </>
  )
}

SecondStep.propTypes = {
  canChargeTransactionFee: PropTypes.bool.isRequired,
  formData: PropTypes.shape({
    boleto_expires_in: PropTypes.string,
    fee_payer: PropTypes.string,
    free_installments: PropTypes.string,
    interest_rate: PropTypes.string,
    max_installments: PropTypes.string,
  }).isRequired,
  loading: PropTypes.bool,
  onBack: PropTypes.func,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  renderBulletSteps: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
}

SecondStep.defaultProps = {
  loading: false,
  onBack: () => {},
  onChange: () => {},
  onSubmit: () => {},
}

export default SecondStep
