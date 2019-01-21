var express = require('express');
//var path = require('path');
var request = require('request');
var HTMLParser = require('node-html-parser');
var cors = require('cors')
var cache = require('memory-cache');
var Xvfb = require('xvfb');
const Nightmare = require('nightmare')

let nightmareOptions = {
    executionTimeout:10000,
    gotoTimeout: 10000,
    show: false
}



console.log('versio 2019-01-18-1');

function cachePut(id,val) {
    cache.put(id, val, 600000); // Time in ms
}

let xObj = {}

function xStart(id) {

    if(process.env.NODE_ENV == 'production') {
        xObj[id] = new Xvfb();
        xObj[id].startSync();
    }

}
function xStop(id) {
    if(process.env.NODE_ENV == 'production') {
        if(xObj[id]) {
            
            xObj[id].stopSync();

        }
    }

}



const PORT = process.env.PORT || 1234; // heroku uses env.PORT



let app = express();

var whitelist = [
    'http://localhost:8080', 
    'https://lounaat-keilaranta.herokuapp.com', 
    'http://lounaat-keilaranta.herokuapp.com', 
    'https://lounaat-keilaranta.azurewebsites.net', 
    'http://lounaat-keilaranta.azurewebsites.net',
    'https://lounaat-keilaranta-api.azurewebsites.net', 
    'http://lounaat-keilaranta-api.azurewebsites.net'
]
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

console.log('Whitelist:')
console.log(whitelist)

app.use(cors(corsOptions));

app.get('/env',function(req,res) {
    
    res.setHeader('Content-Type', 'application/json');

    res.send(process.env);
})

//console.log(global);


//app.use('/',express.static(path.join(__dirname, 'public'))); // servin frontend

const lscUrl = 'http://www.compass-group.fi/Ravintolat/Espoo/Ravintola-Life-Science-Center/Lounaslista/';

const letsPlayUrl = 'https://www.amica.fi/ravintolat/ravintolat-kaupungeittain/espoo/lets-play/';

const factoryUrl = 'https://ravintolafactory.com/lounasravintolat/ravintolat/espoo-keilaranta/';



let lscMenu = function(body,day) {

    let root = HTMLParser.parse(body);
              
    const rawText = root.querySelector('#mid-column').text;

    //let rawText = root.querySelector('#mid-column').innerHTML;

    var titles = new Set();
    
    root.querySelectorAll('strong').forEach(function(e) { // collect all strong's to Set and then you know what are titles

        let title = e.text.trim()

            if(title) {
                titles.add(title)
            }

    })

    var days = ['Maanantai','Tiistai','Keskiviikko','Torstai','Perjantai'];

    var menu = days.map(function(d,k) {
        
        var nextOne = days[k+1];
            
        var start_pos = rawText.indexOf(d) + d.length;
        
        var end_pos = rawText.indexOf('G =',start_pos);	
        
        if(nextOne) {
            end_pos = rawText.indexOf(nextOne,start_pos);	
        }

        var text_to_get = rawText.substring(start_pos,end_pos).trim().replace(/\n/g, " ").replace(/\s\s/g,' ');
        
    //  var doubleRows = ['Päivän','Liha:','Kana:','Deli','Keitto:','Kala:','Lämmin ','Kokoa ','Grillistä']

      titles.forEach((v)=> {

        //        console.log(v)
            text_to_get = text_to_get.replace(v,'<b>'+v+'</b>');
           // text_to_get = text_to_get.replace(new RegExp(';', 'g'),'<br />');
        });


        return {
            day: d,
            lunch: text_to_get
        }
    });


    let rtn = menu;

    if(day) {
        rtn = menu.find((v) => {

            return v.day == day
    
        });
    }

    return rtn;
}


app.get('/lsc',function(req,res) {
    
    res.setHeader('Content-Type', 'application/json');

    let cached = cache.get('lsc');

    if(cached) {
                
        res.send(cached);

    }
    else {
        
        cachePut('lsc','loading');

        request(lscUrl,function(err,response,body){

            if(!err) {
    
                var parsed = lscMenu(body);

                cachePut('lsc',parsed);

                res.send(parsed);
    
            }
        
            if(err) {
                console.log(err)
            }
        
        });

    }

  

});

app.get('/lsc/link',function(req,res) {

    res.send(lscUrl);
    

});

app.get('/letsplay',function(req,res) {


    res.setHeader('Content-Type', 'application/json');

    let cached = cache.get('letsplay');

    if(cached) {
                
        res.send(cached);

    }
    else {
   
        cachePut('letsplay','loading');

        
        xStart('letsplay')

        const nightmare = new Nightmare(nightmareOptions)


        nightmare
        .goto(letsPlayUrl)
        .evaluate(() => { // selaimessa(electronissa) suoritettavaa kamaa, returnilla välitetään nodejslle
    
            console.log(document);
            let menu = [];
    
            document.querySelectorAll('.menu-container-menu-content-week-day').forEach((m)=> {
    
                let content = m.querySelector('.menu-container-menu-content-custom');
    
                if(content) {
    
                    let title = m.querySelector('h5').innerText;
    
    
                    menu.push({
                        day: title,
                        lunch: content.innerText.replace(/\n/g, "<br>")
                    })
                }
    
            })
    
            return menu;
        })
        .end()
        .then((r)=> {
    
            let resp = r;

            if(!resp) {
                resp = 'loading'
            }

            cachePut('letsplay',resp);
            res.send(resp);
    
            
            xStop('letsplay')
        })
        .catch(error => {
            console.error('Search failed:', error)
            res.send('error')
            xStop('letsplay')
        });
    }
 
    


   //https://www.amica.fi/api/restaurant/menu/week?language=fi&restaurantPageId=46009&weekDate=2019-1-3

});

app.get('/letsplay/link',function(req,res) {
    res.send(letsPlayUrl);
});



app.get('/factory',function(req,res) {
    
    res.setHeader('Content-Type', 'application/json');

    let cached = cache.get('factory');

    if(cached) {
                
        res.send(cached);

    }
    else {

        cachePut('factory','loading');

        xStart('factory')

        const nightmare = new Nightmare(nightmareOptions)
        nightmare
        .goto(factoryUrl)
        .evaluate(() => document.querySelector('#main').innerHTML)
        .end()
        .then((r)=> {
    
            const root = HTMLParser.parse(r);
            
            var titles = new Set();
        
            root.querySelectorAll('h3').forEach(function(e) { // collect all strong's to Set and then you know what are titles
        
                let title = e.text.trim()
    
                if(title) {
                    titles.add(title)
                }
    
            });
    
            var rawText = root.querySelector('section').text;
    
    
            var days = ['Maanantai','Tiistai','Keskiviikko','Torstai','Perjantai'];
    
            var menu = days.map(function(d,k) {
                
                var nextOne = days[k+1];
                    
                var start_pos = rawText.indexOf(d) - 1;
                
                var end_pos = rawText.indexOf('Monday',start_pos);	
                
                if(nextOne) {
                    end_pos = rawText.indexOf(nextOne,start_pos);	
                }
        
                var text_to_get = rawText.substring(start_pos,end_pos).trim().replace(/\n/g, "<br/><br/>");
        
                titles.forEach((v)=> {
                    text_to_get = text_to_get.replace(v+'<br/><br/>','<h3>'+v+'</h3>');
                });
        
                return {
                    day: d,
                    lunch: text_to_get
                }
            });
    
            let resp = menu;

            if(!resp) {
                resp = 'loading'
            }
            
            cachePut('factory',resp);
            
            res.send(resp);
            
            xStop('factory')
    
        })
        .catch(error => {
            console.error('Search failed:', error)
            res.send('error')
            
            xStop('factory')
        });
    }

});

app.get('/factory/link',function(req,res) {
    res.send(factoryUrl);
});

app.listen(PORT);

console.log('Listening: '+PORT)



