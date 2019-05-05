function init_vision_form_ocr() {
    return {
        template: `
        <div style="width:100%">
            <v-container grid-list-xl>
                <v-layout row wrap style="width:100%;text-align:center">
                    <v-flex xs12 sm12 md12 style="margin: 0 auto;">
                        <v-tabs 
                            v-model="active"
                            color="cyan"
                            dark
                            slider-color="yellow"
                        >
                            <v-tab key="tab1" ripple>
                                Sample
                            </v-tab>
                            <v-tab-item key="tab1">
                                <v-card flat>
                                    <v-toolbar dense  color="cyan">
                                        <v-spacer></v-spacer>
                                        <v-btn  color="green" @click="uploadFormImage()">Upload Form Image</v-btn>
                                        <v-btn  color="green" @click="addRow()">Add Row</v-btn>
                                    </v-toolbar>
                                    <v-layout row wrap>
                                        <v-flex xs12 style="max-height:450px; overflow:auto">
                                        <img :src="empty_form_image" style="max-width:600px;padding:10px">
                                        <v-progress-linear :indeterminate="true" v-if="progressing"></v-progress-linear>
                                        </v-flex>
                                        <v-flex xs12 style="max-height:450px; overflow:auto">
                                        <v-card>
                                            <form>
                                            <v-container grid-list-md text-xs-center>
                                                <v-layout row wrap v-for="(formline, lineIdx) in formtexts">
                                                    <v-flex xs6>
                                                        <v-card dark>
                                                            <v-select 
                                                                :items="words"
                                                                v-model="formline.linetext"
                                                                multiple
                                                                :hint="rect2Str(calcRect(formline.linetext))"
                                                                persistent-hint
                                                            ></v-select>
                                                        </v-card>
                                                    </v-flex>
                                                    <v-flex xs4>
                                                        <v-card dark>
                                                            <v-select 
                                                                v-model="formline.type"
                                                                :items="textmap"
                                                               
                                                                :hint="formline.type"
                                                                
                                                               
                                                            ></v-select>
                                                        </v-card>
                                                    </v-flex>
                                                    <v-flex xs2>
                                                       
                                                            <v-btn fab dark small color="primary" @click="deleteLine(lineIdx)">
                                                                <v-icon dark>remove</v-icon>
                                                            </v-btn>
                                                        
                                                    </v-flex>
                                                </v-layout>
                                            </v-container>

                                            
                                            </form>
                                        </v-card>
                                        </v-flex>
                                        </v-layout>
                                </v-card>
                            </v-tab-item>

                            <v-tab key="tab3" ripple>
                                Detect
                            </v-tab>
                            <v-tab-item key="tab3">
                                <v-card flat>
                                    <v-toolbar dense  color="cyan">
                                        <v-spacer></v-spacer>
                                        <v-btn  color="green" @click="uploadInputImage()">Upload Form Image</v-btn>
                                        <v-btn  color="green" @click="Import()">Import</v-btn>
                                    </v-toolbar>
                                    <v-layout row wrap>
                                        <v-flex xs12 style="max-height:450px; overflow:auto">
                                            <img :src="input_form_image" style="max-width:600px;padding:10px">
                                            <v-progress-linear :indeterminate="true" v-if="progressing"></v-progress-linear>
                                        </v-flex>
                                        <v-flex xs12 style="max-height:450px; overflow:auto">
                                            <v-card>
                                                <v-form v-if="inputtexts.length>0">
                                                    <v-text-field v-for="(formtext, lineIdx) in formtexts"
                                                        v-if="formtext.type==='Label'"
                                                            :label="makeLabel(formtext)"
                                                            :value="makeValue(formtext)"
                                                    ></v-text-field>
                                                </v-form>
                                            </v-card>
                                        </v-flex>   
                                    </v-layout>     
                                </v-card>
                            </v-tab-item>
                        </v-tabs
                    </v-flex>
                </v-layout>
            </v-container>    
        </div>



        `,
        data() {
            return {
                active: null,
                headers: [{
                    text: 'text',
                    align: 'left',
                    sortable: false,
                    value: 'text'
                },
                {
                    text: 'postion',
                    align: 'right',
                    sortable: false,
                    value: 'postion'
                }],
                values: [],
                empty_form_image:null,
                input_form_image:null,
                words:[],
                formtexts:[],
                inputtexts:[],
                progressing:false

            }
        },
        mounted: function () {
            
        },
        computed:{
            textmap(){
                var map = ["Label"];

                for(let formtext of this.formtexts) {
                    var text = "";
                    if(formtext.type === 'Label') {
                        for(let linetext of formtext.linetext) {
                            text += linetext.text + " "
                        }
                        var rect = this.calcRect(formtext.linetext)
                        map.push(text + "\n"+rect.x+","+rect.y+","+rect.w+","+rect.h)
                    }
                   
                }

                return map;
            }
        },
        methods: {
            makeLabel(formtext){
                var text = "";
                for(let linetext of formtext.linetext) {
                    text += linetext.text + " "
                }
                return text;
            },
            addRow(){
                this.formtexts.push({linetext:[this.words[0]], type:'Label'});
            },
            merge(r1, r2) {
                let x1 = Math.min(r1.x, r2.x)
                let y1 = Math.min(r1.y, r2.y)

                let x2 = Math.max(r1.x+r1.w, r2.x+r2.w)
                let y2 = Math.max(r1.y+r1.h, r2.y+r2.h)

                return { x: Math.min(r1.x, r2.x),
                         y: Math.min(r1.y, r2.y),
                         w: x2-x1,
                         h: y2-y1
                       }
            },
            region2rect(boundingBox) {
                return {
                    x: Math.min(boundingBox[0], boundingBox[6]),
                    y: Math.min(boundingBox[1], boundingBox[3]),
                    w: Math.max(boundingBox[2], boundingBox[4]) - Math.min(boundingBox[0], boundingBox[6]),
                    h: Math.max(boundingBox[5], boundingBox[7]) - Math.min(boundingBox[1], boundingBox[3])
                }
            },
            intersect(r1, r2){
                return !(r2.x > r1.x + r1.w
                    || r2.x + r2.w < r1.x
                    || r2.y > r1.y + r1.h
                    || r2.y + r2.h < r1.y
                );
            },
            calcRect(linetexts) {
                var rect = null;
                for(let linetext of linetexts) {
                    if(rect == null)
                        rect = this.region2rect(linetext.boundingBox)
                    else {
                        rect = this.merge(rect, this.region2rect(linetext.boundingBox))
                    }    
                }
                return rect
            },
            rect2Str(rect) {
                return JSON.stringify(rect)
            },
            deleteLine(idx){
                this.formtexts.splice(idx, 1)
            },
            clickElem(elem) {
                // Thx user1601638 on Stack Overflow (6/6/2018 - https://stackoverflow.com/questions/13405129/javascript-create-and-save-file )
                var eventMouse = document.createEvent("MouseEvents")
                eventMouse.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
                elem.dispatchEvent(eventMouse)
            },
            openFile(func) {
                var readFile = function(e) {
                    var file = e.target.files[0];
                    if (!file) {
                        return;
                    }
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        var contents = e.target.result;
                        fileInput.func(contents)
                        document.body.removeChild(fileInput)
                    }
                    reader.readAsDataURL(file)
                }
                var fileInput = document.createElement("input")
                fileInput.type='file'
                fileInput.style.display='none'
                fileInput.onchange=readFile
                fileInput.func=func
                document.body.appendChild(fileInput)
                this.clickElem(fileInput)
            },
            uploadFormImage(){
                var that = this
                that.progressing  = true
                this.openFile(function(contents){
                    that.empty_form_image = contents
                    
                    var binaryData = dataURItoBlob(contents)
                    var binaryDataToSend = new Uint8Array(binaryData)

                    axios({
                        method: 'POST',
                        url: '/api/recognizeText',
                        headers: {
                            "Content-Type": "application/octet-stream"
                        },
                        data: binaryDataToSend
                    }).then(function (response) {
                        const data = response.data;
                        const words = []
                        const formtexts = []
                        for(var line of data.recognitionResult.lines) {
                            var linetext = []
                            for(var word of line.words) {
                                var text = {text:word.text, boundingBox:word.boundingBox}
                                words.push(text)
                                linetext.push(text)
                            }
                            formtexts.push({linetext:linetext, type:'Label'})
                        }
                        
                        that.words = words
                        that.formtexts = formtexts
                        that.progressing  = false
                    }).catch(function (e) {
                        console.log(e)
                        that.progressing  = false
                    });

                    // axios({
                    //     method: 'POST',
                    //     url: '/api/ocr',
                    //     headers: {
                    //         "Content-Type": "application/octet-stream"
                    //     },
                    //     data: binaryDataToSend
                    // }).then(function (response) {
                    //     const data = response.data;
                    //     console.log(data)
                    //     for (var item of data) {
                    //         that.values = obj2array(flatten(item), 'name', 'value')
                    //     }
                    // }).catch(function (e) {
                    //     console.log(e)
                    // });

                })
            },
            uploadInputImage(){
                var that = this
                that.progressing  = true
                this.openFile(function(contents){
                    that.input_form_image = contents
                    
                    var binaryData = dataURItoBlob(contents)
                    var binaryDataToSend = new Uint8Array(binaryData)

                    axios({
                        method: 'POST',
                        url: '/api/recognizeText',
                        headers: {
                            "Content-Type": "application/octet-stream"
                        },
                        data: binaryDataToSend
                    }).then(function (response) {
                        const data = response.data;
                        const inputtexts = []
                        for(var line of data.recognitionResult.lines) {
                            var linetext = []
                            for(var word of line.words) {
                                var text = {text:word.text, boundingBox:word.boundingBox}
                                linetext.push(text)
                            }
                            inputtexts.push({linetext:linetext, type:'Label'})
                        }
                        that.inputtexts = inputtexts
                        that.progressing  = false
                    }).catch(function (e) {
                        that.progressing  = false
                        console.log(e)
                    });
                })
            },
            makeValue(formtextArg) {
                debugger
                var rectArg = this.calcRect(formtextArg.linetext)

                var valueRect = null;

                var value = "";

                for(let formtext of this.formtexts) {
                    var text = "";
                    if(formtext.type != 'Label') {
                        var rect = formtext.type.split('\n')
                        var rectArray = rect[1].split(',')
                        if(rectArg.x == rectArray[0] &&
                            rectArg.y == rectArray[1] &&
                            rectArg.w == rectArray[2] &&
                            rectArg.h == rectArray[3]
                        ) {
                            valueRect =  this.calcRect(formtext.linetext)
                        }
                    }
                   
                }

                for(var inputtext of this.inputtexts) {
                    
                    var rect = this.calcRect(inputtext.linetext)
                    if(this.intersect(rect, valueRect)) {
                        value+=this.makeLabel(inputtext)
                        break
                    }
                    
                }

                return value
            }
        }

    }
}



