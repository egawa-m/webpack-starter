<template>
  <div class="l-main">
    <p>{{ date() }}</p>
    <form>
      <input type="text" v-model="search" placeholder="検索">
    </form>
    <ul v-if="items.length">
      <li v-for="item in filteredItems" :key="item.id">
        <p>{{ item.message }}</p>
        <img :src="createImgPath(item.image)" alt="" width="" height="">
      </li>
    </ul>
    <div class="c-loader" v-if="loading"></div>
  </div>
</template>

<script>
export default {
  name: 'Top',
  data () {
    return {
      data: [
        { message: 'Foo', image: 'noimage.png' },
        { message: 'Bar', image: 'keyvisual.jpg' }
      ],
      search: ''
    };
  },
  created () {
    this.$store.commit('setData', this.data)
  },
  methods: {
    date () {
      let date = new Date();
      return date.getMonth() + 1 + '月' + date.getDate() + '日';
    },
    createImgPath (name) {
      return '../img/' + name;
    }
  },
  computed: {
    items () {
      return this.$store.getters.items;
    },
    filteredItems () {
      this.$store.commit('setLoading', true);
      let data = this.$store.getters.items;
      let filterWord = this.search && this.search.toLowerCase();
      if (filterWord) {
        data = data.filter((item) => {
          if (item && item.message) {
            return item.message.toLowerCase().indexOf(filterWord) !== -1;
          }
        });
      }
      this.$store.commit('setLoading', false);
      return data;
    },
    loading () {
      return this.$store.getters.loading;
    }
  }
}
</script>