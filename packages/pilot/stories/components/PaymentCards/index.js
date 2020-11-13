import React from 'react'
import {
  Col,
  Grid,
  Row,
} from 'former-kit'
import { action } from '@storybook/addon-actions'

import Section from '../../Section'
import PaymentCard from '../../../src/components/PaymentCard'
import PaymentBoleto from '../../../src/components/PaymentBoleto'
import PaymentPix from '../../../src/components/PaymentPix'

const copyToClipBoard = (text) => {
  const textarea = document.createElement('textarea')
  textarea.textContent = text

  textarea.style.opacity = 0
  textarea.style.position = 'absolute'

  document.body.appendChild(textarea)
  textarea.select()

  document.execCommand('copy')
  document.body.removeChild(textarea)
}

const PaymentCards = () => (
  <Section>
    <Grid>
      <Row stretch>
        <Col palm={12} tablet={6} desk={3}>
          <PaymentCard
            first="3764"
            last="6001"
            holderName="João dos Santos Lima"
            brand="mastercard"
            title="Cartão de Crédito"
          />
        </Col>

        <Col palm={12} tablet={6} desk={3}>
          <PaymentBoleto
            barcode="23791.22928 50000.673934 58000.04902 3 72110000030000"
            copyBarcodeFeedback="Copiado!"
            copyBarcodeLabel="copiar"
            dueDate="20/03/2018"
            dueDateLabel="Vencimento"
            onCopy={copyToClipBoard}
            onShow={action('ver boleto')}
            showBoletoLabel="ver boleto"
            title="Boleto"
          />
        </Col>

        <Col palm={12} tablet={6} desk={3}>
          <PaymentPix
            copyQrCodeFeedback="Copiado!"
            copyQrCodeLabel="copiar"
            dueDate="20/03/2018"
            dueDateLabel="Vencimento:"
            onCopy={copyToClipBoard}
            onShow={action('ver boleto')}
            qrCodeUrl="www.pagar.me"
            showQrcode="Ver código QR"
            title="Pix"
          />
        </Col>
      </Row>
    </Grid>
  </Section>
)

export default PaymentCards

