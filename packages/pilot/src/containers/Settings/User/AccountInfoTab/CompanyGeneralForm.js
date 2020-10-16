import React from 'react'
import PropTypes from 'prop-types'
import Form from 'react-vanilla-form'
import {
  Button,
  CardActions,
  Col,
  FormInput,
  Grid,
  Row,
} from 'former-kit'
import {
  always,
  complement,
  isNil,
  mapObjIndexed,
  unless,
} from 'ramda'

const replaceNilForString = num => unless(
  complement(isNil),
  always(''),
  num
)

const formatInitialData = mapObjIndexed(replaceNilForString)

const CompanyGeneralForm = ({
  general,
  onCompanyInfoChange,
  onCompanyInfoSubmit,
  t,
}) => {
  const currentFormData = formatInitialData(general)

  return (
    <Form
      data={currentFormData}
      onSubmit={onCompanyInfoSubmit}
      onChange={onCompanyInfoChange}
    >
      <Grid>
        <Row flex>
          <Col palm={12} tablet={6} desk={6} tv={4}>
            <FormInput
              label={t('pages.settings.user.account_info.general.form.name')}
              name="name"
              type="text"
            />
          </Col>
          <Col palm={12} tablet={12} desk={6} tv={4}>
            <FormInput
              disabled
              label={t('pages.settings.user.account_info.general.form.full_name')}
              name="fullName"
              type="text"
            />
          </Col>
          <Col palm={12} tablet={12} desk={3} tv={2}>
            <FormInput
              disabled
              label={t('pages.settings.user.account_info.general.form.cnpj')}
              name="cnpj"
              type="text"
            />
          </Col>
          <Col palm={12} tablet={12} desk={5} tv={5}>
            <FormInput
              disabled
              label={t('pages.settings.user.account_info.general.form.site_url')}
              name="siteUrl"
              type="text"
            />
          </Col>
        </Row>
      </Grid>
      <CardActions>
        <Button
          type="submit"
        >
          {t('pages.settings.user.account_info.general.confirm')}
        </Button>
      </CardActions>
    </Form>
  )
}

CompanyGeneralForm.propTypes = {
  general: PropTypes.shape({
    cnpj: PropTypes.string,
    fullName: PropTypes.string,
    name: PropTypes.string,
    siteUrl: PropTypes.string,
  }).isRequired,
  onCompanyInfoChange: PropTypes.func.isRequired,
  onCompanyInfoSubmit: PropTypes.func.isRequired,
  t: PropTypes.func,
}

CompanyGeneralForm.defaultProps = {
  t: t => t,
}

export default CompanyGeneralForm
