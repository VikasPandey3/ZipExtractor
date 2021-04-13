$(document).ready(function(){
    $("#file").on("change",function(e){
        $('#content').hide();
        var filesObj ={}
        var new_zip = new JSZip();
        console.log('hello')
        var files = e.target.files;
        handelFile(files[0]);

        function handelFile(f){
            new_zip.loadAsync(f).then(function(zip){
                var root=[];
                var start=true;
                filesObj=zip;
                root.push({'id':"root",'parent':'#','text':f.name,'state':{'opened':true}});
                zip.forEach(function(relativePath,zipEntry){
                    var newPath="root/".concat(relativePath);
                    var pathSplit=newPath.split('/');
                    if(zipEntry.dir){
                        var text = pathSplit[pathSplit.length-2]
                        var parent =(pathSplit.slice(0,(pathSplit.length-2))).join('');
                        var id =(pathSplit.slice(0,(pathSplit.length-1))).join('');
                        console.log(id,parent);
                        root.push({'id':id,'parent':parent,'text':text,'data':{'path':relativePath},'state':{'opened':true}});
                    }
                    else{
                        var text = pathSplit[pathSplit.length-1]
                        var parent =(pathSplit.slice(0,(pathSplit.length-1))).join('');
                        var id =pathSplit.join('');
                        console.log(id,parent);
                        root.push({'id':id,'parent':parent,'text':text,'data':{'path':relativePath},'icon':false});
                    }
                    
                })
                $("#result").jstree("destroy");
                createTree(root);
                $('#result').on("changed.jstree", function (e, data) {
                    var path=data.node.data.path;
                    saveZip(path);
                }).jstree();
            })        
        }
        function saveZip(filename){
            console.log(filesObj);
            var file=filesObj.files[filename]
            if(!file.dir){
                file.async('blob').then(function(data){
                    var blob = new Blob([data], {type: "text/plain;charset=utf-8"});
                    saveAs(blob, filename);
                })
            }
        }

    })
})
function createTree(root){
    $('#content').show();
    $('#result').jstree({ 'core' : {
        'data' :root
    } }); 
}
// function saveAll(){
//     Object.keys(filesObj.files).forEach(function(filename){
//         var file=filesObj.files[filename]
//             if(!file.dir){
//                 file.async('blob').then(function(data){
//                     var blob = new Blob([data], {type: "text/plain;charset=utf-8"});
//                     saveAs(blob, filename);
//                 })
//             }
//         })
// }