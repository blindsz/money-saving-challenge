(function () {
	angular.module("money-saving-challenge.controllers", [])

	.controller("PreferencesController", function ($scope, $ionicPopup, $ionicLoading, $ionicPlatform, $state, $ionicHistory, ionicToast, $cordovaToast, Storage) {  

		$scope.accountSettings = {};

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

		var disableBackButtonAction = $ionicPlatform.registerBackButtonAction(function (){
		    return; // do nothing
		}, 401);

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
			          	else if(!$scope.accountSettings.accountType) {
			          		toast("Please select type of account");
			          		e.preventDefault();
			          	}
			          	else {
			            	return { 
			            		name: $scope.accountSettings.name,
			            		accountType: $scope.accountSettings.accountType
			            	}
			        	}
			    	}
				}]
		   	}).then(function(result) {
		   		if(result){
			   		Storage.settings.add(result);

			   		$ionicLoading.show({ template: 'Loading...' });

			   		Storage.goal.setup().then( function(setup){
			   			$ionicLoading.hide();
			   		});

			   		disableBackButtonAction();

			   		$ionicHistory.nextViewOptions({ 
			   			disableBack: true
			   		});

					$state.go('app.home');
				}
		   	});
		};
	})

	.controller("HomeController", function ($scope, $ionicModal, ionicMaterialInk, $ionicPopup, AccountSavings, Storage, $ionicLoading, $timeout) {

		ionicMaterialInk.displayEffect();
		$scope.items = AccountSavings.getAll();

		Storage.goal.getAllSelected().then( function (selectedData){
			$scope.selectedData = selectedData;
		});

		Storage.settings.getAll().then(function (settings){

			var dateStarted = settings.date_started,
				currentMilestone = moment().add(1, "day").diff(dateStarted, "days"),
				nextMilestone = moment().add(2, "day").diff(dateStarted, "days");

			var getOrdinal = function (number) {
				var s = ["th", "st", "nd", "rd"],
					v  = number % 100;

				return number + (s[(v-20)%10]||s[v]||s[0]);
			};
			
			Storage.goal.getMilestone(currentMilestone).then(function (currentMilestone){
				Storage.goal.getMilestone(nextMilestone).then(function (nextMilestone){

					$scope.accountInfo = {
						name: settings.account_name,
						currentMilestone: currentMilestone.amount,
						nextMilestone: nextMilestone.amount
					};

					$scope.addSavings = function() {

						$ionicPopup.confirm({
					     	title: '<i class="ion-android-checkmark-circle"></i> '+
					     			'Complete Your '+ getOrdinal(currentMilestone.day) +' Milestone',
					     	templateUrl: 'templates/home/popup.html',
					     	cancelText: 'Not Now',
					     	okText: 'Yes',
					     	cancelType: 'button-dark',
					     	okType: 'button-positive',
					     	scope: $scope
					   	}).then(function(result) {
					     	if(result) {
					       		
					     	}
					   	});

					};
				});
			});
		});
	})

})();