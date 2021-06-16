<template>
  <div>
    <header class="header">
      <div class="container">
        <div class="row-head">
          <div class="button-left-group">
            <div class="dropdown-container">
              <button class="button button-head" @click="toggle">Добавить</button>
              <button  class="button button-head" @click="clearAll">Очистить все</button>
                <modal-add @hide="hide" :opened="opened" />
            </div>
          </div>
          <div class="filter-block">

          </div>
        </div>
      </div>
    </header>
    <div class="container">
      <div class="buttons-group">
        <button  class="prev button" @click="previousMonth">«</button>
        <span>{{ currentMonthAndYear }}</span>
        <button  class="next button" @click="nextMonth">»</button>
        <button  class="button" @click="nowMonth">Сегодня</button>
      </div>
      <div id="app-table" class="table-responsive">
        <table class="table table-bordered fullscreen">
          <tr v-for="(item, i) in gridArray" :key="item.id">
            <td class="dropdown-container" v-for="(data, k) in item" :key="data.id" :class="{'cal-selected': getThisData(data).length, 'now-date': activeData == $moment(data).format('MM DD YYYY')}"
                @click="setDate(data)">
              <day-onse  :data="data" :i="i" :k="k" :list="getThisData(data)" :week="week"/>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import $moment from 'moment';
import Once from "@/components/DayOnce";
import ModalAdd from "@/pages/ModalAdd";
import {mapActions, mapGetters} from "vuex/dist/vuex.mjs";

export default {
  name: 'Calendar',
  components: {ModalAdd, DayOnse: Once},
  data: function () {
    return {
      openDetail: false,
      date: null,
      opened: false,
      filterDate: undefined,
      selectedMonth: new Date(),
      currentMonthAndYear: $moment().format('MMM, YYYY'),
      week: [
        "Понедельник",
        "Вторник",
        "Среда",
        "Четверг",
        "Пятница",
        "Суббота",
        "Воскресенье",
      ]

    };
  },
  methods: {
    ...mapActions({
      clearAllState: "calendar/clearAll"
    }),
    getThisData(payload) {
      let data = $moment(payload).format('YYYY-MM-DD')
      let res = this.events.filter(el => el.timeAdd == data.toString())
      return res
    },
    clearAll() {
      this.clearAllState()
    },
    toggle() {
      this.opened = !this.opened
    },
    hide() {
      this.opened = false
    },
    nowMonth() {
      const tmpDate = new Date();
      const tmpMonth = tmpDate.getMonth();
      this.selectedMonth = new Date(tmpDate.setMonth(tmpMonth));
      this.currentMonthAndYear = $moment(this.selectedMonth).format('MMM, YYYY');
    },
    previousMonth() {
      const tmpDate = this.selectedMonth;
      const tmpMonth = tmpDate.getMonth() - 1;
      this.selectedMonth = new Date(tmpDate.setMonth(tmpMonth));
      this.currentMonthAndYear = $moment(this.selectedMonth).format('MMM, YYYY');
    },
    nextMonth() {
      const tmpDate = this.selectedMonth;
      const tmpMonth = tmpDate.getMonth() + 1;
      this.selectedMonth = new Date(tmpDate.setMonth(tmpMonth));
      this.currentMonthAndYear = $moment(this.selectedMonth).format('MMM, YYYY');
    },
    setDate(date) {
      if (date == this.filterDate) {
        this.filterDate = undefined;
      } else {
        this.filterDate = date;
      }
    },
    isActive(date) {
      return date === this.filterDate;
    },
    getCalendarMatrix(date) {
      let calendarMatrix = []

      const startDay = new Date(date.getFullYear(), date.getMonth(), 1)
      const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)
      const startDow = (startDay.getDay() + 6) % 7;
      const endDow = (lastDay.getDay() + 6) % 7;
      startDay.setDate(startDay.getDate() - startDow);
      lastDay.setDate(lastDay.getDate() + (6 - endDow));

      let week = []
      while (startDay <= lastDay) {
        week.push(new Date(startDay));
        if (week.length === 7) {
          calendarMatrix.push(week);
          week = []
        }
        startDay.setDate(startDay.getDate() + 1)
      }

      return calendarMatrix;
    }
  },
  computed: {
    ...mapGetters({
      events: "calendar/events",
    }),
    activeData() {
      return $moment(new Date()).format('MM DD YYYY')
    },
    gridArray() {
      const grid = this.getCalendarMatrix(this.selectedMonth);
      return grid;
    },
    formattedDate() {
      return this.filterDate ? $moment(this.filterDate).format('lll') : '';
    }
  },
}
</script>

<style lang="scss">
* {
  box-sizing: border-box;
}

a {
  text-decoration: none;
  display: block;
  padding: 0;
  color: #000;
}

.container {
  max-width: 980px;
  margin-left: auto;
  margin-right: auto;
}

.header {
  background: #ecebeb;
  min-height: 100px;
  padding: 40px 0 40px 0;

  .row-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .button-head{
      height: 40px;
      background: #0b1547;
      color: #ffffff;
    }
  }
}
.icon-left{
  margin-right: 5px;
}
.table-responsive {
  //display: block;
  //width: 100%;
  //overflow-x: auto;
  //padding: 0 10px 0;
  //min-height: 800px;
  //-webkit-overflow-scrolling: touch;
  //-ms-overflow-style: -ms-autohiding-scrollbar;
  @media (max-width: 800px) {
    width: 800px;
  }
}

.table {
  width: 100%;
  max-width: 100%;
  background-color: transparent;
  border-collapse: collapse;
  table-layout: fixed;
  @media (max-width: 600px) {
    table-layout: auto;
  }
}

tr {
  display: table-row;
  vertical-align: inherit;
  border-color: inherit;
}

.table td {
  padding: .5rem;
  vertical-align: top;
  border-top: 1px solid #dee2e6;
  width: 14.28%;
  height: 110px;
  white-space: nowrap;
  min-width: 100px;
  position: relative;
}

.table td {
  text-align: left;
  border: 1px solid #dee2e6;
  &.now-date{
    border:  2px solid #000;
  }
  .num{
    font-size: 10px;
    color: darkgrey;
    margin-bottom: 10px;
  }
  &.cal-selected,
  &.cal-selected:focus {
    background-color: #bee9f5;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .5s
}

.fade-enter,
.fade-leave-active {
  opacity: 0
}

.thead-default, .thead-default a {
  background-color: #00bcd4;
  color: #fff;
}


.center-title {
  text-align: center;
}


.buttons-group {
  display: flex;
  align-items: center;
  padding-top: 30px;
  padding-bottom: 10px;

  span {
    width: 150px;
    font-weight: 700;
    font-size: 14px;
  }

  .button {
    &.prev {
      margin-right: 10px;
      width: 26px;
      padding-left: 0;
      padding-right: 0;
      margin-left: 0;
    }

    &.next {
      margin-right: 0;
      margin-left: 10px;
      width: 26px;
      padding-left: 0;
      padding-right: 0;
    }
  }
}

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  min-height: 26px;
  padding-left: 15px;
  padding-right: 15px;
  font-size: 14px;
  margin-left: 15px;
  margin-right: 15px;
  background: #ffffff;
  transition: all 0.3s;
  &:hover{
    background: #dee2e6;
  }
  &:active{
    background: darkgrey;
  }
  &:disabled{
    opacity: .3;
    background: darkgrey;
  }
  &-close{
    width: 30px;
    height: 30px;
    background: none;
    color: #ffffff;
    svg{
      color: #ffffff;
    }
  }
}

.dropdown-container {
  position: relative;

  .button {
    margin: 0;
  }

  .dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    min-width: 200px;
    background: #ffffff;
    padding: 15px;
    margin-top: 15px;
    box-shadow: 2px 2px 15px rgba(0, 0, 0, .2);
    z-index: 10;

    input, .form-control {
      display: block;
      border-radius: 2px;
      padding: 0 10px 0 10px;
      width: 100%;
      font-size: 14px;
      margin-bottom: 15px;
      border: 1px solid #c9c3c3;
      height: 30px;
    }

    .form-control {
      padding: 10px;
      height: 100px;
    }
  }

  .button-line {
    display: flex;
    justify-content: space-between;
  }
}

.button-left-group {
  .button + .button{
    margin-left: 15px;
  }
}
</style>
