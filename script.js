(function() {
    if (!"mediaDevices" in navigator ||
        !"getUserMedia" in navigator.mediaDevices
    ) {
        alert("Camera API is not available in your browser");
        return;
    }

    // get page elements
    const video = document.querySelector("#video");
    const btnPlay = document.querySelector("#btnPlay");
    const btnPause = document.querySelector("#btnPause");
    const btnScreenshot = document.querySelector("#btnScreenshot");
    const btnChangeCamera = document.querySelector("#btnChangeCamera");
    const screenshotsContainer = document.querySelector("#screenshots");
    const brightVideo = document.querySelector("#brightVideo");

    const myCanvas = document.getElementById("myCanvas")
    const canvas = document.querySelector("#canvas");
    const devicesSelect = document.querySelector("#devicesSelect");

    // video constraints
    const constraints = {
        video: {
            width: {
                min: 128,
                ideal: 192,
                max: 256,
            },
            height: {
                min: 72,
                ideal: 108,
                max: 144,
            },
        },
    };

    // use front face camera
    let useFrontCamera = true;

    // current video stream
    let videoStream;

    async function getLightImg(llImg) {
        const response = await fetch('http://127.0.0.1:5000/llie', {
            method: 'POST',
            body: JSON.stringify({
                image_base64: llImg
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        let data = await response.json()
            // console.log(data)
        return data.image

    }

    // handle events
    // play
    btnPlay.addEventListener("click", function() {
        video.play();
        var lightImg = document.createElement("img");
        brightVideo.prepend(lightImg);


        (async function drawFrame() {
            //让最底下的canvas绘制一张图
            const img = document.createElement("img");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext("2d").drawImage(video, 0, 0);
            img.src = canvas.toDataURL('image/jpeg');
            //将这张图传给后端
            const lightImgBase64 = await getLightImg(img.src)
            lightImg.src = lightImgBase64

            requestAnimationFrame(drawFrame);
        })();

    });

    // pause
    btnPause.addEventListener("click", function() {
        video.pause();
    });

    // take screenshot
    btnScreenshot.addEventListener("click", function() {
        const img = document.createElement("img");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext("2d").drawImage(video, 0, 0);
        img.src = canvas.toDataURL('image/jpeg');

        // var context = myCanvas.getContext('2d');
        (async function drawFrame() {
            const lightImgBase64 = await getLightImg(img.src)
            var lightImg = document.createElement("img");
            lightImg.src = lightImgBase64
                // context.drawImage(video, 0, 0, canvas.width, canvas.height);
            screenshotsContainer.prepend(lightImg);
            // requestAnimationFrame(drawFrame);
        })();
    });

    // switch camera
    btnChangeCamera.addEventListener("click", function() {
        useFrontCamera = !useFrontCamera;
        initializeCamera();
    });

    // stop video stream
    function stopVideoStream() {
        if (videoStream) {
            videoStream.getTracks().forEach((track) => {
                track.stop();
            });
        }
    }

    // initialize
    async function initializeCamera() {
        stopVideoStream();
        constraints.video.facingMode = useFrontCamera ? "user" : "environment";

        try {
            videoStream = await navigator.mediaDevices.getUserMedia(constraints);
            video.srcObject = videoStream;
        } catch (err) {
            alert("Could not access the camera");
        }
    }

    initializeCamera();
})();