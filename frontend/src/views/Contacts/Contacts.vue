<template>
  <keep-alive>
    <div id="Contacts">
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
                  </v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
        </v-list>
    </div>
  </keep-alive>
</template>
<style lang="scss" scoped src="./Contacts.scss"></style>
<script lang="ts" src="./Contacts.ts"></script>
