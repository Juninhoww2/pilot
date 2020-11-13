import React from 'react'
import { identity } from 'ramda'
import { render } from '@testing-library/react'
import FeeTitleAndValues from './FeeTitleAndValues'
import { buildPixValues } from '.'

test('render pix payment spread fee', () => {
  const fees = {
    pix: {
      paymentFixedFee: 0,
      paymentSpreadFee: 1.19,
    },
  }

  const {
    container,
    getByText,
  } = render(
    <FeeTitleAndValues
      title="pages.empty_state.fees.paid"
      values={[{
        fees: buildPixValues(fees),
        translationPath: 'pages.empty_state.fees.pix',
      }]}
      t={identity}
    />
  )

  getByText(/pages.empty_state.fees.paid/)
  getByText(/pages.empty_state.fees.pix/)
  getByText('1,19%')
  expect(container).toMatchSnapshot()
})

test('render pix payment fixed fee', () => {
  const fees = {
    pix: {
      paymentFixedFee: 380,
      paymentSpreadFee: 0,
    },
  }

  const {
    container,
    getByText,
  } = render(
    <FeeTitleAndValues
      title="pages.empty_state.fees.paid"
      values={[{
        fees: buildPixValues(fees),
        translationPath: 'pages.empty_state.fees.pix',
      }]}
      t={identity}
    />
  )

  getByText(/pages.empty_state.fees.paid/)
  getByText(/pages.empty_state.fees.pix/)
  getByText('R$ 3,80')
  expect(container).toMatchSnapshot()
})

test('render pix payment fixed fee and spread fees', () => {
  const fees = {
    pix: {
      paymentFixedFee: 380,
      paymentSpreadFee: 1.19,
    },
  }

  const {
    container,
    getByText,
  } = render(
    <FeeTitleAndValues
      title="pages.empty_state.fees.paid"
      values={[{
        fees: buildPixValues(fees),
        translationPath: 'pages.empty_state.fees.pix',
      }]}
      t={identity}
    />
  )

  getByText(/pages.empty_state.fees.paid/)
  getByText(/pages.empty_state.fees.pix/)
  expect(container).toMatchSnapshot()
})

