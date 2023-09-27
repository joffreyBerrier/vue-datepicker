# vue-datepicker 2.3.5

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
import { Calendar } from "vue-calendar-3";
// If you using vite
import "vue-calendar-3/style";
// If you not
import "vue-calendar-3/dist/index.css";

export default {
  components: {
    Calendar,
  },
};
```

```html
<script setup lang="ts">
  import { ref } from "vue";
  import { Calendar } from "vue-calendar-3";
  import "vue-calendar-3/style";

  const checkIn = ref(null);
  const checkOut = ref(null);
</script>

<template>
  <Calendar v-model:checkIn="checkIn" v-model:checkOut="checkOut" />
</template>
```

## Colors

Use css variable

```css
--calendar-wrapper: #fff;

--calendar-tooltip-bg: #202020;
--calendar-tooltip-border: #202020;
--calendar-tooltip-text: #fff;

--calendar-half-day-color: #757575;
--calendar-half-day-color-active: #222;

--calendar-text-color: #202020;

--day-border: #fff;
--day-checkIn-checkOut: #8ebbbb;
--day-disabled: #aaa;
--day-hovering-with-checkIn: #8ebbbb;
--day-range-days: #daebeb;

--calendar-disabled-opacity: 0.5;

--calendar-mobile-header-border-bottom-days: #eee;

--calendar-input-bg: #fff;
--calendar-input-border: #f0f2f6;
--calendar-input-shadow: 0 0 0 0.2rem #eee;

--calendar-paginate-bg: #fff;
--calendar-paginate-text-color: #202020;
--calendar-paginate-border-color: #f0f2f6;

--calendar-paginate-hover-bg: #fff;
--calendar-paginate-hover-text: #202020;
--calendar-paginate-hover-border: #202020;

--calendar-paginate-disabled-bg: #ffffff;
--calendar-paginate-disabled-border: #f0f2f6;
--calendar-paginate-disabled-text: #f0f2f6;

--day-today: #264646;
```

## Data binding

### CheckIn

- Type: `Date`
- Default: `null`

Example: `v-model:checkIn=""`

### CheckOut

- Type: `Date`
- Default: `null`

Example: `v-model:checkOut=""`

## Props/Options

### SingleCalendar
- Type: `Boolean`
- Default: `false`

Show single mode calendar

### alwaysVisible

- Type: `Boolean`
- Default: `false`

Show calendar by default

### bookingColor

- Type: `Object as PropType<BookingColor>`
- Default: `{}`

Allows you to define colors for your bookings, the name of the key must be equal to your type key in the booking object

Example:

```javascript
bookingColor: {
  admin: "#9dc1c9",
  contract: "#a56a0b",
};
```

### bookingDates

- Type: `Array as PropType<string[]>`
- Default: `[]`

Allows you to define a date range (Booking)

Example:

```javascript
bookingDates: [
  {
    checkInDate: "2022-07-01",
    checkOutDate: "2022-07-10",
    type: "admin",
  },
  {
    checkInDate: "2022-08-01",
    checkOutDate: "2022-08-20",
    type: "contract",
  },
];
```

### disabledDaysAfterDayDate

- Type: `Boolean`
- Default: `false`

Disabled days after the current date

### disabledDaysBeforeDayDate

- Type: `Boolean`
- Default: `true`

Disabled days before the current date

### disabled

- Type: `Boolean`
- Default: `true`

Disabled the click on input calendar

### hasFooter

- Type: `Boolean`
- Default: `false`

Hidden / Show the default footer of the calendar

### hasHeader

- Type: `Boolean`
- Default: `false`

Hidden / Show the default header of the calendar

### isAffixed

- Type: `Boolean`
- Default: `false`

Add a calendar in a modal

### startDate

- Type: `Date`
- Default: `new Date(new Date().getFullYear() - 2, 0, 1)`

Define the first Date in your calendar

### endDate

- Type: `Date`
- Default: `new Date(new Date().getFullYear() + 2, 0, 1)`

Define the last Date in your calendar

### formatDate

- Type: `String`
- Default: `YYYY-MM-DD`

Define the format of your date

### placeholder

- Type: `Object as PropType<Placeholder>`
- Default: `{ checkIn: "Arrivée", checkOut: "Départ", }`

Define the text of you input calendar

### position

- Type: `String`
- Default: `left`

Define the position of the calendar (right or left)

### showYear

- Type: `Boolean`
- Default: `false`

show the calendar in year mode

### showInputCalendar

- Type: `Boolean`
- Default: `false`

hide / show the input calendar

### BookedDates

- Type: `string[]`
- Default: `[]`

This data is an array of your booked dates, the date is already booked is appear it in disabled

Example:

```javascript
bookedDates: [
  "2021-06-01",
  "2021-06-02",
  "2021-06-03",
  "2021-06-23",
  "2021-06-24",
  "2021-06-25",
];
```

### periodManagementRule

- Type: `Boolean`
- Default: `false`

Active the period management rules :

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

- Corresponds to the day you want to block the period, `nightly`,` weekly_by_saturday`, `weekly_by_sunday` or `weekly_by_monday`

#### The **minimumDuration**:

- Corresponds to the number of the days where you want to block the period.

- If the periodType is `nightly` the count corresponds the number of days
- If the periodType is `weekly_by_saturday`, `weekly_by_sunday` or `weekly_by_monday` the count corresponds to the number of weeks

Example:

```javascript
periodDates: [
  // Nightly
  {
    startAt: "2021-08-01",
    endAt: "2021-08-31",
    minimumDuration: 4,
    periodType: "nightly",
  },
  // Weekly Saturday
  {
    startAt: "2021-09-01",
    endAt: "2021-09-30",
    minimumDuration: 2,
    periodType: "weekly_by_saturday",
  },
  // Weekly Sunday
  {
    startAt: "2021-11-01",
    endAt: "2021-11-29",
    minimumDuration: 1,
    periodType: "weekly_by_sunday",
  },
];
```

### The **translations**
```js
fr: {...},
en: {
  clearDates: "Clear dates",
  close: "Close",
  days: {
    monday: "Mo",
    tuesday: "Tu",
    wednesday: "We",
    thursday: "Th",
    friday: "Fr",
    saturday: "Sa",
    sunday: "Su",
  },
  today: "Today",
  periodType: {
    weeklyBySaturday: "From Saturday to Saturday",
    weeklyBySunday: "From Sunday to Sunday",
    weeklyByMonday: "From Monday to Monday",
    nightly: "A minimum of %{minimumDuration} night is required",
  },
  halfDay: {
    checkIn: "Possible end of stay",
    checkOut: "Possible start of stay",
  },
}
```

### Timezone

- Type : `String`
- Default: `Europe/Paris`

Define the timezone of the Calendar for manage periods and disabled dates in the correct timezone

## Events

* `clear-dates`: Fires when date is cleared
* `close-date-picker`: Fires when the calendar is closed
* `render-next-date`: Fires when date is paginate to the next month
* `render-previous-date`: Fires when date is paginate to the previous month
* `select-booking-date`: Fires when click on a booking
* `update:checkIn`: Fires when click on a checkIn
* `update:checkOut`: Fires when click on a checkOut

## Expose

Expose allows you to access to different methods with a ref on the Calendar component

### Data
* `activeIndex`: Get the index of pagination (use a computed for that)
* `showCalendar`: Get the value of the calendar display

### Methods
* `clearDates`: Allows you to clear the dates
* `closeCalendar`: Allows you to close the calendar
* `openCalendar`: Allows you to open the calendar
* `toggleCalendar`: Allows you to toggle the calendar

## Slots
### Calendar Header

* **Name**: `header`

**Example:**
```
<template #header>
```

### Calendar Header Mobile

* **Name**: `calendar-header-mobile`
* **Methods**:
  * clearDates:
  * closeDatePicker:

**Example:**
```
<template #calendar-header-mobile="{ clearDates, closeDatePicker }">
```

### Calendar Footer
* **Name**: `calendar-footer`
* **Methods**:
  * clearDates:
  * closeDatePicker:

**Example:**
```
<template #calendar-footer="{ clearDates, closeDatePicker }">
```

## Header

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

`select-booking-date` : fires when the user clicks on a day
Params:
name | Description
-------------------------------------|-------------------------
day | Object on type Day
booking | Selected Booking
checkIncheckOutHalfDay | The half day of the checkIn
e | Mouse Event



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
- Refacto code, using setup syntax 👊
- Enable the calendar years view 👊
- Manage translations 👊
- Manage monday to monday and others days 👊

# To Do

- A11Y

## Contributing to development 💁‍♂️💁‍♀️

- First create an issue
- Fork the repo from github.
- Clone your forked repo and run: `npm i`
- Then, make your changes on any branch you want and push it.
- Naming your branch with the gitflow convention:
  - Feature branches? [feature/issueId]
  - Release branches? [release/issueId]
  - Hotfix branches? [hotfix/issueId]
  - Support branches? [support/issueId]
- Finally, open a pull request on the official repo, using the source branch from your forked repo.
