<template>
  <div id="global-overlay" class="overlay-container position-fixed height-100 width-100 flex-container align-center-middle">
    <div id="modal-container" class="flex-container flex-dir-column align-middle">
      <div id="msg-type-icon" class="centered-background" :style="{ 'background-image': 'url(' + icons[type] + ')' }"></div>
      <h3 id="msg-heading-text">{{ heading }}</h3>
      <div id="msg-text-container">
        <h4 class="msg-text normal" v-for="msg in text">{{ msg }}</h4>
      </div>
      <div class="modal-controls-container" v-if="type === 'SUCCESS' || type === 'ERROR'">
        <button class="text-button blue-button" @click="close()">Хорошо</button>
      </div>
      <div id="modal-controls-container" class="controls-container" v-if="type === 'WARNING'">
        <button class="text-button gray-button" @click="close()">Отмена</button>
        <button class="text-button gray-button" @click="removeEvent()">Удалить</button>
      </div>
    </div>
  </div>
</template>

<script>
  // TODO: change confirm button text and action to be modifiable
  import request from '../request';

  export default {
    name: 'Modal',
    computed: {
      type () {
        return this.$store.getters.getType;
      },
      heading () {
        return this.$store.getters.getHeading;
      },
      text () {
        return this.$store.getters.getText;
      },
      currentEvent () {
        return this.$store.getters.getCurrentEvent;
      }
    },
    data () {
      return {
        icons: {
          'ERROR': '',
          'WARNING': '/assets/images/emoji1.png',
          'SUCCESS': '/assets/images/emoji2.png'
        }
      };
    },
    methods: {
      close () {
        this.$store.dispatch('closeModal');
      },
      removeEvent () {
        request.removeEvent(this.currentEvent.id).then(() => {
          this.$store.dispatch('removeEventFromFloors', this.currentEvent.id);
          this.$store.dispatch('removeEventFromEvents', this.currentEvent.id);
          this.$router.replace('/');
          this.close();
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  #global-overlay
  {
    z-index: 13;
  }

  #modal-container
  {
    background-color: #ffffff;
    box-shadow: 0 rem-calc(1) rem-calc(16) 0 rgba(0, 44, 92, 0.28);
    border-radius: rem-calc(8);
    width: rem-calc(444);
    padding: rem-calc(32) rem-calc(62);
    text-align: center;
  }

  #msg-type-icon
  {
    height: rem-calc(40);
    width: rem-calc(40);
    background-size: cover;
  }

  #msg-heading-text
  {
    margin-top: rem-calc(16);
    margin-bottom: 0;
  }

  #msg-body-text-container
  {
    margin-top: rem-calc(8);
  }

  .msg-text
  {
    margin-top: rem-calc(6);
    margin-bottom: 0;
  }

  #modal-controls-container
  {
    margin-top: rem-calc(24);
  }
</style>
