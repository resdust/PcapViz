<template>
  <div class="form-item">
    <label for="">{{ label }}</label>
    <slot>
      <input type="text" />
    </slot>
  </div>
</template>

<script>
export default {
  name: 'formItem',
  props: {
    label: {
      type: String,
      default: '',
    },
  },
}
</script>

<style scoped>
.form-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 0.5rem;
  width: 7rem;
}


.form-item label {
  margin-bottom: 0.5rem;
}

.form-item input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
}
</style>