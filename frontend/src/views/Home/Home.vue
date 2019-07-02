<template>
  <div id="Home" class="background">
    <!-- <Toolbar :title="title"></Toolbar> -->

    <transition :name="'fade-transition'">
      <template v-if="activePage === 'login'">
        <Login :username="username" :id="id" v-on:hide="activePage = 'home'"/>
      </template>

      <template v-if="activePage === 'register'">
        <Register v-on:hide="activePage = 'home'"/>
      </template>
    </transition>

    <div v-if="activePage === 'home'" class="home mx-3">

      <img class="pic" src="static/img/logo.webp" />
      <h1 class="mx-auto display-3 primary--text">Materia</h1>
      <h2 class="mx-auto subheading grey--text">Web based chat</h2>
      <div class="ma-auto mt-5">
        <v-form ref="form" @keyup.enter.native="next">

          <div class="fields">
            <v-text-field 
              ref="code"
              type="number"
              class="code"
              prefix="+"
              v-model="code" 
              error-count="0"
              :rules="codeRules" 
              label="Code"
              required>
            </v-text-field>

            <v-text-field 
              ref="phone"
              type="number"
              class="phone" 
              v-model="phone" 
              :rules="phoneRules" 
              label="Phone number" 
              required>
            </v-text-field>
          </div>

          <v-btn 
            :loading="loading" 
            color="primary"
            class="mx-0"
            @click="next">
            Next
          </v-btn>

        </v-form>
      </div>
    </div>

  </div>
</template>
<style lang="scss" scoped src="./Home.scss"></style>
<script lang="ts" src="./Home.ts"></script>