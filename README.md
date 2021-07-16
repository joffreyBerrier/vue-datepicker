# vue-datepicker

👊 An easier datePicker in Vue.js 👊

https://github.com/joffreyBerrier/vue-datepicker/projects/1

🔥 Vue3 + Typescript + Tailwind + HeroIcon 🔥

# Sandbox example


_Open this link on a new tab_

[![Edit vue-calendar-3](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/vue-calendar-3-ezer3?fontsize=14&theme=dark&view=preview) 

## Installation

#### NPM / YARN

Install the package:

```
npm install vue-calendar-3 --save
yarn add vue-calendar-3
```

```javascript
import { Calendar } from 'vue-calendar-3'
// If you using vite
import 'vue-calendar-3/style'
// If you not
import 'vue-calendar-3/dist/library.css'

export default {
  components: {
    Calendar,
  },
}
```

```html
<Calendar />
```

## Data binding

### CheckIn

- Type: `Date`
- Default: `null`

Exemple : `v-model:checkIn=""`

### CheckOut

- Type: `Date`
- Default: `null`

Exemple : `v-model:checkOut=""`

## Props/Options

### BookedDates

- Type: `string[]`
- Default: `[]`

This data is an array of your booked dates, the date is already booked is appear it in disabled

Exemple:

```javascript
bookedDates: [
  '2021-06-01',
  '2021-06-02',
  '2021-06-03',
  '2021-06-23',
  '2021-06-24',
  '2021-06-25',
]
```

### PeriodDates

- Type: `Array`
- Default: `[]`

This data is an array of object of your periods

#### The **startAt**

Corresponds to the start of your periods with the format `YYYY-MM-DD`

#### The **endAt**

Corresponds to the start of your periods with the format `YYYY-MM-DD`

**Each period correspond to different logic define by `periodType` and `minimumDuration`**

#### The **periodType**:

- Corresponds to the day you want to block the period, `nightly`,` weekly_by_saturday` or `weekly_by_sunday`

#### The **minimumDuration**:

- Corresponds to the number of the days where you want to block the period.

- If the periodType is `nightly` the count corresponds the number of days
- If the periodType is `weekly_by_saturday` or `weekly_by_sunday` the count corresponds to the number of weeks

Exemple:

```javascript
periodDates: [
  // Nightly
  {
    startAt: '2021-08-01',
    endAt: '2021-08-31',
    minimumDuration: 4,
    periodType: 'nightly',
  },
  // Weekly Saturday
  {
    startAt: '2021-09-01',
    endAt: '2021-09-30',
    minimumDuration: 2,
    periodType: 'weekly_by_saturday',
  },
  // Weekly Sunday
  {
    startAt: '2021-11-01',
    endAt: '2021-11-29',
    minimumDuration: 1,
    periodType: 'weekly_by_sunday',
  },
]
```

## Events

`@renderNextMonth` : fires when the user clicks on paginate

#### Example :

```typescript
  bookedDates: [
    '2021-06-01',
    '2021-06-02',
    '2021-06-03',
    '2021-06-23',
    '2021-06-24',
    '2021-06-25',
  ] as string[],
  periodDates: [
    {
      startAt: '2021-07-01',
      endAt: '2021-08-31',
      minimumDuration: 4,
      periodType: 'nightly',
    },
    {
      startAt: '2021-09-01',
      endAt: '2021-09-30',
      minimumDuration: 2,
      periodType: 'weekly_by_saturday',
    },
    {
      startAt: '2021-10-01',
      endAt: '2021-10-30',
      minimumDuration: 4,
      periodType: 'nightly',
    },
    {
      startAt: '2021-11-01',
      endAt: '2021-11-29',
      minimumDuration: 1,
      periodType: 'weekly_by_sunday',
    },
  ] as Period[],
  checkIn: null,
  checkOut: null,
```

# 👊 Done 👊

- Manage export library with **Library Mode** of #vite
- Manage tooltip 👊
- Manage minimum duration 👊
- Manage periods (weekly / nightly) 👊
- Show dates + month + year 👊
- Manage HoveringDate 👊
- Manage Checkin / CheckOut halfday 👊
- Manage BookingDates 👊
- Show checkIn checkOut date 👊
- When click on checkIn checkOut date open calendar 👊

# To Do

- Manage translations
