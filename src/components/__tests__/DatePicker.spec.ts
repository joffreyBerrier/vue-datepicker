import { afterEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import Calendar from '../DatePicker.vue'

let wrapper: any

const startDateYear = new Date().getFullYear() + 2
const disabledClasses = ['calendar_day', 'z-5', 'calendar_day--in-period', 'event-none']
const disabledClassWhenWeeklyMoreThan1 = [
  'calendar_day',
  'z-5',
  'calendar_day--in-period',
  'event-none',
  'calendar_day--is-a-day-period'
]
const enablePeriodClasses = ['calendar_day', 'z-5', 'calendar_day--is-a-day-period']
const enableClasses = ['calendar_day', 'z-5']

const checkIn = new Date('2026-04-01')
const checkOut = new Date('2026-04-20')
const placeholder = {
  checkIn: 'Check-in',
  checkOut: 'Check-out'
}

afterEach(() => {
  wrapper.unmount()
})

describe('Calendar', () => {
  it('is a Vue instance', () => {
    const periodDates = [
      {
        id: '1',
        startAt: '2026-04-01',
        endAt: '2026-04-06',
        minimumDuration: 3,
        periodType: 'nightly'
      },
      {
        id: '2',
        startAt: '2026-04-06',
        endAt: '2026-04-27',
        minimumDuration: 1,
        periodType: 'weekly_by_saturday'
      }
    ]

    wrapper = mount(Calendar, {
      props: {
        checkIn: checkIn,
        checkOut: checkOut,
        alwaysVisible: true,
        periodDates: periodDates,
        placeholder: placeholder
      }
    })
    expect(wrapper.vm).toBeTruthy()
  })

  it('renders Calendar properly', () => {
    const periodDates = [
      {
        id: '1',
        startAt: '2026-04-01',
        endAt: '2026-04-06',
        minimumDuration: 3,
        periodType: 'nightly'
      },
      {
        id: '2',
        startAt: '2026-04-06',
        endAt: '2026-04-27',
        minimumDuration: 1,
        periodType: 'weekly_by_saturday'
      }
    ]

    wrapper = mount(Calendar, {
      props: {
        checkIn: checkIn,
        checkOut: checkOut,
        alwaysVisible: true,
        periodDates: periodDates,
        placeholder: placeholder
      }
    })
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('Renders correct checkout when minimum stay is nightly 1', async () => {
    const periodDates = [
      {
        id: '1',
        startAt: `2026-01-01`,
        endAt: `2026-01-06`,
        minimumDuration: 1,
        periodType: 'nightly'
      }
    ]
    wrapper = mount(Calendar, {
      props: {
        checkIn: '',
        checkOut: '',
        startDate: new Date(startDateYear, 0, 2),
        endDate: new Date(startDateYear, 11, 1),
        alwaysVisible: true,
        periodDates: periodDates,
        placeholder: placeholder
      }
    })

    const checkin = wrapper.get(`[data-testid="day-2026-01-01"]`)
    await checkin.trigger('click')
    const checkout = wrapper.get(`[data-testid="day-2026-01-02"]`)

    expect(checkout.classes()).toEqual(enableClasses)
  })

  it('Renders correct checkout when minimum stay is nightly 2', async () => {
    const periodDates = [
      {
        id: '1',
        startAt: `2026-01-01`,
        endAt: `2026-01-06`,
        minimumDuration: 2,
        periodType: 'nightly'
      }
    ]

    wrapper = mount(Calendar, {
      props: {
        checkIn: '',
        checkOut: '',
        startDate: new Date(startDateYear, 0, 2),
        endDate: new Date(startDateYear, 11, 1),
        alwaysVisible: true,
        periodDates: periodDates,
        placeholder: placeholder
      }
    })
    const checkin = wrapper.get(`[data-testid="day-2026-01-01"]`)
    await checkin.trigger('click')
    const dayAfterCheckin = wrapper.get(`[data-testid="day-2026-01-02"]`)
    const checkout = wrapper.get(`[data-testid="day-2026-01-03"]`)

    expect(checkout.classes()).toEqual(enableClasses)
    expect(dayAfterCheckin.classes()).toEqual(disabledClasses)
  })

  it('Renders correct checkout when minimum stay is weekly_by_saturday 1', async () => {
    const periodDates = [
      {
        id: '1',
        startAt: `2026-01-03`,
        endAt: `2026-01-10`,
        minimumDuration: 1,
        periodType: 'weekly_by_saturday'
      }
    ]

    wrapper = mount(Calendar, {
      props: {
        checkIn: '',
        checkOut: '',
        startDate: new Date(startDateYear, 0, 2),
        endDate: new Date(startDateYear, 11, 1),
        alwaysVisible: true,
        periodDates: periodDates,
        placeholder: placeholder
      }
    })
    const checkin = wrapper.get(`[data-testid="day-2026-01-03"]`)
    await checkin.trigger('click')
    const day1AfterCheckin = wrapper.get(`[data-testid="day-2026-01-04"]`)
    const day2AfterCheckin = wrapper.get(`[data-testid="day-2026-01-05"]`)
    const day3AfterCheckin = wrapper.get(`[data-testid="day-2026-01-06"]`)
    const day4AfterCheckin = wrapper.get(`[data-testid="day-2026-01-07"]`)
    const day5AfterCheckin = wrapper.get(`[data-testid="day-2026-01-08"]`)
    const day6AfterCheckin = wrapper.get(`[data-testid="day-2026-01-09"]`)
    const checkout = wrapper.get(`[data-testid="day-2026-01-10"]`)

    expect(checkout.classes()).toEqual(enablePeriodClasses)

    expect(day1AfterCheckin.classes()).toEqual(disabledClasses)
    expect(day2AfterCheckin.classes()).toEqual(disabledClasses)
    expect(day3AfterCheckin.classes()).toEqual(disabledClasses)
    expect(day4AfterCheckin.classes()).toEqual(disabledClasses)
    expect(day5AfterCheckin.classes()).toEqual(disabledClasses)
    expect(day6AfterCheckin.classes()).toEqual(disabledClasses)
  })

  it('Renders correct checkout when minimum stay is weekly_by_saturday 2', async () => {
    const periodDates = [
      {
        id: '1',
        startAt: `2026-01-03`,
        endAt: `2026-01-17`,
        minimumDuration: 2,
        periodType: 'weekly_by_saturday'
      }
    ]

    wrapper = mount(Calendar, {
      props: {
        checkIn: '',
        checkOut: '',
        startDate: new Date(startDateYear, 0, 2),
        endDate: new Date(startDateYear, 11, 1),
        alwaysVisible: true,
        periodDates: periodDates,
        placeholder: placeholder
      }
    })
    const checkin = wrapper.get('[data-testid="day-2026-01-03"]')
    await checkin.trigger('click')
    const day1AfterCheckin = wrapper.get(`[data-testid="day-2026-01-04"]`)
    const day2AfterCheckin = wrapper.get(`[data-testid="day-2026-01-05"]`)
    const day3AfterCheckin = wrapper.get(`[data-testid="day-2026-01-06"]`)
    const day4AfterCheckin = wrapper.get(`[data-testid="day-2026-01-07"]`)
    const day5AfterCheckin = wrapper.get(`[data-testid="day-2026-01-08"]`)
    const day6AfterCheckin = wrapper.get(`[data-testid="day-2026-01-09"]`)
    const day7AfterCheckin = wrapper.get('[data-testid="day-2026-01-10"]')
    const day8AfterCheckin = wrapper.get('[data-testid="day-2026-01-11"]')
    const day9AfterCheckin = wrapper.get('[data-testid="day-2026-01-12"]')
    const day10AfterCheckin = wrapper.get('[data-testid="day-2026-01-13"]')
    const day11AfterCheckin = wrapper.get('[data-testid="day-2026-01-14"]')
    const day12AfterCheckin = wrapper.get('[data-testid="day-2026-01-15"]')
    const day13AfterCheckin = wrapper.get('[data-testid="day-2026-01-16"]')
    const checkout = wrapper.get('[data-testid="day-2026-01-17"]')

    expect(checkout.classes()).toEqual(enablePeriodClasses)

    expect(day1AfterCheckin.classes()).toEqual(disabledClasses)
    expect(day2AfterCheckin.classes()).toEqual(disabledClasses)
    expect(day3AfterCheckin.classes()).toEqual(disabledClasses)
    expect(day4AfterCheckin.classes()).toEqual(disabledClasses)
    expect(day5AfterCheckin.classes()).toEqual(disabledClasses)
    expect(day6AfterCheckin.classes()).toEqual(disabledClasses)
    expect(day7AfterCheckin.classes()).toEqual(disabledClassWhenWeeklyMoreThan1)
    expect(day8AfterCheckin.classes()).toEqual(disabledClasses)
    expect(day9AfterCheckin.classes()).toEqual(disabledClasses)
    expect(day10AfterCheckin.classes()).toEqual(disabledClasses)
    expect(day11AfterCheckin.classes()).toEqual(disabledClasses)
    expect(day12AfterCheckin.classes()).toEqual(disabledClasses)
    expect(day13AfterCheckin.classes()).toEqual(disabledClasses)
  })
})
