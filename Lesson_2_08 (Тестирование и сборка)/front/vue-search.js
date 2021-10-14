Vue.component('vue-search', {
    props: ['goods', 'filtered_goods'],
    data: () => ({ searchLine: ''}),
    template: `
        <div>
        <input type="text" v-model="searchLine" class="goods-search" v-on:input="show($event.target.value)"/>
        <button class="search-button" type="button" v-on:click=filterGoods>Искать</button>
        </div>
    `,
    methods: {
        show(event) {
            console.log(event);
            this.searchLine = event;
        },
        // Здесь будем фильтровать список товаров
        filterGoods () {
            console.log('Child вызывает filterGoods searchLine = '+ this.searchLine);   
            this.$emit('filter_goods', this.searchLine);
        },
    }
});