<template>
  <div id="app">
    <app-modal v-if="modal"></app-modal>
    <app-header></app-header>
    <router-view/>
  </div>
</template>

<script>
  import AppHeader from './partials/AppHeader';
  import Modal from './partials/Modal';

  export default {
    name: 'app',
    components: {
      'app-header': AppHeader,
      'app-modal': Modal
    },
    computed: {
      modal () {
        return this.$store.getters.getModal;
      }
    }
  };
</script>

<style lang="scss">
  @import "./styles/global";

  input:focus,
  select:focus,
  textarea:focus,
  button:focus
  {
    outline: none;
  }

  h2
  {
    font-size: map-deep-get($header-styles, 'medium', 'h2', 'font-size');
    line-height: rem-calc(24);
  }

  h3
  {
    font-size: map-deep-get($header-styles, 'medium', 'h3', 'font-size');
    line-height: rem-calc(24);
  }

  h4
  {
    font-size: map-deep-get($header-styles, 'medium', 'h4', 'font-size');
  }

  h6
  {
    font-size: map-deep-get($header-styles, 'medium', 'h6', 'font-size');
  }

  p
  {
    font-size: $paragraph-font-size;
  }

  .bold
  {
    font-weight: bold;
  }

  .normal
  {
    font-weight: normal;
  }

  .white
  {
    color: $white;
  }

  .light-gray
  {
    color: $light-gray;
  }

  .medium-gray
  {
    color: $medium-gray;
  }

  .dark-gray
  {
    color: $dark-gray;
  }

  .inline-block
  {
    display: inline-block;
  }

  .no-margin
  {
    margin: 0;
  }

  .no-outline
  {
    outline: none;
  }

  .height-100
  {
    height: 100%;
  }

  .width-100
  {
    width: 100%;
  }

  .width-50
  {
    width: 50%;
  }

  .width-20
  {
    width: 20%;
  }

  .width-10
  {
    width: 10%;
  }

  .nowrap
  {
    white-space: nowrap;
  }

  .wrap-normal
  {
    white-space: normal;
  }

  .inline-flex-container
  {
    display: inline-flex;
  }

  .flex-none
  {
    flex: none;
  }

  .position-relative
  {
    position: relative;
  }

  .position-absolute
  {
    position: absolute;
  }

  .position-fixed
  {
    position: fixed;
  }

  .pointer
  {
    cursor: pointer;
  }

  .centered-background
  {
    background-position: center center;
    background-repeat: no-repeat;
  }

  .shadow-border-top
  {
    box-shadow: 0 rem-calc(-1) 0 0 $light-gray;
  }

  .shadow-border-bottom
  {
    box-shadow: 0 rem-calc(1) 0 0 $light-gray;
  }

  .text-button
  {
    height: $text-button-height;
    border-radius: $text-button-border-radius;
    padding: $text-button-padding;
    font-family: $body-font-family;
    font-size: rem-calc(13);
    font-weight: $medium;
    line-height: $text-button-height;
  }

  .blue-button
  {
    background-color: $blue-button-background-color-normal;
    color: #ffffff;

    &:hover
    {
      background-color: $blue-button-background-color-hover;
    }

    &:focus
    {
      background-color: $blue-button-background-color-pressed;
    }

    &:disabled
    {
      background-color: $light-gray;
      color: rgba(0, 0, 0, 0.20);
    }
  }

  .gray-button
  {
    background-color: $light-gray;

    &:hover
    {
      background-color: #dde0e4;
    }

    &:focus
    {
      background-color: #c7cdd3;
    }

    &:disabled
    {
      background-color: #e2e5e8;
      color: rgba(0, 0, 0, 0.20);
    }
  }

  .icon-button
  {
    height: $icon-button-size;
    width: $icon-button-size;
    border-radius: 100%;
    background-color: $icon-button-background-color;
  }

  .chevron-left
  {
    background-image: $arrow;
    transform: scaleX(-1);

    &:hover
    {
      background-image: $arrow-hover;
    }
  }

  .chevron-right
  {
    background-image: $arrow;

    &:hover
    {
      background-image: $arrow-hover;
    }
  }

  .chevron-up
  {
    background-image: $arrow-up;
  }

  .close
  {
    background-image: $cross;

    &:hover
    {
      background-image: $cross-hover;
    }
  }

  .pen
  {
    background-image: $pen;

    &:hover
    {
      background-image: $pen-hover;
    }
  }

  .form-container
  {
    margin-top: rem-calc(20);
    margin-bottom: rem-calc(4);
  }

  .form-label
  {
    font-size: map-deep-get($header-styles, 'medium', 'h4', 'font-size');
    font-weight: bold;
  }

  .form-input
  {
    border: 2px solid $light-gray;
    border-radius: 4px;
    height: $form-input-height;
    line-height: $form-input-height;
    margin-top: rem-calc(4);
    padding-left: rem-calc(10);
    padding-right: rem-calc(10);
    letter-spacing: rem-calc(0.47);
    font-size: $paragraph-font-size;

    @mixin placeholder-style
    {
      color: $medium-gray;
      letter-spacing: rem-calc(0.47);
      font-size: $paragraph-font-size;
    }

    &:hover, &:focus
    {
      border-color: $light-blue;
    }

    &::-webkit-input-placeholder {
      @include placeholder-style;
    }
    &::-moz-placeholder {
      @include placeholder-style;
    }
    &:-ms-input-placeholder {
      @include placeholder-style;
    }
    &:-moz-placeholder {
      @include placeholder-style;
    }
  }

  .avatar-container
  {
    height: rem-calc(24);
    width: rem-calc(24);
    border-radius: 100%;
  }

  .participant-text
  {
    margin: 0 rem-calc(8);
  }

  .controls-container button:not(:last-child)
  {
    margin-right: rem-calc(16);
  }

  .ui-datepicker
  {
    top: rem-calc(10) !important;
    font-size: rem-calc(12);
  }

  .overlay-container
  {
    background-color: rgba(0, 16, 33, 0.40);
    z-index: 10;
  }

  .fade-enter-active
  {
    transition: opacity .25s;
  }

  .fade-leave-active
  {
    transition: opacity .25s;
  }

  .fade-enter, .fade-leave-to
  {
    opacity: 0;
  }

  @include breakpoint(medium)
  {
    .medium-horizontal-scroll
    {
      overflow-x: scroll;
    }
  }

  @include breakpoint(small only)
  {
    .small-only-horizontal-scroll
    {
      overflow-x: scroll;
    }

    .overlay-container
    {
      background-color: rgba(0, 16, 33, 0.80);
    }
  }
</style>
