'use strict';

var colors        = require('colors');
var path          = require('path');
var childProcess  = require('child_process');
var check         = require('check-types');
var later         = require('later');
var nodemailer    = require('nodemailer');
var fs            = require('fs');

let flagRM      = false;
const type      = '.png';
let tabIMG      = [];
let attach      = {};
const from      = 'CasberJS Bot ✔ <casperjs.darkterra@gmail.com>';
const to        = 'darkterra01@gmail.com';
const subject   = '[Test] CasperJS NRJ';
let text        = 'Not Working';
const textOk    = 'Working';
let html        = `
<b>
  Test CasperJS
</b>
<br/><br/>
Result: <b>Not Working</b>`;
const testSucces  = `
<b>
  Test CasperJS !
</b>
<br/><br/>
Result: <b>✔</b>`;


// Configuration de la coloration des logs
colors.setTheme({
  silly   : 'rainbow',
  input   : 'grey',
  verbose : 'cyan',
  prompt  : 'grey',
  info    : 'green',
  data    : 'grey',
  help    : 'cyan',
  warn    : 'yellow',
  debug   : 'blue',
  error   : 'red'
});

// create reusable transporter object using SMTP transport 
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'casperjs.darkterra@gmail.com',
        pass: '4kr5s2256'
    }
});

// set later to use local time
later.date.localTime();

var schedule = {
  schedules: [
    {dw: [1, 2, 3, 4, 5], h: [19], m: [45]}
  ]
};

var scheds = later.schedule(schedule);

//var schedule = later.parse.recur().every(5).minute();

var start = new Date();
var t = later.setInterval(CasperON, schedule);
var count = 0;

console.log(scheds.next(30, start));


var childArgs = [
  path.join(__dirname, 'casperjs-script.js'),
  path.join(__dirname, 'data.json')
  ];

// Appel de TestCasper une première fois
TestCasperON();

function CasperON() {
  count++;
  console.log(colors.info('\nThis is the ' + count + ' time(s) where the Script is lunched !\n'));
  console.log(new Date());
  
  console.log('\nStarting CasperJS...\n'.info);
  childProcess.execFile('casperjs', childArgs, function(err, stdout, stderr) {
    // handle results 
    console.log(stdout.verbose);
    console.log(colors.warn(stderr));
    if( err !== null) {
      console.log(colors.warn(err));
    }
    
    console.log('\nEnd CasperJS\n'.info);
    
    GetIMG();
  });
}

function TestCasperON() {
  count++;
  console.log(colors.info('\nThis is the ' + count + ' time(s) where the Script is lunched !\n'));
  console.log(new Date());
  
  console.log('\nFake Starting CasperJS...\n'.info);
  setTimeout(function(){
    console.log('\nFake End CasperJS\n'.info);
    
    GetIMG();
  }, 1000);
}

function GetIMG() {
  console.log('\nLooking for images...\n'.verbose);
  
  fs.readdir(__dirname, function(err, files) {
    if (err) {
        throw err;
    }
    
    for(let file of files) {
      if(file.indexOf(type) > -1) {
        tabIMG.push(file);
      }
    }
    
    if (tabIMG.length > 0) {
      html = testSucces;
      text = textOk;
    }
    else
    {
      console.log('\nNot images found...\n'.error);
    }
    SendMail(from, to, subject, text, html);
  });
}

function SendMail(from, to, subject, text, html) {
  console.log('Sending Mail...'.info);
    
  // setup e-mail data with unicode symbols 
  var mailOptions = {
      from: from, // sender address 
      to: to, // list of receivers 
      subject: subject, // Subject line 
      text: text, // plaintext body 
      html: html, // html body
      attachments: []
  };
  
  for(let IMG of tabIMG) {
    attach = {};
    attach.filename = IMG;
    attach.path = IMG;
    mailOptions.attachments.push(attach);
  }
  
    console.log(new Date());
    
  // send mail with defined transport object 
  transporter.sendMail(mailOptions, function(error, info){
      if(error){
          return console.log(error);
      }
      console.log(colors.verbose('Message sent: ' + info.response));
      purgeHisto(__dirname);
  });
}

// Gestion de la rétention de l'historique
function purgeHisto(path) {
  if (check.nonEmptyString(path)) {
    // Liste l'ensemble des fichier présent
    fs.readdir(path, function(err, files) {
      if (err) {
        console.log('readdir err: ' + err);
        return;
      }
      // Traitement pour chaque fichié trouvé
      for (var file of files) {
        // Filtre si c'est un fichier de log
        if (file.indexOf('.png') > -1) {
          (function(num) {
  					fs.unlink(num, function(err) {
  						if (err) {
  							console.log('rm err: ' + err);
  							return;
  						}
  						console.log('Supression de: ' + num + ' réussi !!');
  						flagRM = true;
  					});
          })(file);
        }
      }
      if (!flagRM) {
        console.log('Pas de fichier à supprimer -_-\n');
      }
      flagRM = false;
    });
  }
}