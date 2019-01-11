<template>
  <div id="app">
    <h1 class="maintitle">
      Lounaat Keilaranta - {{ date }}
    </h1>
    <div id="menus">
      <LSC />
      <letsplay />
      <factory />
    </div>
    <div>Icons made by <a href="https://www.freepik.com/" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" 			    title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" 			    title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
  </div>
</template>

<script>
import LSC from './components/LSC.vue'
import letsplay from './components/letsplay.vue'
import factory from './components/factory.vue'

export default {
  name: 'App',
  components: {
  LSC,
  letsplay,
  factory
  },
  computed: {
    date() {
       let d = new Date();
        let day = d.getDate();
        let month = d.getMonth()+1;
        let year = d.getFullYear();
    
        return `${day}.${month}.${year}`;
    }
  },
}
</script>

<style lang="scss">

  h1.maintitle {
    
    flex-basis: 100%;
    padding-bottom: 10px;
    border-bottom: 1px solid rgba(0,0,0,0.1)

  }



.menu {
  margin-bottom: 20px;
  position: relative;

  .content {
    background: #eee;
    width: 100%;
    padding: 10px;
    position: relative;
    z-index: 2;
    opacity: 1;
    transition: opacity 0.5s;

    min-height: 60px;

  }

  &.loading {
    .content {
      opacity: 0;
    }
  }
}

.menu h2 {
  margin-bottom: 10px;
  padding-right: 30px;
}





</style>
