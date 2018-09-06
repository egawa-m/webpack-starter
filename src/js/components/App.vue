<template>
  <div id="app">
    <header class="l-header">
      <p>Title</p>
      <nav>
        <ul>
          <li><router-link to="/">Top</router-link></li>
          <li><router-link to="/about">About</router-link></li>
          <li><a href="/top.html">Top</a></li>
          <li><a href="/about/">About</a></li>
        </ul>
      </nav>
    </header>
    <router-view/>
    <footer class="l-footer">
      <p>©Gurunavi, Inc.</p>
    </footer>
  </div>
</template>

<script>
import Top from '../components/Top.vue';

export default {
  name: 'App',
  components: {
    Top
  }
}
</script>