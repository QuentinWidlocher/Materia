<template>
    <div id="Conversation">
        <Toolbar v-bind:title="title"></Toolbar>
        <v-container fluid class="pt-0 d-flex">
            <v-form
                class="ma-auto"
                ref="form"
                v-model="valid"
                lazy-validation
            >
                <v-alert
                    :value="error !== ''"
                    class="mb-3"
                    color="error"
                    icon="warning"
                    outline
                    >
                    Unable to connect : {{ error | lowercase }}
                </v-alert>

                <v-text-field
                    v-model="username"
                    :rules="usernameRules"
                    label="Username"
                    autocomplete="username"
                    required
                ></v-text-field>

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
                    :disabled="!valid || loading"
                    :loading="loading"
                    color="primary"
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