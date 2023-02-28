<template>
  <div
    v-if="inPercentage"
    class="h-0.5 w-full bg-neutral-200 dark:bg-neutral-100"
  >
    <div class="h-0.5 dark:bg-green-800" :style="{ width: percentage }"></div>
  </div>
  <span v-else>{{ timeLeft || '0 s' }}</span>
</template>

<script>
import { intervalToDuration, formatDuration } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'
import { percentageFromUtcTime } from '@/utils'
import { TIMEZONE } from '@/constants'
import { ref, watch, onBeforeUnmount, onBeforeMount } from 'vue'
const timeZone = TIMEZONE
export default {
  props: {
    timestamp: Number,
    prevTimestamp: {
      type: Number,
      default: 0,
    },
    seconds: Boolean,
    inPercentage: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    onBeforeUnmount(() => {
      clearInterval(polling)
    })
    const dateNow = ref(new Date())
    onBeforeMount(() => {
      dateNow.value = new Date()
    })
    const polling = ref(
      setInterval(() => {
        dateNow.value = new Date()
      }, 500)
    )
    const timeLeft = ref(0)
    const percentage = ref(0)
    const formatWithSeconds = ['days', 'hours', 'minutes', 'seconds']
    const format = ['days', 'hours', 'minutes']
    const formatDistanceLocale = {
      xDays: '{{count}} d',
      xSeconds: '{{count}} s',
      xMinutes: '{{count}} m',
      xHours: '{{count}} h',
    }
    const shortEnLocale = {
      formatDistance: (token, count) =>
        formatDistanceLocale[token].replace('{{count}}', count),
    }
    watch(dateNow, () => {
      emit('time-ending', false)
      if (props.inPercentage) {
        const percentageNum = percentageFromUtcTime(
          props.prevTimestamp > 1000
            ? props.prevTimestamp
            : dateNow.value - 1000,
          dateNow.value,
          props.timestamp
        )
        percentage.value = `${percentageNum}%`
        if (percentageNum > 95 && props.timestamp > 1000) {
          emit('time-ending', true)
        }
      } else {
        const duration = intervalToDuration({
          start: utcToZonedTime(dateNow.value, timeZone),
          end: utcToZonedTime(new Date(props.timestamp), timeZone),
        })
        timeLeft.value = formatDuration(duration, {
          format: props.seconds ? formatWithSeconds : format,
          locale: shortEnLocale,
        })
      }
      if (
        utcToZonedTime(new Date(props.timestamp), timeZone) <
        utcToZonedTime(dateNow.value, timeZone).getTime()
      ) {
        if (props.inPercentage) {
          timeLeft.value = '100%'
        } else {
          timeLeft.value = '0 s'
        }
        emit('clear-timestamp')
        if (!props.inPercentage || props.timestamp < 1000) {
          clearInterval(polling.value)
        }
      }
    })
    return { timeLeft, dateNow, percentage }
  },
}
</script>
