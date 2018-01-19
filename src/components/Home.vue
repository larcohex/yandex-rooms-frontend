<template>
  <div>
    <div class="overlay-container position-fixed height-100 width-100 show-for-small-only" v-show="overlay"></div>
    <div id="date-control-container-mobile" class="flex-container align-justify align-middle width-100 position-relative show-for-small-only shadow-border-bottom">
      <div class="icon-button chevron-left centered-background" @click="prevDay()"></div>
      <div id="date-container-mobile" class="date-container dashboard-header-elem no-outline pointer flex-container align-center-middle" tabindex="0" @focus="openCalendar()" @blur="closeCalendar()">
        <h4 class="date-text no-margin">{{ now.format('D MMM') }}</h4>
      </div>
      <div class="icon-button chevron-right centered-background" @click="nextDay()"></div>
      <div class="calendar-container position-absolute flex-container align-center-middle" v-show="calendar">
        <div id="datepicker-mobile" class="datepicker-container flex-container align-center-middle"></div>
      </div>
    </div>
    <div class="small-only-horizontal-scroll nowrap width-100">
      <div id="timeline-container-mobile" class="show-for-small-only">
        <div class="width-50 height-100 inline-block position-relative shadow-border-bottom" style="z-index: 2"></div><div class="times-container height-100 inline-block position-relative shadow-border-bottom">
          <div class="header-line time-line-container" :style="{ left: (0.0667 * (now.hour() * 60 + now.minute()) - 0.03125) + 'rem' }" v-if="moment().isSame(now, 'day')"></div>
          <div class="current-time-container flex-container align-center-middle" :style="{ left: (0.0667 * (now.hour() * 60 + now.minute()) - 1.5) + 'rem' }" v-if="moment().isSame(now, 'day')">
            <h6 class="time-text no-margin white">{{ now.format('H:mm') }}</h6>
          </div>
          <div class="height-100 time-container inline-flex-container align-center-middle" v-for="n in 23">
            <h6 class="time-text no-margin" :class="{ 'medium-gray': now.clone().hour(n).minute(0).isBefore(moment(), 'minute') }">{{ n }}</h6>
          </div>
        </div>
      </div>
      <div id="dashboard-container" class="grid-container flex-container position-relative">
        <div id="shadow-bottom-container" class="dashboard-header-elem show-for-medium shadow-border-bottom"></div>
        <div id="left-column" class="shadow-border-right">
          <div class="dashboard-header-elem flex-container align-justify align-middle width-100 position-relative hide-for-small-only">
            <div class="icon-button chevron-left centered-background" @click="prevDay()"></div>
            <div id="date-container-desktop" class="date-container dashboard-header-elem no-outline pointer flex-container align-center-middle" tabindex="0" @focus="openCalendar()" @blur="closeCalendar()">
              <h4 class="date-text no-margin">{{ now.format('D MMM') }}</h4>
            </div>
            <div class="icon-button chevron-right centered-background" @click="nextDay()"></div>
            <div class="calendar-container position-absolute flex-container align-center-middle" v-show="calendar">
              <div id="datepicker-desktop" class="datepicker-container flex-container align-center-middle"></div>
            </div>
          </div>
          <div class="width-100">
            <div class="floor-container" v-for="(value, key) in floors">
              <h6 class="floor-text medium-gray">{{ key }} ЭТАЖ</h6>
              <div class="room-container" v-for="room in value" :class="{ 'medium-gray': now.isBefore(moment(), 'day') || checkBusy(room.events) }">
                <h4 :id="'room-title-' + room.id" class="room-title-text">{{ room.title }}</h4>
                <p class="room-capacity-text">до {{ room.capacity }} человек</p>
              </div>
            </div>
          </div>
        </div>
        <div id="right-column" class="medium-horizontal-scroll nowrap">
          <!---->
          <transition name="fade">
            <div id="compact-room-name-list-container" class="show-for-small-only position-absolute" v-show="mobileRooms" key="compact">
              <div class="floor-container" v-for="(value, key) in floors">
                <h6 class="floor-text medium-gray">{{ key }} ЭТАЖ</h6>
                <div class="room-container" v-for="room in value">
                  <div class="compact-room-name-container flex-container align-center-middle" :class="{ 'medium-gray': now.isBefore(moment(), 'day') || checkBusy(room.events) }">
                    <h6 class="no-margin">{{ room.title }}</h6>
                  </div>
                </div>
              </div>
            </div>
          </transition>
          <!---->
          <div class="times-container dashboard-header-elem nowrap position-relative hide-for-small-only">
            <div class="header-line time-line-container" :style="{ left: (0.0667 * (now.hour() * 60 + now.minute()) - 0.03125) + 'rem' }" v-if="moment().isSame(now, 'day')"></div>
            <div class="current-time-container flex-container align-center-middle" :style="{ left: (0.0667 * (now.hour() * 60 + now.minute()) - 1.5) + 'rem' }" v-if="moment().isSame(now, 'day')">
              <h6 class="time-text no-margin white">{{ now.format('H:mm') }}</h6>
            </div>
            <div class="dashboard-header-elem time-container inline-flex-container align-center-middle float-none" v-for="n in 23">
              <h6 class="time-text no-margin" :class="{ 'medium-gray': now.clone().hour(n).minute(0).isBefore(moment(), 'minute') }">{{ n }}</h6>
            </div>
          </div>
          <div class="width-100 position-relative">
            <div class="time-line-container" :style="{ left: (0.0667 * (now.hour() * 60 + now.minute()) - 0.03125) + 'rem' }" v-if="moment().isSame(now, 'day')"></div>
            <div class="floor-data-container" v-for="floor in floors">
              <div class="before-floor-container hide-for-small-only">
                <div class="table-cell-container height-100 inline-block without-data" v-for="n in 24"></div>
              </div>
              <div class="floor-text-data-container">
                <div class="table-cell-container height-100 inline-block without-data" v-for="n in 24"></div>
              </div>
              <div v-for="room in floor">
                <div class="between-rooms-container hide-for-small-only">
                  <div class="table-cell-container height-100 inline-block without-data" v-for="n in 24"></div>
                </div>
                <div class="room-data-container">
                  <div class="room-data-padding-container">
                    <div class="table-cell-container height-100 inline-block without-data" v-for="n in 24"></div>
                  </div>
                  <div class="room-row-container position-relative width-100">
                    <div class="busy-container data-container event-container position-absolute" v-for="event in room.events" :style="{ width: (4 / 60 * event.dateEnd.diff(event.dateStart, 'minutes')) + 'rem', left: (4 * event.dateStart.hour() + 4 / 60 * event.dateStart.minute()) + 'rem' }" @focus="selectEvent(event.id)" @blur="unselectEvent()" tabindex="0" v-if="event.dateStart.isSame(now, 'day')" :class="'busy-event-' + room.id">
                    </div>
                    <div class="event-info-container position-absolute" v-for="event in room.events" v-show="event.id === selectedEvent" :style="{ left: (4 * event.dateStart.hour() + 4 / 60 * event.dateStart.minute() - (21.125 - (4 / 60 * event.dateEnd.diff(event.dateStart, 'minutes'))) / 2) + 'rem' }" v-if="event.dateStart.isSame(now, 'day')">
                      <div class="edit-button icon-button pen centered-background position-absolute" @mousedown="editEvent(event.id)"></div>
                      <h4 class="event-info-heading">{{ event.title }}</h4>
                      <p class="event-info-text">{{ event.dateStart.format('D MMMM') }}, {{ event.dateStart.format('HH:mm') }}—{{ event.dateEnd.format('HH:mm') }} · {{ room.title }}</p>
                      <div class="event-info-participants flex-container align-middle" v-if="event.users.length">
                        <div class="avatar-container centered-background" :style="{ 'background-image': 'url(' + event.users[0].avatarUrl + ')' }"></div>
                        <p class="participant-text inline-block no-margin">{{ event.users[0].login }} <span class="medium-gray" v-show="event.users.length - 1 > 0">и {{ event.users.length - 1 }} участников</span></p>
                      </div>
                      <p v-else>Нет участников</p>
                    </div>
                    <div class="table-cell-container data-container inline-block" v-for="n in 24" @mouseover="mouseoverRoom(room.id, n)" @mouseleave="mouseleaveRoom(room.id)">
                      <router-link :to="{ path: '/new', query: { timeStart: n - 1 } }" tag="button" class="add-button" v-if="now.clone().hour(n).minute(0).isSameOrAfter(moment(), 'minute')">+</router-link>
                    </div>
                  </div>
                  <div class="room-data-padding-container hide-for-small-only">
                    <div class="table-cell-container height-100 inline-block without-data" v-for="n in 24"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  /* global $ */

  import moment from 'moment';

  export default {
    name: 'Home',
    computed: {
      floors () {
        return this.$store.getters.getFloors;
      }
    },
    data () {
      return {
        now: moment(),
        selectedEvent: -1,
        calendar: false,
        mobileRooms: false,
        overlay: false
      };
    },
    methods: {
      nextDay () {
        this.now = moment(this.now).add(1, 'days');
      },
      prevDay () {
        this.now = moment(this.now).subtract(1, 'days');
      },
      selectEvent (id) {
        this.selectedEvent = id;
      },
      unselectEvent () {
        this.selectedEvent = -1;
      },
      editEvent (id) {
        this.$router.push('/' + id);
      },
      openCalendar () {
        this.calendar = true;
        this.overlay = true;
      },
      closeCalendar () {
        this.calendar = false;
        this.overlay = false;
      },
      mouseoverRoom (id, n) {
        if (this.now.clone().hour(n).minute(0).isSameOrAfter(moment(), 'minute')) {
          $(`#room-title-${id}`).addClass('room-title-text-hover');
        }
      },
      mouseleaveRoom (id) {
        $(`#room-title-${id}`).removeClass('room-title-text-hover');
      },
      checkBusy (events) {
        let start = -1;
        let end = -1;
        for (let i = 0; i < events.length; ++i) {
          if (events[i].dateStart.isSame(this.now, 'day') && events[i].dateEnd.isAfter(moment(), 'minute')) {
            if (start === -1) start = i;
          } else if (events[i].dateStart.isAfter(this.now, 'day')) {
            end = i;
            break;
          }
        }
        if (end === -1) end = events.length;
        if (start !== -1) {
          if (events[start].dateStart.format('HH:mm') !== '00:00') {
            return false;
          } else if (events[end - 1].dateEnd.format('HH:mm') !== '23:59') {
            return false;
          } else {
            for (let i = start; i < end - 1; ++i) {
              if (events[i].dateEnd.isBefore(events[i + 1].dateStart, 'minute')) {
                return false;
              }
            }
          }
          return true;
        } else return false;
      }
    },
    mounted () {
      $('#datepicker-desktop').datepicker({
        showOtherMonths: true,
        numberOfMonths: 3,
        beforeShow () {
          $('#ui-datepicker-div').appendTo($(this));
        },
        onSelect: (date) => {
          let hour = this.now.hour();
          let minute = this.now.minute();
          this.now = moment(date, 'DD.MM.YYYY').hour(hour).minute(minute);
          $('#date-container-desktop').trigger('blur');
        }
      }).mousedown((e) => {
        e.preventDefault();
      });

      $('#datepicker-mobile').datepicker({
        showOtherMonths: true,
        beforeShow () {
          $('#ui-datepicker-div').appendTo($(this));
        },
        onSelect: (date) => {
          let hour = this.now.hour();
          let minute = this.now.minute();
          this.now = moment(date, 'DD.MM.YYYY').hour(hour).minute(minute);
          $('#date-container-mobile').trigger('blur');
        }
      }).mousedown((e) => {
        e.preventDefault();
      });

      let el = $('.small-only-horizontal-scroll');
      let left = $('#left-column');
      let rooms = $('#compact-room-name-list-container');
      let f = () => {
        if (el.scrollLeft() >= left.width()) {
          this.mobileRooms = true;
          rooms.css({
            left: el.scrollLeft() + parseInt(left.css('padding-left'), 10)
          });
        } else {
          this.mobileRooms = false;
        }
      };
      el.scroll(() => {
        this.mobileRooms = false;
        let $this = $(this);
        if ($this.data('scrollTimeout')) {
          clearTimeout($this.data('scrollTimeout'));
        }
        $this.data('scrollTimeout', setTimeout(f, 250));
      });
    }
  };
</script>

<style lang="scss">
  $datetime-container-height: rem-calc(46);
  $time-container-width: rem-calc(49);

  #shadow-bottom-container
  {
    position: absolute;
    width: 100%;
    height: $datetime-container-height;
    background: transparent;
    z-index: 2;
    left: 0;
  }

  #dashboard-container
  {
    padding-right: 0;
  }

  #left-column
  {
    width: rem-calc(245);
  }

  #right-column
  {
    width: rem-calc(1043);
  }

  .date-container:focus .date-text
  {
    color: #0070e0;
  }

  .date-container
  {
    position: relative;
    z-index: 2;
  }

  .date-text
  {
    font-weight: 500;
  }

  .calendar-container
  {
    height: rem-calc(232);
    width: rem-calc(604);
    z-index: 6;
    background-color: $white;
    box-shadow: 0 rem-calc(1) rem-calc(8) 0 rgba(0, 44, 92, 0.28);
    border-radius: rem-calc(4);
    top: 100%;
    left: 0;
  }

  .datepicker-container
  {
    height: rem-calc(200);
    width: rem-calc(572);
  }

  .dashboard-header-elem
  {
    height: $datetime-container-height;
  }

  .times-container
  {
    padding-left: rem-calc(32);
    z-index: 2;
  }

  .time-container
  {
    width: $time-container-width - rem-calc(1);
    margin-left: rem-calc(8);
    margin-right: rem-calc(8);
    font-size: rem-calc(11);
    font-weight: bold;
  }

  .current-time-container
  {
    position: absolute;
    width: $time-container-width;
    height: rem-calc(20);
    background-color: $light-blue;
    border-radius: rem-calc(100);
    top: rem-calc(13);
    color: $white;
    z-index: 4;
  }

  .time-line-container
  {
    width: rem-calc(1);
    position: absolute;
    background-color: $light-blue;
    height: 100%;
    z-index: 3;
  }

  .header-line
  {
    height: 50%;
    top: 50%;
  }

  .floor-container
  {
    margin-top: rem-calc(22);
    margin-bottom: rem-calc(2);
  }

  .floor-text
  {
    margin-top: 0;
    margin-bottom: rem-calc(8);
  }

  .room-container
  {
    margin-bottom: rem-calc(8);
    height: rem-calc(44);
    padding-top: rem-calc(4);
    padding-bottom: rem-calc(4);
  }

  .room-title-text
  {
    margin: 0;
  }

  .room-title-text-hover
  {
    color: #0070e0;
  }

  .room-capacity-text
  {
    margin-top: rem-calc(2);
    margin-bottom: 0;
  }

  .without-data
  {
    background-color: #f6f7f9;
  }

  .before-floor-container
  {
    height: rem-calc(22);
  }

  .floor-text-data-container
  {
    height: rem-calc(17);
  }

  .between-rooms-container
  {
    height: rem-calc(8);
  }

  .room-data-container
  {
    height: rem-calc(44);
  }

  .table-cell-container
  {
    width: rem-calc(65);
    border-right: 1px solid rgba(19, 100, 205, 0.10);
    border-left: 1px solid rgba(19, 100, 205, 0.10);
    vertical-align: top;
    margin: 0 -1px 0 0;
    position: relative;
    z-index: 1;
  }

  .data-container
  {
    height: rem-calc(28);
    border-top: 1px solid rgba(19, 100, 205, 0.10);
    border-bottom: 1px solid rgba(19, 100, 205, 0.10);
    background-color: $white;
  }

  .busy-container
  {
    z-index: 2;
  }

  .room-data-padding-container
  {
    height: rem-calc(8);
  }

  .event-info-container
  {
    height: rem-calc(112);
    width: rem-calc(338);
    top: rem-calc(20);
    z-index: 4;
    background-color: #ffffff;
    box-shadow: 0 rem-calc(1) rem-calc(16) 0 rgba(0, 44, 92, 0.28);
    padding: rem-calc(8) rem-calc(8) rem-calc(16) rem-calc(16);
  }

  .event-info-container:after
  {
    bottom: 100%;
    left: 50%;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
    border: rem-calc(8) solid rgba(255, 255, 255, 0);
    border-bottom-color: #ffffff;
    margin-left: rem-calc(-8);
  }

  .edit-button
  {
    right: rem-calc(8);
    top: rem-calc(8);
  }

  .event-info-heading
  {
    margin-top: rem-calc(14);
    margin-bottom: 0;
  }

  .event-info-text
  {
    margin-top: rem-calc(2);
    margin-bottom: 0;
  }

  .event-info-participants
  {
    margin-top: rem-calc(16);
    margin-bottom: 0;
  }

  .event-container
  {
    background-color: $busy-data-background-color-normal;

    &:hover
    {
      background-color: $busy-data-background-color-hover;
    }

    &:focus
    {
      background-color: $busy-data-background-color-active;
      outline: none;
    }
  }

  .add-button
  {
    height: rem-calc(28);
    width: rem-calc(57);
    opacity: 0;
    color: #ffffff;
    font-family: $body-font-family;
    font-weight: bold;

    &:hover, &:active
    {
      opacity: 1;
    }

    &:hover
    {
      background-color: $medium-blue;
    }

    &:active
    {
      background-color: $dark-blue;
    }
  }

  @include breakpoint(small only)
  {
    .times-container
    {
      z-index: 2;
    }

    .calendar-container
    {
      z-index: 11;
      box-shadow: 0 rem-calc(1) rem-calc(16) 0 rgba(0, 44, 92, 0.28);
      border-radius: 0 0 rem-calc(8) rem-calc(8);
      width: 100%;
      height: rem-calc(380);
      & .ui-datepicker
      {
        font-size: rem-calc(20);
      }
    }

    .datepicker-container
    {
      height: rem-calc(347);
      width: rem-calc(328);
    }

    #dashboard-container
    {
      background-color: #f6f7f9;
    }

    #left-column
    {
      width: 50%;
      padding-left: rem-calc(16);
    }

    #right-column
    {
      width: 50%;
    }

    .time-container
    {
      width: $time-container-width - rem-calc(1);
    }

    .current-time-container
    {
      top: rem-calc(6);
    }

    .floor-container
    {
      margin-top: 0;
    }

    .floor-text
    {
      margin-top: rem-calc(16);
      margin-bottom: rem-calc(8);
    }

    .room-container
    {
      padding-top: rem-calc(12);
      padding-bottom: rem-calc(12);
      height: rem-calc(58);
      margin-top: rem-calc(2);
      margin-bottom: 0;
      margin-left: rem-calc(-16);
      padding-left: rem-calc(16);
      background-color: $white;
    }

    .table-cell-container
    {
      border-left: none;
      margin-left: 0;
    }

    .floor-text-data-container
    {
      height: rem-calc(39);
    }

    .room-data-container
    {
      height: rem-calc(60);

      & .room-data-padding-container
      {
        height: rem-calc(2);
      }
    }

    .busy-container
    {
      height: rem-calc(58);
    }

    .data-container
    {
      height: 100%;
      border: none;
      border-right: 1px solid rgba(19, 100, 205, 0.10);
    }

    .room-row-container
    {
      height: 100%;
    }

    #date-control-container-mobile
    {
      height: rem-calc(56);
      padding-left: rem-calc(16);
      padding-right: rem-calc(16);
      z-index: 11;
      background-color: $white;

      & .icon-button
      {
        height: rem-calc(32);
        width: rem-calc(32);
      }
    }

    #timeline-container-mobile
    {
      height: rem-calc(32);
      padding-left: 0;

      & div
      {
        vertical-align: top;
      }
    }

    #compact-room-name-list-container
    {
      z-index: 3;
      background-color: transparent;
    }

    #compact-room-name-list-container .room-container
    {
      background: transparent;
      color: #262626;
      padding-top: 0;
    }

    .compact-room-name-container
    {
      height: rem-calc(24);
      background-color: $white;
      padding-left: rem-calc(8);
      padding-right: rem-calc(8);
      box-shadow: 0 rem-calc(1) rem-calc(8) 0 rgba(0,44,92,0.28);
      border-radius: rem-calc(4);
      letter-spacing: rem-calc(0.4);
    }
  }
</style>
