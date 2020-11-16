const types = {
  analyze: {
    status: {
      approved: {
        status: 'Aprovada',
        title: 'Análise de antifraude',
      },
      deferred: {
        status: 'Processando',
        title: 'Análise de antifraude',
      },
      failed: {
        status: 'Falhou',
        title: 'Análise de antifraude',
      },
      processing: {
        status: 'Processando',
        title: 'Análise de antifraude',
      },
      refused: {
        status: 'Negada com risco alto',
        title: 'Análise de antifraude',
      },
    },
  },
  authorize: {
    status: {
      deferred: {
        status: 'Pendente',
        title: 'Autorização',
      },
      failed: {
        status: 'Falhou',
        title: 'Autorização',
      },
      processing: {
        status: 'Em processamento',
        title: 'Autorização',
      },
      success: {
        title: 'Autorizada',
      },
    },
  },
  capture: {
    status: {
      deferred: {
        status: 'Pendente',
        title: 'Captura',
      },
      failed: {
        status: 'Falhou',
        title: 'Captura',
      },
      processing: {
        status: 'Em processamento',
        title: 'Captura',
      },
      success: {
        title: 'Capturada',
      },
    },
  },
  chargeback: {
    status: {
      deferred: {
        status: 'Pendente',
        title: 'Chargeback',
      },
      failed: {
        status: 'Falhou',
        title: 'Chargeback',
      },
      processing: {
        status: 'Em processamento',
        title: 'Chargeback',
      },
      success: {
        title: 'Chargeback Recebido',
      },
    },
  },
  chargeback_refund: {
    status: {
      deferred: {
        status: 'Reapresentação pendente',
        title: 'Chargeback',
      },
      failed: {
        status: 'Reapresentação falhou',
        title: 'Chargeback',
      },
      processing: {
        status: 'Reapresentação em processamento',
        title: 'Chargeback',
      },
      success: {
        title: 'Chargeback Reapresentado',
      },
    },
  },
  conciliate: {
    status: {
      deferred: {
        status: 'Pendente',
        title: 'Conciliação',
      },
      failed: {
        status: 'Falhou',
        title: 'Conciliação',
      },
      processing: {
        status: 'Em processamento',
        title: 'Conciliação',
      },
      success: {
        title: 'Pago',
      },
    },
  },
  issue: {
    status: {
      deferred: {
        status: 'Pendente',
        title: 'Emissão',
      },
      failed: {
        status: 'Falhou',
        title: 'Emissão',
      },
      processing: {
        status: 'Em processamento',
        title: 'Emissão',
      },
      success: {
        title: 'Emitido',
      },
    },
  },
  manual_review: {
    status: {
      approved: {
        status: 'Aprovada',
        title: 'Revisão manual',
      },
      pending: {
        status: 'Pendente',
        title: 'Revisão manual',
      },
      refused: {
        status: 'Recusada',
        title: 'Revisão manual',
      },
      timeout: {
        status: 'Expirada',
        title: 'Revisão manual',
      },
    },
  },
  refund: {
    status: {
      deferred: {
        status: 'Pendente',
        title: 'Estorno',
      },
      failed: {
        status: 'Falhou',
        title: 'Estorno',
      },
      processing: {
        status: 'Em processamento',
        title: 'Estorno',
      },
      success: {
        title: 'Estornada',
      },
    },
  },
  validate: {
    status: {
      deferred: {
        status: 'Pendente',
        title: 'Validação do cartão',
      },
      failed: {
        status: 'Falhou',
        title: 'Validação do cartão',
      },
      processing: {
        status: 'Em processamento',
        title: 'Validação do cartão',
      },
      success: {
        title: 'Cartão validado',
      },
    },
  },
}

export default types
