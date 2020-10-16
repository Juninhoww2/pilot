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
  address,
  onCompanyAddressChange,
  onCompanyAddressSubmit,
  t,
}) => {
  const currentFormData = formatInitialData(address)

  return (
    <Form
      customErrorProp="error"
      data={currentFormData}
      onSubmit={onCompanyAddressSubmit}
      onChange={onCompanyAddressChange}
    >
      <Grid>
        <Row>
          <Col palm={12} tablet={12} desk={4} tv={3}>
            <FormInput
              label={t('pages.settings.user.account_info.address.form.street')}
              name="street"
              type="text"
            />
          </Col>
          <Col palm={12} tablet={12} desk={2} tv={2}>
            <FormInput
              label={t('pages.settings.user.account_info.address.form.street_number')}
              name="streetNumber"
              type="text"
            />
          </Col>
          <Col palm={12} tablet={12} desk={3} tv={2}>
            <FormInput
              label={t('pages.settings.user.account_info.address.form.complementary')}
              name="complementary"
              type="text"
            />
          </Col>
          <Col palm={12} tablet={12} desk={3} tv={3}>
            <FormInput
              label={t('pages.settings.user.account_info.address.form.neighborhood')}
              name="neighborhood"
              type="text"
            />
          </Col>
        </Row>
        <Row>
          <Col palm={12} tablet={12} desk={3} tv={2}>
            <FormInput
              label={t('pages.settings.user.account_info.address.form.city')}
              name="city"
              type="text"
            />
          </Col>
          <Col palm={12} tablet={12} desk={3} tv={2}>
            <FormInput
              label={t('pages.settings.user.account_info.address.form.state')}
              name="state"
              type="text"
            />
          </Col>
          <Col palm={12} tablet={12} desk={3} tv={2}>
            <FormInput
              label={t('pages.settings.user.account_info.address.form.zipcode')}
              name="zipcode"
              type="text"
            />
          </Col>
        </Row>
      </Grid>
      <CardActions>
        <Button
          type="submit"
        >
          {t('pages.settings.user.account_info.address.confirm')}
        </Button>
      </CardActions>
    </Form>
  )
}

CompanyGeneralForm.propTypes = {
  address: PropTypes.shape({
    city: PropTypes.string,
    complementary: PropTypes.string,
    neighborhood: PropTypes.string,
    state: PropTypes.string,
    street: PropTypes.string,
    streetNumber: PropTypes.string,
    zipcode: PropTypes.string,
  }).isRequired,
  onCompanyAddressChange: PropTypes.func.isRequired,
  onCompanyAddressSubmit: PropTypes.func.isRequired,
  t: PropTypes.func,
}

CompanyGeneralForm.defaultProps = {
  t: t => t,
}

export default CompanyGeneralForm
