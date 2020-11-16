import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
  always,
  applySpec,
  juxt,
  isNil,
  pipe,
  prop,
  propEq,
  reject,
  uncurryN,
  when,
} from 'ramda'
import {
  Modal,
  ModalContent,
  ModalSection,
  ModalTitle,
  Steps,
} from 'former-kit'
import IconClose from 'emblematic-icons/svg/ClearClose32.svg'
import Form from './Form'
import Confirmation from './Confirmation'
import Result from './Result'

const validateOnRestart = ({ onRestart, stepStatus }, propName) => {
  if (
    propName === 'onRestart'
    && stepStatus.result === 'error'
    && !onRestart
  ) {
    throw new Error('The prop onRestart must be a function when stepStatus.result is equal to "error"')
  }
}

const buildStep = (stepName, translation) => applySpec({
  id: always(stepName),
  status: prop(stepName),
  title: () => translation(`pages.reprocess.${stepName}`),
})

const buildSteps = translation => juxt([
  buildStep('identification', translation),
  buildStep('confirmation', translation),
  buildStep('result', translation),
])

const getSteps = allowReprocessWithoutAntifraud => uncurryN(2,
  translation => pipe(
    buildSteps(translation),
    when(
      always(!allowReprocessWithoutAntifraud),
      reject(propEq('id', 'confirmation'))
    )
  ))

const Reprocess = ({
  allowReprocessWithoutAntifraud,
  isOpen,
  loading,
  lockReason,
  maxChargebackRate,
  onBack,
  onCancel,
  onCopyId,
  onForward,
  onRestart,
  onReprocess,
  onViewTransaction,
  statusMessage,
  stepStatus = {},
  t,
  transaction: {
    amount,
    card: {
      holder_name: holderName,
    },
    id: transactionId,
  },
}) => {
  const [isWithoutAntifraud, setIsWithoutAntifraud] = useState(false)
  const stepsBuilder = getSteps(allowReprocessWithoutAntifraud)

  const currentSteps = stepsBuilder(t, stepStatus)

  const handleReprocess = withoutAntifraud => onReprocess({
    transactionId,
    withoutAntifraud,
  })

  const onReprocessTypeSelection = withoutAntifraud => () => {
    setIsWithoutAntifraud(withoutAntifraud)

    if (allowReprocessWithoutAntifraud) {
      return onForward()
    }

    return handleReprocess(isWithoutAntifraud)
  }

  return (
    <Modal
      isOpen={isOpen}
      loading={loading}
      onRequestClose={onCancel}
    >
      <ModalTitle
        closeIcon={<IconClose height={16} width={16} />}
        onClose={onCancel}
        title={t('pages.reprocess.title')}
      />
      <ModalContent>
        <ModalSection>
          <Steps
            status={currentSteps}
            steps={currentSteps}
          />
        </ModalSection>
      </ModalContent>
      {stepStatus.identification === 'current' && (
        <Form
          allowReprocessWithoutAntifraud={allowReprocessWithoutAntifraud}
          disableWithoutAntifraudReprocess={!isNil(lockReason)}
          amount={amount}
          error={
            stepStatus.confirmation === 'error'
              ? statusMessage
              : ''
          }
          holderName={holderName}
          loading={loading}
          lockReason={lockReason}
          maxChargebackRate={maxChargebackRate}
          onReprocessWithAntifraud={onReprocessTypeSelection(false)}
          onReprocessWithoutAntifraud={onReprocessTypeSelection(true)}
          t={t}
          transactionId={transactionId}
        />
      )}
      {stepStatus.confirmation === 'current' && (
        <Confirmation
          isReprocessingWithoutAntifraud={isWithoutAntifraud}
          loading={loading}
          onBack={onBack}
          onReprocess={() => handleReprocess(isWithoutAntifraud)}
          t={t}
        />
      )}
      {(stepStatus.result === 'success' || stepStatus.result === 'error') && (
        <Result
          onCopyIdClick={onCopyId}
          onRestart={onRestart}
          onViewTransactionClick={onViewTransaction}
          status={stepStatus.result}
          statusMessage={statusMessage}
          t={t}
        />
      )}
    </Modal>
  )
}

Reprocess.propTypes = {
  allowReprocessWithoutAntifraud: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  lockReason: PropTypes.string,
  maxChargebackRate: PropTypes.number.isRequired,
  onBack: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onCopyId: PropTypes.func.isRequired,
  onForward: PropTypes.func.isRequired,
  onReprocess: PropTypes.func.isRequired,
  onRestart: validateOnRestart,
  onViewTransaction: PropTypes.func.isRequired,
  statusMessage: PropTypes.string,
  stepStatus: PropTypes.shape({
    confirmation: PropTypes.oneOf([
      'current', 'pending', 'success',
    ]),
    identification: PropTypes.oneOf([
      'current', 'success',
    ]),
    result: PropTypes.oneOf([
      'error', 'pending', 'success',
    ]),
  }),
  t: PropTypes.func.isRequired,
  transaction: PropTypes.shape({
    amount: PropTypes.number.isRequired,
    card: PropTypes.shape({
      holder_name: PropTypes.string,
    }),
    id: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]).isRequired,
  }).isRequired,
}

Reprocess.defaultProps = {
  lockReason: null,
  onRestart: null,
  statusMessage: '',
  stepStatus: {
    confirmation: 'pending',
    identification: 'current',
    result: 'pending',
  },
}

export default Reprocess
