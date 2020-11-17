import moment from 'moment'
import paymentLinkSpec from './paymentLinkSpec'

describe('paymentLinkSpec', () => {
  describe('when only credit_card is set', () => {
    it('should properly create the request payload', () => {
      const name = 'Christmas Gifts #25'
      const result = paymentLinkSpec({
        amount: '1231',
        boleto: false,
        boleto_expires_in: '7',
        chargeTransactionFee: true,
        credit_card: true,
        expiration_amount: '23',
        expiration_unit: 'days',
        free_installments: '1',
        name,
      })
      expect(result.amount).toEqual(1231)
      expect(result.expires_in).toEqual(33120)
      expect(result.name).toEqual(name)
      expect(result.items.length).toEqual(1)
      expect(result.items[0].id).toBeDefined()
      expect(result.items[0].title).toEqual(name)
      expect(result.items[0].quantity).toEqual(1)
      expect(result.items[0].tangible).toEqual(true)
      expect(result.payment_config).toEqual({
        credit_card: {
          charge_transaction_fee: true,
          enabled: true,
          free_installments: 1,
          max_installments: 12,
        },
        default_payment_method: 'credit_card',
      })
    })
  })

  describe('when credit_card and boleto is set', () => {
    it('should properly create the request payload', () => {
      const name = 'Totally Not Bribery $$$'
      const result = paymentLinkSpec({
        amount: '100000000',
        boleto: true,
        boleto_expires_in: '16',
        chargeTransactionFee: false,
        credit_card: true,
        expiration_amount: '23',
        expiration_unit: 'days',
        free_installments: '10',
        interest_rate: '20',
        max_installments: '1',
        name,
      })
      expect(result.amount).toEqual(100000000)
      expect(result.expires_in).toEqual(33120)
      expect(result.name).toEqual(name)
      expect(result.items.length).toEqual(1)
      expect(result.items[0].id).toBeDefined()
      expect(result.items[0].title).toEqual(name)
      expect(result.items[0].quantity).toEqual(1)
      expect(result.items[0].tangible).toEqual(true)
      expect(result.payment_config).toEqual({
        boleto: {
          enabled: true,
          expires_in: 16,
        },
        credit_card: {
          charge_transaction_fee: false,
          enabled: true,
          free_installments: 10,
          interest_rate: 20,
          max_installments: 1,
        },
        default_payment_method: 'credit_card',
      })
    })
  })

  describe('when pix, credit_card, and boleto is set', () => {
    it('should properly create the request payload', () => {
      const name = 'Ryzen 9 5900X'
      const payload = {
        amount: '427920',
        boleto: true,
        boleto_expires_in: '16',
        chargeTransactionFee: false,
        credit_card: true,
        expiration_amount: '23',
        expiration_unit: 'days',
        free_installments: '10',
        interest_rate: '20',
        max_installments: '1',
        name,
        pix: true,
      }
      const result = paymentLinkSpec(payload)
      expect(result.amount).toEqual(427920)
      expect(result.expires_in).toEqual(33120)
      expect(result.name).toEqual(name)
      expect(result.items.length).toEqual(1)
      expect(result.items[0].id).toBeDefined()
      expect(result.items[0].title).toEqual(name)
      expect(result.items[0].quantity).toEqual(1)
      expect(result.items[0].tangible).toEqual(true)
      expect(result.payment_config.boleto).toEqual({
        enabled: true,
        expires_in: 16,
      })
      expect(result.payment_config.credit_card).toEqual({
        charge_transaction_fee: false,
        enabled: true,
        free_installments: 10,
        interest_rate: 20,
        max_installments: 1,
      })
      expect(result.payment_config.default_payment_method).toEqual('credit_card')
      expect(result.payment_config.pix.enabled).toEqual(true)

      const expectedLinkExpirationDate = moment()
        .add(payload.expiration_amount, payload.expiration_unit)
        .add(1, 'minute')
      const pixExpirationDate = moment(
        result.payment_config.pix.expiration_date
      )

      expect(pixExpirationDate.year()).toEqual(
        expectedLinkExpirationDate.year()
      )
      expect(pixExpirationDate.month()).toEqual(
        expectedLinkExpirationDate.month()
      )
      expect(pixExpirationDate.date()).toEqual(
        expectedLinkExpirationDate.date()
      )
      expect(pixExpirationDate.hours()).toEqual(
        expectedLinkExpirationDate.hours()
      )
      expect(pixExpirationDate.minutes()).toEqual(
        expectedLinkExpirationDate.minutes()
      )
    })
  })

  describe('when payment link has no expiration date', () => {
    it('pix_expiration_date should be set to one year from current date', () => {
      const name = 'Gel Antisséptico'
      const result = paymentLinkSpec({
        amount: '10000',
        name,
        pix: true,
      })
      expect(result.amount).toEqual(10000)
      expect(result.name).toEqual(name)
      expect(result.items.length).toEqual(1)
      expect(result.items[0].id).toBeDefined()
      expect(result.items[0].title).toEqual(name)
      expect(result.items[0].quantity).toEqual(1)
      expect(result.items[0].tangible).toEqual(true)
      expect(result.payment_config.default_payment_method).toEqual('pix')
      expect(result.payment_config.pix.enabled).toEqual(true)

      const expectedLinkExpirationDate = moment().add(1, 'year')
      const pixExpirationDate = moment(
        result.payment_config.pix.expiration_date
      )

      expect(pixExpirationDate.year()).toEqual(
        expectedLinkExpirationDate.year()
      )
      expect(pixExpirationDate.month()).toEqual(
        expectedLinkExpirationDate.month()
      )
      expect(pixExpirationDate.date()).toEqual(
        expectedLinkExpirationDate.date()
      )
      expect(pixExpirationDate.hours()).toEqual(
        expectedLinkExpirationDate.hours()
      )
      expect(pixExpirationDate.minutes()).toEqual(
        expectedLinkExpirationDate.minutes()
      )
    })
  })
})
