$(()=>{
    
    
    $("#get-articles").click((e)=>{
        e.preventDefault();
        $.get("/newArticles",(data,status)=>{
            console.log(data);
            location.reload();
        })
    })
    $("#drop-articles").click((e)=>{
        e.preventDefault();
        $.get("/dropArticles",(data,status)=>{
            console.log(data);
            location.reload();
        });
    })
    $(".save").click(function(e){
        e.preventDefault();
        var id = $(this).attr("data-id");
        console.log(id);
        $.post("/savearticle/"+id,(data,status)=>{
            location.reload();
        })
    })
    $(".delete").click(function(e){
        e.preventDefault();
        var id = $(this).attr("data-id");
        console.log(id);
        $.post("/unsavearticle/"+id,(data,status)=>{
            location.reload();
        })
    })
    $(".modal-trigger").click(function(e){
        e.preventDefault();
        let id = $(this).attr("data-id")
        $("#article-id").text(id);
        $.get("/articleinfo/"+id,(data,status)=>{
            console.log(data);
            drawNotes(data.notes);
        })
        $(".modal").modal();
        
    })
    $("#savenote").click(function(e){
        e.preventDefault();
        newNoteText = $("#textBox").val();
        $("#textBox").val("");
        $.post("/newnote",{
            noteText:newNoteText,
            articleId:$(this).attr("data-id")
        },(response)=>{
            drawNotes(response.notes);
        })
        //add note to list
    })
    function drawNotes(noteIdArr){
        var notesDiv = $("#notes");
        notesDiv.empty();
        noteIdArr.forEach(noteId => {
            var newRow = $("<div>").addClass("row valign-wrapper z-depth-1 section");
            var noteCol = $("<div>").addClass("col s9 center")
            var buttonCol = $("<div>").addClass("col s3");
            $.get("/noteinfo/"+noteId,(data,status)=>{
                console.log(data.noteText, data._id);
                //make note with noteText and button with noteid
                noteCol.append("<h1>").text(data.noteText);
                buttonCol.append(`<a data-id="${data._id}" class="remove-note waves-effect waves-light btn"><i class="material-icons right">remove_circle</i>remove</a>`)
                newRow.append(noteCol,buttonCol);
                notesDiv.append(newRow);
            });
        });
    }
})