(function () {
	angular.module("money-saving-challenge", [
		"money-saving-challenge.controllers",
		"money-saving-challenge.services",
		"money-saving-challenge.directives",
		"money-saving-challenge.filters",
		"ionic",
		"ionic-material"
	])

	.config(function ($ionicConfigProvider, $stateProvider, $urlRouterProvider) {

		$ionicConfigProvider.scrolling.jsScrolling(true);

		$stateProvider

		.state('app', {
	        url: '/app',
	        abstract: true,
	        templateUrl: 'templates/main/menu.html',
	        controller: 'MenuController'
	    })

		.state('app.introduction', {
	        url: '/introduction',
	        views: {
	            'main': {
	                templateUrl: 'templates/introduction/index.html'
	                // controller: 'IntroductionController'
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
		
		$urlRouterProvider.otherwise('/app/introduction');
		
	})

	.run(function ($ionicPlatform) {
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
	});
})();
