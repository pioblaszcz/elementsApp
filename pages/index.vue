 <template>
  <div>
      <p class="subtitle-1 text-center" >Serwery:</p> 
      <div v-if="servers!==null" class="d-flex flex-column align-center">
      <v-btn
        v-for="server in servers" 
        :key="server.id"
        outlined
        elevation="4"
        class="mb-4 buttonEl"
        v-on:click="showDetails"
      >
      {{ server.name }}
      </v-btn>
    </div>
    <p class="subtitle-1 text-center" >Aplikacje:</p> 
    <p class="subtitle-1 text-center" >Taski:</p> 
  </div>
 
</template>

<script>
export default {
  name: 'IndexPage',
  data(){
    return{
      servers: null
    }
  },
  mounted() {
      fetch('data/data.json')
      .then(response => response.json())
      .then(resp => {this.servers = resp})
  },
  methods: {
    showDetails: function (event) {
      alert('Hello')
    }
  }
}
</script>

<style>
  .buttonEl{
    width: 40%;
  }
</style>