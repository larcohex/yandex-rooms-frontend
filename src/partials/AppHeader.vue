<template>
  <div id="header">
    <div class="grid-container height-100 position-relative shadow-border-bottom">
      <div class="grid-x grid-margin-x height-100 align-middle">
        <div class="large-3 medium-5 small-6 cell flex-container">
          <a href="/" id="logo" class="inline-block centered-background"></a>
        </div>
        <div class="large-7 medium-2 hide-for-small-only cell"></div>
        <div class="large-2 medium-5 small-6 cell flex-container align-right">
          <router-link to="/new" tag="button" id="create-event-button" class="text-button blue-button" v-if="$route.name === 'Home'">Создать встречу</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'AppHeader'
  };
</script>

<style lang="scss" scoped>
  $header-container-height: rem-calc(71);
  $header-container-height-mobile: rem-calc(48);

  #header
  {
    height: $header-container-height;
  }

  #logo
  {
    background-image: url("/assets/images/logo.svg");
    background-size: cover;
    height: rem-calc(24.4);
    width: rem-calc(173.9);
  }

  @include breakpoint(small only)
  {
    #header
    {
      height: $header-container-height-mobile;
      position: relative;
      z-index: 12;

      & .grid-container
      {
        padding-left: rem-calc(20.5);
        padding-right: rem-calc(20.5);
      }
    }

    #logo
    {
      height: rem-calc(21);
      width: rem-calc(149);
    }

    #create-event-button
    {
      height: $text-button-height;
      font-size: $paragraph-font-size;
      padding: $text-button-padding;
    }
  }
</style>
