import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment-timezone'
import qs from 'qs'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { translate } from 'react-i18next'
import {
  __,
  all,
  allPass,
  always,
  anyPass,
  applySpec,
  compose,
  contains,
  equals,
  filter,
  find,
  has,
  head,
  identity,
  ifElse,
  includes,
  invoker,
  is,
  isEmpty,
  isNil,
  juxt,
  last,
  lte,
  map,
  path,
  pathOr,
  pipe,
  prop,
  propEq,
  propOr,
  propSatisfies,
  reduce,
  reverse,
  sortBy,
  split,
  splitAt,
  tail,
  uncurryN,
  unless,
  values,
} from 'ramda'
import {
  Flexbox,
} from 'former-kit'
import {
  requestConversion as requestConversionAction,
  requestMetrics as requestMetricsAction,
} from './actions'
import {
  requestLogout,
  getAcquirersRequest as getAcquirersRequestAction,
} from '../Account/actions/actions'
import { withError } from '../ErrorBoundary'
import creditCardBrands from '../../models/creditcardBrands'
import dateInputPresets from '../../models/dateSelectorPresets'
import HomeContainer from '../../containers/Home'
import icons from '../../models/icons'
import IndicatorTooltip from '../../components/HomeIndicatorTooltip'
import statusLegends from '../../models/statusLegends'
import isCompanyPaymentLink from '../../validation/isPaymentLink'
import isRecentlyCreatedCompany from '../../validation/recentCreatedCompany'

import {
  Message,
} from '../../components/Message'
import GenericErrorIcon from '../Errors/GenericError/Icon.svg'

const mapStateToProps = ({
  account: {
    acquirers,
    company,
    user,
  },
  home: {
    conversion,
    loading,
    metrics,
  },
}) => ({
  acquirers,
  company,
  conversion,
  loading,
  metrics,
  user,
})

const mapDispatchToProps = {
  getAcquirersRequest: getAcquirersRequestAction,
  logout: requestLogout,
  requestConversion: requestConversionAction,
  requestMetrics: requestMetricsAction,
}

const enhanced = compose(
  translate(),
  connect(mapStateToProps, mapDispatchToProps),
  withRouter,
  withError
)

const isNilOrEmpty = anyPass([isNil, isEmpty])

const areDatesEqual = ({ end, start }) => moment(start).isSame(end, 'day')

const momentToISOString = unless(
  isNilOrEmpty,
  pipe(moment, invoker(0, 'toISOString'))
)

const queryDatesToISOString = applySpec({
  dates: {
    end: pipe(prop('end'), momentToISOString),
    start: pipe(prop('start'), momentToISOString),
  },
})

const buildQuery = pipe(
  queryDatesToISOString,
  qs.stringify
)

const stringToMoment = unless(
  isNilOrEmpty,
  moment
)

const queryDatesToMoment = applySpec({
  end: pipe(path(['dates', 'end']), stringToMoment),
  start: pipe(path(['dates', 'start']), stringToMoment),
})

const getDatesFromUrl = unless(
  isNilOrEmpty,
  pipe(
    tail,
    qs.parse,
    queryDatesToMoment
  )
)

const possiblePresets = [7, 15, 30]

const getSelectedPreset = ({ end, start }) => {
  const today = moment()
  const daysDiff = Math.abs(start.diff(end, 'day'))
  if (today.isSame(start, 'day') && today.isSame(end, 'day')) {
    return 'today'
  }
  if (daysDiff <= 1) {
    return 'day'
  }
  if (includes(daysDiff, possiblePresets)) {
    return `days-${daysDiff}`
  }
  return 'custom'
}

const isInvalidDate = property => pipe(
  prop(property),
  isNilOrEmpty
)

const areInvalidDates = anyPass([
  isInvalidDate('end'),
  isInvalidDate('start'),
])

const updateQuery = (datesRange, replace) => {
  if (datesRange) {
    const queryString = buildQuery(datesRange)
    replace({ search: queryString })
  } else {
    replace('./')
  }
}

const defaultDates = {
  end: moment(),
  start: moment().subtract(7, 'days'),
}

const filterPossiblePresets = filter(
  pipe(
    prop('key'),
    split('-'),
    last,
    Number,
    includes(__, possiblePresets)
  )
)

const getDaysPresetsList = pipe(
  find(propEq('key', 'days')),
  prop('list'),
  filterPossiblePresets
)

let presets = null

const getPresets = (t) => {
  if (presets) {
    return presets
  }
  const dateSelectorPresets = dateInputPresets(t)
  const todayPreset = head(dateSelectorPresets)
  const customPreset = last(dateSelectorPresets)
  const presetList = getDaysPresetsList(dateSelectorPresets)

  presets = [todayPreset, ...presetList, customPreset]

  return presets
}

const getPercentualValueString = uncurryN(2, (value, total) => {
  const percentual = ((value / total) * 100)
  if (percentual % 1 === 0) {
    return `${percentual}%`
  }
  return `${percentual.toFixed(1)}%`
})

const sortIndicatorsData = pipe(
  sortBy(prop('value')),
  reverse
)

const visibleIndicatorsNumber = 2

const getIconByTitle = pipe(
  prop('title'),
  ifElse(
    is(Array),
    always(icons.others),
    propOr(icons.unknown, __, icons)
  )
)

const hasIcon = has(__, icons)

const createTooltipTitle = uncurryN(3, (t, total) => map(({ title, value }) => {
  const translationBase = 'pages.home.'
  let translation = t(`${translationBase}${title}`)
  translation = translation.indexOf(translationBase) > -1
    ? title
    : translation

  return (
    <div key={title}>
      {`${translation}: `}
      <b>{getPercentualValueString(value, total)}</b>
    </div>
  )
}))

const createOthersTitle = (t, totalValue) => (indicatorsTitles) => {
  if (is(Array, indicatorsTitles)) {
    return (
      <IndicatorTooltip
        label={t('pages.home.others')}
        indicatorsTitles={createTooltipTitle(t, totalValue, indicatorsTitles)}
      />
    )
  }

  return indicatorsTitles
}

const enhanceIndicatorTitle = (t, totalValue) => pipe(
  prop('title'),
  ifElse(
    hasIcon,
    title => t(`pages.home.${title}`),
    createOthersTitle(t, totalValue)
  )
)

const getOthersIndicatorReducer = (acc, { title, value }) => ({
  icon: creditCardBrands.default.icon,
  title: [...acc.title, { title, value }],
  value: acc.value + value,
})

const createOthersIndicator = reduce(
  getOthersIndicatorReducer,
  {
    title: [],
    value: 0,
  }
)

const groupIndicators = ([indicators, total]) => {
  const sortedIndicators = sortIndicatorsData(indicators)

  if (sortedIndicators.length <= visibleIndicatorsNumber + 1) {
    return [sortedIndicators, total]
  }

  const [visibleIndicators, others] = splitAt(
    visibleIndicatorsNumber,
    sortedIndicators
  )

  if (others.length > 0) {
    const othersIndicator = createOthersIndicator(others)

    return [[...visibleIndicators, othersIndicator], total]
  }

  return [visibleIndicators, total]
}

const enhanceIndicator = uncurryN(3, (totalValue, t) => map(
  applySpec({
    icon: getIconByTitle,
    title: enhanceIndicatorTitle(t, totalValue),
    value: pipe(
      prop('value'),
      getPercentualValueString(__, totalValue)
    ),
  })
))

const enhanceIndicators = uncurryN(2, t => ifElse(
  isNilOrEmpty,
  always([]),
  pipe(
    juxt([
      identity,
      reduce((acc, indicator) => acc + propOr(0, 'value', indicator), 0),
    ]),
    groupIndicators,
    ([indicators, total]) => enhanceIndicator(total, t, indicators)
  )
))

const getStatusPropBy = (statusProp, property) => pipe(
  prop(property),
  prop(__, statusLegends),
  unless(
    isNilOrEmpty,
    prop(statusProp)
  )
)

const getColorFromStatus = getStatusPropBy('color', 'title')

const getTitleFromStatus = getStatusPropBy('text', 'title')

const enhanceGraphicData = ({
  getColor = always(null),
  getLabel = prop('title'),
  getValue = propOr(0, 'value'),
} = {}) => ifElse(
  isNilOrEmpty,
  always([]),
  map(applySpec({
    color: getColor,
    label: getLabel,
    value: getValue,
  }))
)

const enhanceTransactionsStatusGraphicData = enhanceGraphicData({
  getColor: getColorFromStatus,
  getLabel: getTitleFromStatus,
})

const enhanceAmountByWeekdayData = enhanceGraphicData()

const enhanceInstallmentsGraphicData = uncurryN(2, t => enhanceGraphicData({
  getLabel: ({ title }) => t('pages.home.installments', { count: title }),
}))

const enhanceGreetingsDescription = (t, { end, start }) => {
  const equalDates = areDatesEqual({ end, start })
  const datesString = equalDates
    ? ` ${moment(start).format('L')}`
    : ` ${moment(start).format('L')} ${t('pages.home.until')} ${moment(end).format('L')}`

  return (
    <span>
      {`${t('pages.home.greeting_summary')} `}
      {equalDates ? t('pages.home.on') : t('pages.home.between')}
      <b>{datesString}</b>
    </span>
  )
}

const isEmptyProp = anyPass([
  propSatisfies(isNilOrEmpty),
  propSatisfies(lte(0)),
])

const isEmptyVolumeByWeekday = pipe(
  propOr([{}], 'volumeByWeekday'),
  reduce(
    (acc, { value }) => acc || value <= 0,
    false
  )
)

const verifyEmptyMetrics = allPass([
  isEmptyProp('averageAmount'),
  isEmptyProp('cardBrands'),
  isEmptyProp('installments'),
  isEmptyProp('paymentMethods'),
  isEmptyProp('refuseReasons'),
  isEmptyProp('status'),
  isEmptyProp('totalAmount'),
  isEmptyProp('totalTransactions'),
  isEmptyVolumeByWeekday,
])

const enhanceConversion = (label, conversionPath) => applySpec({
  label: always(label),
  value: pathOr(0, conversionPath),
})

const getConversions = (t, conversion, isPixEnabled) => {
  const res = juxt([
    enhanceConversion(
      t('pages.home.conversion.real'),
      ['card', 'conversion']
    ),
    enhanceConversion(
      t('pages.home.conversion.without_retries'),
      ['card', 'withoutRetries']
    ),
    enhanceConversion(
      t('pages.home.conversion.boleto'),
      ['boleto', 'conversion']
    ),
  ])(conversion)

  if (isPixEnabled) {
    res.push(enhanceConversion(
      t('pages.home.conversion.pix'),
      ['pix', 'conversion']
    )(conversion))
  }

  return res
}

const userNotHidEmptyState = () => isNilOrEmpty(localStorage.getItem('hide_empty-state'))

const defaultPreset = 'days-7'

const isGlobalLoading = pipe(
  values,
  all(equals(true))
)

const Home = ({
  acquirers,
  company,
  conversion,
  error,
  getAcquirersRequest,
  history: {
    location: {
      search,
    },
    replace,
  },
  loading,
  metrics,
  requestConversion,
  requestMetrics,
  t,
  user,
}) => {
  const initialSearchDates = getDatesFromUrl(search)
  const [dates, setDates] = useState(search ? initialSearchDates : defaultDates)
  const [preset, setPreset] = useState(defaultPreset)
  const [isPixEnabled, setIsPixEnabled] = useState(false)

  const handleDatesChange = (datesRange) => {
    setDates(datesRange)
    updateQuery(datesRange, replace)
  }

  const handleDatesConfirm = (datesRange, newPreset) => {
    setDates(datesRange)
    setPreset(newPreset ? newPreset.key : 'custom')
    updateQuery(datesRange, replace)
  }

  /* Start effects */
  useEffect(() => {
    if (search) {
      const searchDates = getDatesFromUrl(search)
      if (!areInvalidDates(searchDates)) {
        requestConversion(searchDates)
        requestMetrics(searchDates)
      }
    }
  }, [search, requestConversion, requestMetrics])

  useEffect(() => {
    if (!search) {
      updateQuery(dates, replace)
    }
  }, [dates, search, replace])

  useEffect(() => {
    if (search) {
      const searchDates = getDatesFromUrl(search)
      const newPreset = getSelectedPreset(searchDates)
      setPreset(newPreset)
    }
  }, [search])

  useEffect(() => {
    if (!isNilOrEmpty(company)
      && !isCompanyPaymentLink(company)
      && isRecentlyCreatedCompany({ company })
      && userNotHidEmptyState()
    ) {
      replace('/welcome')
    }
  }, [company, replace, user])

  useEffect(() => {
    getAcquirersRequest()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setIsPixEnabled(!!find(
      pipe(
        propOr([], 'payment_methods'),
        contains('pix')
      )
    )(acquirers))
  }, [acquirers])
  /* End effects */

  const {
    averageAmount = 0,
    cardBrands,
    installments,
    paymentMethods,
    refuseReasons,
    status,
    totalAmount = 0,
    totalTransactions = 0,
    volumeByWeekday,
  } = metrics || {}

  if (error) {
    const message = t('pages.error.internal_message')
    const title = t('pages.error.internal_title')

    return (
      <Flexbox
        alignItems="center"
        justifyContent="center"
      >
        <Message
          image={<GenericErrorIcon width={365} height={148} />}
          message={message}
          title={title}
        />
      </Flexbox>
    )
  }

  return (
    <HomeContainer
      averageAmount={averageAmount}
      cardBrands={enhanceIndicators(t, cardBrands)}
      conversions={getConversions(t, conversion, isPixEnabled)}
      dates={dates}
      isEmptySearch={verifyEmptyMetrics(metrics || {})}
      labels={{
        description: enhanceGreetingsDescription(t, dates),
        greeting: t('pages.home.greeting', { name: user.name }),
      }}
      loading={isGlobalLoading(loading)}
      localLoading={loading}
      onDateChange={handleDatesChange}
      onDateConfirm={handleDatesConfirm}
      paymentMethods={enhanceIndicators(t, paymentMethods)}
      presets={getPresets(t)}
      refuseReasons={enhanceIndicators(t, refuseReasons)}
      selectedPreset={preset}
      t={t}
      totalAmount={totalAmount}
      totalTransactions={totalTransactions}
      totalAmountByWeekday={enhanceAmountByWeekdayData(volumeByWeekday)}
      transactionsByInstallment={enhanceInstallmentsGraphicData(
        t,
        installments
      )}
      transactionsByStatus={enhanceTransactionsStatusGraphicData(status)}
    />
  )
}

const indicatorShape = PropTypes.shape({
  icon: PropTypes.node,
  title: PropTypes.node,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
})

const graphicDataShape = PropTypes.shape({
  color: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.number,
})

Home.propTypes = {
  acquirers: PropTypes.arrayOf(PropTypes.shape()),
  company: PropTypes.shape({
    alreadyTransacted: PropTypes.bool,
  }),
  conversion: PropTypes.shape({
    boleto: PropTypes.shape({
      conversion: PropTypes.number,
      paid: PropTypes.number,
      total: PropTypes.number,
    }),
    card: PropTypes.shape({
      conversion: PropTypes.number,
      paid: PropTypes.number,
      total: PropTypes.number,
      withoutRetries: PropTypes.number,
    }),
  }),
  error: PropTypes.shape({
    localized: PropTypes.shape({
      message: PropTypes.string.isRequired,
    }),
    message: PropTypes.string.isRequired,
  }),
  getAcquirersRequest: PropTypes.func.isRequired,
  history: PropTypes.shape({
    location: PropTypes.shape({
      search: PropTypes.string,
    }).isRequired,
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
  }).isRequired,
  loading: PropTypes.shape({
    metrics: PropTypes.bool,
  }),
  metrics: PropTypes.shape({
    averageAmount: PropTypes.number,
    cardBrands: PropTypes.arrayOf(indicatorShape),
    installments: PropTypes.arrayOf(graphicDataShape),
    paymentMethods: PropTypes.arrayOf(indicatorShape),
    refuseReasons: PropTypes.arrayOf(indicatorShape),
    status: PropTypes.arrayOf(graphicDataShape),
    totalAmount: PropTypes.number,
    totalTransactions: PropTypes.number,
  }),
  requestConversion: PropTypes.func.isRequired,
  requestMetrics: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  user: PropTypes.shape({
    date_created: PropTypes.string,
    name: PropTypes.string,
  }),
}

Home.defaultProps = {
  acquirers: [],
  company: {},
  conversion: {
    boleto: {},
    card: {},
  },
  error: null,
  loading: {},
  metrics: {},
  user: {},
}

export default enhanced(Home)
