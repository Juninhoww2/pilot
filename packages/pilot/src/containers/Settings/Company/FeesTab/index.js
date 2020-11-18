import PropTypes from 'prop-types'
import React from 'react'

import {
  Card,
  CardContent,
  CardTitle,
} from 'former-kit'

import FeesDetails from '../../../../components/FeesDetails'

const Pricing = ({
  fees,
  isMDRzao,
  isPixEnabled,
  t,
}) => (
  <Card>
    <CardTitle title={t('pages.settings.company.card.general.title.rate')} />
    <CardContent>
      <FeesDetails
        fees={fees}
        isMDRzao={isMDRzao}
        isPixEnabled={isPixEnabled}
        t={t}
      />
    </CardContent>
  </Card>
)

Pricing.propTypes = {
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
  }).isRequired,
  isMDRzao: PropTypes.bool.isRequired,
  isPixEnabled: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
}

export default Pricing
