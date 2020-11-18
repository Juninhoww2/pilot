import React from 'react'
import PropTypes from 'prop-types'
import CollapsibleCard from '../CollapsibleCard'
import FeesDetails from '../../../components/FeesDetails'
import styles from './styles.css'

const Fees = ({
  fees,
  isMDRzao,
  isPixEnabled,
  t,
}) => {
  const subtitle = <span className={styles.subtitle}>{t('pages.empty_state.fees.subtitle')}</span>

  return (
    <CollapsibleCard
      title={t('pages.empty_state.fees.title')}
      subtitle={subtitle}
    >
      <div className={styles.feeArea}>
        <FeesDetails
          fees={fees}
          isMDRzao={isMDRzao}
          isPixEnabled={isPixEnabled}
          t={t}
        />
      </div>
    </CollapsibleCard>
  )
}

Fees.propTypes = {
  fees: PropTypes.shape({
    anticipation: PropTypes.number,
    antifraud: PropTypes.number,
    boleto: PropTypes.number,
    gateway: PropTypes.number,
    installments: PropTypes.arrayOf(PropTypes.shape({
      installment: PropTypes.number.isRequired,
      mdr: PropTypes.number.isRequired,
    })),
    transfer: PropTypes.number,
  }),
  isMDRzao: PropTypes.bool.isRequired,
  isPixEnabled: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
}

Fees.defaultProps = {
  fees: {},
}

export default Fees
