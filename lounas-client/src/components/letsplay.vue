<template>
  <div
    v-if="loading!=2"
    id="letsplay"
    class="menu"
    :class="{loading: loading}"
  >
    <h2 class="menutitle">
      Let’s Play 

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
    <div
      class="letsplay-menu content">

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
    name: 'Letsplay',
    data:  function () {
        return {
            loading: 1,
            menu: {},
            showWeek:0,
            url: ''
        }
    },
    computed: {
        switchText() {

            if(this.showWeek) {
                return 'Näytä päivä'
            }
            else {
                return 'Näytä viikko'
            }

        },
        

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
            console.log('Loading letsplay');
            
            this.loading = 1;

             this.$http.get('letsplay').then(response => {

                 

                if(response.bodyText == 'loading') {

                    setTimeout(()=> {
                        this.load();
                    },2000)

                }
                else if(response.bodyText == 'error') {
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

           //    this.loading = 2;
                this.load();

            });

            this.$http.get('letsplay/link').then(response => {

                this.url = response.body
                 
            }, response => {
            });

        }
    },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">

#letsplay {
    
    flex: 1 0 0;

}

.letsplay-menu h5 {
    margin-bottom: 20px;
    font-size:18px;
}
    

</style>
