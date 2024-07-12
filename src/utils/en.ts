import type { LanguageTranslations } from '@/types'

export const en = <LanguageTranslations>{
  clearDates: 'Clear dates',
  close: 'Close',
  days: {
    monday: 'Mo',
    tuesday: 'Tu',
    wednesday: 'We',
    thursday: 'Th',
    friday: 'Fr',
    saturday: 'Sa',
    sunday: 'Su'
  },
  today: 'Today',
  periodType: {
    weeklyBySaturday: 'From Saturday to Saturday',
    weeklyBySunday: 'From Sunday to Sunday',
    weeklyByMonday: 'From Monday to Monday',
    nightly: 'A minimum of %{minimumDuration} night is required'
  },
  halfDay: {
    checkIn: 'Possible end of stay',
    checkOut: 'Possible start of stay'
  }
}
