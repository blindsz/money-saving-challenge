(function () {
	angular.module("money-saving-challenge", [
		"money-saving-challenge.controllers",
		"money-saving-challenge.directives",
		"money-saving-challenge.filters",
		"money-saving-challenge.services",		
		"ionic",
		"ionic-material",
		"ionic-toast",
		"ngResource",
		"ngCordova"
	])

	.run( function ($ionicPlatform, Storage, $state, APP_STATUS){
		$ionicPlatform.ready(function () {
			Storage.init().then( function (){
				Storage.settings.getAll().then(function (settings){
					if(settings[0].app_status === APP_STATUS.appFirstRun){
						$state.go("app.preferences");
					}
					else if(settings[0].app_status === APP_STATUS.appAlreadyUsed){
						$state.go("app.home");
					}
				});
			});
		});
	})

	.run(function ($ionicPlatform, $state) {
		$ionicPlatform.ready(function () {
			if(window.cordova && window.cordova.plugins.Keyboard) {
				// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
				// for form inputs)
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

				// Don"t remove this line unless you know what you are doing. It stops the viewport
				// from snapping when text inputs are focused. Ionic handles this internally for
				// a much nicer keyboard experience.
				cordova.plugins.Keyboard.disableScroll(true);

				Keyboard.disableScrollingInShrinkView(true);
			}

			if(window.StatusBar) {
				// StatusBar.styleDefault();
				StatusBar.styleLightContent();
			}
		});
	})

	.config(function ($ionicConfigProvider, $stateProvider, $urlRouterProvider) {

		$ionicConfigProvider.scrolling.jsScrolling(true);

		$stateProvider
		.state('app', {
	        url: '/app',
	        abstract: true,
	        templateUrl: 'templates/main/menu.html'
	        // controller: 'MenuController'
	    })

		.state('app.preferences', {
	        url: '/preferences',
	        views: {
	            'main': {
	                templateUrl: 'templates/preferences/index.html',
	                controller: 'PreferencesController'
	            }
	        }
	    })

		.state('app.home', {
	        url: '/home',
	        views: {
	            'main': {
	                templateUrl: 'templates/home/index.html',
	                controller: 'HomeController'
	            }
	        }
	    })

		.state('app.achievements', {
	        url: '/achievements',
	        views: {
	            'main': {
	                templateUrl: 'templates/achievements/index.html'
	                // controller: 'AchievementsController'
	            }
	        }
	    })

	    .state('app.missed-milestones', {
	        url: '/missed-milestones',
	        views: {
	            'main': {
	                templateUrl: 'templates/missed-milestones/index.html'
	                // controller: 'MissedMilestonesController'
	            }
	        }
	    })

	    .state('app.currency', {
	        url: '/currency',
	        views: {
	            'main': {
	                templateUrl: 'templates/currency/index.html'
	                // controller: 'CurrencyController'
	            }
	        }
	    })

	    .state('app.settings', {
	        url: '/settings',
	        views: {
	            'main': {
	                templateUrl: 'templates/settings/index.html'
	                // controller: 'SettingsController'
	            }
	        }
	    })

	    .state('app.about', {
	        url: '/about',
	        views: {
	            'main': {
	                templateUrl: 'templates/about/index.html'
	                // controller: 'AboutController'
	            }
	        }
	    });

		// $urlRouterProvider.otherwise('/app/preferences');	// commented out to allow conditional routing	
	})

	.constant("StorageConfig", {
		name: "money_saving_challenge.db",
		version: "1.0",
		description: "Money Saving Challenge Database",
		tables: [{
			name: "goals",
			columns: [
				{ name: "id", type: "integer primary key" },
				{ name: "day", type: "integer" },
				{ name: "amount", type: "decimal"}
			]
		}, {
			name: "achievements",
			columns: [
				{ name: "id", type: "integer primary key" },
				{ name: "day", type: "integer" },
				{ name: "amount", type: "decimal" },
				{ name: "status", type: "text" },
				{ name: "created_at", type: "text" }
			]
		}, {
			name: "settings",
			columns: [
				{ name: "id", type: "integer primary key" },
				{ name: "account_name", type: "text" },
				{ name: "account_type", type: "integer" },
				{ name: "app_status", type: "integer"},
				{ name: "date_started", type: "text"},
				{ name: "date_finish", type: "text"}
			]
		}, {
			name: "reminder",
			columns: [
				{ name: "id", type: "integer primary key" },
				{ name: "has_reminder", type: "integer" },
				{ name: "repeat_reminder", type: "text" },
				{ name: "reminder_time", type: "text" },

				{ name: "has_follow_up_reminder", type: "integer"},
				{ name: "repeat_follow_up_reminder", type: "text" },
				{ name: "follow_up_time", type: "text"}
			]
		}]
	})

	.constant("ACCOUNT_TYPE",{
		inOrder: 1,
		inReverse: 2,
		random: 3
	})

	.constant("APP_STATUS",{
		appFirstRun: 0,
		appAlreadyUsed: 1
	})

	.constant("DAYS_COUNT", 365);

})();
