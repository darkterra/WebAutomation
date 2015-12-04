var casper = require('casper').create({
    verbose: true,
    logLevel: "debug",
    //userAgent: 'CasperJS'
});

if (casper.cli.has(0)){
  casper.echo('The first Parameter has Set', 'INFO');
  casper.echo(casper.cli.get(0), 'INFO');
  
  var json = require(casper.cli.get(0));
  
  var date = new Date();
  
  // console.log(casper.version.major);
  var element;
  
  casper.start(json.URLS.Form1, function Set_Config() {
      this.echo(this.getTitle());
      casper.evaluate(function() {
          document.body.bgColor = 'white';
      });
  });
  
  casper.then(function Remplissage_Form_1() {
    element = 'form#f1';
    if (this.exists(element)) {
      this.echo('found ' + element, 'INFO');
      this.fill(element, {
        'civilite':     json.civilite,
        'nom':          json.nom,
        'prenom':       json.prenom,
        'email':        json.email,
        'conf_email':   json.email,
        'jj':           json.jj,
        'mm':           json.mm,
        'aaaa':         json.aaaa,
        'tel':          json.tel,
        'adresse':      json.adresse,
        'cp':           json.cp,
        'ville':        json.ville,
        'pays':         json.pays,
        'opt_nl':       json.opt_nl,
        'part_email':   json.part_email,
        'part_sms':     json.part_sms,
        'optreglement': json.optreglement
      }, true);
      
      this.capture('NRJ1.png', undefined);
      }
      else {
        this.echo(element + ' not found', 'ERROR');
      }
  });
  
  casper.then(function Remplissage_Form_2() {
    this.waitForUrl(json.URLS.Form2, function then() {
      this.echo('OK: ' + this.getCurrentUrl(), 'INFO');
      
      element = 'form#f2';
      if (this.exists(element)) {
        this.echo('found ' + element, 'INFO');
        
        this.fill(element, {
        'profession':      json.profession,
        'salaire':         json.salaire[date.getFullYear()][date.getMonth() - 1],
        'optexact':        json.optexact,
        'optreglement2':   json.optreglement2
        }, true);                           // A MODIFIER EN TRUE !! //
        
        this.capture('NRJ2.png', undefined);
      }
      else {
        this.echo(element + ' not found', 'ERROR');
      }
    }, function timeout() { // step to execute if check has failed
      this.echo('KO: ' + this.getCurrentUrl(), 'WARNING').exit();
    });
  });
  
  casper.then(function Validation() {
    this.waitForUrl(json.URLS.Conf, function then() {
      this.echo('OK: ' + this.getCurrentUrl(), 'INFO');
      
      this.capture('NRJ3.png', undefined);
      
    }, function timeout() { // step to execute if check has failed
      this.echo('KO: ' + this.getCurrentUrl(), 'WARNING').exit();
    });
  });
    
  casper.run(function() {
      this.echo('Done.').exit();
  });
}
else {
  casper.echo('You Need a file.json ho contain data !!!', 'WARNING').exit();
}