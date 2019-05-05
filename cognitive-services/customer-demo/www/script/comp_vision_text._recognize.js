function init_vision_text_detect() {
    return {
        template: `
        <div style="width:100%">
            <v-container grid-list-xl>
                <v-layout row wrap style="width:100%;text-align:center">
                    <v-flex xs12 sm12 md12 style="margin: 0 auto;">
                        <v-card>
                            <v-toolbar dense  color="cyan">

                                <v-spacer></v-spacer>
                                <v-btn outline  @click="processOCRImage()" color="white">Capture</v-btn>
                                
                            </v-toolbar>
                                <canvas style="padding:10px;width:100%;height:100%; max-width:600px" id="ocr-video-canvas"></canvas>

                                <v-progress-linear :indeterminate="true" v-if="progressing"></v-progress-linear>
                                <v-data-table
                                    :headers="headers"
                                    :items="values"
                                    hide-actions
                                    class="elevation-1"
                                >
                                    <template slot="items" slot-scope="props">
                                    <td style="text-align:left">{{ props.item.name }}</td>
                                    <td class="text-xs-right">{{ props.item.value }}</td>
                                    </template>
                                </v-data-table>

                                <video id="ocr-video" width="100%" height="100%" autoplay style="padding:10px;display:none" ></video>
                                
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-container>
        </div>



        `,
        data() {
            return {
                ocrRectangles: [],
                values: [],
                headers: [{
                    text: 'Name',
                    align: 'left',
                    sortable: false,
                    value: 'name'
                },
                {
                    text: 'Value',
                    align: 'right',
                    sortable: false,
                    value: 'value'
                }],
                progressing:false
            }
        },
        mounted: function () {
            this.init_camera()
        },
        methods: {
            init_camera() {
                var that = this
                var video = document.getElementById('ocr-video');

                if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                    navigator.mediaDevices.getUserMedia({ video: true }).then(function (stream) {
                        video.src = window.URL.createObjectURL(stream);
                        video.play();
                    });
                } else if (navigator.getUserMedia) { // Standard
                    navigator.getUserMedia({ video: true }, function (stream) {
                        video.src = stream;
                        video.play();
                    }, errBack);
                } else if (navigator.webkitGetUserMedia) { // WebKit-prefixed
                    navigator.webkitGetUserMedia({ video: true }, function (stream) {
                        video.src = window.webkitURL.createObjectURL(stream);
                        video.play();
                    }, errBack);
                } else if (navigator.mozGetUserMedia) { // Mozilla-prefixed
                    navigator.mozGetUserMedia({ video: true }, function (stream) {
                        video.src = window.URL.createObjectURL(stream);
                        video.play();
                    }, errBack);
                }

                video.addEventListener('loadedmetadata', function () {
                    var videocanvas = document.getElementById('ocr-video-canvas');
                    videocanvas.width = video.videoWidth;
                    videocanvas.height = video.videoHeight;
                });


                video.addEventListener('play', function () {
                    var $this = this; //cache
                    var videocanvas = document.getElementById('ocr-video-canvas');
                    var videocanvasctx = videocanvas.getContext('2d');
                    (function loop() {
                        if (!$this.paused && !$this.ended) {
                            videocanvasctx.drawImage($this, 0, 0);
                            videocanvasctx.font = 'italic 12pt Calibri';
                            // videocanvasctx.fillText('Hello World!', 150, 100);
                            setTimeout(loop, 1000 / 30); // drawing at 30fps

                            for (var idx in that.ocrRectangles) {
                                var item = that.ocrRectangles[idx]

                                // videocanvasctx.moveTo(poly[0], poly[1]);
                                videocanvasctx.beginPath();
                                videocanvasctx.lineWidth = 3;
                                videocanvasctx.strokeStyle = 'yellow';
                                videocanvasctx.rect(item.left, item.top, item.width, item.height);
                                // for( var item=2 ; item < poly.length-1 ; item+=2 ){
                                //     videocanvasctx.lineTo( poly[item] , poly[item+1] )
                                // }

                                // videocanvasctx.lineTo( poly[1] , poly[1] )
                                videocanvasctx.closePath();
                                videocanvasctx.stroke();
                            }


                        }
                    })();
                }, 0);

            },
            region2rect(boundingBox) {
                return {
                    x: Math.min(boundingBox[0], boundingBox[6]),
                    y: Math.min(boundingBox[1], boundingBox[3]),
                    w: Math.max(boundingBox[2], boundingBox[4]) - Math.min(boundingBox[0], boundingBox[6]),
                    h: Math.max(boundingBox[5], boundingBox[7]) - Math.min(boundingBox[1], boundingBox[3])
                }
            },
            processOCRImage() {
                var that = this;
                var videocanvas = document.getElementById('ocr-video-canvas');
                var image = videocanvas.toDataURL();
                var binaryData = dataURItoBlob(image)
                var binaryDataToSend = new Uint8Array(binaryData)
                this.progressing = true
                axios({
                    method: 'POST',
                    url: '/api/recognizeText',
                    headers: {
                        "Content-Type": "application/octet-stream"
                    },
                    data: binaryDataToSend
                }).then(function (response) {
                    const data = response.data;
                    console.log(JSON.stringify(data, null, 2));
                    that.ocrRectangles = [];
                    that.values = [];
                    for (var item of data.recognitionResult.lines) {
                        //that.ocrRectangles.push(item.faceRectangle)
                        var rect = that.region2rect(item.boundingBox)
                        that.ocrRectangles.push({left:rect.x, top:rect.y,width:rect.w,height:rect.h})
                        // that.ocrRectangles.push(item.boundingBox);
                        that.values.push({name:item.text,value:item.boundingBox});

                    }
                    that.progressing  = false
                }).catch(function (e) {
                    that.progressing  = false
                    alert("Server Error!")
                    console.log(e)
                });
            }
        }

    }
}