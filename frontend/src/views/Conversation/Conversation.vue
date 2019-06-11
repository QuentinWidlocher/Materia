<template>
  <div id="Conversation">
    <Toolbar :user="interlocutor" :button="{ action: 'back' }"></Toolbar>
    <v-container fluid class="background pt-0">
        <div class="page">

        <v-progress-circular 
          class="ma-auto"
          v-if="messagesLoading"
          indeterminate 
          color="primary"
          :size="70"
          :width="3"
        ></v-progress-circular>

        <!-- <DynamicScroller
          :items="messages"
          :min-item-size="45"
          :itemSize="null" 
        >
          <template v-slot="{ item, index, active }">
            <DynamicScrollerItem
              :item="item"
              :active="active"
              :data-active="active"
              :data-index="index"
              :size-dependencies="[
                item.body,
              ]"
              :title="new Date(item.dateSent * 1000)"
            >
              <Talkbubble :message="item" :align="item.from === interlocutor.id ? 'left' : 'right'"/>
            </DynamicScrollerItem>
          </template>
        </DynamicScroller> -->

      <div ref="messages" class="message-list" v-if="!messagesLoading">
        <Talkbubble v-for="message in messages" :message="message" v-bind:key="message.id" :align="message.from === interlocutor.id ? 'left' : 'right'"/>
      </div>
          
        <v-text-field 
          class="input"
          solo
          v-model="message" 
          :append-icon="'send'"
          clearable
          label="Message" 
          type="text"
          @keyup.enter.native="sendMessage"
          @click:append="sendMessage" 
          @click:clear="clearMessage">
        </v-text-field>
      </div>
    </v-container>
  </div>
</template>
<style lang="scss" scoped src="./Conversation.scss"></style>
<script lang="ts" src="./Conversation.ts"></script>
