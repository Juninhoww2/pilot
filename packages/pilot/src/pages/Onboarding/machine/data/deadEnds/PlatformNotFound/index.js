import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'former-kit'
import styles from './styles.css'

const PlatformNotFound = ({ onSubmit, t }) => (
  <div className={styles.platformNotFound}>
    <h1 className={styles.title}>
      {t('pages.onboarding.not_found_pages.platform_not_found.title')}
    </h1>
    <p className={styles.description}>
      {t('pages.onboarding.not_found_pages.platform_not_found.description')}
    </p>
    <Button
      onClick={
              // eslint-disable-next-line no-undef
              () => window.open(t('pages.onboarding.not_found_pages.platform_not_found.button_link'))
            }
      size="huge"
    >
      {t('pages.onboarding.not_found_pages.platform_not_found.button_label')}
    </Button>

    <button
      className={styles.skipToDashboard}
      onClick={onSubmit}
      role="link"
      type="button"
    >
      {t('pages.onboarding.not_found_pages.platform_not_found.skip_to_dashboard')}
    </button>
  </div>
)

PlatformNotFound.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
}

export default PlatformNotFound
