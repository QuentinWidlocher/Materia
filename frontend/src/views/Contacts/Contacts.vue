<template>
  <div id="Contacts" class="background">
    <Toolbar :title="title" :button="{ action: 'sidenav' }"></Toolbar>

    <div class="page" v-if="contactsLoading">
      <v-progress-circular 
        class="ma-auto"
        indeterminate 
        color="primary"
        :size="70"
        :width="3"
      ></v-progress-circular>
    </div>

      <v-list two-line>
          <v-list-tile v-for="contact in contacts" v-bind:key="contact.user.id" @click="gotoConversation(contact.user.id)">
            <v-list-tile-content>
              <v-list-tile-title>{{ contact.user.username }}</v-list-tile-title>
              <v-list-tile-sub-title>
                <b v-if="contact.lastMessage.from == userService.currentUser.id">You : </b>
                {{ contact.lastMessage.body }}
                <span v-if="contact.lastMessage.dateSent" class="time">
                  {{ new Date(contact.lastMessage.dateSent * 1000) | moment("kk:mm") }}</span>
                </v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
      </v-list>
  </div>
</template>
<style lang="scss" scoped src="./Contacts.scss"></style>
<script lang="ts" src="./Contacts.ts"></script>
