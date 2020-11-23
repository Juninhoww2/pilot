import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import React from 'react'
import { withRouter } from 'react-router-dom'
import {
  applySpec,
  compose,
  curry,
  find,
  head,
  map,
  merge,
  path,
  pathOr,
  pipe,
  prop,
  propEq,
} from 'ramda'
import { translate } from 'react-i18next'

import { requestLogout } from '../Account/actions/actions'

import UserSettings from '../../containers/Settings/User'
import isCompanyPaymentLink from '../../validation/isPaymentLink'
import environment from '../../environment'

const defaultBankAccountState = {
  account: '',
  accountCd: '',
  agency: '',
  agencyCd: '',
  bankCode: '',
  documentNumber: '',
  legalName: '',
  type: '',
}

const defaultBankAccountErrorsState = {
  account: '',
  accountCd: '',
  agency: '',
  agencyCd: '',
  bankCode: '',
  type: '',
}

const buildBankAccount = account => ({
  agencia: account.agency || account.agencia,
  agencia_dv: account.agencyCd || account.agencia_dv,
  bank_code: account.bankCode || account.bank_code,
  conta: account.account || account.conta,
  conta_dv: account.accountCd || account.conta_dv,
  document_number: account.documentNumber || account.document_number,
  legal_name: account.legalName || account.legal_name,
  type: account.type,
})

const formatErrors = pipe(
  pathOr([], ['response', 'errors']),
  map(error => error.message),
  head
)

const getBankAccounts = curry((client, bankAccount) => client
  .bankAccounts.find({
    count: 100,
    document_number: bankAccount.document_number,
  }).then(accounts => ({
    accounts,
    selectedAccount: bankAccount,
  })))

const updateBankAccount = ({ account, client, recipiendId }) => client
  .recipients.update({
    bank_account: buildBankAccount(account),
    id: recipiendId,
  })

const userIsReadOnly = propEq('permission', 'read_only')
const getDefaultRecipientId = path(['default_recipient_id', environment])
const getCurrentCompany = client => client.company.current()
const getSelectedAccount = curry((client, id) => client
  .recipients.find({ id })
  .then(path(['bank_account'])))

const mapStateToProps = ({
  account: { client, company, user },
}) => ({ client, company, user })

const mapDispatchToProp = ({
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

class UserSettingsPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      bankAccount: {
        accounts: [],
        actionsDisabled: true,
        actionSelectDisabled: userIsReadOnly(props.user) || false,
        data: defaultBankAccountState,
        errors: defaultBankAccountErrorsState,
        loading: false,
        selectedAccount: {},
        selectedView: 'selection',
      },
      companyInfo: {
        address: {},
        general: {},
        managingPartner: {},
        team: [],
      },
      createUserStatus: {
        error: null,
        loading: false,
        success: false,
      },
      defaultRecipientId: null,
      deleteUserStatus: {
        error: null,
        success: false,
      },
      passwordFormStatus: {
        error: null,
        success: false,
      },
    }
    this.requestData = this.requestData.bind(this)
    this.handleAccountCancel = this.handleAccountCancel.bind(this)
    this.handleAccountChange = this.handleAccountChange.bind(this)
    this.handleAccountCreate = this.handleAccountCreate.bind(this)
    this.handleAccountSelect = this.handleAccountSelect.bind(this)
    this.handleCompanyAddressSubmit = this.handleCompanyAddressSubmit.bind(this)
    this.handleCompanyInfoSubmit = this.handleCompanyInfoSubmit.bind(this)
    this.handleCompanyAddressChange = this.handleCompanyAddressChange.bind(this)
    this.handleCompanyInfoChange = this.handleCompanyInfoChange.bind(this)
    this.handleCreateUser = this.handleCreateUser.bind(this)
    this.handleDeleteUser = this.handleDeleteUser.bind(this)
    this.handleRedefinePassword = this.handleRedefinePassword.bind(this)
  }

  getInitialState () {
    const {
      client,
      requestLogout: redirectToLogout,
    } = this.props

    const { bankAccount } = this.state

    const getCompanyBankAccount = id => getSelectedAccount(client, id)
      .then(getBankAccounts(client))
      .then(({ accounts, selectedAccount }) => this.setState({
        bankAccount: {
          ...bankAccount,
          accounts,
          data: {
            ...defaultBankAccountState,
            documentNumber: selectedAccount.document_number,
            legalName: selectedAccount.legal_name,
          },
          selectedAccount,
        },
      }))

    getCurrentCompany(client)
      .then(applySpec({
        defaultRecipientId: getDefaultRecipientId,
        type: prop('type'),
      }))
      .then(({
        defaultRecipientId,
        type,
      }) => {
        this.setState({
          defaultRecipientId,
        })

        return { defaultRecipientId, type }
      })
      .then(({ defaultRecipientId, type }) => !isCompanyPaymentLink(type)
        && getCompanyBankAccount(defaultRecipientId))
      .catch(() => {
        redirectToLogout()
      })
  }

  componentDidMount () {
    this.requestData()
    this.getInitialState()
  }

  requestData () {
    const { client } = this.props

    client.company.info()
      .then((companyInfo) => {
        this.setState({ companyInfo })
      })
  }

  handleAccountCancel () {
    const { bankAccount } = this.state

    this.setState({
      bankAccount: {
        ...bankAccount,
        actionsDisabled: true,
        data: {
          ...defaultBankAccountState,
          documentNumber: bankAccount.data.documentNumber,
          legalName: bankAccount.data.legalName,
        },
        errors: defaultBankAccountErrorsState,
      },
    })
  }

  handleCompanyAddressSubmit (data) {
    const { client, requestLogout: redirectoToLogout } = this.props
    const { companyInfo } = this.state

    return client
      .company.update({
        address: data,
      })
      .then(({ address: companyAddress }) => this.setState({
        companyInfo: {
          ...companyInfo,
          address: companyAddress,
        },
      }))
      .catch(redirectoToLogout)
  }

  handleCompanyInfoSubmit ({ name }) {
    const { client, requestLogout: redirectoToLogout } = this.props
    const { companyInfo } = this.state
    const { general } = companyInfo

    return client
      .company.update({ name })
      .then(({ name: companyName }) => this.state({
        companyInfo: {
          ...companyInfo,
          general: {
            ...general,
            companyName,
          },
        },
      }))
      .catch(redirectoToLogout)
  }

  handleCompanyAddressChange (data) {
    const { companyInfo } = this.state
    const { address } = companyInfo

    this.setState({
      companyInfo: {
        ...companyInfo,
        address: {
          ...address,
          ...data,
        },
      },
    })
  }

  handleCompanyInfoChange (data) {
    const { companyInfo } = this.state
    const { general } = companyInfo

    this.setState({
      companyInfo: {
        ...companyInfo,
        general: {
          ...general,
          ...data,
        },
      },
    })
  }

  handleAccountChange (data, errors) {
    const { bankAccount } = this.state

    this.setState({
      bankAccount: {
        ...bankAccount,
        actionsDisabled: false,
        data: merge(bankAccount.data, data),
        errors,
        selectedView: 'addition',
      },
    })
  }

  handleAccountCreate (data, errors) {
    const { bankAccount, defaultRecipientId } = this.state
    const { client, requestLogout: redirectoToLogout } = this.props
    const account = merge(bankAccount.data, data)

    if (!errors) {
      this.setState({
        bankAccount: {
          ...bankAccount,
          actionsDisabled: true,
        },
      }, () => updateBankAccount({
        account,
        client,
        recipiendId: defaultRecipientId,
      })
        .then(prop('bank_account'))
        .then(getBankAccounts(client))
        .then(({ accounts, selectedAccount }) => this.setState({
          bankAccount: {
            ...bankAccount,
            accounts,
            actionsDisabled: true,
            data: {
              ...defaultBankAccountState,
              documentNumber: account.documentNumber,
              legalName: account.legalName,
            },
            errors: defaultBankAccountErrorsState,
            selectedAccount,
            selectedView: 'selection',
          },
        }))
        .catch(redirectoToLogout))
    } else {
      this.setState({
        bankAccount: {
          ...bankAccount,
          errors,
        },
      })
    }
  }

  handleAccountSelect (accountId) {
    const { bankAccount, defaultRecipientId } = this.state
    const { client, requestLogout: redirectoToLogout } = this.props
    const account = find(propEq('id', accountId), bankAccount.accounts)

    this.setState({
      bankAccount: {
        ...bankAccount,
        actionSelectDisabled: true,
      },
    }, () => updateBankAccount({
      account,
      client,
      recipiendId: defaultRecipientId,
    })
      .then(({ bank_account: selectedAccount }) => this.setState({
        bankAccount: {
          ...bankAccount,
          actionSelectDisabled: false,
          selectedAccount,
        },
      }))
      .catch(redirectoToLogout))
  }

  handleCreateUser (user) {
    const { client } = this.props

    const handleSuccess = () => this.setState({
      createUserStatus: {
        error: null,
        loading: false,
        success: true,
      },
    })

    const handleFailure = (response) => {
      this.setState({
        createUserStatus: {
          error: formatErrors(response),
          loading: false,
          success: false,
        },
      })
    }

    this.setState({
      createUserStatus: {
        error: null,
        loading: true,
        success: false,
      },
    }, () => client.invites
      .create(user)
      .then(handleSuccess)
      .catch(handleFailure))
  }

  handleDeleteUser (id) {
    const { client } = this.props

    client.user.destroy({ id })
      .then(() => {
        this.requestData()
        this.setState({
          deleteUserStatus: {
            error: null,
            success: true,
          },
        })
      })
      .catch((response) => {
        this.setState({
          deleteUserStatus: {
            error: formatErrors(response),
            success: false,
          },
        })
      })
  }

  /* eslint-disable-next-line camelcase */
  handleRedefinePassword ({ current_password, new_password }) {
    const {
      client,
      user: { id },
    } = this.props

    client
      .user.updatePassword({
        current_password,
        id,
        new_password,
      })
      .then(() => this.setState({
        passwordFormStatus: {
          error: null,
          success: true,
        },
      }))
      .catch((response) => {
        this.setState({
          passwordFormStatus: {
            error: formatErrors(response),
            success: false,
          },
        })
      })
  }

  render () {
    const {
      company,
      t,
    } = this.props

    const {
      bankAccount,
      companyInfo: {
        address,
        general,
        managingPartner,
        team,
      },
      createUserStatus,
      deleteUserStatus,
      passwordFormStatus,
    } = this.state

    return (
      <UserSettings
        address={address}
        bankAccounts={bankAccount.accounts}
        bankActionsDisabled={bankAccount.actionsDisabled}
        bankAccountSelected={bankAccount.selectedAccount}
        bankAccountChangeActionDisabled={bankAccount.actionSelectDisabled}
        bankAccountSelectedView={bankAccount.selectedView}
        bankData={bankAccount.data}
        bankErrors={bankAccount.errors}
        company={company}
        createUserStatus={createUserStatus}
        deleteUserStatus={deleteUserStatus}
        general={general}
        managingPartner={managingPartner}
        onCompanyAddressChange={this.handleCompanyAddressChange}
        onCompanyInfoChange={this.handleCompanyInfoChange}
        onCompanyAddressSubmit={this.handleCompanyAddressSubmit}
        onCompanyInfoSubmit={this.handleCompanyInfoSubmit}
        onBankAccountCancel={this.handleAccountCancel}
        onBankAccountChange={this.handleAccountChange}
        onBankAccountCreate={this.handleAccountCreate}
        onBankAccountSelect={this.handleAccountSelect}
        handleCreateUser={this.handleCreateUser}
        handleDeleteUser={this.handleDeleteUser}
        handlePasswordFormSubmit={this.handleRedefinePassword}
        passwordFormStatus={passwordFormStatus}
        t={t}
        team={team}
      />
    )
  }
}

UserSettingsPage.propTypes = {
  client: PropTypes.shape({
    user: PropTypes.shape({
      updatePassword: PropTypes.func,
    }),
  }).isRequired,
  company: PropTypes.shape({
    type: PropTypes.string,
  }),
  requestLogout: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  user: PropTypes.shape({
    email: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
}

UserSettingsPage.defaultProps = {
  company: null,
}

export default enhanced(UserSettingsPage)
