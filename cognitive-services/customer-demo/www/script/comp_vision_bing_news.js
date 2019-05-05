function init_vision_bing_news_search() {
    return {
        template: `
        <div style="width:100%" >
            <v-container grid-list-xl>
                <v-layout wrap column>            
                    <v-flex xs12 sm6>
                        <v-text-field type="text" label="Key Words" clearable id="txt-search" value="china"
                            append-outer-icon="search"
                            @click:append-outer="bingSearchNews()">
                        </v-text-field>
                    </v-flex>  
                       
                    <v-flex xs12 sm6 wrap>
                        <v-progress-linear :indeterminate="true" v-if="progressing"></v-progress-linear>
                        <v-data-table
                        :headers="headers"
                        :items="counts"
                        hide-actions
                        class="elevation-1">
                        <template slot="items" slot-scope="props">
                          <td class="text-xs-center">{{ props.item.total}}</td>
                          <td class="text-xs-center">{{ props.item.positive}}</td>
                          <td class="text-xs-center">{{ props.item.lack}}</td>
                          <td class="text-xs-center">{{ props.item.negative}}</td>
                          </template>
                        </v-data-table>

                    <v-flex xs12 sm12 md12>
                        <v-card id="zingChart"></v-card> 
                        
                        <v-layout wrap>
                            <v-flex v-for="card in cards"
                                :key="card.name">
                                <v-card style="margin: 10px auto;text-align:left" width="350px">
                                    <v-card-media
                                        :src=card.image
                                        height="200px">
                                    </v-card-media>

                                    <v-card-title primary-title  height="200px">
                                        <div style="text-align:left;">
                                            <div class="headline white--text" v-text="card.name"></div>
                                            <span class="grey--text" v-text="card.description"></span>
                                        </div>
                                    </v-card-title>
                                </v-card>
                            </v-flex>
                        </v-layout>                                                  
                    </v-flex>
                    </v-flex>  
                </v-layout>
            </v-container>
        </div>
`
        ,
        data() {
            return {
                counts: [],
                sort: [],
                cards: [],
                headers: [
                    {
                        text: 'Total',
                        sortable: false,
                        align: 'center',
                        value: 'total'
                    },
                    {
                        text: 'Positive',
                        sortable: false,
                        align: 'center',
                        value: 'positive'
                    },
                    {
                        text: 'Lack',
                        sortable: false,
                        align: 'center',
                        value: 'lack'
                    },
                    {
                        text: 'Negative',
                        sortable: false,
                        align: 'center',
                        value: 'negative'
                    }
                ],
                progressing: false
            }
        },
        mounted: function () {

        },
        methods: {

            bingSearchNews() {
                var that = this;
                var txtSearch = document.getElementById('txt-search');
                //alert(txtSearch.value);

                that.progressing = true
                var documentsPostArr = [];
                axios({
                    method: 'GET',
                    url: `/api/bingSearchNews?keyword=${txtSearch.value}`,
                    headers: {
                        "Content-Type": "application/json"
                    },
                    data: null
                }).then(function (response) {
                    const dataNews = response.data;

                    //alert(data._type);
                    // that._type = dataNews._type;
                    // that.readLink = dataNews.readLink;
                    // that.queryContext = dataNews.queryContext;
                    // that.sort = dataNews.sort;
                    that.cards = [];
                    var i = 0;
                    for (var item of dataNews.value) {
                        i++;
                        documentsPostArr.push(new DocumentPost("en", i, item.description))
                        that.cards.push(new NewsCard(i, item.name, item.description, item.image, item.url, item.datePublished, item.provider));
                    }
                    var total = i;
                    AnalyzingKeyPhrasesOfDocuments(documentsPostArr);

                    var countLack = 0;
                    var countNegative = 0;
                    var countPositive = 0;
                    axios({
                        method: 'POST',
                        url: '/api/textAnalyticsInSentiment',
                        headers: {
                            "Content-Type": "application/json"
                        },
                        data: documentsPostArr
                    }).then(function (response) {
                        const data = response.data;
                        for (var item of data.documents) {
                            if (item.score == 0.5)
                                countLack++;
                            else if (item.score > 0.5)
                                countPositive++;
                            else
                                countNegative++;
                        }
                        console.log("that.counts");
                        var temp=[];
                        temp.push(new TableItems(total, countLack, countNegative, countPositive));
                        that.counts=temp;
                        console.log(that.counts);
                    }).catch(function (e) {
                        console.log(e)
                    });

                    console.log(that.cards);
                    that.progressing = false
                }).catch(function (e) {
                    console.log(e)
                    that.progressing = false
                });
            }
        }
    }
}

function DocumentPost(language, id, text) {
    this.language = language;
    this.id = id;
    this.text = text;
}

function TableItems(a, b, c, d) {
    this.total = a;
    this.lack = b;
    this.negative = c;
    this.positive = d;
}

function NewsCard(id, name, description, image, url, datePublished, provider) {
    this.id = id;
    this.name = name;
    this.description = description;
    if (image == null || image.thumbnail == null)
        this.image = "https://www.bing.com/th?id=null";
    else {
        var urlStr = image.thumbnail.contentUrl;
        var m = urlStr.indexOf("&");
        this.image = urlStr.substring(0, m);
    }
    this.url = url;
    this.datePublished = datePublished;
    if (provider == null && provider[0].name == null)
        this.provider = provider[0].name;
}

function AnalyzingKeyPhrasesOfDocuments(documents) {
    var desArr = String;
    axios({
        method: 'POST',
        url: '/api/textAnalyticsInKeyPhrases',
        headers: {
            "Content-Type": "application/json"
        },
        data: documents
    }).then(function (response) {
        const data = response.data;
        var keyPhrasesArr = [];
        keyPhrasesArr = data.documents;

        for (var document of data.documents) {
            for (var item of document.keyPhrases) {

                desArr = desArr + item + ",";
            }
        }

        var zcConfig = {
            type: 'wordcloud',
            options: {
                text: desArr,
                minLength: 4,
                ignore: ['establish', 'this'],
                maxFontSize: 50,
                minFontSize: 10,
                // colorType: 'color',
                // color: 'white',

                style: {
                    // backgroundColor: 'black',
                    borderRadius: 2,
                    fontFamily: 'Scope One',
                    padding: '5px 10px',
                    hoverState: {
                        alpha: 1,
                        backgroundColor: 'white',
                        fontColor: 'black',
                        borderColor: 0,
                        textAlpha: 1,
                    },
                    tooltip: {
                        text: '%text: %hits',
                        visible: true,

                        alpha: 1,
                        //backgroundColor: 'purple',
                        borderColor: 'none',
                        borderRadius: 2,
                        fontColor: 'blank',
                        fontFamily: 'Georgia',
                        fontSize: 12,
                        textAlpha: 0.9,
                    }
                }
            }
        };

        zingchart.render({
            id: 'zingChart',
            data: zcConfig,
            height: 400,
            width: '100%'
        });
    }).catch(function (e) {
        console.log(e)
    });
}