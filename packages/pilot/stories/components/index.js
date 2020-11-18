import React from 'react'
import { storiesOf } from '@storybook/react'
import { withA11y } from '@storybook/addon-a11y'

import SearchableDropdown from './SearchableDropdown'
import BoletoRefundDetails from './BoletoRefundDetails'
import ConfigurationCardForm from './ConfigurationCardForm'
import CaptureDetails from './CaptureDetails'
import CopyButton from './CopyButton'
import CurrencyInput from './CurrencyInput'
import CreditCardRefundDetails from './CreditCardRefundDetails'
import CustomerCard from './CustomerCard'
import DataDisplay from './DataDisplay'
import DescriptionAlert from './DescriptionAlert'
import DetailsHead from './DetailsHead'
import EventList from './EventList'
import ExportData from './ExportData'
import FakeLoader from './FakeLoader'
import PaymentCards from './PaymentCards'
import Property from './Property'
import MetricIndicator from './MetricIndicator'
import MetricList from './MetricList'
import MetricChart from './MetricChart'
import OnboardingBackground from './OnboardingBackground'
import Operations from './Operations'
import RecipientSectionState from './RecipientSection'
import RiskLevel from './RiskLevel'
import ReprocessDetails from './ReprocessDetails'
import Summary from './Summary'
import TotalDisplay from './TotalDisplay'
import TransferError from './TransferError'
import TransactionDetailsCard from './TransactionDetailsCard'
import TreeView from './TreeView'
import ApiKeySection from './ApiKey'
import PendingAnticipations from './PendingAnticipations'
import BalanceTotalDisplay from './BalanceTotalDisplay'
import BalanceSummary from './BalanceSummary'
import SidebarSections from './SidebarSections'
import SidebarSummary from './SidebarSummary'
import Loader from './Loader'
import Message from './Message'
import MessageActions from './MessageActions'
import PasswordInput from './PasswordInput'
import ConfirmModal from './ConfirmModal'
import WithLoader from './withLoader'
import WithSpinner from './withSpinner'
import WelcomeMessage from './WelcomeMessage'
import FeesDetails from './FeesDetails'
import Alert from './Alert'

storiesOf('Components|Custom components', module)
  .addDecorator(withA11y)
  .add('Searchable Dropdown', () => <SearchableDropdown />)
  .add('Configuration card form', () => <ConfigurationCardForm />)
  .add('Copy button', () => <CopyButton />)
  .add('Currency Input', () => <CurrencyInput />)
  .add('Customer card', () => <CustomerCard />)
  .add('Details head', () => <DetailsHead />)
  .add('Recipient section', () => <RecipientSectionState />)
  .add('Transaction details card', () => <TransactionDetailsCard />)
  .add('Event list', () => <EventList />)
  .add('Export Data', () => <ExportData />)
  .add('Fake Loader', () => <FakeLoader />)
  .add('DataDisplay', () => <DataDisplay />)
  .add('Description Alert', () => <DescriptionAlert />)
  .add('Reprocess details', () => <ReprocessDetails />)
  .add('Capture Details', () => <CaptureDetails />)
  .add('Payment card', () => <PaymentCards />)
  .add('RiskLevel', () => <RiskLevel />)
  .add('TreeView', () => <TreeView />)
  .add('Property', () => <Property />)
  .add('Boleto Refund Details', () => <BoletoRefundDetails />)
  .add('CreditCardRefundDetails', () => <CreditCardRefundDetails />)
  .add('ApiKey', () => <ApiKeySection />)
  .add('Pending Anticipations', () => <PendingAnticipations />)
  .add('Onboarding Background', () => <OnboardingBackground />)
  .add('Operations', () => <Operations />)
  .add('Balance summary', () => <BalanceSummary />)
  .add('Sidebar Sections', () => <SidebarSections />)
  .add('Sidebar Summary', () => <SidebarSummary />)
  .add('Summary', () => <Summary />)
  .add('Transfer Error', () => <TransferError />)
  .add('Loader', () => <Loader />)
  .add('Message', () => <Message />)
  .add('Message with actions', () => <MessageActions />)
  .add('Password Input', () => <PasswordInput />)
  .add('TotalDisplay', () => <TotalDisplay />)
  .add('MetricIndicator', () => <MetricIndicator />)
  .add('MetricList', () => <MetricList />)
  .add('MetricChart', () => <MetricChart />)
  .add('Confirm Modal', () => <ConfirmModal />)
  .add('Welcome Message', () => <WelcomeMessage />)

storiesOf('Components|High Order Components', module)
  .add('with loader', () => <WithLoader />)
  .add('with spinner', () => <WithSpinner />)

storiesOf('Components|Balance Total Display', module)
  .add('Enabled Withdraw', () => <BalanceTotalDisplay.EnabledWithdraw />)
  .add('Blocked Withdraw', () => <BalanceTotalDisplay.BlockedWithdraw />)

storiesOf('Components|Custom components/FeesDetails', module)
  .addDecorator(withA11y)
  .add('Default', () => <FeesDetails.FeesDetailsDefault />)
  .add('MDRzao', () => <FeesDetails.FeesDetailsMDRzao />)
  .add('Pix', () => <FeesDetails.FeesDetailsPix />)

storiesOf('Components|Custom components/Alert', module)
  .add('Inactive Status', () => <Alert.InactiveStatus />)
  .add('Pending Analysis Status', () => <Alert.PendingAnalysisStatus />)
  .add('Pending Confirmation Status', () => <Alert.PendingConfirmationStatus />)
  .add('Pending Confirmation Status Request Success',
    () => <Alert.PendingConfirmationStatusRequestSuccess />)
  .add('Pending Confirmation Status Request Failed',
    () => <Alert.PendingConfirmationStatusRequestFailed />)
  .add('Unknown Status', () => <Alert.UnknownStatus />)
