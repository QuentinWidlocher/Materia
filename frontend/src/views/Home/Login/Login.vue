<template>
    <div id="Login">
        <v-btn
            flat
            class="px-0"
            v-on:click="$emit('hide', $event)"
            >
            <v-icon>arrow_back</v-icon> Go back
        </v-btn>

        <v-container fluid class="pt-0 d-flex">
            <v-form
                class="ma-auto"
                ref="form"
                v-model="valid"
                @keyup.enter.native="login"
            >
                <h1 class="title mb-4">Welcome back {{username}} !</h1>
                <v-alert
                    :value="error !== ''"
                    class="mb-3"
                    color="error"
                    icon="warning"
                    outline
                    >
                    Unable to connect : {{ error | lowercase }}
                </v-alert>

                <input type="text" hidden/>

                <v-text-field
                    v-model="password"
                    :rules="passwordRules"
                    label="Password"
                    autocomplete="current-password"
                    :type="showPassword ? 'text' : 'password'"
                    :append-icon="showPassword ? 'visibility' : 'visibility_off'"
                    @click:append="showPassword = !showPassword"
                    required
                ></v-text-field>

                <v-btn
                    :loading="loading"
                    block
                    type="button"
                    color="primary"
                    class="mx-0"
                    @click="login"
                >
                Login
                </v-btn>
            </v-form>
        </v-container>
    </div>
</template>
<style lang="scss" scoped src="./Login.scss"></style>
<script lang="ts" src="./Login.ts"></script>