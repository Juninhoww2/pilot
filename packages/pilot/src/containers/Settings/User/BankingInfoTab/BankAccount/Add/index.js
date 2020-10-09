import React from 'react'
import PropTypes from 'prop-types'
import Form from 'react-vanilla-form'
import {
  Button,
  CardActions,
  CardContent,
  Col,
  FormDropdown,
  FormInput,
  Grid,
  Row,
  Spacing,
} from 'former-kit'

import { map } from 'ramda'

import accountCDValidation from '../../../../../../validation/accountCheckDigit'
import accountTypes from '../../../../../../models/accountTypes'
import agencyCDValidation from '../../../../../../validation/agencyCheckDigit'
import banks from '../../../../../../models/banks'
import formatCpfCnpj from '../../../../../../formatters/cpfCnpj'
import numberValidation from '../../../../../../validation/number'
import Property from '../../../../../../components/Property'
import requiredValidation from '../../../../../../validation/required'
import style from './style.css'

const optionGenerator = (t, prefix) => value => ({
  name: t(`${prefix}.${value}`),
  value,
})

const BankAccountForm = ({
  actionsDisabled,
  data: {
    account,
    accountCd,
    agency,
    agencyCd,
    bankCode,
    documentNumber,
    legalName,
    type,
  },
  disabled,
  errors,
  onCancel,
  onChange,
  onSubmit,
  t,
}) => {
  const bankGenerator = optionGenerator(t, 'models.bank_code')
  const bankOptions = map(bankGenerator, banks)
  const accountTypeGenerator = optionGenerator(t, 'models.account_type')
  const accountTypeOptions = map(accountTypeGenerator, accountTypes)

  const isRequired = requiredValidation(t('pages.settings.user.banking_info.required'))
  const isNumber = numberValidation(t('pages.settings.user.banking_info.number'))

  return (
    <Form
      data={{
        account,
        accountCd,
        agency,
        agencyCd,
        bankCode,
        type,
      }}
      errors={errors}
      onChange={onChange}
      onSubmit={(data, formErrors) => {
        if (!formErrors) {
          onSubmit(data)
        }
      }}
      validateOn="blur"
      validation={{
        account: [isRequired, isNumber],
        accountCd: [
          isRequired,
          accountCDValidation(t('pages.settings.user.banking_info.invalid_cd')),
        ],
        agency: [isRequired, isNumber],
        agencyCd: agencyCDValidation(t('pages.settings.user.banking_info.invalid_cd')),
        bankCode: isRequired,
        type: isRequired,
      }}
    >
      <CardContent>
        <Grid>
          <Row>
            <Col palm={12} tablet={4} desk={4} tv={4}>
              <Property
                title={t('models.bank_account.legal_name')}
                value={legalName}
              />
            </Col>
            <Col palm={12} tablet={3} desk={3} tv={3}>
              <Property
                title={t('models.bank_account.document')}
                value={formatCpfCnpj(documentNumber)}
              />
            </Col>
          </Row>
          <Row>
            <Col palm={12} tablet={4} desk={4} tv={4}>
              <FormDropdown
                disabled={disabled}
                key={bankCode}
                label={t('models.bank_account.bank')}
                name="bankCode"
                options={bankOptions}
              />
            </Col>
            <Col palm={12} tablet={3} desk={3} tv={3}>
              <FormDropdown
                disabled={disabled}
                key={type}
                label={t('models.bank_account.account_type')}
                name="type"
                options={accountTypeOptions}
              />
            </Col>
          </Row>
          <Row>
            <Col palm={12} tablet={8} desk={4} tv={4}>
              <div className={style.agencyAccountContainer}>
                <div className={style.agencyAccountFields}>
                  <FormInput
                    disabled={disabled}
                    label={t('models.bank_account.agency')}
                    maxLength={5}
                    name="agency"
                    type="text"
                  />
                  <span className={style.separator}>-</span>
                  <FormInput
                    disabled={disabled}
                    label={t('models.bank_account.dv')}
                    maxLength={1}
                    name="agencyCd"
                    type="text"
                  />
                </div>
                <Spacing size="large" />
                <div className={style.agencyAccountFields}>
                  <FormInput
                    disabled={disabled}
                    label={t('models.bank_account.account')}
                    maxLength={13}
                    name="account"
                    type="text"
                  />
                  <span className={style.separator}>-</span>
                  <FormInput
                    disabled={disabled}
                    label={t('models.bank_account.dv')}
                    maxLength={2}
                    name="accountCd"
                    type="text"
                  />
                </div>
              </div>
            </Col>
          </Row>
        </Grid>
      </CardContent>
      <CardActions>
        <Button
          disabled={actionsDisabled}
          fill="outline"
          onClick={onCancel}
          type="reset"
        >
          {t('pages.settings.user.banking_info.cancel')}
        </Button>
        <Button
          disabled={actionsDisabled}
          type="submit"
        >
          {t('pages.settings.user.banking_info.confirm')}
        </Button>
      </CardActions>
    </Form>
  )
}

BankAccountForm.propTypes = {
  actionsDisabled: PropTypes.bool,
  data: PropTypes.shape({
    account: PropTypes.string,
    accountCd: PropTypes.string,
    agency: PropTypes.string,
    agencyCd: PropTypes.string,
    bankCode: PropTypes.string,
    documentNumber: PropTypes.string.isRequired,
    legalName: PropTypes.string.isRequired,
    type: PropTypes.string,
  }),
  disabled: PropTypes.bool,
  errors: PropTypes.shape({
    account: PropTypes.string,
    accountCd: PropTypes.string,
    agency: PropTypes.string,
    agencyCd: PropTypes.string,
    bankCode: PropTypes.string,
    type: PropTypes.string,
  }),
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
}

BankAccountForm.defaultProps = {
  actionsDisabled: false,
  data: {
    account: '',
    accountCd: '',
    agency: '',
    agencyCd: '',
    bankCode: '',
    type: '',
  },
  disabled: false,
  errors: null,
}
export default BankAccountForm
