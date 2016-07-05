(function () {
	angular.module("money-saving-challenge.controllers", [])

	.controller("PreferencesController", function ($scope, $ionicPopup, $ionicPlatform, $state, $ionicHistory, ionicToast, $cordovaToast, Storage) {  

		$scope.accountSettings = {},
		$scope.accountType;

		$scope.showPreferences = function() {
			$ionicPopup.show({
				templateUrl: 'templates/preferences/preferences.html',
		     	title: '<i class="icon ion-android-settings placeholder-icon"></i> Preferences Setup',
		     	scope: $scope,
		     	buttons: [{
				    text: '<i class="ion-android-done"></i> Start saving challenge!',
				    type: 'button-positive',
				    onTap: function(e) {

			        	if (!$scope.accountSettings.name) {
			            	toast("Please enter an account name");
			          		e.preventDefault();
			          	}
			          	else if(!$scope.accountSettings.inOrder && !$scope.accountSettings.inReverse && !$scope.accountSettings.random) {
			          		toast("Please select type of account");
			          		e.preventDefault();
			          	}
			          	else {
			          		if($scope.accountSettings.inOrder !== undefined){
			          			$scope.accountType = $scope.accountSettings.inOrder;
			          		}
			          		else if($scope.accountSettings.inReverse !== undefined){
			          			$scope.accountType = $scope.accountSettings.inReverse;
			          		}
			          		else if($scope.accountSettings.random !== undefined){
			          			$scope.accountType = $scope.accountSettings.random;
			          		}

			            	return { 
			            		name: $scope.accountSettings.name,
			            		accountType: $scope.accountType
			            	}
			        	}
			    	}
				}]

		   	}).then(function(result) {
		   		if(result){
			   		Storage.settings.add(result);

			   		Storage.goal.setup();

			   		$ionicPlatform.registerBackButtonAction(function (){
					    return; // do nothing
					}, 401);

			   		$ionicHistory.nextViewOptions({ 
			   			disableBack: true
			   		});

					$state.go('app.home');
				}
		   	});
		};

		var toast = function (message) {
			if(window.cordova) {
				window.plugins.toast.showWithOptions({
				    message: message,
				    duration: "short", 
				    position: "bottom",
				    styling: {
				      	opacity: 0.8,
				      	cornerRadius: 100,
				      	horizontalPadding: 25, 
      					verticalPadding: 21 
				    }
				});
		    }
		    else {
		    	ionicToast.show(message, 'bottom', false, 2000);
		    }
		};
	})

	.controller("HomeController", function ($scope, $ionicModal, ionicMaterialInk, $ionicPopup, AccountSavings, Storage) {

		ionicMaterialInk.displayEffect();
		$scope.items = AccountSavings.getAll();

		Storage.settings.getAll().then(function (settings){
			$scope.accountName = settings[0].account_name;
		});

	   	$scope.addSavings = function() {
			$ionicPopup.confirm({
		     	title: 'Consume Ice Cream',
		     	template: 'Are you sure you want to eat this ice cream sad sad asd asd as dasd?',
		     	cancelText: 'No',
		     	okText: 'Yes',
		     	cancelType: 'button-dark',
		     	okType: 'button-positive'
		   	}).then(function(result) {
		     	if(result) {
		       		console.log('You are sure');
		       		// Storage.add();
		     	} 
		     	else {
		       		console.log('You are not sure');
		     	}
		   	});
		};
	})

})();