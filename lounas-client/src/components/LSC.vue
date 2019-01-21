<template>
  <div
    id="LSC"
    class="menu"
    :class="{loading: loading, smallLoader: loading == 2}"
  >
    <h2 class="menutitle">
      LSC

      <div class="buttons">
        <button
          class="button"
          @click="weekSwitch"
        >
          {{ switchText }}
        </button>
        <a
          class="button"
          :href="url"
          target="blank"
        >
          Sivusto
        </a>
      </div>
    </h2>

    <div class="lsc-menu content">
      <section
        v-for="m in menu"
        v-if="showWeek"
      >
        <h3>{{ m.day }}</h3>
        <p v-html="m.lunch" />
      </section>

      <section v-if="!showWeek">
        <h3>{{ thisDay }}</h3>
        <p v-html="thisLunch" />
      </section>
    </div>
  </div>
</template>

<script>
export default {
    name: 'LSC',
    props: {
        date: String,
    },
    data:  function () {
        return {
            loading: 1,
            menu: {},
            showWeek:0,
            url: ''
        }
    },
    computed: {

        thisDay() {

            try {
                var dt = new Date();

                var todaysMenu = this.menu[dt.getDay()-1];

                return todaysMenu.day;

            }catch(e) {

            }


        },
        thisLunch() {

            try {
                 var dt = new Date();
            
                var todaysMenu = this.menu[dt.getDay()-1];

               return todaysMenu.lunch;

            }catch(e) {

            }

        },

        switchText() {

            if(this.showWeek) {
                return 'Näytä päivä'
            }
            else {
                return 'Näytä viikko'
            }

        }
    },
    created() {
        this.load()
    },
    methods: {

        weekSwitch() {

            if(this.showWeek) {
                this.showWeek = 0
            }
            else {
                this.showWeek = 1;
            }
            //  console.log(this.showWeek);dsa
        },

        load() {
            console.log('Loading '+this.$options.name);
            

            if(this.date == localStorage[this.$options.name+'-date']) {
     
                this.menu = JSON.parse(localStorage[this.$options.name]);
                this.url = localStorage[this.$options.name+'-url']
                this.loading = 2;
            }
            else {
                this.loading = 1;
            }

            this.$http.get('lsc').then(response => {

                 if(response.bodyText == 'error') {
                        this.load();
                 }

                if(response.bodyText == 'loading') {

                    setTimeout(()=> {
                        this.load();
                    },2000)

                }
                else {

                    this.menu = response.body

                    localStorage.setItem(this.$options.name,JSON.stringify(this.menu))
                    localStorage.setItem(this.$options.name+'-date',this.date)
        
                    this.loading = 0;
                        
                    if(!this.thisDay) {
                        this.showWeek = 1;
                    }
                }

                 
            }, response => {
          //      this.loading = 2;
                this.load();
            });


            this.$http.get('lsc/link').then(response => {

                this.url = response.body
                localStorage.setItem(this.$options.name+'-url',response.body)
                 
            });

        }
    },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  lang="scss">

    #LSC {
        flex: 1 0 0;
        
    }
    .lsc-menu .icon {
        display: none;
    }

</style>
