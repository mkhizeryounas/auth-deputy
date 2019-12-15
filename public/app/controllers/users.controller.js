angular
  .module("app")
  .controller("usersCtrl", function(
    $scope,
    $rootScope,
    $localStorage,
    $state,
    $http
  ) {
    $scope.startForm = async () => {
      try {
        let permissions = await $http.get("/permissions");
        $scope.permissions = permissions.data.data;
      } catch (err) {
        console.log(err);
      }
    };
    $scope.getAll = async () => {
      try {
        let res = await $http.get("/users");
        $scope.data = res.data.data;
        console.log(res);
      } catch (err) {
        toastr.error(err.data.message);
      }
    };
    $scope.get = async () => {
      try {
        let permissions = await $http.get("/permissions");
        $scope.permissions = permissions.data.data;
        let res = await $http.get(`/users/${$state.params.id}`);
        $scope.obj = res.data.data;
        console.log(res);
      } catch (err) {
        console.log(err);
        toastr.error(err.data.message);
        $state.go("users:list");
      }
    };
    $scope.create = async obj => {
      try {
        let res = await $http.post("/users", obj);
        console.log(res);
        toastr.success(res.data.message);
        $state.go("users:list");
      } catch (err) {
        toastr.error(err.data.message);
      }
    };
    $scope.edit = async obj => {
      try {
        let res = await $http.put(`/users/${$state.params.id}`, obj);
        console.log(res);
        toastr.success(res.data.message);
        $state.go("users:list");
      } catch (err) {
        toastr.error(err.data.message);
        $state.go("users:list");
      }
    };
    $scope.delete = async id => {
      try {
        if (window.confirm("Do you want to delete this document?")) {
          let res = await $http.delete(`/users/${id}`);
          console.log(res);
          toastr.success(res.data.message);
          $state.reload();
        }
      } catch (err) {
        toastr.error(err.data.message);
      }
    };
  });
