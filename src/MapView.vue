<script
  setup
  lang="ts"
  generic="
    TLocation extends { id: unknown; location: { lat: number; lng: number } }
  "
>
import {
  MapboxGeolocateControl,
  MapboxMap,
  MapboxMarker,
  // @ts-expect-error missing types
} from '@studiometa/vue-mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import type { UserLocation } from '@/components/appointment/location-selection'
import { useMqtt } from '@/composables/useMqtt'
// import  mqtt from 'mqtt';

// Add the Mapbox GL JS and Directions plugin via CDN in the head section

useHead({
  link: [
    {
      rel: 'stylesheet',
      href: 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css',
    },
    {
      rel: 'stylesheet',
      href: 'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-directions/v4.3.1/mapbox-gl-directions.css',
    },
  ],
  script: [
    {
      src: 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js',
      defer: true,
    },
    {
      src: 'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-directions/v4.3.1/mapbox-gl-directions.js',
      defer: true,
    },
  ],
})
const { locations, mode, userLocation } = defineProps<{
  locations?: TLocation[]
  mode: 'station' | 'driver'
  userLocation?: UserLocation
}>()

const { createConnection, latestPosition } = useMqtt()

const mapBoxMap = ref(null)
const moveableLocation = ref(null)

// Assuming you want to center the map dynamically based on the stations
const mapCenter = computed(() => {
  if (userLocation?.name === '<current>') {
    return [userLocation.lng, userLocation.lat]
  }
  if ((locations?.length ?? 0) > 0) {
    return [locations![0].location.lng, locations![0].location.lat]
  }

  return [10.4515, 51.1657] // Germany
})

// if user selects current location showing first location directions
onMounted(() => {
  // Wait for the scripts to load before initializing the map
  if (userLocation?.name !== '<current>' || !locations?.length) {
    return
  }
  if (process.client) {
    const interval = setInterval(() => {
      // @ts-ignore
      if (window.mapboxgl && window.MapboxDirections) {
        clearInterval(interval)
        // @ts-ignore
        const directions = new MapboxDirections({
          accessToken:
            'pk.eyJ1IjoibW9kZXJuaWNlIiwiYSI6ImNseDF3ZmdsdjBkd3cycXM5NXZlYTBxd2IifQ.4TdDROuEq-7vnDBBqjO8cw',
          profile: 'mapbox/driving',
          interactive: false,
        })

        // @ts-ignore
        mapBoxMap.value.map.addControl(directions, 'top-left')
        if (mode === 'station') {
          directions.setOrigin([userLocation.lng, userLocation.lat])
          directions.setDestination([
            locations![0].location.lng,
            locations![0].location.lat,
          ])
        } else {
          moveableLocation.value = [
            locations[0].location.lng,
            locations[0].location.lat,
          ]

          directions.setOrigin([
            locations![0].location.lng,
            locations![0].location.lat,
          ])
          directions.setDestination([userLocation.lng, userLocation.lat])

          if (process.client) {
            createConnection(`driver_${locations[0].id}`)
            watch(
              () => latestPosition.value,
              (newValue, oldValue) => {
                if (newValue) {
                  directions.setOrigin([newValue.lng, newValue.lat])
                  moveableLocation.value = [newValue.lng, newValue.lat]
                }
              },
            )
          }
        }
      }
    }, 1000)
  }
})

const locationsList = computed(() => {
  if (userLocation?.name === '<current>' && mode === 'driver') {
    const [, ...rest] = locations
    return rest
  }
  return locations
})
</script>

<template>
  <div class="h-[65vh] overflow-hidden rounded-lg">
    <MapboxMap
      ref="mapBoxMap"
      class="h-full"
      access-token="pk.eyJ1IjoibW9kZXJuaWNlIiwiYSI6ImNseDF3ZmdsdjBkd3cycXM5NXZlYTBxd2IifQ.4TdDROuEq-7vnDBBqjO8cw"
      map-style="mapbox://styles/mapbox/streets-v11"
      :center="mapCenter"
      :zoom="10"
    >
      <MapboxGeolocateControl />
      <MapboxMarker
        v-if="mode === 'driver' && moveableLocation"
        :lng-lat="moveableLocation"
        color="#FEC700"
      >
        <img src="@/assets/car.png" style="height: 40px; width: 40px" />
      </MapboxMarker>
      <MapboxMarker
        v-for="location in locationsList"
        :key="location.id"
        :lng-lat="[location.location.lng, location.location.lat]"
        color="#FEC700"
      >
        <img
          v-if="mode === 'station'"
          :src="
            mode === 'station' ? '@/assets/station.png' : '@/assets/car.png'
          "
          style="height: 40px; width: 40px"
        />
        <img
          v-else-if="mode === 'driver'"
          src="@/assets/car.png"
          style="height: 40px; width: 40px"
        />
      </MapboxMarker>
    </MapboxMap>
  </div>
</template>
<style>
.directions-control.directions-control-instructions {
  display: none;
}

.mapbox-directions-component-keyline:not(.mapbox-directions-profile) {
  display: none;
}
</style>
