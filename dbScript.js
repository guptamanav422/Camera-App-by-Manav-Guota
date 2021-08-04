
let req=indexedDB.open("gallery",1);
let numberOfMedia=0;
let database;
req.addEventListener("success",()=>{
    database=req.result;
});
req.addEventListener("upgradeneeded",()=>{
    let db=req.result;
    console.log(db)
    db.createObjectStore("media",{keyPath:"mId"});
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
            numberOfMedia++;
            let mediaCard=document.createElement("div");
            mediaCard.classList.add("media-card");
            mediaCard.innerHTML=`
            <div class="actual-media"></div>
            <div class="media-buttons">
                <button class="media-download">Download </button>
                <button data-mId="${cursor.value.mId}" class="media-delete">Delete</button>
            </div>
            `

            let downloadBtn=mediaCard.querySelector(".media-download");
            let deleteBtn=mediaCard.querySelector(".media-delete");
            deleteBtn.addEventListener("click",(e)=>{
                let mId=Number(e.currentTarget.getAttribute("data-mId"));
                deleteMedia(mId);

                e.currentTarget.parentElement.parentElement.remove();
            })

            let data=cursor.value.mediaData;
            let actualMedia=mediaCard.querySelector(".actual-media");
            let type=typeof(data);
            if(type=="string"){
                // image 

                downloadBtn.addEventListener("click",()=>{
                    downloadMedia(data,"image");
                })
                let image=document.createElement("img");
                image.src=data;

                actualMedia.append(image);
            }
            else if(type=='object'){
                // video 
                let video=document.createElement("video");
                let url=URL.createObjectURL(data);

                downloadBtn.addEventListener("click",()=>{
                    downloadMedia(url,"video");
                })

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
        else{
            if(numberOfMedia==0){
                galleryContainer.innerText="No media present";
            }
        }
    })

}

function downloadMedia(url,type) {
     let a = document.createElement("a");
    a.href = url;
    if(type=='image')
    {
        a.download="image.png"
    }
    else{
        a.download="video.mp4"
    }
    a.click();
    a.remove();
}

function deleteMedia(mId)
{
    let tx=database.transaction("media","readwrite");
    let mediaStore=tx.objectStore("media")
    mediaStore.delete(mId);
    // console.log(mediaStore);
    
    // console.log(mId)
}