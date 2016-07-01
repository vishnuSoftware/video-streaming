/**
 * Created by vishnu on 13/6/16.
 */
angular.module('LoginService' ,['ngResource']).factory('Login' , function($resource){
    return $resource('/:entity/:id',{id:'@id'},{
        authenticate: {method: 'POST', params: {entity: 'login'}},
        save: {method: 'POST', params: {entity: 'user'}},
        logout :{method:'GET' , params:{entity: 'logout'}},
        loggedIn:{method:'GET' , params:{entity:'loggedInUser'}},
        fileRecord:{methods:'GET' ,params:{entity:'getFiless'},isArray:true},
        removeFile:{method:"POST" , params:{entity:'removeFile'}}
    })
});

var projectApp = angular.module('newApp',[ 'ui.router','toaster' , 'ngAnimate' ,'LoginService' ,'ngFileUpload', "ngSanitize",'angularSpinner',
    "com.2fdevs.videogular",
    "com.2fdevs.videogular.plugins.controls",
    "com.2fdevs.videogular.plugins.overlayplay",
    "com.2fdevs.videogular.plugins.poster",
    "com.2fdevs.videogular.plugins.buffering",

    'angular-thumbnails',

     ]);

projectApp.controller('toastController', function($scope, toaster, $window) {

    $scope.pop = function(){
        toaster.pop('success', "title", 'Its address is https://google.com.', 3000, 'trustedHtml', 'goToLink');
        toaster.pop('success', "title", '<ul><li>Render html</li></ul>', 5000, 'trustedHtml');
        toaster.pop('error', "title", '<ul><li>Render html</li></ul>', null, 'trustedHtml');
        toaster.pop('wait', "title", null, null, 'template');
        toaster.pop('warning', "title", "myTemplate.html", null, 'template');
        toaster.pop('note', "title", "text");
    };

    $scope.goToLink = function(toaster) {
        var match = toaster.body.match(/http[s]?:\/\/[^\s]+/);
        if (match) $window.open(match[0]);
        return true;
    };

    $scope.clear = function(){
        toaster.clear();
    };
});

function projectAppRouteConfig($stateProvider, $urlRouterProvider) {



    $stateProvider.state('login', {
        url: '^/login',
        controller: loginCtrl,
        templateUrl: 'pages/login.html'
    }).state('menu', {
        url: '^/menu',
        controller: menuCtrl ,
        templateUrl: 'pages/menu.html'
    }).state('menu.SMEdashBoard', {
        url: '^/SMEdashBoard/:id',
        controller:SMEdashBoardCtrl ,
        templateUrl: 'pages/SMEdashBoad.html'
    }).state('menu.dashBoard', {
        url: '^/dashBoard/:id',
        controller:dashBoardCtrl ,
        templateUrl: 'pages/dashBoad.html'
    }).state('signUp', {
        url: '^/sign-up',
        controller:signUpCtrl ,
        templateUrl: 'pages/signup.html'
    });

    $urlRouterProvider.otherwise('/login');
}

projectApp.config(projectAppRouteConfig);



//=============loginCtrl========================

function loginCtrl($scope ,Login , $state ,toaster){

    $scope.login =function(user){
        console.log(user);
        Login.authenticate(user,function(response) {
            console.log(response);
            if(response.role != 'SME') {
                $state.go('menu.dashBoard', {id: response._id});
            }else{
                $state.go('menu.SMEdashBoard', {id: response._id});
            }

        },function(err){
            toaster.pop('error', "", "sorry email and password does not match", 3000, 'trustedHtml');
            console.log(err);
        })
    }
}

//=============signUpCtrl========================

function signUpCtrl($scope,toaster,$state,Login){
$scope.signupOk=false;
    $scope.errorUser=false;

    $scope.create=function(user){
        Login.save({},user,function(res){
            //if(res.email == 'Email already exists') {
            //
            //}else{
                $scope.signupOk = true;
            //}

        },function(err){
            console.log(err);
        })
    }

}

//=============menuCtrl========================

function menuCtrl($scope , Login , toaster ,  $state) {

    $scope.user = {};

    Login.loggedIn({}, function (user) {
        console.log(user);
        $scope.user = user;

    }, function (err) {
        console.log(err);
        if (err.status == 401) {
            alert("Please Login to continue");
            $state.go('login');
        }
    });

    $scope.logout = function (user) {
        if (confirm("You want to logout!")) {
            Login.logout(function (res) {
                console.log(res);
                toaster.pop('success', "", res.success, 3000, 'trustedHtml');
                $state.go('login');
            }, function (err) {
                console.log(err);
            })
        }
    }

}

//=============SMEdashBoardCtrl========================

function SMEdashBoardCtrl($scope, toaster, Upload , $state , Login ,sbSpinnerService) {

    $scope.fileRecords = [];

    $scope.getrecods = function () {
        Login.fileRecord({}, function (response) {
            console.log(response);
            $scope.fileRecords = response;
        }, function (err) {
            console.log(err);
        });
    };

    $scope.getrecods();

    $scope.uploadFile = function (files, master) {
        sbSpinnerService.spin('spinner');
        var url, file;
        console.log(files[0].name);

        Upload.upload({url: '/fileUploadVideo', file: files[0]}).then(function (response) {
            $scope.exemptionFiles = [];
            $scope.getrecods();
            sbSpinnerService.stop('spinner');
            //toaster.pop('success', "", "File uploaded successfully...!", 3000, 'trustedHtml');
            alert('File uploaded successfully...!');
        }, function (error) {

            console.log(error);
            toaster.pop('error', "", "Error in file upload", 3000, 'trustedHtml');

        });
    };

    $scope.deleteFile = function (index) {

        Login.removeFile({}, $scope.fileRecords[index], function (res) {
            console.log(res.message);
            toaster.pop('error', "", "File is removed successfully", 3000, 'trustedHtml');
            $scope.getrecods();
        }, function (err) {
            console.log(err);
        })

    }

}

  //=============DashBoardCtrl========================

function dashBoardCtrl($sce , $scope ,$timeout , Login ,$window) {

    $scope.state = null;
    $scope.API = null;
    $scope.currentVideo = 0;
    $scope.listOfVideos = [];
    $scope.title = '';
    $scope.searchText='';

    $scope.getrecods = function () {
        var obj = {};
        var result = [];
        Login.fileRecord({}, function (response) {
            console.log(response);
            $scope.listOfVideos = response;

        }, function (err) {
            console.log(err);

        });

    };

    $scope.getrecods();

    $scope.onPlayerReady = function (API) {
        $scope.API = API;
    };

    $scope.onCompleteVideo = function () {
        $scope.isCompleted = true;

        $scope.currentVideo++;

        if ($scope.currentVideo >= $scope.videos.length) $scope.currentVideo = 0;

        $scope.setVideo($scope.currentVideo);
    };


    $scope.videos = [
        {
            sources: [
                {src:$sce.trustAsResourceUrl("How to Make a Website for FREE.mp4"), type: "video/mp4"},
            ]
        }
    ];

    $scope.title = 'How to Make a Website for FREE';
    //var initVideo=$scope.listOfVideos[0].fileName;
    $scope.config = {
        preload: "none",
        autoHide: false,
        autoHideTime: 3000,
        autoPlay: false,
        sources: $scope.videos[0].sources,
        //sources:[ {src:$sce.trustAsResourceUrl(initVideo), type: "video/mp4"}],
        theme: {
            url: "../libs/videogular-themes-default/videogular.css"
        },
        plugins: {
            poster: ""
        }
    };

    $scope.setVideo = function (index) {
        $scope.API.stop();
        $scope.currentVideo = index;
        //$scope.config.sources = $scope.videos[index].sources;
        $scope.config.sources = [{src: $sce.trustAsResourceUrl(index), type: "video/mp4"}];
        $scope.title = index.substr(0, index.length - 4);
        $timeout($scope.API.play.bind($scope.API), 100);
        $window.scrollTo(0, 0);
    };

}