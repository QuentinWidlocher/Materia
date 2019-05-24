import Vue from 'vue';

export class GlobalVariableService {
    public darkMode?: boolean = false;
    public eventHub: Vue;
}

export const globalVariableService: GlobalVariableService = {eventHub: new Vue()};
