function init_vision_face_detect() {
    return {
        template: `
        <div style="width:100%">
            <v-container grid-list-xl>
                <v-layout row wrap style="width:100%;text-align:center">
                    <v-flex xs12 sm12 md12 style="margin: 0 auto;">
                        <v-card>
                            <v-toolbar dense  color="cyan">
                                <v-spacer></v-spacer>
                                <v-btn outline  @click="processImage()" color="white">Capture</v-btn>
                                
                            </v-toolbar>
                                <canvas style="padding:10px;width:100%;height:100%; max-width:600px" id="video-canvas"></canvas>
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

                                <video id="video" width="100%" height="100%" autoplay style="padding:10px;display:none" ></video>
                                
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-container>
        </div>



        `,
        data() {
            return {
                faceRectangles: [],
                age: [],
                gender: [],
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
                values: [],
                progressing : false
            }
        },
        mounted: function () {
            this.init_camera()
        },
        methods: {
            init_camera() {
                var that = this
                var video = document.getElementById('video');

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
                    var videocanvas = document.getElementById('video-canvas');
                    videocanvas.width = video.videoWidth;
                    videocanvas.height = video.videoHeight;
                });


                video.addEventListener('play', function () {
                    var $this = this; //cache
                    var videocanvas = document.getElementById('video-canvas');
                    var videocanvasctx = videocanvas.getContext('2d');
                    (function loop() {
                        if (!$this.paused && !$this.ended) {
                            videocanvasctx.drawImage($this, 0, 0);
                            videocanvasctx.font = 'italic 12pt Calibri';
                            // videocanvasctx.fillText('Hello World!', 150, 100);
                            setTimeout(loop, 1000 / 30); // drawing at 30fps

                            for (var idx in that.faceRectangles) {
                                var item = that.faceRectangles[idx]
                                videocanvasctx.beginPath();
                                videocanvasctx.rect(item.left, item.top, item.width, item.height);
                                videocanvasctx.lineWidth = 3;
                                videocanvasctx.strokeStyle = 'yellow';
                                videocanvasctx.stroke();
                                videocanvasctx.fillStyle = 'yellow';
                                videocanvasctx.fillText(that.gender[idx], item.left + item.width + 5, item.top + 20);
                                videocanvasctx.fillText(that.age[idx], item.left + item.width + 5, item.top + 40);
                            }


                        }
                    })();
                }, 0);

            },
            
            processImage() {
                var that = this;
                var videocanvas = document.getElementById('video-canvas');
                var image = videocanvas.toDataURL();
                var binaryData = dataURItoBlob(image)
                var binaryDataToSend = new Uint8Array(binaryData)
                that.progressing = true
                axios({
                    method: 'POST',
                    url: '/api/detectface',
                    headers: {
                        "Content-Type": "application/octet-stream"
                    },
                    data: binaryDataToSend
                }).then(function (response) {
                    const data = response.data;
                    console.log(JSON.stringify(data, null, 2));
                    that.faceRectangles = [];
                    that.gender = [];
                    that.age = [];
                    that.values = [];
                    for (var item of data) {
                        that.faceRectangles.push(item.faceRectangle)
                        that.age.push(item.faceAttributes.age)
                        that.gender.push(item.faceAttributes.gender)
                        that.values = obj2array(flatten(item), 'name', 'value')

                    }
                    that.progressing = false
                }).catch(function (e) {
                    console.log(e)
                    that.progressing = false
                });
            }
        }

    }
}