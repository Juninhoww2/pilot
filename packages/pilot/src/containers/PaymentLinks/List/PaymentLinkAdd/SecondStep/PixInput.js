import React from 'react'
import PixIcon from '../../../../../models/icons/pix.svg'
import PaymentMethodToggle from './PaymentMethodToggle'
import styles from './style.css'

const renderPixInput = (formData, t) => (
  <div className={styles.creditCardContainer}>
    <PaymentMethodToggle
      Icon={PixIcon}
      name="pix"
      label={t('pages.payment_links.add_link.second_step.pix')}
      t={t}
      value={formData.pix}
    />
    <p>
      {t('pages.payment_links.add_link.second_step.pix_info')}
    </p>
  </div>
)

export default renderPixInput
