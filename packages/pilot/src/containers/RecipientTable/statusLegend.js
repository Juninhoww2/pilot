import React from 'react'
import PropTypes from 'prop-types'
import { Legend } from 'former-kit'

import style from './style.css'
import status from '../../models/recipientStatusLegends'

const StatusLegend = ({
  isAcronym,
  item,
  t,
}) => {
  const localePath = isAcronym
    ? 'pages.recipients.status_acronym_of'
    : 'pages.recipients.status_of'

  if (!item.status) {
    return null
  }

  return (
    <div className={style.centralizedItem}>
      <Legend
        acronym={t(`${localePath}.${item.status}`)}
        color={status[item.status].color}
        hideLabel
        textColor={status[item.status].textColor}
      >
        {t(`pages.recipients.status_of.${item.status}`)}
      </Legend>
    </div>
  )
}

StatusLegend.propTypes = {
  isAcronym: PropTypes.bool,
  item: PropTypes.shape({
    status: PropTypes.string.isRequired,
  }).isRequired,
  t: PropTypes.func.isRequired,
}

StatusLegend.defaultProps = {
  isAcronym: false,
}

export default StatusLegend
