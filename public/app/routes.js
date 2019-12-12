app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
  // Removing /#!/ from the routes
  $locationProvider.html5Mode(true).hashPrefix("");

  $urlRouterProvider.otherwise("/");

  $stateProvider
    .state("home", {
      templateUrl: "app/partials/home.html",
      url: "/home",
      controller: "mainCtrl",
      data: {
        authLevel: "logged_in",
        title: "Home"
      }
    })
    .state("discover", {
      templateUrl: "app/partials/discover.html",
      url: "/discover",
      controller: "mainCtrl",
      data: {
        authLevel: "logged_in",
        title: "Discover"
      }
    })

    .state("auth:sign_in", {
      templateUrl: "app/partials/auth/sign-in.html",
      url: "/auth/sign-in",
      controller: "authCtrl",
      data: {
        authLevel: "not_logged_in",
        title: "Sign in"
      }
    })
    .state("auth:sign_up", {
      templateUrl: "app/partials/auth/sign-up.html",
      url: "/auth/sign-up",
      controller: "authCtrl",
      data: {
        authLevel: "not_logged_in",
        title: "Sign up"
      }
    })

    .state("default", {
      templateUrl: "app/partials/home.html",
      url: "/",
      controller: "mainCtrl",
      data: {
        authLevel: "logged_in",
        title: "Home"
      }
    });
});
