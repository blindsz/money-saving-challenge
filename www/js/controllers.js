(function () {
	angular.module("money-saving-challenge.controllers", [])

	.controller("MenuController", function ($scope) {

	    
	})

	.controller("HomeController", function ($scope, $ionicModal, ionicMaterialInk, $ionicPopup) {
		ionicMaterialInk.displayEffect();

		var chats = [
			{
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
		  	}
		];

		$scope.items = chats;
		   

	   	$scope.showConfirm = function() {
			var confirmPopup = $ionicPopup.confirm({
		     	title: 'Consume Ice Cream',
		     	template: 'Are you sure you want to eat this ice cream sad sad asd asd as dasd?',
		     	cancelText: 'No',
		     	okText: 'Yes',
		     	cancelType: 'button-dark',
		     	okType: 'button-positive'
		   	});

		   	confirmPopup.then(function(result) {
		     	if(result) {
		       		console.log('You are sure');
		     	} 
		     	else {
		       		console.log('You are not sure');
		     	}
		   	});
		};
	})

	.controller("PreferencesController", function ($scope, $ionicPopup, $ionicPlatform, $state, $ionicHistory) {  

		var disablePopupClose = $ionicPlatform.registerBackButtonAction(function(){
		    return; // do nothing
		}, 401);

		var goTo = function (stateName) {
			$state.go(stateName);
		};

		$scope.accountOptions = {};

		$scope.showPopup = function() {
			var showPopup = $ionicPopup.show({
				templateUrl: 'templates/preferences/preferences.html',
		     	title: '<i class="icon ion-android-settings placeholder-icon"></i> Preferences Setup',
		     	scope: $scope,
		     	buttons: [{
				    text: '<i class="ion-android-done"></i> Start saving challenge!',
				    type: 'button-positive',
				}]
		   	});

		   	showPopup.then(function() {
		   		console.log($scope.accountOptions);
		   		disablePopupClose();
		   		$ionicHistory.nextViewOptions({
				    disableBack: true
				});
		   		goTo('app.home');

		   	});
		};



	});
})();