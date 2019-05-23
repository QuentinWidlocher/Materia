<template>
  <div id="Contacts">
    <Toolbar :title="title"></Toolbar>
        <v-list two-line v-for="contact in contacts">
            <v-list-tile @click="gotoConversation(contact.user.id)">
              <v-list-tile-content>
                <v-list-tile-title>{{ contact.user.username }}</v-list-tile-title>
                <v-list-tile-sub-title>
                  <b v-if="contact.user.id === userService.currentUser.id">You : </b>
                  {{ contact.lastMessage.body }}
                  </v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
        </v-list>
  </div>
</template>

<script lang="ts" src="./Contacts.ts"></script>
