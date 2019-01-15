<template>
  <div
    v-if="loading!=2"
    id="factory"
    class="menu"
    :class="{loading: loading}"
  >
    <h2 class="menutitle">
      Factory

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

    <div class="factory-menu content">
      <section
        v-for="m in menu"
        v-if="showWeek"
      >
        <div v-html="m.lunch" />
      </section>

      <section v-if="!showWeek">
        <div v-html="thisLunch" />
      </section>
    </div>
  </div>
</template>

<script>
export default {
    name: 'Factory',
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
            //  console.log(this.showWeek);
        },

        load() {
            console.log('Loading factory');
            
             this.$http.get('factory').then(response => {

                if(response.bodyText == 'loading') {

                    setTimeout(()=> {
                        this.load();
                    },2000)

                }else if(response.bodyText == 'error') {
                        this.load();
                }
                else {

                    this.menu = response.body
        
                    this.loading = 0;
                        
                    if(!this.thisDay) {
                        this.showWeek = 1;
                    }
                }
                 
            }, response => {
           //     this.loading = 2;
                this.load();
            });


            this.$http.get('factory/link').then(response => {

                this.url = response.body
                 
            }, response => {
            });

        }
    },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  lang="scss">

    #factory {
        flex: 1 0 0;
        
    }

    .factory-menu {
        div {
            margin-bottom: 20px;
        }
    }



</style>
