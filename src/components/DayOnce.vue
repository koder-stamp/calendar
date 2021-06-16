<template>
  <div class="list-container" >
    <div class="list-container-inside" @click="toggleDetail">
      <div v-if="list.length" class="title-num">{{ list.length > 9 ? 9 : list.length}}</div>
      <div class="num">
        <template v-if="i==0 && k< 7 ">
          {{ week[k] }}
        </template>
        {{ data.getDate() }}
      </div>
      <template>
        <div v-for="(li,it) in list" :key="li.id">
          <div v-if="it < 3" class="list-item">{{ li.titleEvent }}</div>
          <div v-else-if="it == 4" class="li-dot">...</div>
        </div>
      </template>
    </div>
      <transition name="fade">
        <div class="dropdown dropdown-inside" v-show="opened" >
          <div class="dropdown-header">
            {{ $moment(data).format('MM.DD.YYYY') }}
            <button class="button button-close" @click="hideDetail" ><font-awesome-icon  icon="times" /></button>
          </div>
          <div class="dropdown-body">
            <div v-for="(li, i) in list" :key="i">
              <div class="item">
                <div class="item-row item-title">
                  <font-awesome-icon class="icon-left"  icon="star" />{{ li.titleEvent }}
                </div>
                <div class="item-row item-data">
                  <font-awesome-icon class="icon-left"  icon="calendar" />{{ $moment(li.timeAdd).format('MM.DD.YYYY') }}
                </div>
                <div class="item-row item-description">
                  <font-awesome-icon class="icon-left"  icon="user" />{{ li.titleEvent }}
                </div>
                <div class="item-buttons">
                  <button class="button"  @click="toggleDetail('edit', li)"><font-awesome-icon  icon="pen" /></button>
                  <button class="button" @click="deleteItem(li.eventId)"><font-awesome-icon  icon="trash-alt" /></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    <modal-add :source="source" :right="k > 3" :inside="true" :propData="data" :editable="editable"  @hide="hideDetail" :opened="openedModal" />
  </div>
</template>
<script>
import {mapActions} from "vuex/dist/vuex.mjs";
import ModalAdd from "@/pages/ModalAdd";

export default {
  name: 'day-once',
  components: {ModalAdd},
  props: {
    data: {},
    i: {},
    k: {},
    list: {
      type: Array,
      default: () => []
    },
    week: {}
  },
  data: function () {
    return {
      source: {},
      opened: false,
      editable: false,
      openedModal: false
    }
  },
  computed: {

  },
  methods: {
    ...mapActions({
      deleteEvent: "calendar/deleteEvent"
    }),
    deleteItem(id){
      this.deleteEvent(id)
    },
    toggleDetail (elem, source) {
      if (elem !== 'edit'){
        this.opened = !this.opened
        if (!this.list.length) {
          this.opened = !this.opened
          this.source = {}
          this.editable = false
          this.openedModal = !this.openedModal
        }
      } else {
        this.source = source
        this.editable = true
        console.log('this.source 22222 ===', this.source)
        this.opened = !this.opened
        this.openedModal = !this.openedModal
      }

    },
    hideDetail () {
      this.$emit('hide')
      this.opened = false
      this.openedModal = false
    },
  },
}
</script>
<style lang="scss">
.list-container{
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  &-inside{
    display: block;
    height: 100%;
    padding: 10px 5px;
  }
  .title-num{
    font-size: 11px;
    font-weight: 700;
    display: flex;
    width: 16px;
    height: 16px;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 1);
    border-radius: 50%;
    color: #ffffff;
    position: absolute;
    right: 5px;
    top: 5px;
  }
}
.list-item{
  border: 1px solid #000;
  -webkit-border-radius: 2px;
  -moz-border-radius: 2px;
  border-radius: 2px;
  margin-bottom: 4px;
  font-size: 12px;
  line-height: 1;
  padding: 2px 5px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}


.li-dot {
  font-size: 14px;
  line-height: 5px;
  color: #000000;

}
.dropdown.dropdown{
  &.dropdown-inside{
    width: 250px;
    left: 100%;
    top: 0;
    margin-top: 0;
    margin-left: 20px;
    padding: 0;
    .dropdown-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      font-weight: 700;
      height: 40px;
      background: #260650;
      color: #ffffff;
      padding: 0 15px;
      position: relative;
      .button{
        border: none;
        &.button-close{
          &:hover, &:active{
            svg {
              color: #260650;

            }
          }
        }
      }
      &:before{
        content: '';
        position: absolute;
        left: -40px;
        top: 0;
        border: 20px solid transparent;
        border-right: 20px solid #260650;
      }
    }
    .dropdown-body{
      font-size: 14px;
      line-height: 1.4;
      max-height: 300px;
      overflow: auto;
      padding: 15px 15px 50px;

      &::-webkit-scrollbar {
        width: 3px;
      }

      &::-webkit-scrollbar-track {
        box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
      }

      &::-webkit-scrollbar-thumb {
        background-color: darkgrey;
      }
      .item{
        margin-bottom: 5px;
        font-size: 12px;
        color: rgba(0,0,0, .5);
        .icon-left {
          margin-right: 5px;
          width: 15px !important;
          color: #000000;
        }
        &-row{
          display: flex;
          align-items: center;
          width: 100%;
        }
        &-title{
          font-weight: 700;
          color: #000000;
        }
        &-buttons {
          border-bottom: 1px solid rgba(0,0,0, .1);
          padding-top: 10px;
          padding-bottom: 10px;
          display: flex;
          justify-content: flex-end;
          .button{
            width: 30px;
            height: 30px;
            padding: 0;
            font-size: 12px;
          }
          .button + .button{
            margin-left: 5px;
          }
        }
      }
    }
    &.modal-left{
      left: auto;
      right: 100%;
      margin-left: 0;
      margin-right: 20px;
      .dropdown-header {
        &:before {
          content: "";
          position: absolute;
          left: auto;
          right: -40px;
          transform: rotate( -180deg);
        }
      }
    }
  }
}



</style>