import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment-timezone'

import RenderBoleto from '../RenderBoleto'
import RenderPaymentCard from '../RenderPaymentCard'
import RenderPix from '../RenderPix'

const RenderPayment = ({
  boleto,
  card,
  onCopyBoletoUrl,
  onCopyQrCodeUrl,
  onShowBoleto,
  payment,
  paymentBoletoLabels,
  paymentCardLabels,
  paymentPixLabels,
  pixExpirationDate,
  pixQrCode,
}) => {
  if (payment.method === 'boleto') {
    return (
      <RenderBoleto
        onCopyBoletoUrl={onCopyBoletoUrl}
        onShowBoleto={onShowBoleto}
        paymentBoletoLabels={paymentBoletoLabels}
        boleto={boleto}
      />
    )
  }

  if (payment.method === 'pix') {
    return (
      <RenderPix
        onCopyQrCodeUrl={onCopyQrCodeUrl}
        paymentPixLabels={paymentPixLabels}
        pixExpirationDate={pixExpirationDate}
        pixQrCode={pixQrCode}
      />
    )
  }

  return (
    <RenderPaymentCard
      paymentCardLabels={paymentCardLabels}
      card={card}
    />
  )
}

RenderPayment.propTypes = {
  boleto: PropTypes.shape({
    barcode: PropTypes.string,
    due_date: PropTypes.instanceOf(moment),
  }),
  card: PropTypes.shape({
    brand_name: PropTypes.string,
    first_digits: PropTypes.string,
    holder_name: PropTypes.string,
    last_digits: PropTypes.string,
  }),
  onCopyBoletoUrl: PropTypes.func,
  onCopyQrCodeUrl: PropTypes.func,
  onShowBoleto: PropTypes.func,
  payment: PropTypes.shape({
    method: PropTypes.string,
  }).isRequired,
  paymentBoletoLabels: PropTypes.shape({
    copy: PropTypes.string,
    due_date: PropTypes.string,
    feedback: PropTypes.string,
    show: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
  paymentCardLabels: PropTypes.shape({
    title: PropTypes.string,
  }).isRequired,
  paymentPixLabels: PropTypes.shape({
    dueDate: PropTypes.string,
    showQrcode: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
  pixExpirationDate: PropTypes.string,
  pixQrCode: PropTypes.string,
}

RenderPayment.defaultProps = {
  boleto: null,
  card: null,
  onCopyBoletoUrl: null,
  onCopyQrCodeUrl: null,
  onShowBoleto: null,
  pixExpirationDate: '',
  pixQrCode: 'www.pagar.me',
}

export default RenderPayment
