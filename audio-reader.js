//* get audio list and play

var audioReader = function() {
    return function() {
        var playList = [];
        var option, player, playing;
        var AudioContext, useWebAudioApi;
        var getBufferNow = 0,
            bufferList = {};
        var playListNow = 0;

        try {
            // Fix up for prefixing
            AudioContext = window.AudioContext || window.webkitAudioContext;
            var audioContext = new AudioContext();
        } catch (e) {
            console.warn('Damn it! Web Audio API is not supported in this browser...');
        }

        var buildSource = function() {
            var source = option.sourceFile;
            var sourcePath = option.sourcePath ? option.sourcePath : "";
            for (var i = 0; i < source.length; i++) {
                var name = source[i].split('.')[0];
                playList.push({ name: name, src: sourcePath + source[i] });
            }
            useWebAudioApi = option.useWebAudioApi && AudioContext;
            if (useWebAudioApi) {
                getAudio_buffer();
            } else {
                createPlayer();
                getAudio_buffer();
            }
        }

        var fullOnLoad = function() {
            if (!!option.fullOnLoad && typeof option.fullOnLoad === 'function' && !option.fullOnLoadFired) {
                option.fullOnLoad();
                option.fullOnLoadFired = true;
            }
        };

        var createPlayer = function() {
            //** create element , used when not webAudioApi
            player = document.createElement('audio');
            player.controls = false;
            player.autoplay = false;
            player.preload = "auto";
            player.type = 'audio/mp3';

            player.addEventListener("canplaythrough", function() {
            }, false);

            player.addEventListener("onerror", function() {
                // option;
                if (option.onError && typeof option.onError === 'function' && !option.error) {
                    option.onError("音源檔案讀取錯誤");
                    option.error = true;
                }
            }, true);
            player.addEventListener("ended", function() {
                if (!!option.playAll && playListNow < playList.length) {
                    try {
                        playByChangeSrc();
                    } catch (err) {
                        console.warn("play next error")
                        console.warn(err);
                    }
                } else {
                    resetPlayStatus();
                }
            }, false);
        }

        var toBase64 = function() {
            var reader = new FileReader();
            reader.addEventListener("load", function() {
                bufferList[this.item.name] = reader.result;
                getBufferSwitch();
            }.bind(this), false);
            reader.readAsDataURL(this.data);
        }

        var playByChangeSrc = function() {
            // console.warn(bufferList);
            // console.warn(playList);
            // console.warn(playListNow);
            player.src = bufferList[playList[playListNow].name];
            // console.warn(player.src);
            player.play();
            if (playListNow < playList.length) {
                playListNow++;
            }
        };

        var ajaxBuffer = function() {
            var request = new XMLHttpRequest();
            var item = this.item;
            request.open('GET', item.src, true);
            // Setting the responseType to arraybuffer sets up the audio decoding
            request.responseType = this.responseType;

            request.onload = function() {
                // console.warn(request.response)
                // Decode the audio once the require is complete
                this.data = request.response;
                this.onload.call(this)
            }.bind(this);

            request.onerror = function() {
                option.error = true;
                console.warn('get audio error!');
            }
            // Send the request which kicks off 
            request.send();
        }

        var getAudio_buffer = function() {
            // Create the XHR which will grab the audio contents
            for (var i = 0; i < playList.length; i++) {
                var item = playList[i];
                if (!bufferList[item.name] || bufferList[item.name].length === 0) {
                    // Set the audio file src here
                    if (useWebAudioApi) {
                        ajaxBuffer.call({ item: item, responseType: 'arraybuffer', onload: decodeBuffer });
                    } else {
                        ajaxBuffer.call({ item: item, responseType: 'blob', onload: toBase64 });
                    }
                } else {
                    getBufferSwitch();
                }
            }
        }

        var decodeBuffer = function() {
            audioContext.decodeAudioData(this.data, function(buffer) {
                bufferList[this.item.name] = buffer;
                // console.warn(bufferList)
                option.error = false;
                getBufferSwitch();
            }.bind(this), function(e) {
                option.error = true;
                console.warn('Audio error! ', e);
            });
        }

        var getBufferSwitch = function() {
            getBufferNow++;
            if (getBufferNow == playList.length) {
                fullOnLoad();
                option.loaded = true;
                option.fullOnLoadFire = true;
            }
        }

        var playBuffer = function() {
            player = audioContext.createBufferSource();
            player.buffer = bufferList[playList[playListNow].name];
            player.connect(audioContext.destination);
            player.onended = function() {
                playListNow++;
                if (playListNow < playList.length) {
                    if (option.playAll) {
                        playBuffer();
                    }
                } else {
                    resetPlayStatus();
                }
            }
            player["start"] ? player.start(0) : player.noteOn(0);
        };

        var resetPlayStatus = function resetPlayStatus() {
            playing = false;
            playListNow = 0;
        };

        var resetSource = function() {
            option.fullOnLoadFired = false;
            option.loaded = false;
            option.error = false;
            getBufferNow = 0;
            playList = [];
        };

        var clearBuffer = function() {
            bufferList={};
        };

        return {
            play: function(i) {
                if (option.error || playing) return;
                if (!i) i = 0;
                playListNow = i;
                try {
                    if (useWebAudioApi) {
                        playBuffer();
                    } else {
                        playByChangeSrc();
                    }
                    playing = true;
                } catch (err) {
                    return false;
                }
            },
            set: function(optionCustom) {

                /* optionCustom 參考
                optionCustom = {
                        sourcePath:"./audio/letters/",
                        sourceFile: [],  //** files like a.mp3
                        playAll:true, //** play all list
                        useWebAudioApi:true, //** try use web audio api if possible
                        fullOnLoad: function() {
                            // console.warn("fullOnLoad")
                            projectServer.loadingEnd();
                        },
                        onError: function(err){
                            modalFactory.modalDefault({option:{body:'<h3>'+err+'</h3>'}});
                            projectServer.loadingEnd();
                        }
                    }
                */
                if (!optionCustom && !option) return false;
                if (!!optionCustom) option = optionCustom;
                resetSource();
                buildSource();
                return {
                    //** loaded then
                    then: function(callback) {
                        var checkThen = function() {
                            if (option.loaded) {
                                callback({ bufferList: bufferList, playList: playList });
                                clearInterval(fullLoadCheck);
                                fullLoadCheck = null;
                            }
                        }
                        var fullLoadCheck = setInterval(checkThen, 10)
                    }
                }
            }
        }
    }()
}
export default audioReader;