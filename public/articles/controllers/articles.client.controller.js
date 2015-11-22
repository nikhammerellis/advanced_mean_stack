//$routeParams: This is provided with the ngRoute module and holds references to route parameters of the AngularJS routes 
//$location: This allows you to control the navigation of your application
//Authentication: provides you with the authenticated user information 
//Articles: provides you with a set of methods to communcate with RESTful endpoints 
angular.module('articles').controller('ArticlesController', ['$scope', '$routeParams', '$location', 'Authentication', 'Articles',
	function($scope, $routeParams, $location, Authentication, Articles){
		$scope.authentication = Authentication;

		//used the Articles resource service to create a new article resource
		//used the article resource $save method to send the new article object to the corresponding RESTful endpoint, along with two callbacks
		$scope.create = function(){
			var article = new Articles({
				title: this.title,
				content: this.content
			});

			article.$save(function(response){
				$location.path('articles/' + response._id);
			}, function(errorResponse){
				$scope.error = errorResponse.data.message;
			});
		};

		//retieve a list of articles, uses the resource query() method because it expects a collection
		$scope.find = function(){
			$scope.articles = Articles.query();
		};

		//retrieve one article, uses the resource get() method to retrieve a single document 
		$scope.findOne = function(){
			$scope.article = Articles.get({
				articleId: $routeParams.articleId
			});
		};

		//used the resource article's update method to send the updated article object to the correspnding RESTful endpoint 
		$scope.update = function(){
			$scope.article.$update(function(){
				$location.path('articles/'+$scope.article._id);
			}, function(errorResponse){
				$scope.error = errorResponse.data.message;
			});
		};

		//first figures out whether the user is deleting an article from a list or directly from the article view 
		//uses the article's $remove method to call the corresponding RESTful endpoint
		//if the user deleted the article from a list view, it will remove the deleted object from the articles collection
		//otherwise, it will delete the article then redirect the user back to the list view 
		$scope.delete = function(article){
			if(article){
				article.$remove(function(){
					for(var i in $scope.articles){
						if($scope.articles[i] === article){
							$scope.articles.splice(i, 1);
						}
					}
				});
			} else {
				$scope.article.$remove(function(){
					$location.path('articles');
				});
			}
		};
	} // end of controller constructor 
]);

