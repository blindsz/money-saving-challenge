(function () {
	angular.module("money-saving-challenge.services", [])


	.factory("Storage", function ($q, $ionicPlatform, $cordovaSQLite, StorageConfig, APP_STATUS, DAYS_COUNT, ACCOUNT_TYPE, ACHIEVEMENT_STATUS) {
		var db;

		return {
			init: function (){
				var deferred = $q.defer();

				if(window.cordova) {
					db = $cordovaSQLite.openDB({ name: StorageConfig.name, location: 2 ,androidDatabaseImplementation: 2, androidLockWorkaround: 1});
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
					return deferred.resolve(true);
				});
				return deferred.promise;
			},

			tables:{
				drop: function () {
					var deferred = $q.defer();
					db.transaction(function(tx) {
						for(var i = 0; i < StorageConfig.tables.length; i++) {
							tx.executeSql('DROP TABLE IF EXISTS '+ StorageConfig.tables[i].name +' ');
						}
					})
					return deferred.promise;
				}
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

			milestones: {
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
										tx.executeSql("INSERT INTO milestones (id, day, amount) VALUES (NULL, '"+ data[i].day +"', '" + data[i].amount + "')", [], function (tx, results) {
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
										tx.executeSql("INSERT INTO milestones (id, day, amount) VALUES (NULL, '"+ data[i].day +"', '" + data[i].amount + "')", [], function (tx, results) {
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
				get: function (day) {
					var deferred = $q.defer();

					db.transaction (function (tx){
						tx.executeSql("SELECT * FROM milestones WHERE day ='" + day + "' ", [], function (tx, results){
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
						tx.executeSql("SELECT * FROM milestones WHERE amount NOT IN (SELECT amount FROM achievements)", [], function (tx, results){
							for(var i=0; i<results.rows.length; i++){
								data.push(results.rows.item(i));
							}
							deferred.resolve(data);
						}, function (tx, error){
							deferred.reject(error);
						});
					});
					return deferred.promise;
				},
				getTotalAmount: function (){
					var deferred = $q.defer();
					db.transaction( function (tx, results){
						tx.executeSql("SELECT SUM(amount) as total_amount from milestones", [], function (tx, results){
							if(results.rows.length != 0){
								deferred.resolve(results.rows.item(0));
							}
						}, function (tx, error){
							deferred.reject(error);
						});
					});
					return deferred.promise;
				}
			},

			achievements: {
				add: function (data) {
					var deferred = $q.defer();

					db.transaction ( function (tx) {
						tx.executeSql("INSERT INTO achievements " + 
							" (id, day, amount, status, created_at) " +
					 " VALUES (NULL, '" + data.day +"', '" + data.amount + "', '" + data.status + "', '" + moment() + "') ", [], function (tx, results){
					 		deferred.resolve(results.insertId);
						}, function (tx, error){
							deferred.reject(error);
						});
					});
					return deferred.promise;
				},
				getAll: function (){
					var deferred = $q.defer(),
						data = [];

					db.transaction( function (tx) {
						tx.executeSql("SELECT * FROM achievements ORDER BY day", [], function (tx, results) {
							for(var i=0; i<results.rows.length; i++){
								data.push(results.rows.item(i));
							}
							deferred.resolve(data);
						}, function (tx, error){
							deferred.reject(error);
						});
					});
					return deferred.promise;
				},
				getAllMissed: function (){
					var deferred = $q.defer(),
						data = [];

					db.transaction( function (tx) {
						tx.executeSql("SELECT * FROM achievements WHERE status = '" + ACHIEVEMENT_STATUS.completedButDelayed + "' ORDER BY day", [], function (tx, results) {
							for(var i=0; i<results.rows.length; i++){
								data.push(results.rows.item(i));
							}
							deferred.resolve(data);
						}, function (tx, error){
							deferred.reject(error);
						});
					});
					return deferred.promise;
				},
				get: function (id) {
					var deferred = $q.defer();

					db.transaction( function (tx, results){
						tx.executeSql("SELECT * FROM achievements WHERE id='" + id + "' ", [], function (tx, results) {
							if(results.rows.length != 0){
								deferred.resolve(results.rows.item(0));
							}

						}, function (tx, error){
							deferred.reject(error);
						});
					});
					return deferred.promise;
				},
				getTotalAmount: function (){
					var deferred = $q.defer();
					db.transaction( function (tx, results){
						tx.executeSql("SELECT SUM(amount) as total_amount from achievements", [], function (tx, results){
							if(results.rows.length != 0){
								deferred.resolve(results.rows.item(0));
							}
						}, function (tx, error){
							deferred.reject(error);
						});
					});
					return deferred.promise;
				},
				achievementExist: function (day) {
					var deferred = $q.defer();

					db.transaction ( function (tx){
						tx.executeSql("SELECT day FROM achievements WHERE day = '" + day + "' ", [], function (tx, results){
							if(results.rows.length != 0){
								deferred.resolve(true);
							}
							else{
								deferred.resolve(false);
							}
						}, function (tx, error){
							deferred.reject(error);
						});
					});
					return deferred.promise;
				}
			},
			
			missedMilestones: {
				getAll: function(missedDays){
					var deferred = $q.defer(),
						data = [];
					db.transaction ( function (tx) {
						tx.executeSql("SELECT * FROM achievements WHERE day = '" + missedDays + "'  ", [], function (tx, results){
							if(results.rows.length === 0){
								tx.executeSql("SELECT * FROM milestones WHERE day = '" + missedDays + "' ", [], function (tx, results){
									data.push({
										id: results.rows.item(0).id,
										day: results.rows.item(0).day,
										amount: results.rows.item(0).amount,
										date_missed: results.rows.item(0).day
									});
									deferred.resolve(data);
								}, function (tx, error){
									deferred.reject(error);
								});
							}
							else{
								deferred.resolve(false);
							}
						}, function (tx, error){
							deferred.reject(error);
						});
					});
					return deferred.promise;
				},
				count: function (missedDays){
					var deferred = $q.defer();

					db.transaction ( function (tx) {
						tx.executeSql("SELECT * FROM achievements WHERE day = '" + missedDays + "'  ", [], function (tx, results){
							if(results.rows.length === 0){
								deferred.resolve(missedDays);
							}
							else{
								deferred.resolve(false);
							}
						}, function (tx, error){
							deferred.reject(error);
						});
					});
					return deferred.promise;
				}
			}
		}
	})
})();