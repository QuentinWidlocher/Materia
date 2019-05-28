import Vue from 'vue';

export class GlobalVariableService {
    public eventHub: Vue = new Vue();
    private _darkMode?: boolean = false;

    public get darkMode(): boolean {
        if (!this._darkMode) {
            const darkModeLocal = localStorage.getItem('darkmode') === 'true';
            return darkModeLocal || false;
        } else {
            return this._darkMode;
        }
    }

    public set darkMode(state: boolean) {
        console.log(state);
        this._darkMode = state;
        localStorage.setItem('darkmode', (state ? 'true' : 'false'));
    }
}

export const globalVariableService: GlobalVariableService = new GlobalVariableService();
