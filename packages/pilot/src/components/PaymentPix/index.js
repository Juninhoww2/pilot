import React, { useState } from 'react'
import PropTypes from 'prop-types'
import QRCode from 'qrcode.react'

import {
  Card,
  CardContent,
} from 'former-kit'
import IconCopy from 'emblematic-icons/svg/Copy24.svg'
import IconPix from './qrcodePix.svg'
import CopyButton from '../CopyButton'

import style from './style.css'

const PaymentCard = ({
  copyQrCodeFeedback,
  copyQrCodeLabel,
  dueDate,
  dueDateLabel,
  onCopy,
  qrCodeUrl,
  showQrcode,
  title,
}) => {
  const [show, setShow] = useState(false)

  const handleShowQrCode = () => setShow(true)

  return (
    <Card className={style.card}>
      <CardContent className={style.cardContent}>
        <div className={style.cardTitle}>
          <h2>{title}</h2>
        </div>
        {show && (
          <div className={style.pixQrCode}>
            <QRCode
              value={qrCodeUrl}
              size={83}
            />
          </div>
        )}
        {
          !show && (
            <button
              className={style.cardQrcode}
              onClick={handleShowQrCode}
              type="button"
            >
              <IconPix width={18} height={18} />
              <strong>{showQrcode}</strong>
            </button>
          )
        }
        <div className={style.cardDueDate}>
          <p>{dueDateLabel} {dueDate}</p>
          <CopyButton
            feedbackText={copyQrCodeFeedback}
            feedbackTimeout={3000}
            fill="clean"
            icon={<IconCopy width="12px" height="12px" />}
            onClick={onCopy}
            size="tiny"
            title={copyQrCodeLabel}
          />
        </div>
      </CardContent>
    </Card>
  )
}

PaymentCard.propTypes = {
  copyQrCodeFeedback: PropTypes.string.isRequired,
  copyQrCodeLabel: PropTypes.string.isRequired,
  dueDate: PropTypes.string.isRequired,
  dueDateLabel: PropTypes.string.isRequired,
  onCopy: PropTypes.func.isRequired,
  qrCodeUrl: PropTypes.string.isRequired,
  showQrcode: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
}

export default PaymentCard

