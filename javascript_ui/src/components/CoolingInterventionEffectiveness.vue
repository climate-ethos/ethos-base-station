<template>
  <div v-if="effectiveness">
    <q-icon
      v-for="index in 5"
      :key="index"
      name="ac_unit"
      :color="getColor(index)"
    />
  </div>
</template>

<script>
export default {
  name: 'CoolingInterventionEffectiveness',
  props: {
    effectiveness: {
      type: Number,
      required: true,
    },
  },
  methods: {
    getColor(index) {
      const effectiveIcons = this.effectiveness * 5;
      if (index <= effectiveIcons) {
        return 'blue-8'; // full snowflake
      } else if (index - 0.5 <= effectiveIcons) {
        return 'blue-4'; // half snowflake
      } else {
        return 'grey-4'; // no snowflake
      }
    },
  },
};
</script>

<style scoped>
.q-icon {
  font-size: 1.5em;
}
</style>
