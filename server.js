var colors = require('colors');
var path = require('path');
var childProcess = require('child_process');
var later = require('later');

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

// Appel de Casper une première fois
//CasperON();

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
  });
}

function TestCasperON() {
  count++;
  console.log(colors.info('\nThis is the ' + count + ' time(s) where the Script is lunched !\n'));
  console.log(new Date());
  
  console.log('\nFake Starting CasperJS...\n'.info);
  setTimeout(function(){
    console.log('\nFake End CasperJS\n'.info);
  }, 1000);
  
}