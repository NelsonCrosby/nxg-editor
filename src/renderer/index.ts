import Vue from 'vue'
import App from './view/app.vue'
import { setup as ipcSetup, say } from './ipc'

ipcSetup()

new Vue({
    el: '#app',
    render: h => h(App, {props: {name: 'World'}})
})

say('Hello!').then(console.log)
