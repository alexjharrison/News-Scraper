$(()=>{
    if(!$(".card").attr("data-id")){
        console.log(this);
        $(this).remove();
    }

    
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
        $.post("/removearticle/"+id,(data,status)=>{
            location.reload();
        })
    })

})