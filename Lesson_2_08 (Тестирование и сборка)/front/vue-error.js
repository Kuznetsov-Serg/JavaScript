// Error
Vue.component('vue-error', {
    props: ['flag_error', 'error_description'],
    template: `
        <div v-if="flag_error" class="error">
            <h1>Ошибка!</h1>
            <p>{{error_description}}</p>
            <button class="button_active" v-on:click=closeError>❌ Закрыть</button>
        </div>
    `,
    methods: {
        closeError() {
            console.log('Закрыть ошибку')
            this.$emit('clear_error');       // передадим в Родителя команду закрыть ошибку
        }
    }
})