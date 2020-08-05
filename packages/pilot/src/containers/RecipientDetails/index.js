import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Card,
  CardContent,
  TabBar,
  TabItem,
} from 'former-kit'
import { omit } from 'ramda'
import Information from './Info'
import Configuration from './Config'
import Balance from './Balance'
import styles from './styles.css'
import dateFormatter from '../../formatters/longDate'
import StatusLegend from '../RecipientTable/statusLegend'

class RecipientDetails extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selected: 0,
    }
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange (selected) {
    this.setState({
      selected,
    })
  }

  render () {
    const {
      balanceProps,
      capabilities,
      configurationProps,
      exporting,
      informationProps,
      recipient,
      t,
    } = this.props

    const { selected } = this.state

    return (
      <Card>
        <CardContent>
          <div className={styles.container}>
            <div className={styles.left}>
              <div className={styles.bankAccount}>
                <span className={styles.label}>{t('pages.recipients.bank_account')}</span>
                <h2 className={styles.companyName}>
                  {configurationProps.bankAccount.name}
                </h2>
                <span className={styles.labelBottom}>{`${t('pages.recipients.ID')}#${recipient.id}`}</span>
              </div>
              <div className={styles.status}>
                <span className={styles.label}>{t('pages.recipients.status')}</span>
                <div className={styles.statusLegend}>
                  <StatusLegend
                    item={recipient}
                    isAcronym={false}
                    t={t}
                  >
                    {t('pages.recipients.active')}
                  </StatusLegend>
                </div>
              </div>
            </div>
            <div className={styles.right}>
              <span className={styles.label}>{t('pages.recipients.id')}</span>
              <span className={styles.hash}>{recipient.hash}</span>
              <span className={styles.labelBottom}>
                {`${t('pages.recipients.date_created')}:
                ${dateFormatter(recipient.createDate)}`
                }
              </span>
            </div>
          </div>
        </CardContent>
        <CardContent>
          <TabBar
            selected={selected}
            onTabChange={this.handleChange}
          >
            <TabItem text={t('pages.recipients.balance')} />
            <TabItem text={t('pages.recipients.configurations')} />
            <TabItem text={t('pages.recipients.more_information')} />
          </TabBar>
        </CardContent>
        {selected === 0
        && (
          <Balance
            {...balanceProps}
            exporting={exporting}
            t={t}
          />
        )}
        {selected === 1
        && (
          <Configuration
            {...configurationProps}
            capabilities={capabilities}
            t={t}
          />
        )}
        {selected === 2
        && (
          <Information
            {...informationProps}
            t={t}
          />
        )}
      </Card>
    )
  }
}

/* eslint-disable react/forbid-foreign-prop-types */
const infoProps = omit(['t'], Information.propTypes)
const configProps = omit(['capabilities', 't'], Configuration.propTypes)
const balanceProps = omit(['t'], Balance.propTypes)
/* eslint-enable react/forbid-foreign-prop-types */

RecipientDetails.propTypes = {
  balanceProps: PropTypes.shape(balanceProps).isRequired,
  capabilities: PropTypes.shape({
    canConfigureAnticipation: PropTypes.bool.isRequired,
  }).isRequired,
  configurationProps: PropTypes.shape(configProps).isRequired,
  exporting: PropTypes.bool.isRequired,
  informationProps: PropTypes.shape(infoProps).isRequired,
  recipient: PropTypes.shape({
    createDate: PropTypes.string,
    hash: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
  selected: PropTypes.number,
  t: PropTypes.func.isRequired,
}

RecipientDetails.defaultProps = {
  selected: 0,
}

export default RecipientDetails
