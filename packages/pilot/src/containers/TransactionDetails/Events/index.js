import React from 'react'
import PropTypes from 'prop-types'
import {
  __,
  pipe,
  juxt,
  prop,
  always,
  pathOr,
} from 'ramda'
import moment from 'moment-timezone'
import transactionOperationTypes from '../../../models/transactionOperationTypes'

import Event from '../../../components/Event'
import EventDetails from '../EventDetails'

const getOperationLegendStatus = pipe(
  juxt([
    prop('type'),
    always('status'),
    prop('status'),
  ]),
  pathOr({}, __, transactionOperationTypes)
)

const isChargebackCovered = (type, fraudReimbursed) => {
  const isChargeback = type === 'chargeback' || type === 'chargeback_refund'

  return isChargeback && fraudReimbursed === true
}

const Events = ({
  boleto,
  color,
  eventPaymentLabel,
  fraudReimbursed,
  id,
  operations,
  payment,
  riskLevel,
  t,
}) => (
  operations.map((operation, index) => {
    const {
      cycle,
      status,
      type,
    } = operation
    const key = `${type}_${status}_${(cycle || 0)}_${index}`
    const legendStatus = getOperationLegendStatus(operation)
    const number = operations.length - index
    const isFraudReimbursed = isChargebackCovered(type, fraudReimbursed)
    const eventTitle = (
      legendStatus.title === 'Emitido'
        ? `${eventPaymentLabel.title} ${legendStatus.title}`
        : legendStatus.title
    )

    return (
      <Event
        active={index === 0}
        color={color}
        isMoreThanOneOperation={operations.length > 1}
        key={key}
        number={number}
        title={isFraudReimbursed
          ? t('fraud_reimbursed.title')
          : eventTitle
        }
      >
        <EventDetails
          boleto={boleto}
          fraudReimbursed={isFraudReimbursed}
          id={id}
          legendStatus={legendStatus}
          operation={operation}
          payment={payment}
          riskLevel={riskLevel}
          t={t}
        />
      </Event>
    )
  })
)

Events.propTypes = {
  boleto: PropTypes.shape({
    barcode: PropTypes.string,
    due_date: PropTypes.instanceOf(moment),
    url: PropTypes.string,
  }),
  color: PropTypes.string.isRequired,
  eventPaymentLabel: PropTypes.shape({
    title: PropTypes.string,
  }).isRequired,
  fraudReimbursed: PropTypes.bool,
  id: PropTypes.number,
  operations: PropTypes.arrayOf(PropTypes.shape({
    cycle: PropTypes.number,
    status: PropTypes.string,
    type: PropTypes.string,
  })).isRequired,
  payment: PropTypes.shape({
    authorized_amount: PropTypes.number,
    paid_amount: PropTypes.number,
  }).isRequired,
  riskLevel: PropTypes.string,
  t: PropTypes.func.isRequired,
}

Events.defaultProps = {
  boleto: null,
  fraudReimbursed: null,
  id: null,
  riskLevel: 'unknown',
}

export default Events
