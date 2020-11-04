import React from 'react'
import Card from 'emblematic-icons/svg/Card32.svg'
import Alert from './alert.svg'
import BankIcon from './bank.svg'
import BoletoIcon from './boleto.svg'
import Clock from './clock.svg'
import CoinDollar from './coin-dollar-sign.svg'
import CreditCardIcon from './credit-card.svg'
import DebitCardIcon from './debit-card.svg'
import DeniedResponse from './denied-response.svg'
import Hand from './hand.svg'
import InternalError from './internal-error.svg'
import MastercardIcon from './mastercard.svg'
import NotFound from './not-found.svg'
import OutrosIcon from './outros.svg'
import PixIcon from './pix.svg'
import Shield from './shield.svg'
import Timeout from './timeout.svg'
import VisaIcon from './visa.svg'

const icons = {
  acquirer: <BankIcon />,
  acquirer_timeout: <DeniedResponse />,
  antifraud: <Shield />,
  boleto: <BoletoIcon />,
  capture_timeout: <Clock />,
  credit_card: <CreditCardIcon />,
  debit_card: <DebitCardIcon />,
  internal_error: <InternalError />,
  invalid_capture_amount: <CoinDollar />,
  manual_review: <Hand />,
  manual_review_timeout: <Timeout />,
  mastercard: <MastercardIcon />,
  no_acquirer: <NotFound />,
  none: <Alert />,
  others: <OutrosIcon />,
  pix: <PixIcon />,
  unknown: <Card width={16} height={16} />,
  visa: <VisaIcon />,
}

export default icons
