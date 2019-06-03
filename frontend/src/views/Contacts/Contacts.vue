<template>
  <div id="Contacts" class="background">
    <Toolbar 
      :title="title"
      :button="{ action: 'sidenav' }"
      :lockSearch="!searchReady"
      searchButton="true"
      v-model="searchTerms"
      v-on:search="search()"
      v-on:open-search="openSearch($event)"
    ></Toolbar>

    <div class="page" v-if="contactsLoading">
      <v-progress-circular 
        class="ma-auto"
        indeterminate 
        color="primary"
        :size="70"
        :width="3"
      ></v-progress-circular>
    </div>

    <transition name="fade-transition">
      <div class="page" v-if="searchReady && contacts.length <= 0">
        <v-img src="static/illustrations/svg/contact_search.svg" contain max-width="500" class="ma-auto px-5"/>
      </div>
    </transition>

      <v-list two-line>
        <transition-group name="flip-list">
          <v-list-tile v-for="contact in contacts" v-bind:key="contact.user.id" @click="gotoConversation(contact.user.id)">
            <v-list-tile-content>
              <v-list-tile-title>{{ contact.user.username }}</v-list-tile-title>
              <v-list-tile-sub-title v-if="contact.lastMessage">
                <b v-if="contact.lastMessage.from == userService.currentUser.id">You : </b>
                {{ contact.lastMessage.body }}
                <span v-if="contact.lastMessage.dateSent" class="time">
                  {{ new Date(contact.lastMessage.dateSent * 1000) | moment("kk:mm") }}</span>
                </v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </transition-group>
      </v-list>
  </div>
</template>
<style lang="scss" scoped src="./Contacts.scss"></style>
<script lang="ts" src="./Contacts.ts"></script>
