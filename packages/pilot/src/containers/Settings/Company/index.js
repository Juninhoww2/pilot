import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
  TabBar,
  TabItem,
} from 'former-kit'

import GeneralInfoTab from './GeneralInfoTab'
import BoletoInfoTab from './BoletoInfoTab'
import FeesTab from './FeesTab'

import isPaymentLink from '../../../validation/isPaymentLink'
import isNilOrEmpty from '../../../validation/isNilOrEmpty'

import style from './style.css'

const CompanySettings = ({
  // antifraud,
  apiKeys,
  apiVersion,
  boletoActionsDisabled,
  boletoDaysToAddInExpirationDate,
  boletoDisabled,
  boletoInstructions,
  boletoInstructionsOptions,
  company,
  environment,
  fees,
  isMDRzao,
  onBoletoSettingsCancel,
  onBoletoSettingsChange,
  onBoletoSettingsSubmit,
  onVersionChange,
  t,
  userIsReadOnly,
  versions,
}) => {
  const [tabIndex, setTabIndex] = useState(0)

  return !isNilOrEmpty(company) && (
  <>
    <TabBar
      align="start"
      onTabChange={setTabIndex}
      selected={tabIndex}
      variant="just-text"
    >
      <TabItem text={t('pages.settings.company.tab.general')} />
      <TabItem text={t('pages.settings.company.tab.fees')} />
      <TabItem text={t('pages.settings.company.tab.boleto')} />
    </TabBar>

    <div className={style.tabsContainer}>
      {tabIndex === 0
          && (
            <GeneralInfoTab
              apiKeys={apiKeys}
              apiVersion={apiVersion}
              environment={environment}
              hiddenApiKey={isPaymentLink(company)}
              onVersionChange={onVersionChange}
              t={t}
              userIsReadOnly={userIsReadOnly}
              versions={versions}
            />
          )
        }
      {tabIndex === 1
          && (
            <FeesTab
              fees={fees}
              isMDRzao={isMDRzao}
              t={t}
            />
          )
        }
      {tabIndex === 2
            && (
              <BoletoInfoTab
                actionsDisabled={boletoActionsDisabled}
                daysToAddInExpirationDate={boletoDaysToAddInExpirationDate}
                disabled={boletoDisabled}
                onCancel={onBoletoSettingsCancel}
                onChange={onBoletoSettingsChange}
                onSubmit={onBoletoSettingsSubmit}
                instructions={boletoInstructions}
                instructionsOptions={boletoInstructionsOptions}
                t={t}
              />
            )
          }
    </div>
  </>
  )
}

CompanySettings.propTypes = {
  antifraud: PropTypes.shape({
    fraud_covered: PropTypes.bool.isRequired,
  }).isRequired,
  apiKeys: PropTypes.shape({
    keys: PropTypes.shape({
      apiKey: PropTypes.string.isRequired,
      encryptionKey: PropTypes.string.isRequired,
    }),
    title: PropTypes.string.isRequired,
  }),
  apiVersion: PropTypes.string,
  boletoActionsDisabled: PropTypes.bool.isRequired,
  boletoDaysToAddInExpirationDate: PropTypes.string,
  boletoDisabled: PropTypes.bool.isRequired,
  boletoInstructions: PropTypes.string,
  boletoInstructionsOptions: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  })).isRequired,
  company: PropTypes.shape({
    type: PropTypes.string,
  }),
  createUserStatus: PropTypes.shape({
    error: PropTypes.string,
    loading: PropTypes.bool,
    success: PropTypes.bool,
  }).isRequired,
  deleteUserStatus: PropTypes.shape({
    error: PropTypes.string,
    loading: PropTypes.bool,
    success: PropTypes.bool,
  }).isRequired,
  environment: PropTypes.oneOf([
    'live',
    'test',
  ]).isRequired,
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
  onBoletoSettingsCancel: PropTypes.func.isRequired,
  onBoletoSettingsChange: PropTypes.func.isRequired,
  onBoletoSettingsSubmit: PropTypes.func.isRequired,
  onVersionChange: PropTypes.func.isRequired,
  t: PropTypes.func,
  userIsReadOnly: PropTypes.bool.isRequired,
  versions: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  })).isRequired,
}

CompanySettings.defaultProps = {
  apiKeys: null,
  apiVersion: null,
  boletoDaysToAddInExpirationDate: null,
  boletoInstructions: null,
  company: null,
  t: t => t,
}

export default CompanySettings
