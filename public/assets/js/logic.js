$(()=>{
    //remove 5 blank cards that always show up for unknown reasons
    $(".card").each(function(){
        if($(this).attr("data-id")==="")
            $(this).hide();
    })

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
            location.reload();
        });
    })
    $(".save").click(function(e){
        e.preventDefault();
        var id = $(this).attr("data-id");
        $.post("/savearticle/"+id,(data,status)=>{
            location.reload();
        })
    })
    $(".delete").click(function(e){
        e.preventDefault();
        var id = $(this).attr("data-id");
        $.post("/unsavearticle/"+id,(data,status)=>{
            location.reload();
        })
    })
    $(".modal-trigger").click(function(e){
        e.preventDefault();
        let id = $(this).attr("data-id")
        $("#article-id").text(id);
        $.get("/articleinfo/"+id,(data,status)=>{
            drawNotes(data.notes);
        })
        $(".modal").modal();
        
    })
    $("#savenote").click(function(e){
        e.preventDefault();
        newNoteText = $("#textBox").val();
        $("#textBox").val("");
        if(!newNoteText) return;
        $.post("/newnote",{
            noteText:newNoteText,
            articleId:$(this).attr("data-id")
        },(response)=>{
            drawNotes(response.notes);
        })
        //add note to list
    })
    function drawNotes(noteIdArr){
        var notesUl = $("#notes");
        notesUl.empty();
        noteIdArr.forEach(noteId => {
            var newLi = $("<li>").addClass("collection-item section");
            var noteCol = $("<div>").addClass("left valign-wrapper")
            var buttonCol = $("<div>").addClass("right valign-wrapper");
            $.get("/noteinfo/"+noteId,(data,status)=>{
                //make note with noteText and button with noteid
                noteCol.append($("<h6>").text(data.noteText));
                buttonCol.append(`<a data-id="${data._id}" class="remove-note waves-effect waves-light btn"><i class="material-icons right">remove_circle</i>remove</a>`)
                newLi.append(noteCol,buttonCol);
                notesUl.append(newLi);
            });
        });
    }
    $(document).on("click",".remove-note",e=>{
        var id = $(e.target).attr("data-id");
        $.ajax({
            url: "/noteinfo/"+id,
            type:"DELETE"                
        }).then(data=>{
            drawNotes(data);
        })
    })
})