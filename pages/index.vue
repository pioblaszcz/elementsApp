 <template>
  <div></div>
</template>

<script>
export default {
  name: 'IndexPage',
  mounted() {
      fetch('data/data.json')
      .then(response => response.json())
      .then(resp => console.log(resp))
  }
}
</script>
