<template>
  <div id="Conversation">
    <Toolbar v-bind:title="title"></Toolbar>
    <v-container fluid>
        <div class="message-list">

        <v-progress-circular 
          class="ma-auto"
          v-if="messagesLoading"
          indeterminate 
          color="primary"
          :size="70"
          :width="3"
        ></v-progress-circular>

        <Talkbubble v-for="message in messages" :message="message" :align="message.from === interlocutor.id ? 'left' : 'right'"/>
          
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
