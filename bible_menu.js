var content = document.getElementById("content");

var overlay = document.createElement("div");
overlay.classList.add("overlay");
content.appendChild(overlay);


var plus = document.createElement("div");
plus.innerHTML = "GB";
plus.classList.add("fab");
plus.classList.add("noselect");

//var keepSectionSelected = false;

    var dragItem = plus;

    var active = false;
    var currentX;
    var currentY;
    var initialX;
    var initialY;
    var xOffset = 0;
    var yOffset = 0;

    window.addEventListener("touchstart", dragStart, false);
    window.addEventListener("touchend", dragEnd, false);
    window.addEventListener("touchmove", drag, true);

    window.addEventListener("mousedown", dragStart, false);
    window.addEventListener("mouseup", dragEnd, false);
    window.addEventListener("mousemove", drag, true);

    function dragStart(e) {
      
      if (e.target === dragItem) {
            active = true;

          if (e.type === "touchstart") {
            initialX = e.touches[0].clientX;
            initialY = e.touches[0].clientY;
          } else {
            initialX = e.clientX;
            initialY = e.clientY;
          }


          plus.classList.remove("back");
          plus.classList.add("clicked");
          overlay.classList.add("visible");
          menu.classList.add("visible");
      
      }
    }

    function dragEnd(e) {
      var x = e.changedTouches?e.changedTouches[0].pageX:e.x;
      var y = e.changedTouches?e.changedTouches[0].pageY:e.y;
      //navigate to selected chapter
      var elem = document.elementFromPoint(x,y);
      if(elem && elem.url){
          var url = elem.url;
          console.log(url);
          var iframe = document.getElementById("iframe");
          if(iframe){
              document.getElementById("iframe").src=url;
          }else{
              window.location = url;
          }
      }

    //document.getElementById("chaptersContainer").classList.add("visible");
      


      
      initialX = currentX;
      initialY = currentY;

      var xOffset = 0;
      var yOffset = 0;
      

      active = false;
      setTranslate(0, 0, dragItem);
      plus.classList.add("back");
      plus.classList.remove("clicked");
      overlay.classList.remove("visible");
      menu.classList.remove("visible");
      
    }

    function drag(e) {
      if (active) {

        //TODO: if along the edge (x less than 50)
        //then query for element ... (possibly hiding ball temporarily?)
        //var elem = document.elementFromPoint(
        //    e.changedTouches[0].pageX,
        //    e.changedTouches[0].pageY,
        //);
        //then open tab associated with this section
        
        if(!e.targetTouches){
            e.preventDefault();
        }
        
        var x = e.changedTouches?e.changedTouches[0].pageX:e.x;
        var y = e.changedTouches?e.changedTouches[0].pageY:e.y;
            
        if(x<50){
            //identify object
            var elem = document.elementFromPoint(x,y);
            if(elem && elem.chaptersView){
                showChapters(elem);
            }
        }

        
      
        if (e.type === "touchmove") {
          currentX = e.touches[0].clientX - initialX;
          currentY = e.touches[0].clientY - initialY;
        } else {
          currentX = e.clientX - initialX;
          currentY = e.clientY - initialY;
        } 

        xOffset = currentX;
        yOffset = currentY;
        
        setTranslate(xOffset, yOffset, dragItem);
        
      }
    }

    function setTranslate(xPos, yPos, el) {
      el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
    }



var menu = document.createElement("div");
menu.classList.add("menu");
menu.classList.add("noselect");
content.appendChild(menu);
menu.setAttribute("id", "menu");

content.appendChild(plus);

var sectionsContainer = document.createElement("div");
sectionsContainer.setAttribute("id", "sectionsContainer");
sectionsContainer.classList.add("sections");
menu.appendChild(sectionsContainer);
var sectionsWidth = 50;
sectionsContainer.style.width = sectionsWidth+"px";
sectionsContainer.markSelected = function(section){
    if(!(sectionsContainer.selected && sectionsContainer.selected == section)){
        if(sectionsContainer.selected){
            sectionsContainer.selected.classList.remove("hovering");
        }
        sectionsContainer.selected = section;
        sectionsContainer.selected.classList.add("hovering");
        }
    
}

var chaptersContainer = document.createElement("div");
chaptersContainer.setAttribute("id", "chaptersContainer");
chaptersContainer.classList.add("chapters");
menu.appendChild(chaptersContainer);
var chaptersWidth = window.innerWidth - sectionsWidth;
chaptersContainer.style.width = chaptersWidth+"px";

var bright = true;


function showChapters(section){
    chaptersContainer.classList.add("visible");
    try{
        chaptersContainer.removeChild(chaptersContainer.firstChild);
    }catch(b){}
    chaptersContainer.appendChild(section.chaptersView);
    sectionsContainer.markSelected(section);
}

function makeMenuSection(parent,cls,books,books_str){
    var section = document.createElement("div");
    var chaptersView = document.createElement("div");
    section.chaptersView = chaptersView;
    chaptersView.section = section;
    //create chapters
    for (i = 0; i < books.length; i++) {
        //show book title
        var book = books[i];
        var bookTitle = document.createElement("div");
        bookTitle.classList.add("booktitle");
        bookTitle.innerHTML = book.label;
        chaptersView.appendChild(bookTitle);
        var table = document.createElement("table");
        chaptersView.appendChild(table);
        
        for (j = 0; j < book.chapters; j++) {
            //insert_chapter
            if(j%5 == 0){
                var row = table.insertRow(-1);
            }
            
            var cell = row.insertCell(-1);
            //create div with link
            cell.innerHTML = ""+(j+1);
            cell.classList.add("chapter");
            cell.book = book;
            cell.chapter = j+1;

            cell.url = cell.book.urlStart + cell.chapter + cell.book.urlEnd;
            cell.section = section;
            
            //var chapter = document.createElement("div");
            //chapter.classList.add("chapter");
            //chapter.innerHTML = ""+(j+1);
        }
    }
    
    section.classList.add(cls);
    section.classList.add(bright?"bright":"dark");
    bright = !bright;
    section.innerHTML=books_str;
    parent.appendChild(section);
    
    section.addEventListener("mousemove", function(e){
        showChapters(e.target);
    }, true);

    section.addEventListener("touchmove", function(e){
        showChapters(e.target);
    }, true);

    return section;
}
//

s1 = [
    {
        "label":"Matteusevangeliet",
        "short":"Matt",
        "chapters":28,
        "urlStart":"https://grundbibeln.se/matt-",
        "urlEnd":"/"
    },
    {
        "label":"Markusevangeliet",
        "short":"Mark",
        "chapters":16,
        "urlStart":"https://grundbibeln.se/mark-",
        "urlEnd":"/"
    }
];

var s2 = [
    {
        "label":"Lukasevangeliet",
        "short":"Luk",
        "chapters":24,
        "urlStart":"https://grundbibeln.se/luk-",
        "urlEnd":"/"
    },
    {
        "label":"Johannesevangeliet",
        "short":"Joh",
        "chapters":21,
        "urlStart":"https://grundbibeln.se/joh-",
        "urlEnd":"/"
    }
];

var s3 = [
    {
        "label":"Apostlag\xE4rningarna",
        "short":"Apg",
        "chapters":28,
        "urlStart":"https://grundbibeln.se/apg-",
        "urlEnd":"/"
    }
];

var s4 = [
    {
        "label":"Romarbrevet",
        "short":"Rom",
        "chapters":16,
        "urlStart":"https://grundbibeln.se/rom-",
        "urlEnd":"/"
    },
    {
        "label":"F\xF6rsta Korintierbrevet",
        "short":"1 Kor",
        "chapters":16,
        "urlStart":"https://grundbibeln.se/1kor-",
        "urlEnd":"/"
    },
    {
        "label":"Andra Korintierbrevet",
        "short":"2 Kor",
        "chapters":13,
        "urlStart":"https://grundbibeln.se/2kor-",
        "urlEnd":"/"
    }
];

var s5 = [
    {
        "label":"Galaterbrevet",
        "short":"Gal",
        "chapters":6,
        "urlStart":"https://grundbibeln.se/gal-",
        "urlEnd":"/"
    },
    {
        "label":"Efesierbrevet",
        "short":"Ef",
        "chapters":6,
        "urlStart":"https://grundbibeln.se/ef-",
        "urlEnd":"/"
    },
    {
        "label":"Filipperbrevet",
        "short":"Fil",
        "chapters":4,
        "urlStart":"https://grundbibeln.se/fil-",
        "urlEnd":"/"
    },
    {
        "label":" Kolosserbrevet",
        "short":"Kol",
        "chapters":4,
        "urlStart":"https://grundbibeln.se/kol-",
        "urlEnd":"/"
    }
];

var s6 = [
    {
        "label":"F\xF6rsta Thessalonikerbrevet",
        "short":"1 Thess",
        "chapters":5,
        "urlStart":"https://grundbibeln.se/1thess-",
        "urlEnd":"/"
    },
    {
        "label":"Andra Thessalonikerbrevet",
        "short":"2 Thess",
        "chapters":3,
        "urlStart":"https://grundbibeln.se/2thess-",
        "urlEnd":"/"
    },
    {
        "label":"F\xF6rsta Timotheosbrevet",
        "short":"1 Tim",
        "chapters":6,
        "urlStart":"https://grundbibeln.se/1tim-",
        "urlEnd":"/"
    },
    {
        "label":" Andra Timotheosbrevet",
        "short":"2 Tim",
        "chapters":4,
        "urlStart":"https://grundbibeln.se/2tim-",
        "urlEnd":"/"
    },
    {
        "label":" Titusbrevet",
        "short":"Tit",
        "chapters":3,
        "urlStart":"https://grundbibeln.se/tit-",
        "urlEnd":"/"
    }
    ,{
        "label":" Brevet Till Filemon",
        "short":"Filem",
        "chapters":1,
        "urlStart":"https://grundbibeln.se/filem-",
        "urlEnd":"/"
    }
];

var s7 = [
    {
        "label":"Hebreerbrevet",
        "short":"Heb",
        "chapters":13,
        "urlStart":"https://grundbibeln.se/1thess-",
        "urlEnd":"/"
    },
    {
        "label":"Jakobsbrevet",
        "short":"Jak",
        "chapters":5,
        "urlStart":"https://grundbibeln.se/jak-",
        "urlEnd":"/"
    },
    {
        "label":"F\xF6rsta Petrusbrevet",
        "short":"1 Pet",
        "chapters":5,
        "urlStart":"https://grundbibeln.se/1pet-",
        "urlEnd":"/"
    },
    {
        "label":" Andra Petrusbrevet",
        "short":"2 Pet",
        "chapters":3,
        "urlStart":"https://grundbibeln.se/2pet-",
        "urlEnd":"/"
    },
    
];
var s8 = [
    {
        "label":"F\xF6rsta Johannesbrevet",
        "short":"1 Joh",
        "chapters":5,
        "urlStart":"https://grundbibeln.se/1joh-",
        "urlEnd":"/"
    },
    {
        "label":" Andra Johannesbrevet",
        "short":"2 Joh",
        "chapters":1,
        "urlStart":"https://grundbibeln.se/2joh-",
        "urlEnd":"/"
    },{
        "label":" Tredje Johannesbrevet",
        "short":"2 Joh",
        "chapters":1,
        "urlStart":"https://grundbibeln.se/3joh-",
        "urlEnd":"/"
    },
    {
        "label":" Judas brev",
        "short":"Jud",
        "chapters":1,
        "urlStart":"https://grundbibeln.se/jud-",
        "urlEnd":"/"
    },
    {
        "label":" Uppenbarelseboken",
        "short":"Upp",
        "chapters":22,
        "urlStart":"https://grundbibeln.se/upp-",
        "urlEnd":"/"
    }
];


var section1 = makeMenuSection(sectionsContainer,"section",s1,"<br>Matt<br>Mark");
var section2 = makeMenuSection(sectionsContainer,"section",s2,"<br>Luk<br>Joh");
var section3 = makeMenuSection(sectionsContainer,"section",s3,"<br><br>Apg");
var section4 = makeMenuSection(sectionsContainer,"section",s4,"<br>Rom<br>1-2 Kor");
var section5 = makeMenuSection(sectionsContainer,"section",s5,"Gal<br>Ef<br>Fil<br>Kol");
var section6 = makeMenuSection(sectionsContainer,"section",s6,"1-2 Thess<br>1-2 Tim<br>Tit<br>Filem");
var section7 = makeMenuSection(sectionsContainer,"section",s7,"<br>Heb<br>Jak<br>1-2 Pet");
var section8 = makeMenuSection(sectionsContainer,"section",s8,"<br>1-3 Joh<br>Jud<br>Upp");

var showInitially = false;
//

if(showInitially){
    menu.classList.add("visible");
    chaptersContainer.classList.add("visible");
    sectionsContainer.classList.add("visible");
    chaptersContainer.appendChild(section4.chaptersView);
}

iframe.contentWindow.addEventListener('scroll', function(event) {
  console.log(event);
}, false);
//hide fab on scroll down
var prevScrollpos = iframe.pageYOffset;
iframe.onscroll = function() {
  var currentScrollPos = iframe.pageYOffset;
  if (prevScrollpos > currentScrollPos) {
    //show
    plus.classList.add("hidden");
  } else {
    //hide
    plus.classList.remove("hidden");
  }
  prevScrollpos = currentScrollPos;
}


var lF = document.getElementById('iframe').contentWindow;
	if(window.pageYOffset!=undefined){ //opera, firefox,& gecko browsers
		lF.onscroll = function(){
			console.log("scroll");
		}
	}
	else{//IE	
  		if(lF.document.documentElement)lF= lF.document.documentElement; 
  		else lF=document.body;  		
 		lF.onscroll=function(){
			console.log("scroll");
		}		
	}