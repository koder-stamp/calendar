<template>
  <transition name="fade">
    <div class="dropdown" :class="{'dropdown-inside modal-inside': inside, 'modal-left': right}" v-show="opened">
      <div v-if="inside" class="dropdown-header">
        {{ $moment(propData).format('MM.DD.YYYY') }}
        <button class="button button-close" @click="clearTime">
          <font-awesome-icon icon="times"/>
        </button>
      </div>
      <div :class="{'dropdown-body': inside}">
        <input v-model="titleEvent" placeholder="Событие"/>
        <input v-if="inside" readonly v-model="timeAdd"/>
        <date-picker v-else placeholder="дд.мм.ггггг" v-model="timeAdd" valueType="format"></date-picker>
        <input v-model="eventNames" placeholder="Событие">
        <textarea v-model="comment" class="form-control"></textarea>
        <div class="button-line">
          <button :disabled="disabled" class="button" @click="addTime">Сохранить</button>
          <button class="button" @click="clearTime">Отменить</button>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import DatePicker from 'vue2-datepicker'
import 'vue2-datepicker/index.css';
import {mapActions, mapGetters} from "vuex/dist/vuex.mjs";
import $moment from "moment";

export default {
  name: 'modal-add',
  components: {DatePicker},
  props: {
    opened: {},
    inside: {},
    propData: {},
    right: {},
    editable: {},
    source: {}
  },
  watch: {
    editable(val){
      if(val){
        this.titleEvent = this.source.titleEvent
        this.eventNames = this.source.eventNames
        this.comment = this.source.comment
      }
    },
    validationWatch(newVal) {
      const [newTimeAdd, newTitleEvent] = newVal.split('|');
      const valid = [newTimeAdd, newTitleEvent].includes("null") || [newTimeAdd, newTitleEvent].includes("")
      valid ? this.disabled = true : this.disabled = false
    },
  },
  data: function () {
    return {
      disabled: true,
      comment: '',
      eventNames: '',
      titleEvent: '',
      timeAdd: null,
    }
  },
  computed: {
    ...mapGetters({
      events: "calendar/events",
    }),
    validationWatch() {
      return `${this.timeAdd}|${this.titleEvent}`;
    },
  },
  methods: {
    ...mapActions({
      addEvent: "calendar/addEvent"
    }),
    hide() {
      this.$emit('hide')
    },
    addTime() {
      const data = {
        eventId: Date.now(),
        timeAdd: this.timeAdd,
        comment: this.comment,
        eventNames: this.eventNames,
        titleEvent: this.titleEvent
      }
      this.addEvent(data)
      this.hide()
      this.clearTime()
    },
    clearTime() {
      if (!this.inside) {
        this.timeAdd = ''
      }
      this.comment = '',
          this.eventNames = '',
          this.titleEvent = '',
          this.hide()
    },
  },
  mounted() {
    console.log("this.editable = ", this.editable)
  },
  created() {
    if (this.propData) {
      this.timeAdd = $moment(this.propData).format('YYYY-MM-DD')
    }
  }

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

  &:hover {
    background: #dee2e6;
  }

  &:active {
    background: darkgrey;
  }

  &:disabled {
    opacity: .3;
    background: darkgrey;
  }

  &-close {
    width: 30px;
    height: 30px;
    background: none;
    color: #ffffff;

    svg {
      color: #ffffff;
    }
  }
}

</style>