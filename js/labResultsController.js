var myApp = angular.module('myApp');
myApp.controller('LabResultsController', ['LabResults', 'RequestToServer', '$scope', '$timeout', 'EncryptionService', 'Charts', function(LabResults, RequestToServer, $scope, $timeout, EncryptionService, Charts) {
  console.log('heelo');
  Charts.setUp();

}]);
myApp.controller('AllTestsController', ['$scope', '$timeout', 'LabResults', function($scope, $timeout, LabResults) {

  $scope.allTestTypeArray = LabResults.getTestResults();
  $scope.goToTimelineView = function(test,index)
  {
    var realIndex = getRealIndex(test,index);
    navi.pushPage('./views/personal/lab-results/timeline-test-component.html',{data:{TestName: test.FacComponentName,FilterType:'Category',FilterLabel:test.testCategory,Index:realIndex,Tests:$scope.allTestTypeArray}});
    
  };
  function getRealIndex(test,index)
  {
    if($scope.allTestTypeArray[index].FacComponentName===test.FacComponentName)return index;
    else{
      for(var i= 0;i<$scope.allTestTypeArray.length;i++)
      {
        if($scope.allTestTypeArray[i].FacComponentName == test.FacComponentName ) return i;
      }
    }
  }
}]);
myApp.controller('FavoritesTestsController', ['$scope', '$timeout', 'LabResults', function($scope, $timeout, LabResults) {
  //Enter code here!!
  $scope.testResultsByCategory = LabResults.getTestResultsByCategory();
  $scope.testResultsByType = LabResults.getTestResultsByType();
  $scope.testsReceived = 'Your lab results are in';


}]);
myApp.controller('ByDateTestsController', ['$scope', '$timeout', 'LabResults', '$filter', function($scope, $timeout, LabResults, $filter) {

  $scope.goToTest = function(testResultByDate) {
    console.log(testResultByDate);

    navi.pushPage('./views/personal/lab-results/test-view.html', {
      data: testResultByDate
    });

  };


  $scope.testResultsByDateArray = LabResults.getTestResultsArrayByDate();
  $scope.showIfFullYear = function(index) {
    if (index === 0) return true;
    var year1 = $scope.testResultsByDateArray[index].testDateFormat;
    var year2 = $scope.testResultsByDateArray [index - 1].testDateFormat;
    return (year1.getFullYear() !== year2.getFullYear()) ? true : false;
  };

}]);


myApp.controller('IndividualLabTestController', ['$scope', '$timeout', '$filter',function($scope, $timeout,$filter) {

  var data = navi.topPage.data;
  console.log(data);
  $scope.testsByDate = data.testsByDate;
  $scope.testDate = data.testDateFormat;
  $scope.testsByDate = $filter('orderBy')($scope.testsByDate,'AbnormalFlag',true);

  $scope.goToTest = function(test,index)
  {
    console.log(test);
    var realIndex = findRealIndex(index,test);
    navi.pushPage('./views/personal/lab-results/timeline-test-component.html',{data:{TestName: test.FacComponentName,FilterType:'Date',FilterLabel:$filter('formatDateAppointmentTask')(test.TestDateFormat),Index:realIndex,Tests:$scope.testsByDate,DateDataPoint:data.testDate}});
  };
  function findRealIndex(index,test)
  {
    if($scope.testsByDate[index].FacComponentName == test.FacComponentName) return index;
    else{
      for (var i = 0; i < $scope.testsByDate.length; i++) {
        if($scope.testsByDate[i].FacComponentName == test.FacComponentName) return i;
      }
    }
  }
  function findIndexData(test)
  {
    var results = test.testResults;
    console.log(results);
    console.log(test);
    for(var i = 0;i<results.length;i++)
    {
      var date1 = results[i].TestDate.substring(0,results[i].TestDate.indexOf(' '));
      var date2 = test.TestDate.substring(0,test.TestDate.indexOf(' '));
      if(date1==date2) return i;
    }
  }
  $scope.chooseColor = function(flag)
  {
    if(flag)
    {
      if(flag=='H')
      {
        return "lab-results-test-high";
      }else if(flag=='L'){
        return "lab-results-test-low";
      }
    }else{
      return '';
    } 
  };
  /*if(test.testCategory) {
    $scope.selectedCategory = testCategory;
  }*/

  // Update title
  //$scope.title = 'Lab Results - ' + $scope.testDate;
  // $scope.goToSpecificTestView = function(index) {
  //   navi.pushPage('./views/personal/lab-results/specific-test-component.html', {'TestDateResults':$scope.testResults,'Index':index});
  // };
}]);

myApp.controller('SpecificTestComponentController', ['$scope', '$timeout', function($scope, $timeout) {
  console.log('adas');


  var test = navi.topPage.data;
  console.log(test);
  $scope.selectedTest = test;
  $scope.testName = test.ComponentName;
  $scope.testValue = test.TestValue;
  // Update title
  $scope.title = $scope.selectedTest.FacComponentName;
  var maxNorm = [];
  var minNorm = [];
  var result = [];
  for (var i = 0; i < 100; i++) {
    maxNorm.push({
      x: i,
      y: $scope.selectedTest.MaxNorm
    });
    minNorm.push({
      x: i,
      y: $scope.selectedTest.MinNorm
    });
  }
  for (var i = 20; i < 80; i++) {
    result.push({
      x: i,
      y: $scope.selectedTest.TestValue
    });
  }

  $scope.data = [{
    values: maxNorm,
    key: 'Max Norm',
    color: '#000000',
    area: false
  }, {
    values: minNorm,
    key: 'Min Norm',
    color: '#000000',
    area: false
  }, {
    key: 'Result',
    values: result,
    color: '#ff7f0e',
    area: true
  }];
}]);
myApp.controller('TimelineTestComponentController', ['$scope', '$timeout', 'LabResults', 'Charts', function($scope, $timeout, LabResults, Charts) {
  var params = navi.topPage.data;
  var testName = params.TestName;
  var filterLabel = params.FilterLabel;
  var filterType = params.FilterType;
  var data = params.Tests;
  console.log(params);
  if(filterType == 'Date'){
     var dateString = params.DateDataPoint.substring(0,params.DateDataPoint.indexOf(' '));
  }
  console.log(navi.topPage.data);
  var flagCategory = (filterType == 'Category') ? true : false;
  //var resultsByTypeLabResults = LabResults.getTestsBySortingType(category,filterBy);
  //var arrayAllTestResuts = LabResults.getTestResultsArrayByType();

  //Initialize array with test results organized by category
  $scope.testResultsByType = data;
  console.log($scope.testResultsByType);
  $scope.activeTestIndex = params.Index;
  $scope.category = filterLabel;
  setUpTimelineView($scope.activeTestIndex);





  $scope.goNextTestResult = function() {
    if($scope.activeTestIndex<$scope.testResultsByType.length)
    {
      $scope.activeTestIndex++;
      setUpTimelineView($scope.activeTestIndex);
    }
    
  };
  $scope.goPrevTestResult = function() {
    if($scope.activeTestIndex>=0)
    {
      $scope.activeTestIndex--;
      setUpTimelineView($scope.activeTestIndex);
    }
    
  };
  console.log($scope.testResultsByType);

  function setUpTimelineView(index) {

    $scope.testInformation = $scope.testResultsByType[index].testResults[0];
    $scope.title = $scope.testResultsByType[index].FacComponentName;
    if(flagCategory) $scope.category = $scope.testResultsByType[index].testCategory;
    $scope.historicViewTestResult = $scope.testResultsByType[index].testResults;
    $scope.historicViewTestResult.sort(function(a, b) {
      return a.TestDateFormat - b.TestDateFormat;
    });
    initializePlot();

  }


  $scope.goToTestList = function() {
    navi.pushPage('./views/personal/lab-results/specific-testlist-results.html', {
      data: {
        TestName: $scope.title,
        TestInformation: $scope.testInformation,
        TestData: $scope.historicViewTestResult
      }
    });
  };




  $scope.prevResult = function() {
    if ($scope.activeIndex > 0) $scope.activeIndex--;
  };
  $scope.nextResult = function() {
    if ($scope.activeIndex < $scope.historicViewTestResult.length - 1) $scope.activeIndex++;
  };
  $scope.chooseColor = function(flag)
  {
    if(flag)
    {
      if(flag=='H')
      {
        return "lab-results-test-high";
      }else if(flag=='L'){
        return "lab-results-test-low";
      }
    }else{
      return '';
    } 
  };
  function initializePlot()
  {
    var data = [];
    var lowest = Infinity;
    var highest = -Infinity;

    for (var i = 0; i < $scope.historicViewTestResult.length; i++) {
      var value = Number($scope.historicViewTestResult[i].TestValue);
      if (value < lowest) lowest = value;
      if (value > highest) highest = value;

      data.push([$scope.historicViewTestResult[i].TestDateFormat.getTime(), Number(value)]);
    }
    lowest = Math.min(lowest, $scope.testInformation.MinNorm);
    highest = Math.max(highest, $scope.testInformation.MaxNorm);
    // Sample options for first chart
    //$scope.chartOptions = {};
    console.log($scope.title, lowest, highest, $scope.testInformation.UnitDescription, $scope.testInformation.MinNorm, $scope.testInformation.MaxNorm, data);

    $scope.chartOptions = Charts.setTimelineChartOptions($scope.title, lowest, highest, $scope.testInformation.UnitDescription, $scope.testInformation.MinNorm, $scope.testInformation.MaxNorm, data);
  
    $scope.activeIndex = findIndexDataPoint();
  }
  function findIndexDataPoint()
  {
    console.log(filterType);
    console.log($scope.historicViewTestResult);
    console.log(dateString);
    if(filterType === 'Date')
    {
      for(var i=0;i<$scope.historicViewTestResult.length;i++)
      {
        var stringDataPoint = $scope.historicViewTestResult[i].TestDate.substring(0,$scope.historicViewTestResult[i].TestDate.indexOf(' '));
        if(dateString == stringDataPoint) return i;
      }
    }
    return $scope.historicViewTestResult.length-1;
  }
}]);

myApp.controller('TestListController', function($scope, $filter) {
  console.log(navi.topPage.data);
  $scope.testResults = navi.topPage.data;
  $scope.testResults.TestData = $filter('reverse')($scope.testResults.TestData);
  $scope.showIfFullYear = function(index) {
    if (index === 0) return true;
    var year1 = $scope.testResults.TestData[index].TestDateFormat;
    var year2 = $scope.testResults.TestData[index - 1].TestDateFormat;
    return (year1.getFullYear() !== year2.getFullYear()) ? true : false;
  };
});