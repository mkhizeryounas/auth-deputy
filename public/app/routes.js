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
    .state("scopes:list", {
      templateUrl: "app/partials/scopes/list.html",
      url: "/scopes",
      controller: "scopesCtrl",
      data: {
        authLevel: "logged_in",
        title: "Scopes"
      }
    })
    .state("scopes:new", {
      templateUrl: "app/partials/scopes/new.html",
      url: "/scopes/new",
      controller: "scopesCtrl",
      data: {
        authLevel: "logged_in",
        title: "New Scope"
      }
    })
    .state("scopes:edit", {
      templateUrl: "app/partials/scopes/edit.html",
      url: "/scopes/:id/edit",
      controller: "scopesCtrl",
      data: {
        authLevel: "logged_in",
        title: "Edit Scope"
      }
    })

    .state("permissions:list", {
      templateUrl: "app/partials/permissions/list.html",
      url: "/permissions",
      controller: "permissionsCtrl",
      data: {
        authLevel: "logged_in",
        title: "Permissions"
      }
    })
    .state("permissions:new", {
      templateUrl: "app/partials/permissions/new.html",
      url: "/permissions/new",
      controller: "permissionsCtrl",
      data: {
        authLevel: "logged_in",
        title: "New Permission"
      }
    })
    .state("permissions:edit", {
      templateUrl: "app/partials/permissions/edit.html",
      url: "/permissions/:id/edit",
      controller: "permissionsCtrl",
      data: {
        authLevel: "logged_in",
        title: "Edit Permission"
      }
    })

    .state("users:list", {
      templateUrl: "app/partials/users/list.html",
      url: "/users",
      controller: "usersCtrl",
      data: {
        authLevel: "logged_in",
        title: "Users"
      }
    })
    .state("users:new", {
      templateUrl: "app/partials/users/new.html",
      url: "/users/new",
      controller: "usersCtrl",
      data: {
        authLevel: "logged_in",
        title: "New User"
      }
    })
    .state("users:edit", {
      templateUrl: "app/partials/users/edit.html",
      url: "/users/:id/edit",
      controller: "usersCtrl",
      data: {
        authLevel: "logged_in",
        title: "Edit User"
      }
    })

    .state("settings:edit", {
      templateUrl: "app/partials/settings.html",
      url: "/settings",
      controller: "mainCtrl",
      data: {
        authLevel: "logged_in",
        title: "Edit User"
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
