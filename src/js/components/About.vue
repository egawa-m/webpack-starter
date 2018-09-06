<template>
  <div class="l-main">
    <h1 id="msg">About</h1>
  </div>
</template>
<script>
export default {
  name: 'About',
  data () {
    return {
      search: ''
    }
  },
  created () {
  },
  methods: {
  },
  computed: {
    items () {
      return this.$store.getters.items;
    },
    loading () {
      return this.$store.getters.loading;
    }
  }
}
</script>