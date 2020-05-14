import Balance32 from 'emblematic-icons/svg/Extract32.svg'
import Configuration32 from 'emblematic-icons/svg/Configuration32.svg'
import Home32 from 'emblematic-icons/svg/Home32.svg'
import Transaction32 from 'emblematic-icons/svg/Transaction32.svg'
import Withdraw32 from 'emblematic-icons/svg/Withdraw32.svg'
import Store32 from 'emblematic-icons/svg/Store32.svg'
import Link32 from 'emblematic-icons/svg/Link32.svg'

import {
  Anticipation,
  Balance,
  CompanySettings,
  EmptyState,
  Home,
  Recipients,
  Transactions,
  UserSettings,
  Withdraw,
  PaymentLinks,
} from './dynamicImports'

/* eslint-disable sort-keys */
export default {
  accountSettings: {
    component: UserSettings,
    exact: true,
    hidden: true,
    icon: Configuration32,
    path: '/account',
    title: 'pages.settings.user.menu',
  },
  anticipation: {
    component: Anticipation,
    exact: true,
    hidden: true,
    icon: Balance32,
    path: '/anticipation/:id?',
    title: 'pages.anticipation.title',
  },
  home: {
    component: Home,
    exact: true,
    dafaultRoute: true,
    icon: Home32,
    path: '/home',
    title: 'pages.home.title',
  },
  balance: {
    component: Balance,
    exact: true,
    icon: Balance32,
    path: '/balance/:id?',
    title: 'pages.balance.title',
  },
  transactions: {
    component: Transactions,
    exact: true,
    icon: Transaction32,
    path: '/transactions',
    title: 'pages.transactions.title',
  },
  paymentLinks: {
    component: PaymentLinks,
    hidden: true,
    path: '/payment-links',
    title: 'pages.payment_links.title',
    icon: Link32,
  },
  companySettings: {
    component: CompanySettings,
    exact: true,
    icon: Configuration32,
    path: '/settings',
    title: 'pages.settings.company.menu',
  },
  transactionsDetails: {
    exact: true,
    hidden: true,
    path: '/transactions/:id',
    title: 'pages.transaction.title',
  },
  withdrawRoot: {
    component: Withdraw,
    hidden: true,
    icon: Withdraw32,
    path: '/withdraw/:id?',
    title: 'pages.withdraw.title',
  },
  recipients: {
    validateVisibility: ({
      allow_manage_recipient: allowManageRecipient,
    }) => !!allowManageRecipient,
    hidden: false,
    title: 'pages.recipients.title',
    path: '/recipients',
    component: Recipients,
    icon: Store32,
    exact: true,
  },
  recipientsAdd: {
    hidden: true,
    path: '/recipients/add',
    title: 'pages.add_recipient.title',
  },
  recipientsDetail: {
    hidden: true,
    path: '/recipients/detail',
    title: 'pages.recipient_detail.title',
  },
  emptyState: {
    component: EmptyState,
    hidden: true,
    path: '/welcome',
    title: 'pages.empty_state.title',
  },
}

/* eslint-enable sort-keys */
