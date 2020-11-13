import React from 'react'
import PropTypes from 'prop-types'
import { Flexbox } from 'former-kit'
import formatPercent from '../../formatters/percent'
import formatCurrency from '../../formatters/currency'
import styles from './styles.css'

const formatterByType = {
  currency: formatCurrency,
  percent: formatPercent,
}

const FeeTitleAndValues = ({ t, title, values }) => (
  <div>
    <p className={styles.title}>{title}</p>
    <Flexbox className={styles.feeValuesWrapper}>
      {values.map(({ fees, translationPath }) => (
        <div key={translationPath}>
          <p>{t(translationPath)}</p>
          <p>
            <strong>
              {
                fees
                  .map(({ type, value, valueSuffixPath }) => {
                    const formatter = formatterByType[type]
                    const formattedValue = formatter(value) || 'N/A'
                    const valueSuffix = valueSuffixPath ? t(valueSuffixPath) : ''

                    return `${formattedValue} ${valueSuffix}`
                  })
                  .join('+ ')
              }
            </strong>
          </p>
        </div>
      ))}
    </Flexbox>
  </div>
)

FeeTitleAndValues.propTypes = {
  t: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  values: PropTypes.arrayOf(PropTypes.shape({
    fees: PropTypes.arrayOf(PropTypes.shape({
      type: PropTypes.string.isRequired,
      value: PropTypes.number,
      valueSuffixPath: PropTypes.string,
    })),
    translationPath: PropTypes.string.isRequired,
  })).isRequired,
}

export default FeeTitleAndValues
