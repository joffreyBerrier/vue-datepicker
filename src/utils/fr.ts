import type { LanguageTranslations } from '@/types'

export const fr = <LanguageTranslations>{
  clearDates: 'Effacer les dates',
  close: 'Fermer',
  days: {
    monday: 'Lun',
    tuesday: 'Mar',
    wednesday: 'Mer',
    thursday: 'Jeu',
    friday: 'Ven',
    saturday: 'Sam',
    sunday: 'Dim'
  },
  today: "Aujourd'hui",
  periodType: {
    weeklyBySaturday:
      '%{minimumDuration} semaine min. du samedi au samedi || %{minimumDuration} semaines min. du samedi au samedi',
    weeklyBySunday:
      '%{minimumDuration} semaine min. du dimanche au dimanche || %{minimumDuration} semaines min. du dimanche au dimanche',
    weeklyByMonday:
      '%{minimumDuration} semaine min. du lundi au lundi || %{minimumDuration} semaines min. du lundi au lundi',
    nightly:
      'Un minimum de %{minimumDuration} nuit est requis || Un minimum de %{minimumDuration} nuits est requis'
  },
  halfDay: {
    checkIn: 'Fin de séjour possible',
    checkOut: 'Début de séjour possible'
  }
}
