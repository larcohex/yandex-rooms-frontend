import axios from 'axios';
import moment from 'moment';

const GRAPHQL = {
  BASE_URL: '/graphql',

  sendQuery (load, field) {
    return axios.get(this.BASE_URL, {
      params: {
        query: load
      }
    }).then((response) => response.data.data[field]);
  },

  sendMutation (load, field) {
    return axios.post(this.BASE_URL, {
      query: load
    }).then((response) => response.data.data[field]);
  }
};

const request = {
  getRooms () {
    return GRAPHQL.sendQuery(`
     {
        rooms {
          id
          title
          capacity
          floor
          events {
            id
            title
            dateStart
            dateEnd
            users {
              id
              login
              avatarUrl
            }
          }
        }
      }
    `, 'rooms').then((rooms) => {
      let floors = {};
      let events = [];
      for (let i = 0; i < rooms.length; ++i) {
        for (let j = 0; j < rooms[i].events.length; ++j) {
          let e = Object.assign({}, rooms[i].events[j]);
          e.room = { id: rooms[i].id, title: rooms[i].title, capacity: rooms[i].capacity, floor: rooms[i].floor };
          e.dateStart = moment(e.dateStart);
          e.dateEnd = moment(e.dateEnd);
          events.push(e);
          rooms[i].events[j].dateStart = moment(rooms[i].events[j].dateStart);
          rooms[i].events[j].dateEnd = moment(rooms[i].events[j].dateEnd);
          for (var k = j - 1; k > -1 && moment(rooms[i].events[k].dateStart).isAfter(moment(e.dateStart)); --k) {
            rooms[i].events[k + 1] = rooms[i].events[k];
          }
          rooms[i].events[k + 1] = e;
        }
        if (floors.hasOwnProperty(rooms[i].floor)) {
          floors[rooms[i].floor].push(rooms[i]);
        } else {
          floors[rooms[i].floor] = [rooms[i]];
        }
      }
      return [floors, events];
    });
  },

  getUsers () {
    return GRAPHQL.sendQuery(`
      {
        users {
          id
          login
          homeFloor
          avatarUrl
        }
      }
    `, 'users');
  },

  getRecommendation (body) {
    return axios.get('/recommendation', {
      params: body
    }).then((response) => response.data);
  },

  createEvent (title, dateStart, dateEnd, users, room) {
    return GRAPHQL.sendMutation(`
      mutation {
        createEvent (input: {
          title: "${title}"
          dateStart: "${dateStart}"
          dateEnd: "${dateEnd}"
        }, usersIds: ${users}, roomId: ${room}) {
          id
        }
      }
    `, 'createEvent');
  },

  updateEvent (id, body) {
    let payload = JSON.stringify(body).replace(/"([^"]+)":/g, '$1:').replace(/\uFFFF/g, '\\"');
    return GRAPHQL.sendMutation(`
      mutation {
        updateEvent (id: ${id}, input: ${payload}) {
          id
        }
      }
    `, 'updateEvent');
  },

  addUserToEvent (id, user) {
    return GRAPHQL.sendMutation(`
      mutation {
        addUserToEvent (id: ${id}, userId: ${user}) {
          id
        }
      }
    `, 'addUserToEvent');
  },

  removeUserFromEvent (id, user) {
    return GRAPHQL.sendMutation(`
      mutation {
        removeUserFromEvent (id: ${id}, userId: ${user}) {
          id
        }
      }
    `, 'removeUserFromEvent');
  },

  changeEventRoom (id, room) {
    return GRAPHQL.sendMutation(`
      mutation {
        changeEventRoom (id: ${id}, roomId: ${room}) {
          id
        }
      }
    `, 'changeEventRoom');
  },

  removeEvent (id) {
    return GRAPHQL.sendMutation(`
      mutation {
        removeEvent (id: ${id}) {
          id
        }
      }
    `, 'removeEvent');
  }
};

export default request;
