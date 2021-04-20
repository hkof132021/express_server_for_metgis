if ( iskey(e, '/') ) {
    current_date = new Date()


    if (confirm( 'The image ' + self.gen_server_file_name(current_date) +　　'.png will be deleted. Are you sure to continue?')) {

        let uesr_input_date = prompt("Please input date (yyyyddmmHH) for historical case");
        self.input_date = uesr_input_date;


        console.log("len ~~~" +self.input_date.length)
        if(self.input_date.length != 10 && self.input_date.length != 0){
            alert("Please input a vaild date format (yyyyddmmHH)")
            return
        }

        filename = 'my-canvas.png'
        console.log("testing one buttone upload");
        //var content = document.getElementById('CursorLayer');
        html2canvas(document.querySelector("#map"), {allowTaint: true, useCORS: true, logging: true}).then(canvas_1 => {
            document.body.appendChild(canvas_1)
            var ctx = canvas_1.getContext("2d");
            var image_type = '_';
            if(self.map.HIWCActive){
                console.log("It is HIWCActive")
                image_type = 'hiw'
                console.log(canvas_1.width) // 1920
                console.log(canvas_1.height) // 947

                var imgData = ctx.getImageData(420, 40, 1370, 950);
                var tmpCanvas = document.createElement('canvas');
                var ctx2_new = tmpCanvas.getContext('2d');//context from tmpCanvas
                tmpCanvas.width = 1150;
                tmpCanvas.height = 910;
                ctx2_new.putImageData(imgData, 0, 0);
                ctx2_new.fillStyle = "black";
                ctx2_new.font = "20px Arial";
                ctx2_new.fillText(self.get_date_label(current_date), 200, 35);
                // switch proccess temp canvas to current canvas
                canvas_1 = tmpCanvas
            }
            else if(self.map.HIWCSurface){
                console.log("It is HIWCSurface")
                image_type = 'hiw_surface' 
                console.log(canvas_1.width) // 1920
                console.log(canvas_1.height) // 890

                var imgData = ctx.getImageData(420, 45, 1560, 930);
                var tmpCanvas = document.createElement('canvas');
                var ctx2_new = tmpCanvas.getContext('2d');//context from tmpCanvas
                tmpCanvas.width = 1140;
                tmpCanvas.height = 870;
                ctx2_new.putImageData(imgData, 0, 0);
                ctx2_new.fillStyle = "black";
                ctx2_new.font = "20px Arial";
                ctx2_new.fillText(self.get_date_label(current_date), 300, 40);
                // switch proccess temp canvas to current canvas
                canvas_1 = tmpCanvas
            }

            var dataURL = ''
            var result = false;
            try {
                //var dataURL = content.toDataURL('image/png', 1).split(',')[1];
                dataURL = canvas_1.toDataURL("image/png").replace("image/png", "image/png"); 
                $.ajax({
                    url: 'http://hiwvm1:8085/api/upload',
                    type: 'POST',
                    contentType: 'application/json; charset=utf-8',
                    //data: { field1: "hello", field2 : "hello2", base64image :  image},
                    data: JSON.stringify({ "file_type": image_type, "file_name": self.gen_server_file_name(current_date), "base64image": dataURL}) ,
                    dataType: 'json',	
                    success: function(data){
                        console.log(data)
                        alert("Upload Successfully");
                    },
                    error: function(xhr, textStatus, error){
                        //console.log(typeof(errorThrown))
                        alert("Error");
                        //alert(xhr.statusText);
                    }
                });
    

                
                
                // window.open(dataURL)
            } catch(e) {
                dataURL = canvas_1.toDataURL().split(',')[1];
                console.log("there is error")
            }	



            // try to save
            need_save = false;
            if(need_save){
                var link = document.createElement('a');
                link.href = dataURL;
                link.download = filename;
                document.body.appendChild(link);
                link.click();
            }

        });
        console.log("Done");

        // post image to server
        // $.ajax({
        // 	url: 'http://protus:8085/hello',
        // 	type: 'POST',
        // 	contentType: 'application/text'
        //  })
        // .done(function(data) {alert("success");})
        // .fail(function() {alert("error");});
    } else {
        
        console.log('Mission aborted');
        return
    }

    


    
}