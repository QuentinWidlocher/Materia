<template>
    <div id="Login">
        <v-btn
            flat
            class="px-0"
            v-on:click="$emit('hide', $event)"
            >
            <v-icon>arrow_back</v-icon> Go back
        </v-btn>
            <div class="form-wrap mx-3">
                <v-form
                class="ma-auto"
                ref="form"
                v-model="valid"
                @keyup.enter.native="login"
            >
            <h1 class="display-1 mb-5">Welcome back {{username}} !</h1>
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
                    type="button"
                    color="primary"
                    class="mx-0"
                    @click="login"
                >
                Login
                </v-btn>
            </v-form>
        </div>
    </div>
</template>
<style lang="scss" scoped src="./Login.scss"></style>
<script lang="ts" src="./Login.ts"></script>