import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment-timezone'

import PaymentPix from '../../../components/PaymentPix'

const RenderPix = ({
  onCopyQrCodeUrl,
  paymentPixLabels,
  pixExpirationDate,
  pixQrCode,
}) => (
  <PaymentPix
    copyQrCodeFeedback={paymentPixLabels.feedback}
    copyQrCodeLabel={paymentPixLabels.copy}
    dueDate={moment(pixExpirationDate).format('L')}
    dueDateLabel={paymentPixLabels.dueDateLabel}
    onCopy={onCopyQrCodeUrl}
    qrCodeUrl={pixQrCode}
    showQrcode={paymentPixLabels.showQrcode}
    title={paymentPixLabels.title}
  />
)

RenderPix.propTypes = {
  onCopyQrCodeUrl: PropTypes.func.isRequired,
  paymentPixLabels: PropTypes.shape({
    copy: PropTypes.string,
    dueDateLabel: PropTypes.string,
    feedback: PropTypes.string,
    showQrcode: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
  pixExpirationDate: PropTypes.string.isRequired,
  pixQrCode: PropTypes.string.isRequired,
}

export default RenderPix
