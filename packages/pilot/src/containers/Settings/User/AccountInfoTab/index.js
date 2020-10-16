import React from 'react'
import PropTypes from 'prop-types'
import {
  Card,
  CardContent,
  CardTitle,
} from 'former-kit'

import CompanyAddressForm from './CompanyAddressForm'
import CompanyAccountManagerForm from './CompanyAccountManagerForm'
import CompanyGeneralForm from './CompanyGeneralForm'

import style from './style.css'

const AccountInfoTab = ({
  address,
  general,
  managingPartner,
  onCompanyAddressChange,
  onCompanyAddressSubmit,
  onCompanyInfoChange,
  onCompanyInfoSubmit,
  t,
}) => (
  <div>
    <Card className={style.marginBottom}>
      <CardTitle title={t('pages.settings.user.account_info.general.title')} titleSize="large" />
      <CardContent>
        <CompanyGeneralForm
          t={t}
          general={general}
          onCompanyInfoChange={onCompanyInfoChange}
          onCompanyInfoSubmit={onCompanyInfoSubmit}
        />
      </CardContent>
    </Card>

    <Card className={style.marginBottom}>
      <CardTitle title={t('pages.settings.user.account_info.address.title')} titleSize="large" />
      <CardContent>
        <CompanyAddressForm
          t={t}
          address={address}
          onCompanyAddressChange={onCompanyAddressChange}
          onCompanyAddressSubmit={onCompanyAddressSubmit}
        />
      </CardContent>
    </Card>

    <Card>
      <CardTitle title={t('pages.settings.user.account_info.managing_partner.title')} titleSize="large" />
      <CardContent>
        <CompanyAccountManagerForm t={t} managingPartner={managingPartner} />
      </CardContent>
    </Card>
  </div>
)

AccountInfoTab.propTypes = {
  address: PropTypes.shape({
    city: PropTypes.string,
    complementary: PropTypes.string,
    neighborhood: PropTypes.string,
    state: PropTypes.string,
    street: PropTypes.string,
    streetNumber: PropTypes.string,
    zipcode: PropTypes.string,
  }).isRequired,
  general: PropTypes.shape({
    cnpj: PropTypes.string,
    fullName: PropTypes.string,
    name: PropTypes.string,
    siteUrl: PropTypes.string,
  }).isRequired,
  managingPartner: PropTypes.shape({
    cpf: PropTypes.string,
    email: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
  onCompanyAddressChange: PropTypes.func.isRequired,
  onCompanyAddressSubmit: PropTypes.func.isRequired,
  onCompanyInfoChange: PropTypes.func.isRequired,
  onCompanyInfoSubmit: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
}

export default AccountInfoTab
