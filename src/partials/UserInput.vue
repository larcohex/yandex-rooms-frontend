<template>
  <div>
    <div class="form-container">
      <label for="participants" class="form-label">Участники</label>
      <input type="text" name="topic" id="participants" class="form-input width-100 pointer" placeholder="Например, Тор Одинович" @focus="toggleUserList()" @blur="toggleUserList()" readonly>
      <div id="user-list-container" v-if="open">
        <div class="user-container width-100 flex-container align-middle pointer" v-for="(user, index) in userList" @mousedown="addUser(index)">
          <div class="avatar-container centered-background" :style="{ 'background-image': 'url(' + user.avatarUrl + ')' }"></div>
          <p class="user-info-text">{{ user.login }}&nbsp;<span class="medium-gray">· {{ user.homeFloor }} этаж</span></p>
        </div>
      </div>
    </div>
    <div class="participant-list-container">
      <div class="participant-container inline-flex-container align-middle" v-for="(user, index) in selectedList">
        <div class="avatar-container centered-background" :style="{ 'background-image': 'url(' + user.avatarUrl + ')' }"></div>
        <p class="participant-text inline-block">{{ user.login }}</p>
        <div class="participant-remove close centered-background inline-block" @click="removeUser(index)"></div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'UserInput',
    computed: {
      users () {
        return this.$store.getters.getUsers;
      },
      event () {
        return this.$store.getters.getCurrentEvent;
      }
    },
    data () {
      return {
        userList: [],
        selectedList: [],
        open: false
      };
    },
    methods: {
      addUser (index) {
        this.$emit('added', this.userList[index]);
        this.selectedList.push(this.userList[index]);
        this.userList.splice(index, 1);
      },
      removeUser (index) {
        this.$emit('removed', this.selectedList[index]);
        this.userList.push(this.selectedList[index]);
        this.selectedList.splice(index, 1);
      },
      toggleUserList () {
        this.open = !this.open;
      }
    },
    beforeMount () {
      if (this.$route.name === 'EditEvent') {
        for (let i = 0; i < this.users.length; ++i) {
          let found = false;
          for (let j = 0; j < this.event.users.length; ++j) {
            if (this.users[i].id === this.event.users[j].id) {
              found = true;
              break;
            }
          }
          if (found) {
            this.selectedList.push(this.users[i]);
          } else {
            this.userList.push(this.users[i]);
          }
        }
      } else {
        this.userList = this.users;
      }
    }
  };
</script>

<style lang="scss" scoped>
  #user-list-container
  {
    width: 100%;
    height: rem-calc(102);
    box-shadow: 0 1px 10px 0 rgba(0,44,92,0.28);
    border-radius: 4px;
    overflow-y: auto;
    padding-top: rem-calc(5);
    padding-bottom: rem-calc(5);
  }

  #participants:focus
  {
    background: $arrow-up no-repeat scroll 95% center;
  }

  .user-container
  {
    width: 90%;
    height: rem-calc(34);
    padding-left: rem-calc(16);

    &:hover
    {
      background-color: #f6f7f9;
      font-weight: bold;
    }
  }

  .user-info-text
  {
    margin-left: rem-calc(8);
  }

  .participant-list-container
  {
    margin-top: rem-calc(12);
  }

  .participant-container
  {
    height: rem-calc(24);
    border-radius: rem-calc(16);
    margin-top: rem-calc(8);
    background-color: $light-gray;
  }

  .participant-container:not(:last-child)
  {
    margin-right: rem-calc(8);
  }

  .participant-remove
  {
    height: rem-calc(16);
    width: rem-calc(16);
    margin-left: rem-calc(4);
    margin-right: rem-calc(8);
  }
</style>
