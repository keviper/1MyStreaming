// Initialize your app
var myApp = new Framework7({
    swipePanel: 'left' //Activamos la acción slide para el menú
});


// Export selectors engine
var $$ = Dom7;
    // PhoneGap is ready
    //
    var db;
    function onDeviceReady() {
        db = window.openDatabase("1Mybroadcast", "1.0", "PhoneGap Demo", 200000);
        db.transaction(populateDB, errorCB, successCB);
    }
    // Populate the database 
    //
    function populateDB(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS configuracion (id unique, key, value)');
    }
    function successCB() {
        console.log('Base de datos Creada');

        db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM configuracion', [], function (tx, results) {
                var len = results.rows.length;

                for (var i=0; i<len; i++){
                    switch(results.rows.item(i).key){
                        case "servidor":
                            $$('.hostname').text(results.rows.item(i).value);
                        break;
                        case "puerto":
                            $$('.port').text(results.rows.item(i).value);
                        break;
                    }
                }
            }, errorCB);
        }, errorCB);
    }


    // Query the database
    //
    function queryDB(tx) {
        tx.executeSql('INSERT INTO configuracions (id, data) VALUES (1, "First row")');
        tx.executeSql('INSERT INTO configuracions (id, data) VALUES (1, "First row")');

    }

    // Query the success callback
    //
    function querySuccess(tx, results) {
        var len = results.rows.length;
        console.log("configuracion table: " + len + " rows found.");
        for (var i=0; i<len; i++){
            console.log("Row = " + i + " ID = " + results.rows.item(i).id + " Data =  " + results.rows.item(i).data);
        }
    }

    // Transaction error callback
    //
    function errorCB(err) {
        console.log("Error processing SQL: "+err.code);
    }

    // Transaction success callback
    //
    function successCB_2() {
        db = window.openDatabase("1Mybroadcast", "1.0", "PhoneGap Demo", 200000);
        db.transaction(queryDB, errorCB);

    }

onDeviceReady();

$$('.modal-server').on('click', function () {
    myApp.prompt('Introduce la direccion de tu servidor', 'Servidors', 
      function (value) {
        $$('.hostname').text(value);
        db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM configuracion WHERE key="servidor"', [], function (tx, results) {
                var len = results.rows.length;
                if (len>0) {
                    tx.executeSql('UPDATE configuracion SET `value`='+value+' WHERE key="servidor"');
                }else{
                    tx.executeSql('INSERT INTO configuracion (id, key, value) VALUES (1, "servidor", '+value+')');
                };
            }, errorCB);
        }, errorCB);
      },
      function (value) {
        
      }
    );
}); 
$$('.modal-port').on('click', function () {
    myApp.prompt('Introduce el puerto de tu servidor', 'Puerto', 
      function (value) {
        $$('.port').text(value);
        db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM configuracion WHERE key="puerto"', [], function (tx, results) {
                var len = results.rows.length;
                if (len>0) {
                    tx.executeSql('UPDATE configuracion SET `value`='+value+' WHERE key="puerto"');
                }else{
                    tx.executeSql('INSERT INTO configuracion (id, key, value) VALUES (2, "puerto", '+value+')');
                };
            }, errorCB);
        }, errorCB);
      },
      function (value) {
        
      }
    );
}); 
$$('.detener').hide();
$$('.control').click(function () {
    $$('.control').hide();
    if ($$(this).hasClass('detener')) {
        $$('.detener').hide();
        $$('.conectar').show();
        db.transaction(queryDB, errorCB);
    }else{
        $$('.detener').show();
        $$('.conectar').hide();
    }
});  
// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true,
});

// Callbacks to run specific code for specific pages, for example for About page:
myApp.onPageInit('about', function (page) {
    // run createContentPage func after link was clicked
    $$('.create-page').on('click', function () {
        createContentPage();
    });
});
$$(document).on('page:init', function (e) {
    var page = e.detail.page;
    // Code for About page
    if (page.name === 'about') {
        // We need to get count GET parameter from URL (about.html?count=10)
        var count = page.query.count;
        // Now we can generate some dummy list
        var listHTML = '<ul>';
        for (var i = 0; i < count; i++) {
            listHTML += '<li>' + i + '</li>';
        }
        listHTML += '</ul>';
        // And insert generated list to page content
        $$(page.container).find('.page-content').append(listHTML);
    }
    // Code for Services page
    if (page.name === 'about') {
        myApp.alert('Here comes our services!');
    }
});
// Generate dynamic page
var dynamicPageIndex = 0;
function createContentPage() {
	mainView.router.loadContent(
        '<!-- Top Navbar-->' +
        '<div class="navbar">' +
        '  <div class="navbar-inner">' +
        '    <div class="left"><a href="#" class="back link"><i class="icon icon-back"></i><span>Back</span></a></div>' +
        '    <div class="center sliding">Dynamic Page ' + (++dynamicPageIndex) + '</div>' +
        '  </div>' +
        '</div>' +
        '<div class="pages">' +
        '  <!-- Page, data-page contains page name-->' +
        '  <div data-page="dynamic-pages" class="page">' +
        '    <!-- Scrollable page content-->' +
        '    <div class="page-content">' +
        '      <div class="content-block">' +
        '        <div class="content-block-inner">' +
        '          <p>Here is a dynamic page created on ' + new Date() + ' !</p>' +
        '          <p>Go <a href="#" class="back">back</a> or go to <a href="services.html">Services</a>.</p>' +
        '        </div>' +
        '      </div>' +
        '    </div>' +
        '  </div>' +
        '</div>'
    );
	return;
}
