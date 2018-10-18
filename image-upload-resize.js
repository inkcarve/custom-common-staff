//* image upload resize
var dataURLtoBlob = require('blueimp-canvas-to-blob');

var imgUploadResize_fn = function(option) {
    // source from input file readAsDataURL API on onload event
    var image = new Image();
    image.src = option.source;
    // var image = e.target.result;
    image.onerror = function(){
        window.log(()=>{console.log('imgUploadResize_fn image.onerror');});
        window.checkFunction(option.onerror)
    };
    image.onload = function() {

        var w = image.naturalWidth,
            h = image.naturalHeight,
            ifVertical = h>w,
            judgeSide = ifVertical?h:w,
            NotJudgeSide = ifVertical?w:h,
            boundary = option.boundary; //** px 界線
            var canvas_width=w,canvas_height=h;

        //     console.log('natural size');
        // console.log(w, h);
        var canvas = document.createElement('canvas');
        if (judgeSide > boundary) {
            var ratio = boundary / judgeSide;
            canvas_width = w*ratio;
            canvas_height = h*ratio;
        }

        window.log(function(){console.log('canvas_width: '+canvas_width);});
            window.log(function(){console.log('canvas_height: '+canvas_height);});
            canvas.width = canvas_width;
            canvas.height = canvas_height;
            
            var context = canvas.getContext('2d');
    // 沒寫完
            if(!!option.srcOrientation){
                if (4 < option.srcOrientation && option.srcOrientation < 9) {
      canvas.width = canvas_height;
      canvas.height = canvas_width;

    } else {
      canvas.width = canvas_width;
      canvas.height = canvas_height;
    }
    // context.scale(ratio,ratio);
            switch (option.srcOrientation) {
      case 2: context.transform(-1, 0, 0, 1, canvas_width, 0); break;
      case 3: context.transform(-1, 0, 0, -1, canvas_width, canvas_height ); break;
      case 4: context.transform(1, 0, 0, -1, 0, canvas_height ); break;
      case 5: context.transform(0, 1, 1, 0, 0, 0); break;
      case 6: context.transform(0, 1, -1, 0, canvas_height , 0); break;
      case 7: context.transform(0, -1, -1, 0, canvas_height , canvas_width); break;
      case 8: context.transform(0, -1, 1, 0, 0, canvas_width); break;
      default: break;
    
// case 8:
//            ctx.rotate(90*Math.PI/180);
//            break;
//        case 3:
//            ctx.rotate(180*Math.PI/180);
//            break;
//        case 6:
//            ctx.rotate(-90*Math.PI/180);
//            break;
    }
    
    }
    // if(!!ifVertical){
    // context.drawImage(image, 0, 0, h, w, 0, 0, canvas_height, canvas_width);
    // }else{
    //     context.drawImage(image, 0, 0, w, h, 0, 0, canvas_width, canvas_height);
    // }
            context.drawImage(image, 0, 0, w, h, 0, 0, canvas_width, canvas_height);
            var file_base64 = canvas.toDataURL("image/jpeg", 1.0);
            var file_blob;
            var head = 'data:image/jpeg;base64,';
            var imgFileSize = Math.round((file_base64.length - head.length) * 3 / 4) / 1024 / 1024;
            window.log(function(){console.log('file_base64 imgFileSize: ' + imgFileSize);});
            if(!!option.outputBlob){
            file_blob = dataURLtoBlob(file_base64);
            window.log(function(){console.log('file_blob size: '+(file_blob.size/1024/1024));});
            }

        if (window.showUploadImageMin) {
                var imageTest = new Image();
                imageTest.src = file_base64;
                imageTest.width = '700px';
                image.width = '700px';
                document.body.append(image);
                document.body.append(imageTest);
            }

        option.callback({
            file_base64:file_base64,
            file_blob:file_blob,
            imgSize:imgFileSize
        });
    }
}
module.exports = imgUploadResize_fn;