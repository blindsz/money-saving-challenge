(function () {
	angular.module("money-saving-challenge.controllers", [])

	.controller("HomeController", function ($scope, $ionicModal, ionicMaterialInk, $ionicPopup, Storage, $ionicLoading, $timeout, $filter, ACCOUNT_TYPE, ionicToast, $cordovaToast) {

		ionicMaterialInk.displayEffect();

		$scope.$on("$ionicView.beforeEnter", function(event, data){
			$ionicLoading.show({duration: 2000});
		});

		$scope.$on("onResume", function(event, data){
			Storage.settings.getAll().then(function (settings) {
				var dateStarted = settings.date_started,
					current = moment().add(1, "day").diff(dateStarted, "days"),
					next = moment().add(2, "day").diff(dateStarted, "days");
				
				Storage.milestones.get(current).then(function (currentMilestone) {
					Storage.milestones.get(next).then(function (nextMilestone) {
						Storage.achievements.getTotalAmount().then(function (totalAmount){
							$scope.accountInfo = {
								name: settings.account_name,
								totalAmount: totalAmount.total_amount,
								currentMilestoneDay: currentMilestone.day,
								currentMilestoneAmount: currentMilestone.amount,
								nextMilestoneAmount: nextMilestone.amount
							};
						});
					});
				});

				Storage.achievements.getAll().then(function (achievements){
					$scope.achievements = [];
					for(var i=0; i<achievements.length; i++){
						$scope.achievements.push({
							amount: achievements[i].amount,
							day: achievements[i].day,
							created_at: relativeTime(achievements[i].created_at)
						});
					}
				});
			});
		});

		var toast = function (message) {
			if(window.cordova) {
				window.plugins.toast.showWithOptions({
				    message: message,
				    duration: "short", 
				    position: "bottom",
				    addPixelsY: -60,
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

		var relativeTime = function (date){
			return moment(date).startOf('minute').fromNow();
		};

		var ordinal = function (input) {
	    	var s = ["th","st","nd","rd"],
	    		v = input%100;
	    	return input+(s[(v-20)%10]||s[v]||s[0]);
	  	};

		Storage.settings.getAll().then(function (settings) {
			var dateStarted = settings.date_started,
				current = moment().add(1, "day").diff(dateStarted, "days"),
				next = moment().add(2, "day").diff(dateStarted, "days");
			
			Storage.milestones.get(current).then(function (currentMilestone) {
				Storage.milestones.get(next).then(function (nextMilestone) {
					Storage.achievements.getTotalAmount().then(function (totalAmount){
						$scope.accountInfo = {
							name: settings.account_name,
							totalAmount: totalAmount.total_amount,
							currentMilestoneDay: currentMilestone.day,
							currentMilestoneAmount: currentMilestone.amount,
							nextMilestoneAmount: nextMilestone.amount
						};
					});
				});
			});

			Storage.achievements.getAll().then (function (achievements){
				$scope.achievements = [];
				for(var i=0; i<achievements.length; i++){
					$scope.achievements.push({
						amount: achievements[i].amount,
						day: achievements[i].day,
						created_at: relativeTime(achievements[i].created_at)
					});
				}
			});

			if(settings.account_type === ACCOUNT_TYPE.inOrder || settings.account_type === ACCOUNT_TYPE.inReverse) {
				$scope.completeCurrentMilestone = function() {
					Storage.achievements.achievementExist($scope.accountInfo.currentMilestoneDay).then( function (achievementExist) {
						if(achievementExist === false) {
							$ionicPopup.show({
						     	title: '<i class="ion-android-checkmark-circle"></i>  '+
						     			'Complete Your '+ ordinal($scope.accountInfo.currentMilestoneDay) +' Milestone',
						     	templateUrl: 'templates/home/popup.html',
						     	buttons: [{
								    text: '<i class="ion-close font-small small"></i> Not Now',
								    type: 'button-dark',
							    }, {
								    text: '<i class="ion-android-done font-small small"></i> Yes',
								    type: 'button-positive',
								    onTap: function(e) {
							    		return {
							    			amount: $scope.accountInfo.currentMilestoneAmount,
							    			day: $scope.accountInfo.currentMilestoneDay
							    		}
							        }
								}],
						     	scope: $scope
						   	}).then(function(result) {
						     	if(result) {						     		
						       		Storage.achievements.add(result).then (function (insertedId){
						       			Storage.achievements.get(insertedId).then (function (achievement){
						       				$scope.achievements.push({
						       					amount: achievement.amount,
												day: achievement.day,
												created_at: relativeTime(achievement.created_at)
						       				});
						       				$scope.accountInfo.totalAmount += achievement.amount;
						       			});
						       		});
						     	}
						   	});
						}
						else if(achievementExist === true){
							toast( ordinal($scope.accountInfo.currentMilestoneDay) + " Milestone already completed");
						}
					});
				};
			}
			else if(settings.account_type === ACCOUNT_TYPE.random) {
				$scope.selectedMilestone = {};

				Storage.milestones.getAllSelected().then( function (selectedMilestones){
					$scope.selectedMilestones = selectedMilestones;
				});

				$scope.getSelectedMilestone = function (index, milestone) {
					$scope.selectedMilestone = {
						row:index,
						amount: milestone.amount,
						day: milestone.day
					};
				};

				$scope.completeCurrentMilestone = function() {
					Storage.achievements.achievementExist($scope.accountInfo.currentMilestoneDay).then( function (achievementExist) {
						if(achievementExist === false) {
							$ionicPopup.show({
						     	title: '<i class="ion-android-checkmark-circle"></i>  '+
						     			'Complete Your '+ ordinal($scope.accountInfo.currentMilestoneDay) +' Milestone',
						     	templateUrl: 'templates/home/popup-list.html',
						     	buttons: [{
								    text: '<i class="ion-close small"></i> Not Now',
								    type: 'button-dark',
							    }, {
								    text: '<i class="ion-android-done small"></i> Ok',
								    type: 'button-positive',
								    onTap: function(e) {
								    	if($scope.selectedMilestone.row === null){
								    		e.preventDefault();
								    		toast("Please select a milestone");
								    	}
								    	else{
								    		return{
								    			selectedRow: $scope.selectedMilestone.row,
								    			amount: $scope.selectedMilestone.amount,
								    			day: $scope.accountInfo.currentMilestoneDay
								    		}
								    	}
							        }
								}],
						     	scope: $scope
						   	}).then(function(result) {
						     	if(result) {
						       		Storage.achievements.add(result).then (function (insertedId){
						       			Storage.achievements.get(insertedId).then (function (achievement){
						       				$scope.achievements.push({
						       					amount: achievement.amount,
												day: achievement.day,
												created_at: relativeTime(achievement.created_at)
						       				});
						       				$scope.accountInfo.totalAmount += achievement.amount;
						       				$scope.selectedMilestones.splice(result.selectedRow, 1);
						       				$scope.selectedMilestone.row = null;						       			
						       			});
						       		});
						     	}
						   	});
						}
						else if(achievementExist === true){
							toast( ordinal($scope.accountInfo.currentMilestoneDay) + " Milestone already completed");
						}
					});
				};
			}
		});
	})
	
	.controller("MenuController", function ($scope, Storage, $ionicSideMenuDelegate){
		$scope.$on('$ionicView.beforeEnter', function(e) {
			$scope.$watch(function () {
    			return $ionicSideMenuDelegate.getOpenRatio();
  			}, function (isOpen) {
                if (isOpen == 1 || isOpen == 0){	
                    Storage.settings.getAll().then(function (settings) {
                    	var dateStarted = settings.date_started,
							current = moment().add(1, "day").diff(dateStarted, "days"),
							next = moment().add(2, "day").diff(dateStarted, "days");
						Storage.milestones.get(current).then(function (currentMilestone) {
							Storage.milestones.get(next).then(function (nextMilestone) {
								Storage.achievements.getTotalAmount().then(function (totalAmount){
									$scope.accountInfo = {
										acountType: settings.account_type,
										name: settings.account_name,
										totalAmount: totalAmount.total_amount,
										currentMilestoneDay: currentMilestone.day,
										currentMilestoneAmount: currentMilestone.amount,
										nextMilestoneAmount: nextMilestone.amount
									};
								});
							});
						});
					});
                }
            });
		});
	})
	
	.controller("PreferencesController", function ($scope, $ionicPopup, $ionicLoading, $ionicPlatform, $state, $ionicHistory, ionicToast, $cordovaToast, Storage) {  

		$scope.accountSettings = {};

		var toast = function (message) {
			if(window.cordova) {
				window.plugins.toast.showWithOptions({
				    message: message,
				    duration: "short", 
				    position: "bottom",
				    addPixelsY: -40,
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
		     	title: '<i class="icon ion-android-settings placeholder-icon"></i>Preferences Setup',
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

			   		Storage.milestones.setup();

			   		disableBackButtonAction();

			   		$ionicHistory.nextViewOptions({ 
			   			disableBack: true
			   		});

					$state.go('app.home');
				}
		   	});
		};
	})

})();