import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import {
  compose,
  contains,
  curry,
  find,
  nth,
  pipe,
  propOr,
} from 'ramda'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import moment from 'moment'
import {
  Col,
  Grid,
  Row,
} from 'former-kit'
import {
  createLinkRequest as createLinkRequestAction,
  nextStepRequest as nextStepRequestAction,
  previousStepRequest as previousStepRequestAction,
  resetStepsRequest as resetStepsRequestAction,
  getLinksRequest as getLinksRequestAction,
} from './actions'
import {
  getAcquirersRequest as getAcquirersRequestAction,
} from '../../Account/actions/actions'
import {
  NewLinksCard,
  PaymentLinkAdd,
  PaymentLinksFilter,
  PaymentLinksList,
} from '../../../containers/PaymentLinks/List'
import { withError } from '../../ErrorBoundary'

import canChargeTransactionFee from '../../../validation/canChargeTransactionFee'

const defaultColumnSize = {
  desk: 12,
  palm: 12,
  tablet: 12,
  tv: 12,
}

const mapStateToProps = ({
  account: {
    acquirers,
    company,
    user: {
      permission,
    },
  },
  paymentLinks: {
    filter,
    loadingCreateLink,
    loadingGetLinks,
    paymentLinkUrl,
    paymentLinks,
    step,
    totalPaymentLinks,
  },
}) => ({
  acquirers,
  company,
  filter,
  loadingCreateLink,
  loadingGetLinks,
  paymentLinks,
  paymentLinkUrl,
  step,
  totalPaymentLinks,
  userPermission: permission,
})

const mapDispatchToProps = {
  createLinkRequest: createLinkRequestAction,
  getAcquirersRequest: getAcquirersRequestAction,
  getLinksRequest: getLinksRequestAction,
  nextStepRequest: nextStepRequestAction,
  previousStepRequest: previousStepRequestAction,
  resetStepsRequest: resetStepsRequestAction,
}

const enhanced = compose(
  translate(),
  connect(mapStateToProps, mapDispatchToProps),
  withRouter,
  withError
)

const firstStepDefaultData = {
  amount: '0',
  expiration_unit: 'days',
}

const boletoInputDefaultValues = {
  boleto_expires_in: '7',
}

const creditCardInputDefaultValues = {
  free_installments: '1',
  interest_rate: '2',
  max_installments: '12',
}

const makeDefaulLinkData = () => ({
  boleto: true,
  credit_card: true,
  pix: false,
  ...firstStepDefaultData,
  ...boletoInputDefaultValues,
  ...creditCardInputDefaultValues,
})

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

const today = moment().startOf('day')
const initialQueryData = {
  active: true,
  dates: {
    end: today.endOf('day'),
    start: today
      .clone()
      .subtract(1, 'month')
      .startOf('day'),
  },
  inactive: true,
  name: '',
}

const List = ({
  acquirers,
  company,
  createLinkRequest,
  filter,
  getAcquirersRequest,
  getLinksRequest,
  history,
  loadingCreateLink,
  loadingGetLinks,
  nextStepRequest,
  paymentLinkUrl,
  paymentLinks,
  previousStepRequest,
  resetStepsRequest,
  step,
  t,
  totalPaymentLinks,
  userPermission,
}) => {
  const [linkFormData, setLinkFormData] = useState(makeDefaulLinkData())
  const [isNewLinkOpen, setIsNewLinkOpen] = useState(false)
  const [isPixEnabled, setIsPixEnabled] = useState(false)
  const [query, setQuery] = useState(initialQueryData)

  const chargeTransactionFee = canChargeTransactionFee(company)

  useEffect(() => {
    getLinksRequest({ ...filter, ...initialQueryData })
    getAcquirersRequest()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const pixEnabled = !!find(
      pipe(
        propOr([], 'payment_methods'),
        contains('pix')
      )
    )(acquirers)

    setIsPixEnabled(pixEnabled)

    setLinkFormData({
      ...linkFormData,
      pix: pixEnabled,
    })
  }, [acquirers]) // eslint-disable-line react-hooks/exhaustive-deps

  const onQueryChange = curry((propName, value) => setQuery({
    ...query,
    [propName]: value,
  }))

  const onApplyQuery = () => getLinksRequest({
    ...filter,
    ...query,
    page: 1,
  })

  const onResetQuery = () => {
    setQuery(initialQueryData)
    return getLinksRequest({
      ...filter,
      ...initialQueryData,
      page: 1,
    })
  }

  const onPageCountChange = count => getLinksRequest({
    ...filter,
    count,
    page: 1,
  })

  const onPageNumberChange = page => getLinksRequest({
    ...filter,
    page,
  })

  const onOrderChange = ([sortField], sortOrder) => getLinksRequest({
    ...filter,
    sortField,
    sortOrder,
  })

  const handleLinkFormChange = (newData) => {
    let newFormData = { ...newData }

    if (newFormData.max_installments !== linkFormData.max_installments) {
      newFormData = Object.assign(
        newFormData,
        creditCardInputDefaultValues,
        { max_installments: newFormData.max_installments }
      )
    }

    if (!newFormData.boleto) {
      newFormData = Object.assign(
        newFormData,
        boletoInputDefaultValues
      )
    }

    if (!newFormData.credit_card) {
      newFormData = Object.assign(
        newFormData,
        creditCardInputDefaultValues
      )
    }

    setLinkFormData(newFormData)
  }

  const onAddPaymentLink = () => setIsNewLinkOpen(true)

  const onCreateLinkRequest = () => createLinkRequest({
    chargeTransactionFee,
    ...linkFormData,
  })

  const onClosePaymentLink = () => {
    setLinkFormData(makeDefaulLinkData())
    resetStepsRequest()
    setIsNewLinkOpen(false)
  }

  const onCreateAnotherLink = () => {
    setLinkFormData(makeDefaulLinkData())
    resetStepsRequest()
  }

  const onRowClick = (rowIndex) => {
    const { id } = nth(rowIndex, paymentLinks)
    history.push(`/payment-links/${id}`)
  }

  const pagination = {
    offset: filter.count * filter.page,
    total: Math.ceil(totalPaymentLinks / filter.count),
  }

  return (
    <>
      <PaymentLinkAdd
        canChargeTransactionFee={chargeTransactionFee}
        formData={linkFormData}
        isOpen={isNewLinkOpen}
        loading={loadingCreateLink}
        handleFormChange={handleLinkFormChange}
        onClose={onClosePaymentLink}
        onCreateAnotherLink={onCreateAnotherLink}
        onCreateLinkRequest={onCreateLinkRequest}
        onNextStep={nextStepRequest}
        onPreviousStep={previousStepRequest}
        paymentLink={paymentLinkUrl}
        step={steps[step]}
        userPermission={userPermission}
        isPixEnabled={isPixEnabled}
        t={t}
      />
      <Grid>
        {userPermission !== 'read_only' && (
          <Row>
            <Col {...defaultColumnSize}>
              <NewLinksCard onAddPaymentLink={onAddPaymentLink} t={t} />
            </Col>
          </Row>
        )}
        <Row>
          <Col {...defaultColumnSize}>
            <PaymentLinksFilter
              onApply={onApplyQuery}
              onQueryChange={onQueryChange}
              onReset={onResetQuery}
              query={query}
              t={t}
            />
          </Col>
        </Row>
        <Row>
          <Col {...defaultColumnSize}>
            <PaymentLinksList
              loading={loadingGetLinks}
              onPageCountChange={onPageCountChange}
              onPageChange={onPageNumberChange}
              onRowClick={onRowClick}
              pageCount={filter.count}
              pagination={pagination}
              onOrderChange={onOrderChange}
              order={filter.sortOrder}
              orderField={filter.sortField}
              t={t}
              rows={paymentLinks}
              selectedPage={filter.page}
            />
          </Col>
        </Row>
      </Grid>
    </>
  )
}

List.propTypes = {
  acquirers: PropTypes.arrayOf(PropTypes.shape()),
  company: PropTypes.shape({
    capabilities: PropTypes.shape({
      allow_transaction_anticipation: PropTypes.bool,
    }),
    payment_link: PropTypes.shape({
      allow_charge_transaction_fee: PropTypes.bool,
    }),
  }).isRequired,
  createLinkRequest: PropTypes.func.isRequired,
  filter: PropTypes.shape({
    count: PropTypes.number,
    page: PropTypes.number,
    sortField: PropTypes.string,
    sortOrder: PropTypes.string,
  }).isRequired,
  getAcquirersRequest: PropTypes.func.isRequired,
  getLinksRequest: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  loadingCreateLink: PropTypes.bool.isRequired,
  loadingGetLinks: PropTypes.bool.isRequired,
  nextStepRequest: PropTypes.func.isRequired,
  paymentLinks: PropTypes.arrayOf(PropTypes.shape()),
  paymentLinkUrl: PropTypes.string,
  previousStepRequest: PropTypes.func.isRequired,
  resetStepsRequest: PropTypes.func.isRequired,
  step: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
  totalPaymentLinks: PropTypes.number,
  userPermission: PropTypes.string.isRequired,
}

List.defaultProps = {
  acquirers: [],
  paymentLinks: [],
  paymentLinkUrl: '',
  totalPaymentLinks: null,
}

export default enhanced(List)
