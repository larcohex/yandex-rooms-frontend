<template>
  <div>
    <div class="grid-container flex-container align-center">
      <div class="event-form-column-container">
        <h2 class="new-event-heading">Новая встреча</h2>
        <div class="form-container">
          <label for="topic" class="form-label">Тема</label>
          <input type="text" name="topic" id="topic" class="form-input width-100" placeholder="О чем будете говорить?" v-model="event.title">
        </div>
        <app-user-input @added="addUser" @removed="removeUser"></app-user-input>
      </div>
      <div class="event-form-column-container">
        <div class="new-event-heading width-100 flex-container align-right align-middle">
          <router-link to="/" tag="div" class="icon-button close centered-background"></router-link>
        </div>
        <div class="form-container width-100 flex-container align-bottom">
          <div class="inline-block float-left date-input float-left">
            <label for="date" class="form-label">Дата</label>
            <input type="text" name="date" id="date" class="form-input pointer date-input" v-model="date" readonly>
          </div>
          <div class="inline-block float-left time-input float-left">
            <label for="start-time" class="form-label">Начало</label>
            <input type="text" name="start-time" id="start-time" class="form-input time-input" v-model="timeStart">
          </div>
          <div id="dash-container" class="inline-flex-container align-center-middle float-left">
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
            <div><p class="inline-block bold suggestion-time-text no-margin">{{ room.timeStart }}—{{ room.timeEnd }}</p><p class="inline-block no-margin">{{ room.title }} · {{ room.floor }} этаж</p></div>
            <div class="cancel-suggestion-button centered-background" @click="cancelSuggestion()"></div>
          </div>
        </div>
        <div class="form-container width-100" v-else>
          <label class="form-label">Рекомендованные переговорки</label>
          <div class="suggestion-container width-100" v-for="n in 3">
            <p class="inline-block bold suggestion-time-text">16:00—16:30</p><p class="inline-block">Готем · 4 этаж</p>
          </div>
        </div>
      </div>
    </div>
    <div id="event-controls-container" class="controls-container width-100 flex-container align-center-middle">
      <router-link to="/" tag="button" class="text-button gray-button">Отмена</router-link>
      <button class="text-button blue-button" v-if="newEvent" @click="createEvent()">Создать встречу</button>
      <template v-else>
        <button class="text-button gray-button" @click="promptRemove()">Удалить встречу</button>
        <button class="text-button gray-button" @click="updateEvent()">Сохранить</button>
      </template>
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
        room: null,
        roomChange: true
      };
    },
    methods: {
      cancelSuggestion () {
        this.room = null;
        this.roomChange = true;
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
      updateEvent () {
        if (this.room) {
          let body = {};
          body.title = this.event.title;
          if (this.roomChange) {
            let timeStart = moment(this.timeStart, 'HH:mm');
            let timeEnd = moment(this.timeEnd, 'HH:mm');
            body.dateStart = moment(this.date, 'D MMMM, YYYY').hour(timeStart.hour()).minute(timeStart.minute()).toISOString();
            body.dateEnd = moment(this.date, 'D MMMM, YYYY').hour(timeEnd.hour()).minute(timeEnd.minute()).toISOString();
          }
          request.updateEvent(this.event.id, body).then(() => {
            if (this.roomChange) {
              request.changeEventRoom(this.event.id, this.room.id).then(() => {
                let chain = Promise.resolve();
                for (let i = 0; i < this.users.added.length; ++i) {
                  chain = chain.then(() => request.addUserToEvent(this.event.id, this.users.added[i].id));
                }
                chain.then(() => {
                  let chain2 = Promise.resolve();
                  for (let i = 0; i < this.users.added.length; ++i) {
                    chain2 = chain2.then(() => request.removeUserFromEvent(this.event.id, this.users.removed[i].id));
                  }
                  chain2.then(() => {
                    // TODO: update only event
                    this.$store.dispatch('initFloors').then(() => {
                      this.$router.push('/');
                    });
                  });
                });
              });
            }
          });
        }
      },
      createEvent () {
        if (this.room) {
          let users = this.users.added.map((user) => user.id);
          request.createEvent(this.event.title, this.event.dateStart, this.event.dateEnd, users, this.room.id).then(() => {
            this.$store.dispatch('openModal', {
              type: 'SUCCESS',
              heading: 'Встреча создана!',
              text: [`${moment(this.date, 'D MMMM, YYYY').format('D MMMM')}, ${this.timeStart}—${this.timeEnd}`, `${this.room.title} · ${this.room.floor}`]
            });
            this.$store.dispatch('initFloors').then(() => {
              this.$router.push('/');
            });
          });
        }
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
        this.room.timeStart = this.timeStart;
        this.room.timeEnd = this.timeEnd;
      }
    },
    mounted () {
      let date = $('#date');
      date.datepicker({
        showOtherMonths: true,
        onSelect: () => {
          this.date = moment(date.datepicker('getDate')).format('D MMMM, YYYY');
        }
      });
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
  }

  #date
  {
    background: $calendar no-repeat scroll rem-calc(214) center;
    padding-right: rem-calc(24);
  }

  .time-input
  {
    width: rem-calc(72);
  }

  #dash-container
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
</style>
