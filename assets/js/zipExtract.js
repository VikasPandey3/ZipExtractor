var filesObj ={}
var new_zip = new JSZip();
$("#file").on("change",function(e){
    $("#result").html("")
})
function extractZip(){
    var fileElemt =document.getElementById("file");
    var files = fileElemt.files;
    
    for(i=0;i<files.length;i++){
        handelFile(files[i]);
    }

    function handelFile(f){
        new_zip.loadAsync(f).then(function(zip){
            var root=[];
            var start=true;
            filesObj=zip;
            root.push({'id':"root",'parent':'#','text':f.name});
            zip.forEach(function(relativePath,zipEntry){
                console.log(zipEntry)
                // if(start){
                //     var y=relativePath.split('/')
                //     root.push({'id':"root".concat(y[0]),'parent':'#','text':y[0]});
                //     start=false;
                // }
                 {
                    var newPath="root/".concat(relativePath);
                    console.log(newPath);
                    var length=0;
                    if(zipEntry.dir){
                        var pathSplit=newPath.split('/');
                        var text = pathSplit[pathSplit.length-2]
                        var parent =(pathSplit.slice(0,(pathSplit.length-2))).join('');
                        var id =(pathSplit.slice(0,(pathSplit.length-1))).join('');
                        console.log(id,parent);
                        root.push({'id':id,'parent':parent,'text':text,'data':{'path':relativePath}});
                    }
                    else{
                        var pathSplit=newPath.split('/');
                        var text = pathSplit[pathSplit.length-1]
                        var parent =(pathSplit.slice(0,(pathSplit.length-1))).join('');
                        var id =pathSplit.join('');
                        console.log(id,parent);
                        root.push({'id':id,'parent':parent,'text':text,'data':{'path':relativePath}});
                    }
                    //     length=x.length;
                    // for(var i=2;i<length;i++){
                    //     var found=false;
                    //     root.forEach((node,j)=>{
                    //         if(node.id===(x[i-1].concat(x[i]))){
                    //             if(node.parent===x[i-2].concat(x[i-1]))
                    //                 found=true;
                    //         }
                    //     })
                    //     if(!found){
                    //         root.push({'id':x[i-1].concat(x[i]),'parent':x[i-2].concat(x[i-1]),'text':x[i],'data':{'path':relativePath}});
                    //     }
                    // }
                } 
            })
            //filesObj['files']=content.files;
            // Object.keys(content.files).forEach(function(filename){
            // zip.files[filename].async('blob').then(function(data){
            //    filesObj[filename]= new File([data], filename);
            // })
            // })
            console.log(root)
            $('#result').jstree({ 'core' : {
                'data' :root
            } }); 
            $('#result').on("changed.jstree", function (e, data) {
                var path=data.node.data.path;
                saveZip(path);
              }).jstree();
        })        
    }
    
}


function saveZip(filename){
    console.log(filesObj)
    filesObj.files[filename].async('blob').then(function(data){
        var blob = new Blob([data], {type: "text/plain;charset=utf-8"});
        saveAs(blob, filename);
    })
}
// document.addEventListener('DOMContentLoaded',function(event){
// var result =document.getElementById("result");


// var $result = $("#result");
// $("#file").on("change", function(evt) {
//     // remove content
//     $result.html("");
//     // be sure to show the results
//     $("#result_block").removeClass("hidden").addClass("show");

//     // Closure to capture the file information.
//     function handleFile(f) {
//         var $title = $("<h4>", {
//             text : f.name
//         });
//         var $fileContent = $("<ul>");
//         $result.append($title);
//         $result.append($fileContent);

//         var dateBefore = new Date();
//         JSZip.loadAsync(f)                                   // 1) read the Blob
//         .then(function(zip) {
//             var dateAfter = new Date();
//             $title.append($("<span>", {
//                 "class": "small",
//                 text:" (loaded in " + (dateAfter - dateBefore) + "ms)"
//             }));

//             zip.forEach(function (relativePath, zipEntry) {  // 2) print entries
//                 $fileContent.append($("<li>", {
//                     text : zipEntry.name
//                 }));
//             });
//         }, function (e) {
//             $result.append($("<div>", {
//                 "class" : "alert alert-danger",
//                 text : "Error reading " + f.name + ": " + e.message
//             }));
//         });
//     }

//     var files = evt.target.files;
//     for (var i = 0; i < files.length; i++) {
//         handleFile(files[i]);
//     }
// });

