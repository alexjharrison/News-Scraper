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
})