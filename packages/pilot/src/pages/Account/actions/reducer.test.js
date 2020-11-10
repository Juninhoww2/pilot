import { selectCompanyFees, selectAnticipationType } from './reducer'

const companyFactory = mdrs => ({
  pricing: {
    gateway: {
      live: {
        antifraud_cost: [
          {
            cost: 70,
            name: 'pagarme',
          },
        ],
        boletos: {
          payment_fixed_fee: 380,
          payment_spread_fee: 0,
        },
        minimum_monthly_payment: 0,
        pix: {
          payment_fixed_fee: 380,
          payment_spread_fee: 1.19,
        },
        transaction_cost: {
          boleto: 0,
          credit_card: 50,
          debit_card: 50,
        },
        transaction_spread: {
          boleto: 0,
          credit_card: 0,
          debit_card: 1.5,
        },
      },
    },
    psp: {
      live: {
        anticipation: 3.14,
        mdrs,
      },
    },
    transfers: {
      credito_em_conta: 0,
      doc: 367,
      inter_recipient: 0,
      ted: 367,
    },
  },
})

describe('selectCompanyFees', () => {
  describe('when company has 1, 2 and 7 installments', () => {
    const company = companyFactory([{
      installments: [
        { installment: 1, mdr: 3.79 },
        { installment: 2, mdr: 4.19 },
        { installment: 7, mdr: 4.59 },
      ],
      payment_method: 'credit_card',
    }])
    const defaultRecipient = {}

    const fees = selectCompanyFees({ company, defaultRecipient })

    it('should return the correct response', () => {
      expect(fees).toEqual({
        anticipation: 3.14,
        antifraud: 70,
        boleto: 380,
        gateway: 50,
        installments: [
          { installment: 1, mdr: 3.79 },
          { installment: 2, mdr: 4.19 },
          { installment: 7, mdr: 4.59 },
        ],
        pix: {
          paymentFixedFee: 380,
          paymentSpreadFee: 1.19,
        },
        transfer: 367,
      })
    })
  })

  describe('when company has 1 installments', () => {
    const company = companyFactory([{
      installments: [{ installment: 1, mdr: 3.79 }],
      payment_method: 'credit_card',
    }])
    const defaultRecipient = {}

    const fees = selectCompanyFees({ company, defaultRecipient })

    it('should return the correct response', () => {
      expect(fees).toEqual({
        anticipation: 3.14,
        antifraud: 70,
        boleto: 380,
        gateway: 50,
        installments: [{ installment: 1, mdr: 3.79 }],
        pix: {
          paymentFixedFee: 380,
          paymentSpreadFee: 1.19,
        },
        transfer: 367,
      })
    })
  })

  describe('when company has 1, 2 and 7 installments and payment_method is null', () => {
    const company = companyFactory([
      {
        installments: [],
        payment_method: 'debit_card',
      }, {
        installments: [
          { installment: 1, mdr: 3.79 },
          { installment: 2, mdr: 4.19 },
          { installment: 7, mdr: 4.59 },
        ],
        payment_method: null,
      }])
    const defaultRecipient = {}

    const fees = selectCompanyFees({ company, defaultRecipient })

    it('should return the correct response', () => {
      expect(fees).toEqual({
        anticipation: 3.14,
        antifraud: 70,
        boleto: 380,
        gateway: 50,
        installments: [
          { installment: 1, mdr: 3.79 },
          { installment: 2, mdr: 4.19 },
          { installment: 7, mdr: 4.59 },
        ],
        pix: {
          paymentFixedFee: 380,
          paymentSpreadFee: 1.19,
        },
        transfer: 367,
      })
    })
  })

  describe('when company has other installments types', () => {
    const company = companyFactory([{
      installments: [
        { installment: 1, mdr: 3.79 },
        { installment: 4, mdr: 4.19 },
        { installment: 8, mdr: 4.59 },
      ],
      payment_method: 'credit_card',
    }])
    const defaultRecipient = {}

    const fees = selectCompanyFees({ company, defaultRecipient })

    it('should return the correct response', () => {
      expect(fees).toEqual({
        anticipation: 3.14,
        antifraud: 70,
        boleto: 380,
        gateway: 50,
        installments: [],
        pix: {
          paymentFixedFee: 380,
          paymentSpreadFee: 1.19,
        },
        transfer: 367,
      })
    })
  })

  describe('when company has two credit_card installments types', () => {
    const company = companyFactory([
      {
        installments: [
          { installment: 1, mdr: 4.99 },
        ],
        payment_method: 'credit_card',
      },
      {
        installments: [
          { installment: 1, mdr: 3.79 },
          { installment: 2, mdr: 4.19 },
          { installment: 7, mdr: 4.59 },
        ],
        payment_method: 'credit_card',
      },
    ])
    const defaultRecipient = {}

    const fees = selectCompanyFees({ company, defaultRecipient })

    it('should return the correct response', () => {
      expect(fees).toEqual({
        anticipation: 3.14,
        antifraud: 70,
        boleto: 380,
        gateway: 50,
        installments: [{ installment: 1, mdr: 4.99 }],
        pix: {
          paymentFixedFee: 380,
          paymentSpreadFee: 1.19,
        },
        transfer: 367,
      })
    })
  })

  describe('when company has defaultRecipient with feePreset set', () => {
    const company = companyFactory([])
    const defaultRecipient = {
      feePreset: {
        anticipation_rate: 10,
        mdrs: [
          {
            capture_method: 'ecommerce',
            installments: [{ installment: 1, mdr: 2 }],
            payment_method: 'credit_card',
          },
        ],
      },
    }

    const fees = selectCompanyFees({ company, defaultRecipient })

    it('should return the correct response', () => {
      expect(fees).toEqual({
        anticipation: 3.14,
        antifraud: 70,
        boleto: 380,
        gateway: 50,
        installments: [{ installment: 1, mdr: 2 }],
        pix: {
          paymentFixedFee: 380,
          paymentSpreadFee: 1.19,
        },
        transfer: 367,
      })
    })
  })

  describe('selectAnticipationType', () => {
    describe('when company has compulsory anticipation set at company level', () => {
      const company = { capabilities: { allow_transaction_anticipation: true } }
      const defaultRecipient = { automatic_anticipation_type: 'full' }

      const anticipationType = selectAnticipationType({
        company,
        defaultRecipient,
      })

      it('should have anticipation type equal compulsory', () => {
        expect(anticipationType).toEqual('compulsory')
      })
    })

    describe('when company has not compulsory anticipation set at company level', () => {
      const company = {
        capabilities: { allow_transaction_anticipation: false },
      }
      const defaultRecipient = { automatic_anticipation_type: 'full' }

      const anticipationType = selectAnticipationType({
        company,
        defaultRecipient,
      })

      it('should return the anticipation type set at the recipient', () => {
        expect(anticipationType).toEqual('full')
      })
    })
  })
})
