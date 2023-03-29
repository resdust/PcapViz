<!-- not finished, need emit events and get props from parent component -->
<template>
  <keep-alive>
    <div class="searchBar" v-if="showSearchBar">
      <formItem label="Start Date">
        <input v-model="startDate" type="date" placeholder="Select date" @change="handleRangeChange" />
      </formItem>
      <formItem label="Interval (Mins)">
        <input v-model="interval" type="text" @change="handleIntervalChange" />
      </formItem>
      <formItem label="Durateion (Days)">
        <!-- select 1 week or 3 days -->
        <select v-model="duration" @change="handleRangeChange">
          <option value="7">1 week</option>
          <option value="3">3 days</option>
        </select>
      </formItem>
      <formItem label="Refresh">
        <input type="button" value="Refresh" @click="handleRangeChange" />
      </formItem>
    </div>
  </keep-alive>
</template>

<script>
export default {
  props: {
    showSearchBar: {
      type: Boolean,
      default: true
    }
  },
}
</script>

<style scoped>
.searchBar {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 10px;
  column-gap: 0.5rem
}
</style>