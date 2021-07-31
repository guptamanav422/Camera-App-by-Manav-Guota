
let req=indexedDB.open("gallery",1);

let database;
req.addEventListener("success",()=>{
    database=req.result;
    console.log(database)
});
req.addEventListener("upgradeneeded",()=>{
    let db=req.result;
    console.log(db)
    db.createObjectStore("media",{keypath:"mId", autoIncrement: true });
})
req.addEventListener("error",()=>{
    
})


function saveMedia(media){
    if(!database) return;
    let data={
        mId:Date.now(),
        mediaData:media,
    };
    console.log(data);
    let tx=database.transaction("media","readwrite");
    let mediaObjectStore=tx.objectStore("media");
    mediaObjectStore.add(data);
}

function viewMedia(){
    if(!database) return;

    let galleryContainer=document.querySelector(".gallery-container");


    let tx=database.transaction("media","readonly");
    let mediaObjectStore=tx.objectStore("media");

    let req=mediaObjectStore.openCursor();

    req.addEventListener("success",()=>{
        let cursor=req.result;
        if(cursor)
        {
            console.log(cursor.value);
            let mediaCard=document.createElement("div");
            mediaCard.classList.add("media-card");
            mediaCard.innerHTML=`
            <div class="actual-media"></div>
            <div class="media-buttons">
                <button class="media-download">Download </button>
                <button class="media-delete">Delete</button>
            </div>
            `

            let data=cursor.value.mediaData;
            let actualMedia=mediaCard.querySelector(".actual-media");
            let type=typeof(data);
            if(type=="string"){
                // image 

                let image=document.createElement("img");
                image.src=data;

                actualMedia.append(image);
            }
            else if(type=='object'){
                // video 
                let video=document.createElement("video");
                let url=URL.createObjectURL(data);
                video.src=url;
                video.autoplay=true;
                video.loop=true;
                video.controls=true;
                // video.muted=true
                
                actualMedia.append(video);
            }
            galleryContainer.append(mediaCard)
            cursor.continue();
        }
    })

}