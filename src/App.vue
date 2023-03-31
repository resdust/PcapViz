<script setup>
import { RouterLink, RouterView } from 'vue-router'

document.title = 'Viz of Honeypot Network Traffic'
</script>

<template>
  <header>
    <!-- <h1>Visualization of Honeypot Network Traces</h1> -->

    <nav>
      <RouterLink to="/">Overview</RouterLink>
      <RouterLink to="/port/60">Ports</RouterLink>
      <RouterLink to="/ipcount">IP Geo Distribution</RouterLink>
    </nav>
  </header>
  <main>
    <RouterView />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

main {
  /* padding: 1rem var(--section-gap); */
  width: 100%;
  height: 100%;
  max-height: 120rem;
  display: flex;
  max-height: 120rem;
  flex-direction: column;
  align-items: center;
}

main .logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  top: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-left: -1rem;
  font-size: 1rem;
  text-align: center;
  padding: 0 1rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

}
</style>
