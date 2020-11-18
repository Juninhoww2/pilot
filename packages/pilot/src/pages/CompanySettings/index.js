import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import {
  applySpec,
  compose,
  contains,
  defaultTo,
  find,
  head,
  map,
  path,
  pathOr,
  pick,
  pipe,
  prop,
  propEq,
  propOr,
  uncurryN,
} from 'ramda'
import { translate } from 'react-i18next'

import {
  requestLogout,
  getAcquirersRequest as getAcquirersRequestAction,
} from '../Account/actions/actions'
import CompanySettings from '../../containers/Settings/Company'
import environment from '../../environment'
import isCompanyPaymentLink from '../../validation/isPaymentLink'

import { selectCompanyFees, selectAnticipationType } from '../Account/actions/reducer'

const mapStateToProps = ({
  account: {
    acquirers,
    client,
    company,
    defaultRecipient,
    user,
  },
}) => ({
  acquirers,
  anticipationType: selectAnticipationType({ company, defaultRecipient }),
  client,
  company,
  fees: selectCompanyFees({ company, defaultRecipient }),
  user,
})

const mapDispatchToProp = ({
  getAcquirersRequest: getAcquirersRequestAction,
  requestLogout,
})

const enhanced = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProp
  ),
  translate()
)

const formatErrors = pipe(
  pathOr([], ['response', 'errors']),
  map(error => error.message),
  head
)

const getPropFromBoleto = (propName, company) => pathOr(
  null, ['boletos', propName], company
)

const getPropExpiration = pipe(
  propOr('', 'expiration'),
  defaultTo(''),
  String
)

const getPropFromInstructions = (search, propName) => uncurryN(
  2, instructions => pipe(
    find(propEq(search, instructions)),
    prop(propName)
  )
)

const getNameFromInstructions = getPropFromInstructions('value', 'name')
const getValueFromInstructions = getPropFromInstructions('name', 'value')

const getCurrentCompany = client => client.company.current()

const boletoOptions = t => ([
  {
    name: t('pages.settings.company.boleto.options.accept'),
    value: 'accept_payment',
  },
  {
    name: t('pages.settings.company.boleto.options.refuse'),
    value: 'deny_payment',
  },
])

const userIsReadOnly = propEq('permission', 'read_only')

class CompanySettingsPage extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      antifraud: {
        fraud_covered: false,
      },
      boleto: {
        actionsDisabled: true,
        error: null,
        expiration: null,
        instructions: null,
        loading: false,
      },
      companyInfo: {
        apiKeys: null,
        apiVersion: null,
        pricing: [],
        team: [],
      },
      versions: [],
    }

    this.getInitialState = this.getInitialState.bind(this)
    this.handleBoletoCancel = this.handleBoletoCancel.bind(this)
    this.handleBoletoChange = this.handleBoletoChange.bind(this)
    this.handleBoletoSubmit = this.handleBoletoSubmit.bind(this)
    this.requestData = this.requestData.bind(this)
    this.handleVersionChange = this.handleVersionChange.bind(this)
  }

  getInitialState () {
    const {
      client,
      getAcquirersRequest,
      requestLogout: redirectoToLogout,
      t,
    } = this.props

    const { boleto } = this.state

    const getBoletoOptions = company => ({
      expiration: getPropFromBoleto(
        'days_to_add_in_expiration_date',
        company
      ),
      instructions: getValueFromInstructions(
        company.boletos.instrucoes,
        boletoOptions(t)
      ),
    })

    const getDefaultRecipientId = path(['default_recipient_id', environment])

    const getAntifraudOptions = pipe(
      path(['antifraud', environment]),
      pick(['fraud_covered'])
    )

    getAcquirersRequest()

    getCurrentCompany(client)
      .then(applySpec({
        antifraud: getAntifraudOptions,
        boletoInstructions: getBoletoOptions,
        defaultRecipientId: getDefaultRecipientId,
        type: prop('type'),
      }))
      .then(({
        antifraud,
        boletoInstructions,
        type,
      }) => {
        this.setState({
          antifraud,
          boleto: {
            ...boleto,
            actionsDisabled: true,
            ...boletoInstructions,
          },
        })

        return { type }
      })
      .then(({ type }) => !isCompanyPaymentLink(type))
      .catch(() => {
        redirectoToLogout()
      })
  }

  componentDidMount () {
    this.requestData()
    this.getInitialState()
    this.getVersionsAPI()
  }

  getVersionsAPI () {
    const {
      client,
      t,
    } = this.props

    client.versions()
      .then((results) => {
        if (results.length) {
          const versions = results.map((version, index) => ({
            name: `${t('version')} ${index + 1} (${version})`,
            value: version,
          }))

          this.setState({ versions })
        }
      })
  }

  requestData () {
    const { client } = this.props

    client.company.info()
      .then((companyInfo) => {
        this.setState({ companyInfo })
      })
  }

  handleBoletoCancel () {
    const { company, t } = this.props
    const { boleto } = this.state

    this.setState({
      boleto: {
        ...boleto,
        actionsDisabled: true,
        expiration: getPropFromBoleto(
          'days_to_add_in_expiration_date',
          company
        ),
        instructions: getValueFromInstructions(
          company.boletos.instrucoes,
          boletoOptions(t)
        ),
      },
    })
  }

  handleBoletoChange (data) {
    this.setState({
      boleto: {
        actionsDisabled: false,
        error: null,
        expiration: data.daysToAddInExpirationDate,
        instructions: data.instructions,
        loading: false,
      },
    })
  }

  handleBoletoSubmit (data, error) {
    const { boleto } = this.state
    const { client: { company }, t } = this.props

    const handleSuccess = ({ boletos }) => {
      this.setState({
        boleto: {
          ...boleto,
          actionsDisabled: true,
          expiration: boletos.days_to_add_in_expiration_date,
          instructions: getValueFromInstructions(
            boletos.instrucoes,
            boletoOptions(t)
          ),
          loading: false,
        },
      })
    }

    const handleError = response => this.setState({
      boleto: {
        ...boleto,
        actionsDisabled: true,
        error: formatErrors(response),
        loading: false,
      },
    })

    if (!error) {
      this.setState({
        boleto: {
          ...boleto,
          actionsDisabled: true,
          loading: true,
        },
      }, () => {
        company.update({
          boletos: {
            days_to_add_in_expiration_date: data.daysToAddInExpirationDate,
            instrucoes: getNameFromInstructions(
              data.instructions,
              boletoOptions(t)
            ),
          },
          instrucoes_type: data.instructions,
        })
          .then(handleSuccess)
          .catch(handleError)
      })
    }
  }

  handleVersionChange (version) {
    const { client } = this.props
    const { companyInfo } = this.state

    const handleSuccess = () => this.setState({
      companyInfo: {
        ...companyInfo,
        apiVersion: version,
      },
    })

    client.company.update({ api_version: version })
      .then(handleSuccess)
  }

  render () {
    const {
      acquirers,
      anticipationType,
      company,
      fees,
      t,
      user,
    } = this.props

    const {
      antifraud,
      boleto,
      companyInfo: {
        apiKeys,
        apiVersion,
      },
      versions,
    } = this.state

    const isPixEnabled = !!find(
      pipe(
        propOr([], 'payment_methods'),
        contains('pix')
      )
    )(acquirers)

    return (
      <CompanySettings
        antifraud={antifraud}
        apiKeys={apiKeys}
        apiVersion={apiVersion}
        boletoActionsDisabled={boleto.actionsDisabled || boleto.loading}
        boletoDaysToAddInExpirationDate={getPropExpiration(boleto)}
        boletoDisabled={boleto.loading}
        boletoInstructions={boleto.instructions}
        boletoInstructionsOptions={boletoOptions(t)}
        company={company}
        environment={environment}
        fees={fees}
        isMDRzao={anticipationType === 'compulsory'}
        isPixEnabled={isPixEnabled}
        onBoletoSettingsCancel={this.handleBoletoCancel}
        onBoletoSettingsChange={this.handleBoletoChange}
        onBoletoSettingsSubmit={this.handleBoletoSubmit}
        onVersionChange={this.handleVersionChange}
        t={t}
        versions={versions}
        userIsReadOnly={userIsReadOnly(user)}
      />
    )
  }
}

CompanySettingsPage.propTypes = {
  acquirers: PropTypes.arrayOf(PropTypes.shape()),
  anticipationType: PropTypes.string,
  client: PropTypes.shape({
    company: PropTypes.shape({
      info: PropTypes.func.isRequired,
      update: PropTypes.func.isRequired,
    }),
    invites: PropTypes.shape({
      create: PropTypes.func.isRequired,
    }),
    user: PropTypes.shape({
      destroy: PropTypes.func.isRequired,
    }),
    versions: PropTypes.func.isRequired,
  }).isRequired,
  company: PropTypes.shape({
    boletos: PropTypes.shape({
      days_to_add_in_expiration_date: PropTypes.number.isRequired,
      instrucoes: PropTypes.string.isRequired,
    }).isRequired,
  }),
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
  getAcquirersRequest: PropTypes.func.isRequired,
  requestLogout: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  user: PropTypes.shape({}),
}

CompanySettingsPage.defaultProps = {
  acquirers: [],
  anticipationType: '',
  company: null,
  fees: {},
  user: null,
}

export default enhanced(CompanySettingsPage)
