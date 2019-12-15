var app = angular.module("app", [
  "ui.router",
  "ngStorage",
  "angular-loading-bar"
]);

// Angular Loading Bar
app.config([
  "cfpLoadingBarProvider",
  function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeBar = true;
  }
]);

app.config(function($httpProvider) {
  // Making post request with application/json content-type headers
  $httpProvider.defaults.headers.post["Content-Type"] = "application/json";
  $httpProvider.interceptors.push("httpRequestInterceptor");
});

// Binding HTTP requests with access_token if exisits
app.factory("httpRequestInterceptor", function($localStorage) {
  return {
    request: function(config) {
      if (
        typeof $localStorage.user !== "undefined" &&
        $localStorage.user !== null &&
        $localStorage.user !== ""
      ) {
        var auth_headers = $localStorage.user.access_token;
        config.headers["Authorization"] = `Bearer ${auth_headers}`;
      }
      if (config.url.startsWith("/")) {
        config.url = base_url + config.url;
      }
      return config || $q.when(config);
    }
  };
});

// Authenticating with the server if token is still valid
app.factory("authFactory", function($localStorage, $http, $rootScope) {
  return {
    async authenticate() {
      try {
        let res = await $http.get("/authenticate?scopes=authdeputy:admin");
        $rootScope.header(true);
        $rootScope.isAuth = true;
        $rootScope.user = res.data;
        return res.data;
      } catch (err) {
        console.log("Authenticate factory error", err);
        if ($localStorage.user) toastr.error(err.data.message);
        $rootScope.header(false);
        $localStorage.user = null;
        $rootScope.isAuth = false;
        $rootScope.user = null;
        return err.data;
      }
    }
  };
});

app.run(function($state, $rootScope, $transitions, authFactory) {
  $transitions.onStart({}, async function(trans) {
    try {
      // Adding title of the route
      document.title =
        (trans.$to().data.title ? `${trans.$to().data.title} - ` : "") +
        APP_NAME;

      let routeLevel = trans.$to().data.authLevel;
      await authFactory.authenticate();
      if (routeLevel == "logged_in") {
        // enter only if authneticated
        if ($rootScope.isAuth != true) {
          $state.go("auth:sign_in");
        }
      } else if (routeLevel == "not_logged_in") {
        // do not enter if already authenticated
        if ($rootScope.isAuth == true) {
          $state.go("home");
        }
      } else {
        // enter anyway
        return;
      }
    } catch (err) {
      console.log("Transition Error", err);
    }
  });
});
