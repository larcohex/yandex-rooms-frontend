<template>
  <div>
    <div class="grid-container flex-container align-center show-for-medium">
      <div class="event-form-column-container">
        <h2 class="new-event-heading">{{ newEvent ? 'Новая встреча' : 'Редактирование встречи' }}</h2>
        <div class="form-container">
          <label for="topic" class="form-label">Тема</label>
          <input type="text" name="topic" id="topic" class="form-input width-100" placeholder="О чем будете говорить?" v-model="event.title">
        </div>
        <app-user-input @added="addUser" @removed="removeUser" @change="changeSelectedList"></app-user-input>
      </div>
      <div class="event-form-column-container">
        <div class="new-event-heading width-100 flex-container align-right align-middle">
          <router-link to="/" tag="div" class="icon-button close centered-background"></router-link>
        </div>
        <div class="form-container width-100 flex-container align-bottom">
          <div class="inline-block float-left">
            <label for="date" class="form-label">Дата</label>
            <input type="text" name="date" id="date" class="form-input pointer date-input" v-model="date" readonly>
          </div>
          <div class="inline-block float-left">
            <label for="start-time" class="form-label">Начало</label>
            <input type="text" name="start-time" id="start-time" class="form-input time-input" v-model="timeStart">
          </div>
          <div class="dash-container inline-flex-container align-center-middle float-left">
            <p class="bold no-margin">—</p>
          </div>
          <div class="inline-block float-left time-input">
            <label for="end-time" class="form-label">Конец</label>
            <input type="text" name="end-time" id="end-time" class="form-input time-input" v-model="timeEnd">
          </div>
        </div>
        <div class="form-container width-100" v-if="room">
          <label class="form-label">Ваша переговорка</label>
          <div class="suggestion-container chosen-container width-100 flex-container align-justify align-middle">
            <div><p class="inline-block bold suggestion-time-text no-margin">{{ timeStart }}—{{ timeEnd }}</p><p class="inline-block no-margin">{{ room.title }} · {{ room.floor }} этаж</p></div>
            <div class="cancel-suggestion-button centered-background" @click="cancelSuggestion()"></div>
          </div>
        </div>
        <div class="form-container width-100" v-if="!room && recommendations.length">
          <label class="form-label">Рекомендованные переговорки</label>
          <div class="suggestion-container width-100 pointer" v-for="r in recommendations" @click="selectRoom(r)">
            <p class="inline-block bold suggestion-time-text">{{ r.dateStart.format('HH:mm') }}—{{ r.dateEnd.format('HH:mm') }}</p><p class="inline-block">{{ r.title }} · {{ r.floor }} этаж</p>
          </div>
        </div>
      </div>
      <div id="event-controls-container" class="controls-container width-100 flex-container align-center-middle">
        <router-link to="/" tag="button" class="text-button gray-button">Отмена</router-link>
        <button class="text-button blue-button" v-if="newEvent" :disabled="!room" @click="moveEventsIfNeeded()">Создать встречу</button>
        <template v-else>
          <button class="text-button gray-button" @click="promptRemove()">Удалить встречу</button>
          <button class="text-button gray-button" :disabled="!room" @click="updateEvent()">Сохранить</button>
        </template>
      </div>
    </div>
    <div id="event-form-container" class="show-for-small-only" :style="{ 'padding-bottom': ((!room && recommendations.length) ? '7.688rem' : '5rem') }">
      <div class="event-form-column-container">
        <h3 class="new-event-heading">{{ newEvent ? 'Новая встреча' : 'Редактирование встречи' }}</h3>
        <div class="form-container width-100">
          <label for="mobile-topic" class="form-label">Тема</label>
          <input type="text" name="topic" id="mobile-topic" class="form-input width-100" placeholder="О чем будете говорить?" v-model="event.title">
        </div>
        <div class="form-container width-100">
          <label for="mobile-date" class="form-label">Дата</label>
          <input type="text" name="date" id="mobile-date" class="form-input pointer date-input" v-model="date" readonly>
          <div class="grid-x">
            <div class="auto cell">
              <input type="text" name="start-time" class="form-input time-input" v-model="timeStart">
            </div>
            <div class="shrink cell">
              <div class="dash-container inline-flex-container align-center-middle float-left">
                <p class="bold no-margin">—</p>
              </div>
            </div>
            <div class="auto cell">
              <input type="text" name="end-time" class="form-input time-input" v-model="timeEnd">
            </div>
          </div>
        </div>
      </div>
      <div class="event-form-column-container">
        <app-user-input @added="addUser" @removed="removeUser" @change="changeSelectedList"></app-user-input>
      </div>
      <div class="event-form-column-container" v-if="room || recommendations.length">
        <div class="form-container width-100" v-if="room">
          <label class="form-label">Ваша переговорка</label>
          <div class="suggestion-container chosen-container width-100 flex-container align-justify align-middle">
            <div><p class="inline-block bold suggestion-time-text no-margin">{{ timeStart }}—{{ timeEnd }}</p><p class="inline-block no-margin">{{ room.title }} · {{ room.floor }} этаж</p></div>
            <div class="cancel-suggestion-button centered-background" @click="cancelSuggestion()"></div>
          </div>
        </div>
        <div class="form-container width-100" v-else>
          <label class="form-label">Рекомендованные переговорки</label>
          <div class="suggestion-container width-100" v-for="r in recommendations" @click="selectRoom(r)">
            <p class="inline-block bold suggestion-time-text">{{ r.dateStart.format('HH:mm') }}—{{ r.dateEnd.format('HH:mm') }}</p><p class="inline-block">{{ r.title }} · {{ r.floor }} этаж</p>
          </div>
        </div>
      </div>
      <div id="remove-container" class="event-form-column-container flex-container align-center-middle" v-if="!newEvent" @click="promptRemove()">
        <button>Удалить встречу</button>
      </div>
      <div id="choose-rec-message-container" class="position-fixed flex-container align-middle width-100" v-if="!room && recommendations.length">
        <h4 class="no-margin">Выберите переговорку</h4>
      </div>
      <div id="mobile-event-controls-container" class="event-form-column-container position-fixed">
        <div class="flex-container align-center-middle width-100" v-if="newEvent">
          <button class="text-button blue-button" :disabled="!room" @click="moveEventsIfNeeded()">Создать встречу</button>
        </div>
        <div class="controls-container width-100 flex-container align-right" v-else>
          <router-link to="/" tag="button" class="text-button gray-button">Отмена</router-link>
          <button class="text-button blue-button" :disabled="!room" @click="updateEvent()">Сохранить</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  /* global $ */

  import moment from 'moment';
  import request from '../request';
  import UserInput from '../partials/UserInput';

  export default {
    name: 'Event',
    components: {
      'app-user-input': UserInput
    },
    data () {
      return {
        newEvent: true,
        event: {
          title: '',
          dateStart: '',
          dateEnd: ''
        },
        date: '',
        timeStart: '',
        timeEnd: '',
        users: {
          added: [],
          removed: []
        },
        selectedList: [],
        room: null,
        recommendations: []
      };
    },
    watch: {
      timeStart () {
        this.getRecommendation();
      },
      timeEnd () {
        this.getRecommendation();
      },
      date () {
        this.getRecommendation();
      },
      selectedList (newList) {
        if (!this.room || this.room.capacity < newList.length) {
          this.getRecommendation();
        }
      }
    },
    methods: {
      changeSelectedList (newList) {
        this.selectedList = newList;
      },
      cancelSuggestion () {
        this.room = null;
        this.getRecommendation();
      },
      promptRemove () {
        this.$store.dispatch('openModal', {
          type: 'WARNING',
          heading: 'Встреча будет удалена безвозвратно'
        });
      },
      indexOfUser (a, u) {
        for (let i = 0; i < a; ++i) {
          if (a[i].id === u.id) return i;
        }
        return -1;
      },
      addUser (user) {
        let i = this.indexOfUser(this.users.removed, user);
        if (i === -1) this.users.added.push(user);
        else this.users.removed.splice(i, 1);
      },
      removeUser (user) {
        let i = this.indexOfUser(this.users.added, user);
        if (i === -1) this.users.removed.push(user);
        else this.users.added.splice(i, 1);
      },
      checkRecommendationData () {
        return !!(this.selectedList.length && this.date && moment(this.timeStart, 'HH:mm', true).isValid() && moment(this.timeEnd, 'HH:mm', true).isValid() && moment(this.date, 'D MMMM, YYYY').hour(moment(this.timeStart, 'HH:mm').hour()).minute(moment(this.timeStart, 'HH:mm').minute()).isSameOrAfter(moment(), 'minute') && moment(this.timeStart, 'HH:mm').isBefore(moment(this.timeEnd, 'HH:mm'), 'minute'));
      },
      getRecommendation () {
        if (this.checkRecommendationData()) {
          let body = {
            members: this.selectedList.map((user) => user.id)
          };
          let timeStart = moment(this.timeStart, 'HH:mm');
          let timeEnd = moment(this.timeEnd, 'HH:mm');
          body.dateStart = moment(this.date, 'D MMMM, YYYY').hour(timeStart.hour()).minute(timeStart.minute()).toISOString();
          body.dateEnd = moment(this.date, 'D MMMM, YYYY').hour(timeEnd.hour()).minute(timeEnd.minute()).toISOString();
          if (this.event.hasOwnProperty('id')) {
            body.id = this.event.id;
          }
          request.getRecommendation(body).then((recommendations) => {
            if (recommendations instanceof Array) {
              this.room = null;
              this.recommendations = recommendations.map((r) => {
                r.dateStart = moment(r.dateStart);
                r.dateEnd = moment(r.dateEnd);
                return r;
              });
            } else if (recommendations) {
              this.recommendations = [recommendations];
              if (recommendations.hasOwnProperty('newStart')) {
                this.recommendations[0].dateStart = moment(recommendations.newStart);
                this.recommendations[0].dateEnd = moment(recommendations.newEnd);
              } else {
                this.recommendations[0].dateStart = moment(this.date, 'D MMMM, YYYY').hour(timeStart.hour()).minute(timeStart.minute());
                this.recommendations[0].dateEnd = moment(this.date, 'D MMMM, YYYY').hour(timeEnd.hour()).minute(timeEnd.minute());
              }
            }
          });
        }
      },
      selectRoom (room) {
        this.room = room;
        this.timeStart = room.dateStart.format('HH:mm');
        this.timeEnd = room.dateEnd.format('HH:mm');
      },
      updateEvent () {
        if (this.room) {
          let body = {};
          body.title = this.event.title;
          body.dateStart = this.room.dateStart.toISOString();
          body.dateEnd = this.room.dateEnd.toISOString();
          request.updateEvent(this.event.id, body).then(() => {
            if (this.room.id !== this.event.room.id) {
              request.changeEventRoom(this.event.id, this.room.id).then(() => {
                let promises = [];
                for (let i = 0; i < this.users.added.length; ++i) {
                  promises.push(request.addUserToEvent(this.event.id, this.users.added[i].id));
                }
                Promise.all(promises).then(() => {
                  let promises2 = [];
                  for (let i = 0; i < this.users.added.length; ++i) {
                    promises2.push(request.removeUserFromEvent(this.event.id, this.users.removed[i].id));
                  }
                  Promise.all(promises2).then(() => {
                    // TODO: update only event
                    this.$store.dispatch('initFloors').then(() => {
                      this.$router.push('/');
                    });
                  });
                });
              });
            } else {
              this.$store.dispatch('initFloors').then(() => {
                this.$router.push('/');
              });
            }
          });
        }
      },
      moveEventsIfNeeded () {
        if (this.room) {
          if (this.room.hasOwnProperty('newRoom')) {
            let promises = [];
            for (let i = 0; i < this.room.clashingEvents.length; ++i) {
              promises.push(request.changeEventRoom(this.room.clashingEvents[i].id, this.room.newRoom.id));
            }
            Promise.all(promises).then(() => {
              this.createEvent();
            });
          } else this.createEvent();
        }
      },
      createEvent () {
        let users = this.users.added.map((user) => user.id);
        request.createEvent(this.event.title, this.room.dateStart.toISOString(), this.room.dateEnd.toISOString(), JSON.stringify(users), this.room.id).then(() => {
          this.$store.dispatch('openModal', {
            type: 'SUCCESS',
            heading: 'Встреча создана!',
            text: [`${moment(this.date, 'D MMMM, YYYY').format('D MMMM')}, ${this.timeStart}—${this.timeEnd}`, `${this.room.title} · ${this.room.floor} этаж`]
          });
          // TODO: update only event
          this.$store.dispatch('initFloors').then(() => {
            this.$router.push('/');
          });
        });
      }
    },
    beforeMount () {
      if (this.$route.name === 'EditEvent') {
        this.newEvent = false;
        this.event = this.$store.getters.getCurrentEvent;
        this.event.dateStart = moment(this.event.dateStart);
        this.event.dateEnd = moment(this.event.dateEnd);
        this.date = this.event.dateStart.format('D MMMM, YYYY');
        this.timeStart = this.event.dateStart.format('HH:mm');
        this.timeEnd = this.event.dateEnd.format('HH:mm');
        this.room = this.event.room;
        this.room.dateStart = this.event.dateStart;
        this.room.dateEnd = this.event.dateEnd;
      } else {
        if (this.$route.query.hasOwnProperty('timeStart') && this.$route.query.hasOwnProperty('timeStart') && this.$route.query.hasOwnProperty('room')) {
          let start = moment(this.$route.query.timeStart);
          let end = moment(this.$route.query.timeEnd);
          this.date = start.format('D MMMM, YYYY');
          this.timeStart = start.format('HH:mm');
          this.timeEnd = end.format('HH:mm');
          this.room = this.$store.getters.getRoomById(this.$route.query.room);
          this.room.dateStart = start;
          this.room.dateEnd = end;
        }
      }
    },
    mounted () {
      let date = $('#date');
      let mobileDate = $('#mobile-date');
      date.datepicker({
        showOtherMonths: true,
        minDate: new Date(),
        onSelect: () => {
          this.date = moment(date.datepicker('getDate')).format('D MMMM, YYYY');
        }
      });
      mobileDate.datepicker({
        showOtherMonths: true,
        minDate: new Date(),
        onSelect: () => {
          this.date = moment(mobileDate.datepicker('getDate')).format('D MMMM, YYYY');
        }
      });
    },
    beforeDestroy () {
      $('#date').datepicker('destroy');
      $('#mobile-date').datepicker('destroy');
    }
  };
</script>

<style lang="scss" scoped>
  .event-form-column-container
  {
    width: rem-calc(420);
    margin: 0 rem-calc(16);
  }

  .new-event-heading
  {
    margin-top: rem-calc(31);
    margin-bottom: rem-calc(20);
  }

  .date-input
  {
    width: rem-calc(238);
    margin-right: rem-calc(16);
    background: $calendar no-repeat rem-calc(214) center;
    padding-right: rem-calc(24);
  }

  .time-input
  {
    width: rem-calc(72);
  }

  .dash-container
  {
    height: $form-input-height;
    width: rem-calc(14);
    margin: 0 rem-calc(4);
  }

  .suggestion-container
  {
    margin-top: rem-calc(5);
    padding-left: rem-calc(10);
    padding-right: rem-calc(12);
    background-color: $light-gray;
    border-radius: rem-calc(4);
    height: rem-calc(37);
  }

  .chosen-container
  {
    background-color: $light-blue;
    color: $white;
  }

  .cancel-suggestion-button
  {
    height: rem-calc(16);
    width: rem-calc(16);
    background-image: $cross-white;
  }

  .suggestion-time-text
  {
    margin-right: rem-calc(16);
  }

  #event-controls-container
  {
    position: absolute;
    height: rem-calc(76);
    bottom: 0;
  }

  @include breakpoint(small only)
  {
    #event-form-container
    {
      background-color: $light-gray;
    }

    .event-form-column-container
    {
      width: 100%;
      background-color: $white;
      padding: rem-calc(16) rem-calc(16) rem-calc(20);
      margin-top: rem-calc(8);
      margin-left: 0;
      margin-right: 0;

      &:first-child
      {
        margin-top: 0;
      }
    }

    .new-event-heading
    {
      margin-top: rem-calc(8);
      margin-bottom: 0;
    }

    .date-input
    {
      margin-right: 0;
      width: 100%;
      background-position-x: 95%;
    }

    .time-input
    {
      width: 100%;
      margin-top: rem-calc(8);
    }

    .dash-container
    {
      height: rem-calc(44);
      margin-top: rem-calc(8);
    }

    .event-form-column-container > .form-container:first-child
    {
      margin-top: 0;
    }

    #remove-container
    {
      height: rem-calc(54);
      margin-bottom: rem-calc(8);

      & button
      {
        background: none;
        width: 100%;
        height: 100%;
        border: none;
        color: #ff3333;
      }
    }

    #choose-rec-message-container
    {
      padding-left: rem-calc(16);
      height: rem-calc(43);
      color: $white;
      bottom: rem-calc(80);
      background-color: rgba(0, 16, 33, 0.80);
    }

    #mobile-event-controls-container
    {
      bottom: 0;
      margin-top: 0;
    }
  }
</style>
