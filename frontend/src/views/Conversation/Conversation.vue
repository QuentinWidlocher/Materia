<template>
  <div id="Conversation">
    <Toolbar :title="title" :button="{ action: 'back' }"></Toolbar>
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
