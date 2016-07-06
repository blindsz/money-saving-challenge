(function () {
	angular.module("money-saving-challenge.services", [])


	.factory("Storage", function ($q, $ionicPlatform, $cordovaSQLite, StorageConfig, APP_STATUS, DAYS_COUNT, ACCOUNT_TYPE) {
		var db;

		return {
			init: function (){
				var deferred = $q.defer();

				if(window.cordova) {
					db = $cordovaSQLite.openDB({ name: StorageConfig.name, location: 1 ,androidDatabaseImplementation: 2, androidLockWorkaround: 1});
				}
				else {
					db = window.openDatabase(StorageConfig.name, StorageConfig.version, StorageConfig.description, 2 * 1024 * 1024);
				}
				db.transaction(function (tx) {
					for(var i = 0; i < StorageConfig.tables.length; i++) {
						var createTablesSql = "CREATE TABLE IF NOT EXISTS " + StorageConfig.tables[i].name + " (",
							columns = StorageConfig.tables[i].columns;

						for(var j = 0; j < columns.length; j++) {
							createTablesSql += columns[j].name + " " + columns[j].type;

							if(j === (columns.length - 1)) {
								createTablesSql += "); ";
							}
							else {
								createTablesSql += ", ";
							}
						}
						tx.executeSql(createTablesSql);
					}
					// tx.executeSql("INSERT INTO achievements (id, day, amount, status, created_at) VALUES (NULL, 2, 0.02, 'completed', 'asdsa')");
					return deferred.resolve(true);
				});
				return deferred.promise;
			},
			settings: {
				getAll: function(){
					var deferred = $q.defer();

					db.transaction(function (tx) {
						tx.executeSql("SELECT * FROM settings", [], function (tx, results){
							if(results.rows.length == 0){
								deferred.resolve({
									app_status: 0
								});
							}
							else{
								deferred.resolve(results.rows.item(0));
							}
							
						}, function (tx, error) {
							deferred.reject(error);
						});
					});
					return deferred.promise;
				},

				add: function (data){
					var deferred = $q.defer();

					var dateStarted = moment(moment(), "MM-DD-YYYY").valueOf();
					var dateToFinish = moment(moment(), "MM-DD-YYYY").add(DAYS_COUNT, 'days').valueOf();

					db.transaction(function (tx) {
						tx.executeSql("INSERT INTO settings " +
									"(id, account_name, account_type, app_status, date_started, date_finish) " +
							" VALUES (NULL,'" + data.name + "', '" + data.accountType + "', '" + APP_STATUS.appAlreadyUsed + "', '" + dateStarted + "', '" + dateToFinish + "') ", [], function (tx, results) {
							deferred.resolve(results.insertId);
						}, function (tx, error) {
							deferred.reject(error);
						});
					});
					return deferred.promise;
				}
			},
			goal: {
				setup: function (){
					var deferred = $q.defer();

					db.transaction(function (tx){
						tx.executeSql("SELECT date_started FROM settings", [], function (tx, results) {
							var dateStarted = results.rows.item(0).date_started;

							tx.executeSql("SELECT account_type FROM settings", [], function (tx, results){
								var accountType = results.rows.item(0).account_type;
								var data = [];

								if(accountType === ACCOUNT_TYPE.inOrder || accountType === ACCOUNT_TYPE.random){
									for(var i=1; i<DAYS_COUNT + 1; i++){
										data.push({
											day: i,
											amount: (i / 100)
										});
									}

									for(var i=0; i<data.length; i++){
										tx.executeSql("INSERT INTO goals (id, day, amount) VALUES (NULL, '"+ data[i].day +"', '" + data[i].amount + "')", [], function (tx, results) {
											deferred.resolve(true);
										});
									}
								}
								else if(accountType === ACCOUNT_TYPE.inReverse){
									for(var i=DAYS_COUNT; i>0; i--){
										data.push({
											day: DAYS_COUNT-i+1,
											amount: (i / 100)
										})
									}

									for(var i=0; i<data.length; i++){
										tx.executeSql("INSERT INTO goals (id, day, amount) VALUES (NULL, '"+ data[i].day +"', '" + data[i].amount + "')", [], function (tx, results) {
											deferred.resolve(true);
										});
									}
								}

							}, function(tx, error){
								deferred.reject(error);
							});

						}, function (tx, error){
							deferred.reject(error);
						});
					});
					return deferred.promise;
				},
				getMilestone: function (day) {
					var deferred = $q.defer();

					db.transaction (function (tx){
						tx.executeSql("SELECT * FROM goals WHERE day ='" + day + "' ", [], function (tx, results){
							if(results.rows.length != 0){
								deferred.resolve(results.rows.item(0));
							}			
						}, function (tx,error){
							deferred.reject(error);
						});
					});
					return deferred.promise;

				},
				getAllSelected: function (){
					var deferred = $q.defer(),
						data = [];

					db.transaction( function (tx){
						tx.executeSql("SELECT * FROM goals WHERE day NOT IN (SELECT day FROM achievements)", [], function (tx, results){
							for(var i=0; i<results.rows.length; i++){
								data.push(results.rows.item(i));
							}
							deferred.resolve(data);
						}, function (tx, error){
							deferred.reject(error);
						});
					});
					return deferred.promise;
				}
			},
			achievements: {
				add: function () {
					var deferred = $q.defer();

					db.transaction ( function (tx) {
						tx.executeSql()
					}, function (tx, error){
						deferred.reject(error);
					});
					return deferred.promise;
				}
			}
		}
	})

	.factory("AccountSavings", function () {

		var chats = [{
		    id: 0,
		    name: 'Ben Sparrow',
		    lastText: 'You on your way?',
		    face: 'img/ben.png'
	  	}, {
		    id: 1,
		    name: 'Max Lynx',
		    lastText: 'Hey, it\'s me',
		    face: 'img/max.png'
		}, {
		    id: 2,
		    name: 'Adam Bradleyson',
		    lastText: 'I should buy a boat',
		    face: 'img/adam.jpg'
		}, {
		    id: 3,
		    name: 'Perry Governor',
		    lastText: 'Look at my mukluks!',
		    face: 'img/perry.png'
	  	}, {
		    id: 4,
		    name: 'Mike Harrington',
		    lastText: 'This is wicked good ice cream.',
		    face: 'img/mike.png'
	  	}];

		return {

			getAll: function (){
				return chats;
			}
			
		}
	});
	
})();